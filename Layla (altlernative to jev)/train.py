"""Fine-tune Laya into Layla, the skill router.

.venv/bin/python train.py [epochs]
Reads train.jsonl + questions.json, writes checkpoint/. Items are built with laya.Agent's own
encoder (_to_internal/_encode_state), so training sees byte-identical sequences to predict().
Loss is soft cross-entropy on the option markers; the notebook's RLCD noise term is skipped
(ponytail: hard 0/1 labels, CE alone is the proper-scoring fit; add RLCD if calibration lags).
"""
import json, os, random, shutil, sys, time

import torch
from safetensors.torch import save_file
from laya import Agent

HERE = os.path.dirname(os.path.abspath(__file__))
EPOCHS = int(sys.argv[1]) if len(sys.argv) > 1 else 3
BATCH, LR_ENC, LR_HEAD, CALIB_FRAC, SEED = 16, 2e-5, 1e-4, 0.1, 20260924

QS = json.load(open(os.path.join(HERE, "questions.json")))


def items_for(agent, ex):
    """One noul item per Skill not yet loaded, target [P(false), P(true)]."""
    ids = [k for k in QS if k not in ex["state"]["loaded"]]
    if not ids:
        return []
    internal = {k: agent._to_internal(QS[k]) for k in ids}
    enc = agent._encode_state(ex["state"], ids, internal)
    for k, it in zip(ids, enc):
        y = float(k in ex["need"])
        it["target"] = [1 - y, y]
    return enc


def collate(items, pad, dev, L=None):
    # Fixed L: MPS recompiles its graph for every new shape (14 s/step ragged vs 1.4 s fixed).
    n, L = len(items), L or max(len(it["ids"]) for it in items)
    ids = torch.full((n, L), pad, dtype=torch.long)
    att = torch.zeros((n, L), dtype=torch.long)
    mpos = torch.zeros((n, 2), dtype=torch.long)
    for i, it in enumerate(items):
        ids[i, :len(it["ids"])] = torch.tensor(it["ids"])
        att[i, :len(it["ids"])] = 1
        mpos[i] = torch.tensor(it["markers"])
    return (ids.to(dev), att.to(dev), mpos.to(dev), torch.ones((n, 2), dtype=torch.bool, device=dev),
            torch.full((n,), 2, dtype=torch.long, device=dev),
            torch.tensor([it["target"] for it in items], device=dev))


def fit_temp(Z, T):
    log_t = torch.zeros(1, requires_grad=True)
    opt = torch.optim.LBFGS([log_t], lr=0.1, max_iter=100)
    def closure():
        opt.zero_grad()
        loss = -(T * torch.log_softmax(Z / log_t.exp(), -1)).sum(-1).mean()
        loss.backward()
        return loss
    opt.step(closure)
    return float(log_t.exp().clamp(0.1, 10.0))


def main():
    random.seed(SEED); torch.manual_seed(SEED)
    agent = Agent(os.path.join(HERE, "base"), device="mps")
    model, tok, dev = agent.model, agent.tok, agent.device
    model.float().train()

    exs = [json.loads(l) for l in open(os.path.join(HERE, "train.jsonl"))]
    random.shuffle(exs)
    n_cal = int(len(exs) * CALIB_FRAC)
    calib = [it for ex in exs[:n_cal] for it in items_for(agent, ex)]
    train = [it for ex in exs[n_cal:] for it in items_for(agent, ex)]
    print(f"{len(exs)} examples -> {len(train)} train items, {len(calib)} calibration items", flush=True)

    L = max(len(it["ids"]) for it in train + calib)
    enc = [p for n, p in model.named_parameters() if n.startswith("encoder.")]
    head = [p for n, p in model.named_parameters() if not n.startswith("encoder.")]
    opt = torch.optim.AdamW([{"params": enc, "lr": LR_ENC}, {"params": head, "lr": LR_HEAD}], weight_decay=0.01)
    steps = EPOCHS * ((len(train) + BATCH - 1) // BATCH)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=[LR_ENC, LR_HEAD], total_steps=steps, pct_start=0.1)

    t0, step = time.time(), 0
    for ep in range(EPOCHS):
        random.shuffle(train)
        tot = 0.0
        for b in range(0, len(train), BATCH):
            *x, target = collate(train[b:b + BATCH], tok.pad_token_id, dev, L)
            with torch.autocast("mps", dtype=torch.bfloat16):
                logits, act = model(*x)
            logits = logits.float()
            loss = -(target * torch.log_softmax(logits, -1)).sum(-1).mean() + 0.0 * act.sum()
            opt.zero_grad(set_to_none=True)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step(); sched.step(); step += 1
            tot += loss.item()
            if step % 50 == 0:
                print(f"ep {ep+1}/{EPOCHS} step {step}/{steps} loss {tot / (b // BATCH + 1):.4f} "
                      f"{time.time() - t0:.0f}s", flush=True)
        print(f"=== epoch {ep+1} avg loss {tot / ((len(train) + BATCH - 1) // BATCH):.4f}", flush=True)

    # Temperature on the held-out calibration slice (never trained on).
    model.eval()
    Z, T = [], []
    with torch.no_grad():
        for b in range(0, len(calib), 32):
            *x, target = collate(calib[b:b + 32], tok.pad_token_id, dev, L)
            Z.append(model(*x)[0].float().cpu()); T.append(target.cpu())
    Z, T = torch.cat(Z), torch.cat(T)
    acc = ((Z.argmax(-1) == T.argmax(-1)).float().mean()).item()
    t_noul = fit_temp(Z, T)
    print(f"calibration: acc {acc:.4f}, noul temperature {t_noul:.3f}", flush=True)

    out = os.path.join(HERE, "checkpoint")
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    save_file({k: v.half().contiguous().cpu() for k, v in model.state_dict().items()},
              os.path.join(out, "model.safetensors"))
    shutil.copytree(os.path.join(HERE, "base", "encoder"), os.path.join(out, "encoder"))
    shutil.copytree(os.path.join(HERE, "base", "tokenizer"), os.path.join(out, "tokenizer"))
    cfg = json.load(open(os.path.join(HERE, "base", "rl_agent_config.json")))
    cfg.update(model_name="layla", fine_tuned=True, temperature=[1.0, 1.0, t_noul],
               training={"epochs": EPOCHS, "items": len(train), "calib_acc": round(acc, 4),
                         "minutes": round((time.time() - t0) / 60, 1)})
    cfg.pop("temperature_by_options", None)  # else the base's noul:2 bucket masks the new fit
    json.dump(cfg, open(os.path.join(out, "rl_agent_config.json"), "w"), indent=2)
    print("saved", out, flush=True)


if __name__ == "__main__":
    main()
