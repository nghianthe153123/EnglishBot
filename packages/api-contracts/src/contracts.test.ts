import { describe, expect, it } from 'vitest';
import {
  buildImportText,
  classifySelection,
  normalizeTerm,
  validateRequest,
  validateResult,
  validThreshold,
  type ErrorCode,
  type PhraseResult,
  type TranslationRequest,
  type WordResult,
} from './index.js';

const provenance = {
  provider: 'google',
  version: 'mock-v1',
  senseKey: 'independent-common-v1',
  enrichment: { provider: 'ai', version: 'mock-ai-v1' },
  sourceLanguage: 'en',
  targetLanguage: 'vi',
} as const;

const word: WordResult = {
  kind: 'word',
  recordId: 'record-1',
  term: 'resilient',
  pos: 'adjective',
  definition: 'able to recover quickly after difficulty',
  example: 'The resilient team adapted after the setback.',
  provenance,
  cacheHit: false,
  persisted: true,
};

const phrase: PhraseResult = {
  kind: 'phrase',
  definition: 'Việc học cần có thời gian.',
  provenance: { ...provenance, enrichment: null },
};

const request: TranslationRequest = {
  requestId: 'request-1',
  text: 'resilient',
  kind: 'word',
  provider: 'google',
  sourceLanguage: 'en',
  targetLanguage: 'vi',
};

const expectedErrorCodes: readonly ErrorCode[] = [
  'provider-required',
  'key-required',
  'key-invalid',
  'quota',
  'timeout',
  'network',
  'invalid-structure',
  'persist-failed',
  'persist-unknown',
  'add-failed',
  'add-unknown',
  'unavailable',
];

describe('translation contract validators', () => {
  it('accepts valid word, phrase, and request shapes', () => {
    expect(validateResult(word)).toBe(true);
    expect(validateResult(phrase)).toBe(true);
    expect(validateRequest(request)).toBe(true);
    expect(expectedErrorCodes).toHaveLength(12);
  });

  it('rejects incomplete or unsafe word results', () => {
    const missingPos = { ...word } as Partial<WordResult>;
    delete missingPos.pos;
    const missingExample = { ...word } as Partial<WordResult>;
    delete missingExample.example;
    expect(validateResult(missingPos)).toBe(false);
    expect(validateResult(missingExample)).toBe(false);
    expect(validateResult({ ...word, persisted: false })).toBe(false);
    expect(validateResult({ ...word, term: 'two\nwords' })).toBe(false);
    expect(validateResult({ ...word, definition: 'bad\tfield' })).toBe(false);
  });

  it('keeps phrase results lean and rejects secret or unexpected fields', () => {
    expect(validateResult({ ...phrase, recordId: 'not-allowed', pos: 'noun', example: 'no' })).toBe(
      false,
    );
    expect(validateResult({ ...word, apiKey: 'secret' })).toBe(false);
    expect(validateRequest({ ...request, key: 'secret' })).toBe(false);
    expect(validateResult(Object.assign(Object.create({ apiKey: 'secret' }), word))).toBe(false);
  });

  it('rejects unknown providers, blank strings, and unknown request fields', () => {
    expect(validateRequest({ ...request, provider: 'other' })).toBe(false);
    expect(validateRequest({ ...request, text: ' \t ' })).toBe(false);
    expect(validateRequest({ ...request, apiKey: 'secret' })).toBe(false);
    expect(validateResult({ ...word, provenance: { ...provenance, provider: 'other' } })).toBe(
      false,
    );
    expect(validateResult({ ...phrase, definition: '   ' })).toBe(false);
  });

  it('requires valid Google word enrichment provenance and rejects enrichment on phrases', () => {
    const googleWord = { ...word, provenance: { ...provenance, provider: 'google' as const } };
    expect(validateResult(googleWord)).toBe(true);
    const missingEnrichment = { ...googleWord.provenance } as Partial<typeof googleWord.provenance>;
    delete missingEnrichment.enrichment;
    expect(validateResult({ ...googleWord, provenance: missingEnrichment })).toBe(false);
    expect(
      validateResult({
        ...googleWord,
        provenance: { ...googleWord.provenance, enrichment: null },
      }),
    ).toBe(false);
    expect(
      validateResult({
        ...googleWord,
        provenance: {
          ...googleWord.provenance,
          enrichment: { provider: 'ai', version: ' ' },
        },
      }),
    ).toBe(false);
    expect(
      validateResult({
        ...word,
        provenance: {
          ...provenance,
          provider: 'ai',
          enrichment: null,
        },
      }),
    ).toBe(true);
    expect(
      validateResult({
        ...word,
        provenance: {
          ...provenance,
          enrichment: { provider: 'google', version: 'google-v1' },
        },
      }),
    ).toBe(false);
    expect(
      validateResult({
        ...phrase,
        provenance: { ...provenance, enrichment: { provider: 'ai', version: 'ai-v1' } },
      }),
    ).toBe(false);
    expect(
      validateResult({
        ...phrase,
        provenance: { ...provenance, enrichment: null },
      }),
    ).toBe(true);
  });

  it('rejects a request whose declared kind disagrees with its selection text', () => {
    expect(validateRequest({ ...request, text: 'Learning takes time.' })).toBe(false);
    expect(validateRequest({ ...request, kind: 'phrase' })).toBe(false);
    expect(validateRequest({ ...request, text: 'resilient!', kind: 'phrase' })).toBe(false);
  });
});

describe('selection and import helpers', () => {
  it.each([
    ['‘resilient’', 'word'],
    ["don't", 'word'],
    ['well-being', 'word'],
    ['re‐enter', 'word'],
    ['123resilient456', 'phrase'],
    ['Learning takes time.', 'phrase'],
    ['café', 'word'],
    [' cafe\u0301 ', 'word'],
  ] as const)('classifies %s as %s', (text, expected) => {
    expect(classifySelection(text)).toBe(expected);
  });

  it('normalizes using trim, NFC, and lowercase', () => {
    expect(normalizeTerm('  CAFE\u0301  ')).toBe('café');
  });

  it.each([
    ['', null],
    [' ', null],
    ['0', null],
    ['-2', null],
    ['1.5', null],
    ['2e2', null],
    ['9007199254740992', null],
    [' 12 ', 12],
  ] as const)('parses threshold %j as %j', (raw, expected) => {
    expect(validThreshold(raw)).toBe(expected);
  });

  it('formats import rows and rejects field injection or empty values', () => {
    expect(
      buildImportText([
        { term: 'resilient', definition: 'bền bỉ' },
        { term: 'adapt', definition: 'thích nghi' },
      ]),
    ).toBe('resilient\tbền bỉ\nadapt\tthích nghi');
    expect(() => buildImportText([{ term: 'bad\tterm', definition: 'meaning' }])).toThrow();
    expect(() => buildImportText([{ term: 'term', definition: 'line 1\nline 2' }])).toThrow();
    expect(() => buildImportText([{ term: ' ', definition: 'meaning' }])).toThrow();
  });
});
