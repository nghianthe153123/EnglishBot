export type Provider = 'google' | 'ai';

export type SelectionKind = 'word' | 'phrase';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'determiner';

export interface TranslationRequest {
  requestId: string;
  text: string;
  kind: SelectionKind;
  provider: Provider;
  sourceLanguage: 'en';
  targetLanguage: 'vi';
}

export interface Provenance {
  provider: Provider;
  version: string;
  senseKey: string;
  enrichment: { provider: 'ai'; version: string } | null;
  sourceLanguage: 'en';
  targetLanguage: 'vi';
}

export interface WordResult {
  kind: 'word';
  recordId: string;
  term: string;
  pos: PartOfSpeech;
  definition: string;
  example: string;
  provenance: Provenance;
  cacheHit: boolean;
  persisted: true;
}

export interface PhraseResult {
  kind: 'phrase';
  definition: string;
  provenance: Provenance;
}

export type TranslationResult = WordResult | PhraseResult;

export type ErrorCode =
  | 'provider-required'
  | 'key-required'
  | 'key-invalid'
  | 'quota'
  | 'timeout'
  | 'network'
  | 'invalid-structure'
  | 'persist-failed'
  | 'persist-unknown'
  | 'add-failed'
  | 'add-unknown'
  | 'unavailable';

export type LookupOutcome =
  { ok: true; result: TranslationResult } | { ok: false; code: ErrorCode; message: string };

const providers = new Set<Provider>(['google', 'ai']);
const selectionKinds = new Set<SelectionKind>(['word', 'phrase']);
const partsOfSpeech = new Set<PartOfSpeech>([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection',
  'determiner',
]);
function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSafeImportField(value: unknown): value is string {
  return isNonEmptyString(value) && !hasControlCharacters(value);
}

function hasControlCharacters(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0)!;
    if (codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f)) return true;
  }
  return false;
}

function isProvider(value: unknown): value is Provider {
  return typeof value === 'string' && providers.has(value as Provider);
}

function isProvenance(value: unknown): value is Provenance {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'provider',
      'version',
      'senseKey',
      'enrichment',
      'sourceLanguage',
      'targetLanguage',
    ])
  )
    return false;

  return (
    isProvider(value.provider) &&
    isNonEmptyString(value.version) &&
    isNonEmptyString(value.senseKey) &&
    (value.enrichment === null ||
      (isRecord(value.enrichment) &&
        hasExactKeys(value.enrichment, ['provider', 'version']) &&
        value.enrichment.provider === 'ai' &&
        isNonEmptyString(value.enrichment.version))) &&
    value.sourceLanguage === 'en' &&
    value.targetLanguage === 'vi'
  );
}

/** Runtime validator for the closed word/phrase result contract. */
export function validateResult(value: unknown): value is TranslationResult {
  if (!isRecord(value)) return false;

  if (value.kind === 'word') {
    return (
      hasExactKeys(value, [
        'kind',
        'recordId',
        'term',
        'pos',
        'definition',
        'example',
        'provenance',
        'cacheHit',
        'persisted',
      ]) &&
      isNonEmptyString(value.recordId) &&
      isSafeImportField(value.term) &&
      typeof value.pos === 'string' &&
      partsOfSpeech.has(value.pos as PartOfSpeech) &&
      isSafeImportField(value.definition) &&
      isNonEmptyString(value.example) &&
      isProvenance(value.provenance) &&
      (value.provenance.provider === 'google'
        ? value.provenance.enrichment !== null
        : value.provenance.enrichment === null) &&
      typeof value.cacheHit === 'boolean' &&
      value.persisted === true
    );
  }

  if (value.kind === 'phrase') {
    return (
      hasExactKeys(value, ['kind', 'definition', 'provenance']) &&
      isNonEmptyString(value.definition) &&
      isProvenance(value.provenance) &&
      value.provenance.enrichment === null
    );
  }

  return false;
}

/** Runtime validator for requests; secrets are deliberately absent from the contract. */
export function validateRequest(value: unknown): value is TranslationRequest {
  return (
    isRecord(value) &&
    hasExactKeys(value, [
      'requestId',
      'text',
      'kind',
      'provider',
      'sourceLanguage',
      'targetLanguage',
    ]) &&
    isNonEmptyString(value.requestId) &&
    isNonEmptyString(value.text) &&
    typeof value.kind === 'string' &&
    selectionKinds.has(value.kind as SelectionKind) &&
    isProvider(value.provider) &&
    value.sourceLanguage === 'en' &&
    value.targetLanguage === 'vi' &&
    classifySelection(value.text) === value.kind
  );
}

const edgePunctuation = /^\p{P}+|\p{P}+$/gu;
const singleWord = /^[\p{L}\p{M}]+(?:['’\-‐‑][\p{L}\p{M}]+)*$/u;

/** Classifies one lexical token as a word; surrounding punctuation is ignored. */
export function classifySelection(text: string): SelectionKind {
  const trimmed = text.normalize('NFC').trim().replace(edgePunctuation, '');
  return singleWord.test(trimmed) ? 'word' : 'phrase';
}

/** Canonical display/cache term normalization without removing internal punctuation. */
export function normalizeTerm(text: string): string {
  const normalized = text.normalize('NFC').trim().toLowerCase();
  return classifySelection(normalized) === 'word'
    ? normalized.replace(edgePunctuation, '')
    : normalized;
}

/** Parses a user configured threshold, returning null for unset or invalid input. */
export function validThreshold(raw: string): number | null {
  const value = raw.trim();
  if (!/^\d+$/u.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Builds Quizlet import rows as `term<TAB>definition`, rejecting delimiter/control injection. */
export function buildImportText(items: readonly { term: string; definition: string }[]): string {
  return items
    .map(({ term, definition }) => {
      if (!isNonEmptyString(term) || !isNonEmptyString(definition)) {
        throw new TypeError('Import term and definition must be non-empty.');
      }
      if (hasControlCharacters(term) || hasControlCharacters(definition)) {
        throw new TypeError('Import values cannot contain tabs, newlines, or control characters.');
      }
      return `${term}\t${definition}`;
    })
    .join('\n');
}
