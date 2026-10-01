import { describe, expect, it } from 'vitest';
import { type TranslationRequest, type WordResult } from '@englishbot/api-contracts';
import { MockBackend, type MockScenario } from './service.js';

const request = (
  text = 'resilient',
  provider: 'google' | 'ai' = 'google',
  kind: 'word' | 'phrase' = 'word',
): TranslationRequest => ({
  requestId: `request:${text}`,
  text,
  kind,
  provider,
  sourceLanguage: 'en',
  targetLanguage: 'vi',
});
function lookupWord(backend: MockBackend, text: string): WordResult {
  const outcome = backend.lookup(request(text));
  if (!outcome.ok || outcome.result.kind !== 'word') throw new Error('Expected word fixture');
  return outcome.result;
}
describe('P1-103 fake backend boundary', () => {
  it('invalid AI key does not affect Google phrase-only; network errors do not fallback', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    backend.scenario = 'key-invalid';
    expect(backend.lookup(request())).toMatchObject({ ok: false, code: 'key-invalid' });
    expect(backend.lookup(request('Learning takes time.', 'google', 'phrase')).ok).toBe(true);
    expect(backend.lookup(request('Learning takes time.', 'ai', 'phrase'))).toMatchObject({
      ok: false,
      code: 'key-invalid',
    });
    backend.scenario = 'network';
    expect(backend.lookup(request('Learning takes time.', 'google', 'phrase'))).toMatchObject({
      ok: false,
      code: 'network',
    });
  });
  it('known Add failure preserves queue and permits explicit retry of the same command', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const word = lookupWord(backend, 'resilient');
    backend.scenario = 'add-failed';
    expect(backend.add(word.recordId, 'one')).toMatchObject({ state: 'error', code: 'add-failed' });
    expect(backend.getQueue()).toHaveLength(0);
    backend.scenario = 'success';
    expect(backend.add(word.recordId, 'one').state).toBe('added');
  });
  it('single-word surrounding punctuation resolves the same canonical cache entry', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const plain = lookupWord(backend, 'resilient');
    const quoted = lookupWord(backend, '“resilient,”');
    expect(quoted.recordId).toBe(plain.recordId);
  });
  it('dedupes the same word/sense across providers without changing old batch', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    backend.saveThreshold(1);
    const google = lookupWord(backend, 'resilient');
    backend.add(google.recordId, 'google');
    const ai = backend.lookup(request('resilient', 'ai'));
    if (!ai.ok || ai.result.kind !== 'word') throw new Error('Expected AI word');
    expect(backend.add(ai.result.recordId, 'ai').state).toBe('already-added');
    expect(backend.getQueue()).toHaveLength(1);
    expect(backend.getBatches()[0]).toMatchObject({ thresholdSnapshot: 1 });
  });
  it('does not call anything before explicit lookup, and lookup never Adds', () => {
    const backend = new MockBackend();
    expect(backend.trace).toEqual([]);
    backend.keyConfigured = true;
    lookupWord(backend, 'resilient');
    expect(backend.trace).toEqual([
      'backend:lookup',
      'provider:google',
      'provider:ai-enrichment',
      'mock-db:word-persisted',
    ]);
    expect(backend.getQueue()).toEqual([]);
    expect(backend.getBatches()).toEqual([]);
  });
  it('Google phrase works without key and has no AI enrichment', () => {
    const backend = new MockBackend();
    expect(backend.lookup(request('Learning takes time.', 'google', 'phrase')).ok).toBe(true);
    expect(backend.trace).toEqual(['backend:lookup', 'provider:google']);
    expect(() => backend.add('phrase', 'command')).toThrow();
  });
  it('AI phrase requires key; no hidden Google fallback', () => {
    const backend = new MockBackend();
    expect(backend.lookup(request('Learning takes time.', 'ai', 'phrase'))).toMatchObject({
      ok: false,
      code: 'key-required',
    });
    expect(backend.trace).toEqual(['backend:lookup']);
  });
  it('full cache reuse needs no key and makes no provider call', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const first = lookupWord(backend, 'resilient');
    backend.keyConfigured = false;
    backend.trace.length = 0;
    const reused = lookupWord(backend, 'resilient');
    expect(reused.recordId).toBe(first.recordId);
    expect(reused.cacheHit).toBe(true);
    expect(backend.trace).toEqual(['backend:lookup']);
    expect(backend.lookup(request('resilient', 'ai'))).toMatchObject({
      ok: false,
      code: 'key-required',
    });
  });
  for (const scenario of [
    'quota',
    'timeout',
    'malformed',
    'persist-failed',
    'persist-unknown',
  ] satisfies MockScenario[]) {
    it(`${scenario} rejects unsafe Add and does not cache partial results`, () => {
      const backend = new MockBackend();
      backend.keyConfigured = true;
      backend.scenario = scenario;
      expect(backend.lookup(request())).toMatchObject({ ok: false });
      expect(() => backend.add('mock-word-1', 'command')).toThrow();
      backend.scenario = 'success';
      backend.keyConfigured = false;
      expect(backend.lookup(request())).toMatchObject({ ok: false, code: 'key-required' });
    });
  }
  it('valid new Add is idempotent, same key cannot target another record', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const first = lookupWord(backend, 'resilient'),
      second = lookupWord(backend, 'adapt');
    expect(backend.add(first.recordId, 'one')).toMatchObject({ state: 'added', queueCount: 1 });
    expect(backend.add(first.recordId, 'one')).toMatchObject({ state: 'added', queueCount: 1 });
    expect(backend.add(first.recordId, 'two')).toMatchObject({
      state: 'already-added',
      queueCount: 1,
    });
    expect(() => backend.add(second.recordId, 'one')).toThrow();
  });
  it('N has no default; saving N does not batch until next successful NEW Add', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const first = lookupWord(backend, 'resilient'),
      second = lookupWord(backend, 'adapt');
    backend.add(first.recordId, 'one');
    backend.add(second.recordId, 'two');
    expect(backend.threshold).toBeNull();
    expect(backend.getBatches()).toHaveLength(0);
    backend.saveThreshold(2);
    expect(backend.getBatches()).toHaveLength(0);
    backend.add(second.recordId, 'duplicate');
    expect(backend.getBatches()).toHaveLength(0);
    const third = lookupWord(backend, 'sustain');
    backend.add(third.recordId, 'three');
    expect(backend.getBatches()).toHaveLength(1);
    expect(backend.getBatches()[0]?.items).toHaveLength(2);
    expect(backend.getBatches()[0]?.importText).toContain('resilient\t');
  });
  it('rejects invalid N without overwriting existing configuration', () => {
    const backend = new MockBackend();
    backend.saveThreshold(2);
    for (const n of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
      expect(() => backend.saveThreshold(n)).toThrow();
    expect(backend.threshold).toBe(2);
  });
  for (const scenario of [
    'success',
    'quizlet-unavailable',
    'quizlet-unknown',
    'quizlet-verified-mock',
  ] satisfies MockScenario[]) {
    it(`immutable ${scenario} batch with identifiers; no live create or retry operation`, () => {
      const backend = new MockBackend();
      backend.keyConfigured = true;
      backend.scenario = scenario;
      backend.saveThreshold(1);
      const word = lookupWord(backend, 'resilient');
      backend.add(word.recordId, 'one');
      const batch = backend.getBatches()[0];
      expect(batch?.snapshotId).toBe('mock-batch-1');
      expect(batch?.idempotencyKey).toBe('mock-create:mock-batch-1');
      expect(Object.isFrozen(batch)).toBe(true);
      expect(Object.isFrozen(batch?.items)).toBe(true);
      backend.saveThreshold(3);
      backend.add(word.recordId, 'one');
      expect(backend.getBatches()).toHaveLength(1);
      expect(backend.getBatches()[0]).toBe(batch);
      if (scenario === 'quizlet-verified-mock') expect(batch?.setUrl).toContain('example.invalid');
      expect(backend.trace.some((entry) => entry.includes('quizlet'))).toBe(false);
    });
  }
  it('unknown Add command is stable and never blind retried', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    backend.scenario = 'add-unknown';
    const word = lookupWord(backend, 'resilient');
    const outcome = backend.add(word.recordId, 'one');
    backend.scenario = 'success';
    expect(backend.add(word.recordId, 'one')).toBe(outcome);
    expect(backend.getQueue()).toHaveLength(0);
  });
});
