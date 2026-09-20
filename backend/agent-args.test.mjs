/* node backend/agent-args.test.mjs */
import assert from 'node:assert/strict';
import { buildArgs } from './agent.mjs';

const base = { root: '/tmp/app', prompt: 'hi', sid: 'abc-123', model: '',
               useWorkflow: true, liveModel: '', scratch: '', summary: '' };

{
  const fresh = buildArgs({ ...base, resuming: false });
  assert.ok(fresh.includes('--session-id'), 'a new session claims its id');
  assert.ok(!fresh.includes('--resume'));
}

{
  const again = buildArgs({ ...base, resuming: true });
  assert.ok(again.includes('--resume'), 'a known session resumes');
  assert.ok(!again.includes('--session-id'), 'an id may only be claimed once');
  assert.equal(again[again.indexOf('--resume') + 1], 'abc-123');
}

{
  // the rolling summary must reach the model without needing a tool call
  const withSummary = buildArgs({ ...base, resuming: true, summary: 'Step 3 holds the control.' });
  const appended = withSummary[withSummary.indexOf('--append-system-prompt') + 1];
  assert.match(appended, /Step 3 holds the control\./);
}

{
  const none = buildArgs({ ...base, resuming: false, summary: '' });
  const appended = none[none.indexOf('--append-system-prompt') + 1];
  assert.doesNotMatch(appended, /earlier in this session/i, 'no empty summary block');
}

console.log('agent args ok');
