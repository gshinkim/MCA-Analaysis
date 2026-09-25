"""Score routers on the held-out test.jsonl.

.venv/bin/python eval.py [base] [checkpoint] [keywords] [tfidf] [jev]   (default: all but jev)
jev needs JEV_API_KEY. Per Skill: precision/recall at the hint (0.50) and auto-load (0.85)
thresholds, exact-set accuracy at 0.50 (predicted set == needed set), p50 latency.
Only Skills not already loaded are scored, as in the app's router.
"""
import json, os, re, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
QS = json.load(open(os.path.join(HERE, "questions.json")))
TEST = [json.loads(l) for l in open(os.path.join(HERE, "test.jsonl"))]
text = lambda s: s["request"] + " " + " ".join(s["recent"])


def laya_router(name):
    from laya import Agent
    a = Agent(os.path.join(HERE, name), device="mps")
    def f(s, ask):
        return {k: v["noul"] for k, v in a.predict(s, {k: QS[k] for k in ask})["answers"].items()}
    return f


# Free baseline, written to the same policy: on-topic words -> mca+tellurium, build words -> +pathway-modeling.
ON = re.compile(r"control coeff|elasticit|rate.limit|summation|connectivity|\bmca\b|flux|steady|simulat|"
                r"antimony|tellurium|roadrunner|sbml|pathway|enzyme|kinetic|michaelis|model|reaction|species|"
                r"feedback|jacobian|eigen|stabil|bistab|scan|plot|fit|metabol|glycoly|concentration|error", re.I)
BUILD = re.compile(r"\b(build|write|create|make|add|remove|delete|change|replace|modify|set up|construct)\b.*"
                   r"\b(model|reaction|species|feedback|rate law|enzyme|step|compartment|event|antimony)|REFUSED|REJECTED",
                   re.I)
def keywords():
    def f(s, ask):
        on, build = bool(ON.search(text(s))), bool(BUILD.search(text(s)))
        need = {"mca": on, "tellurium": on, "pathway-modeling": on and build}
        return {k: float(need[k]) for k in ask}
    return f


def tfidf():
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    tr = [json.loads(l) for l in open(os.path.join(HERE, "train.jsonl"))]
    vec = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=2)
    X = vec.fit_transform(text(e["state"]) for e in tr)
    clf = {k: LogisticRegression(max_iter=2000, C=4).fit(X, [k in e["need"] or k in e["state"]["loaded"] for e in tr])
           for k in QS}
    return lambda s, ask: {k: float(clf[k].predict_proba(vec.transform([text(s)]))[0, 1]) for k in ask}


def jev():
    key = os.environ["JEV_API_KEY"]
    def f(s, ask):
        body = json.dumps({"model": "jev-1.13.0", "state": s, "questions": {k: QS[k] for k in ask}}).encode()
        req = urllib.request.Request("https://api.typesafe.ai/v1/systemone", body,
                                     {"authorization": "Bearer " + key, "content-type": "application/json"})
        ans = json.load(urllib.request.urlopen(req, timeout=20))["answers"]
        return {k: ans[k]["noul"] for k in ask}
    return f


def score(name, f):
    rows, ms, exact = [], [], 0
    for c in TEST:
        ask = [k for k in QS if k not in c["state"]["loaded"]]
        t0 = time.time()
        p = f(c["state"], ask) if ask else {}
        ms.append((time.time() - t0) * 1000)
        exact += {k for k, v in p.items() if v >= 0.5} == set(c["need"])
        rows += [(k, k in c["need"], p[k], c["state"]["request"]) for k in ask]
    def pr(rs, th):
        tp = sum(n and p >= th for _, n, p, _ in rs); fp = sum(not n and p >= th for _, n, p, _ in rs)
        fn = sum(n and p < th for _, n, p, _ in rs)
        return f"P {tp / max(1, tp + fp):.2f} R {tp / max(1, tp + fn):.2f}"
    ms.sort()
    print(f"\n== {name}: exact-set acc {exact / len(TEST):.3f} ({exact}/{len(TEST)}), p50 {ms[len(ms) // 2]:.0f} ms")
    for k in [*QS, "ALL"]:
        rs = rows if k == "ALL" else [r for r in rows if r[0] == k]
        print(f"  {k:17} @0.50 {pr(rs, 0.5)}   @0.85 {pr(rs, 0.85)}")
    wrong = [r for r in rows if r[1] != (r[2] >= 0.5)]
    for k, n, p, req in wrong[:25]:
        print(f"    {'FN' if n else 'FP'} {k:17} {p:.2f}  {req[:70]}")
    return exact / len(TEST)


if __name__ == "__main__":
    ROUTERS = {"base": lambda: laya_router("base"), "checkpoint": lambda: laya_router("checkpoint"),
               "keywords": keywords, "tfidf": tfidf, "jev": jev}
    for name in sys.argv[1:] or ["base", "checkpoint", "keywords", "tfidf"]:
        score(name, ROUTERS[name]())
