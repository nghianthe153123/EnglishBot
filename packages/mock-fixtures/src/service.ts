import {
  buildImportText,
  normalizeTerm,
  validateRequest,
  validateResult,
  type LookupOutcome,
  type TranslationRequest,
  type WordResult,
} from '@englishbot/api-contracts';
import { PHRASE_FIXTURES, WORD_FIXTURES } from './fixtures.js';

export type MockScenario =
  | 'success'
  | 'cache'
  | 'quota'
  | 'timeout'
  | 'key-invalid'
  | 'network'
  | 'malformed'
  | 'persist-failed'
  | 'persist-unknown'
  | 'add-unknown'
  | 'add-failed'
  | 'quizlet-unavailable'
  | 'quizlet-unknown'
  | 'quizlet-verified-mock';
export interface MockBatch {
  readonly snapshotId: string;
  readonly idempotencyKey: string;
  readonly thresholdSnapshot: number;
  readonly state: 'unsent' | 'unavailable' | 'unknown' | 'verified-mock';
  readonly items: readonly WordResult[];
  readonly importText: string;
  readonly setId?: string;
  readonly setUrl?: string;
  readonly accountId?: string;
}
export type AddOutcome = {
  state: 'added' | 'already-added' | 'unknown' | 'error';
  queueCount: number;
  code?: 'add-failed';
};

/** Fake backend boundary. Ephemeral and deterministic: no network, DB or credentials. */
export class MockBackend {
  keyConfigured = false;
  threshold: number | null = null;
  scenario: MockScenario = 'success';
  readonly trace: string[] = [];
  private readonly cache = new Map<string, WordResult>();
  private readonly added = new Map<string, WordResult>();
  private readonly commands = new Map<string, { recordId: string; outcome: AddOutcome }>();
  private readonly batches: MockBatch[] = [];
  private counter = 0;

  getQueue(): readonly WordResult[] {
    return Object.freeze([...this.added.values()]);
  }
  getBatches(): readonly MockBatch[] {
    return Object.freeze([...this.batches]);
  }
  saveThreshold(value: number | null): void {
    if (value !== null && (!Number.isSafeInteger(value) || value < 1))
      throw new Error('N không hợp lệ');
    this.threshold = value; // No batch on saving N: next successful NEW Add evaluates queue.
  }

  lookup(request: TranslationRequest): LookupOutcome {
    if (!validateRequest(request))
      return { ok: false, code: 'invalid-structure', message: 'Selection/request không hợp lệ.' };
    this.trace.push('backend:lookup');
    const normalized = normalizeTerm(request.text);
    const provenance = Object.freeze({
      provider: request.provider,
      version: 'mock-v1',
      senseKey: 'independent-common-v1',
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      enrichment:
        request.kind === 'word' && request.provider === 'google'
          ? Object.freeze({ provider: 'ai' as const, version: 'mock-enrichment-v1' })
          : null,
    });
    const cacheKey = JSON.stringify([
      normalized,
      provenance.sourceLanguage,
      provenance.targetLanguage,
      provenance.provider,
      provenance.version,
      provenance.senseKey,
      provenance.enrichment?.version ?? null,
    ]);
    const wordFixture = WORD_FIXTURES.find((entry) => normalizeTerm(entry.term) === normalized);
    if (request.kind === 'word') {
      const cached = this.cache.get(cacheKey);
      if (cached) return { ok: true, result: Object.freeze({ ...cached, cacheHit: true }) };
      if (this.scenario === 'cache' && wordFixture) {
        const result: WordResult = Object.freeze({
          ...wordFixture,
          kind: 'word',
          recordId: `mock-word-${++this.counter}`,
          provenance,
          cacheHit: true,
          persisted: true,
        });
        if (!validateResult(result))
          return { ok: false, code: 'invalid-structure', message: 'Cache mô phỏng không hợp lệ.' };
        this.cache.set(cacheKey, result);
        return { ok: true, result };
      }
    }
    if ((request.provider === 'ai' || request.kind === 'word') && !this.keyConfigured)
      return {
        ok: false,
        code: 'key-required',
        message:
          'Cần AI key phía backend. Bản mock chỉ mô phỏng trạng thái key trong khu vực kiểm thử.',
      };
    this.trace.push(`provider:${request.provider}`);
    if (request.provider === 'google' && request.kind === 'word')
      this.trace.push('provider:ai-enrichment');
    if (
      this.scenario === 'network' ||
      (this.scenario === 'key-invalid' && (request.provider === 'ai' || request.kind === 'word'))
    )
      return {
        ok: false,
        code: this.scenario,
        message:
          this.scenario === 'key-invalid'
            ? 'AI key không hợp lệ (mock), không trả lại secret.'
            : 'Lỗi kết nối provider (mock), không tự fallback.',
      };
    if (this.scenario === 'quota' || this.scenario === 'timeout')
      return {
        ok: false,
        code: this.scenario,
        message:
          this.scenario === 'quota'
            ? 'Hết quota provider (mock). Không tự chuyển provider.'
            : 'Provider không phản hồi kịp (mock).',
      };
    if (this.scenario === 'malformed')
      return {
        ok: false,
        code: 'invalid-structure',
        message: 'Phản hồi thiếu/sai cấu trúc. Chưa lưu từ.',
      };
    if (request.kind === 'phrase') {
      const phrase = PHRASE_FIXTURES.find((entry) => normalizeTerm(entry.text) === normalized);
      return phrase
        ? { ok: true, result: { kind: 'phrase', definition: phrase.definition, provenance } }
        : {
            ok: false,
            code: 'unavailable',
            message: 'Bản mock không có fixture cho selection này; hãy dùng câu mẫu.',
          };
    }
    if (!wordFixture)
      return {
        ok: false,
        code: 'unavailable',
        message:
          'Bản mock chưa có từ này. Thử resilient, adapt, sustain hoặc từ dài trong bài mẫu.',
      };
    const result: WordResult = Object.freeze({
      ...wordFixture,
      kind: 'word',
      recordId: `mock-word-${++this.counter}`,
      provenance,
      cacheHit: false,
      persisted: true,
    });
    if (!validateResult(result))
      return { ok: false, code: 'invalid-structure', message: 'Fixture từ không hợp lệ.' };
    if (this.scenario === 'persist-failed' || this.scenario === 'persist-unknown')
      return {
        ok: false,
        code: this.scenario,
        message: 'Lưu DB mô phỏng lỗi/chưa rõ kết quả. Không cho Add.',
      };
    this.cache.set(cacheKey, result);
    this.trace.push('mock-db:word-persisted');
    return { ok: true, result };
  }

  add(recordId: string, idempotencyKey: string): AddOutcome {
    const previous = this.commands.get(idempotencyKey);
    if (previous) {
      if (previous.recordId !== recordId) throw new Error('Idempotency key đã thuộc command khác');
      return previous.outcome;
    }
    const word = [...this.cache.values()].find((entry) => entry.recordId === recordId);
    if (!word || !idempotencyKey.trim())
      throw new Error('Chỉ Add word đã validate và persist tại backend mock');
    if (this.scenario === 'add-failed')
      return { state: 'error', code: 'add-failed', queueCount: this.added.size };
    if (this.scenario === 'add-unknown') {
      const outcome: AddOutcome = Object.freeze({ state: 'unknown', queueCount: this.added.size });
      this.commands.set(idempotencyKey, { recordId, outcome });
      return outcome;
    }
    const identity = JSON.stringify([
      normalizeTerm(word.term),
      word.provenance.sourceLanguage,
      word.provenance.targetLanguage,
      word.provenance.senseKey,
    ]);
    const existing = this.added.has(identity);
    if (!existing) {
      this.added.set(identity, word);
      this.makeBatches();
    }
    const outcome: AddOutcome = Object.freeze({
      state: existing ? 'already-added' : 'added',
      queueCount: this.added.size,
    });
    this.commands.set(idempotencyKey, { recordId, outcome });
    return outcome;
  }

  private makeBatches(): void {
    if (this.threshold === null) return;
    const assigned = new Set(
      this.batches.flatMap((batch) => batch.items.map((word) => word.recordId)),
    );
    const pending = [...this.added.values()].filter((word) => !assigned.has(word.recordId));
    while (pending.length >= this.threshold) {
      const items = Object.freeze(pending.splice(0, this.threshold));
      const snapshotId = `mock-batch-${this.batches.length + 1}`;
      const state =
        this.scenario === 'quizlet-unknown'
          ? 'unknown'
          : this.scenario === 'quizlet-verified-mock'
            ? 'verified-mock'
            : this.scenario === 'quizlet-unavailable'
              ? 'unavailable'
              : 'unsent';
      this.batches.push(
        Object.freeze({
          snapshotId,
          idempotencyKey: `mock-create:${snapshotId}`,
          thresholdSnapshot: this.threshold,
          state,
          items,
          importText: buildImportText(items),
          ...(state === 'verified-mock'
            ? {
                setId: `mock-set-${snapshotId}`,
                setUrl: `https://example.invalid/quizlet/${snapshotId}`,
                accountId: 'mock-owner-1',
              }
            : {}),
        }),
      );
    }
  }
}
