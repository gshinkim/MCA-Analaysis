import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// One warm Python process. `import tellurium` costs seconds; the UI runs on every
// keystroke, so the process is started once and fed newline-delimited JSON.
export class Tellurium {
  constructor(root) {
    this.root = root;
    this.python = join(root, '.venv/bin/python');
    this.script = join(root, 'backend/py/te_worker.py');
    this.proc = null; this.buf = ''; this.seq = 0; this.pending = new Map();
    this.version = null;
  }

  get installed() { return existsSync(this.python) && existsSync(this.script); }

  start() {
    if (this.proc || !this.installed) return;
    const p = spawn(this.python, [this.script], { cwd: this.root, stdio: ['pipe', 'pipe', 'pipe'] });
    p.stdout.setEncoding('utf8');
    p.stdout.on('data', d => {
      this.buf += d;
      let i;
      while ((i = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, i); this.buf = this.buf.slice(i + 1);
        if (!line.trim()) continue;
        let msg; try { msg = JSON.parse(line); } catch { continue; }
        const w = this.pending.get(msg.id);
        if (w) { this.pending.delete(msg.id); w(msg); }
      }
    });
    p.stderr.on('data', d => { const s = String(d).trim(); if (s && s !== 'READY') console.error('[te]', s); });
    p.on('exit', c => {
      this.proc = null;
      for (const w of this.pending.values()) w({ ok: false, error: 'tellurium worker exited (' + c + ')' });
      this.pending.clear();
    });
    this.proc = p;
  }

  call(op, payload = {}, timeoutMs = 60000) {
    if (!this.installed) {
      return Promise.resolve({ ok: false, error: 'Tellurium is not installed. Run: bash setup.sh' });
    }
    this.start();
    const id = ++this.seq;
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        if (this.pending.delete(id)) {
          this.proc?.kill('SIGKILL');          // a runaway solver must not wedge the server
          resolve({ ok: false, error: 'Tellurium call timed out after ' + (timeoutMs / 1000) + 's' });
        }
      }, timeoutMs);
      this.pending.set(id, m => { clearTimeout(timer); resolve(m); });
      this.proc.stdin.write(JSON.stringify({ id, op, ...payload }) + '\n');
    });
  }

  async versions() {
    if (this.version) return this.version;
    const r = await this.call('version');
    this.version = r.ok ? r.result : { error: r.error };
    return this.version;
  }
}
