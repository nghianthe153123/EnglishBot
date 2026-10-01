import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MockBackend, PHRASE_FIXTURES } from '@englishbot/mock-fixtures';
import { PopupContent } from './components.js';

const noop = () => undefined;
describe('popup text safety and phrase rendering', () => {
  it('renders provider-like HTML as inert text, never executable markup', () => {
    const backend = new MockBackend();
    backend.keyConfigured = true;
    const outcome = backend.lookup({
      requestId: 'one',
      text: 'resilient',
      kind: 'word',
      provider: 'google',
      sourceLanguage: 'en',
      targetLanguage: 'vi',
    });
    if (!outcome.ok || outcome.result.kind !== 'word') throw new Error('Fixture unavailable');
    const html = renderToStaticMarkup(
      <PopupContent
        view={{
          state: 'result',
          text: 'resilient',
          outcome: {
            ok: true,
            result: {
              ...outcome.result,
              definition: '<img src=x onerror=alert(1)>',
              example: '<script>unsafe()</script>',
            },
          },
        }}
        added={false}
        adding={false}
        addMessage=""
        onAdd={noop}
        onClose={noop}
        onRetry={noop}
        onOptions={noop}
      />,
    );
    expect(html).toContain('&lt;img');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script');
  });
  it('long multiline phrase renders no word fields or Add', () => {
    const backend = new MockBackend();
    const phrase = PHRASE_FIXTURES[0];
    if (!phrase) throw new Error('Fixture unavailable');
    const outcome = backend.lookup({
      requestId: 'one',
      text: phrase.text,
      kind: 'phrase',
      provider: 'google',
      sourceLanguage: 'en',
      targetLanguage: 'vi',
    });
    const html = renderToStaticMarkup(
      <PopupContent
        view={{ state: 'result', text: phrase.text, outcome }}
        added={false}
        adding={false}
        addMessage=""
        onAdd={noop}
        onClose={noop}
        onRetry={noop}
        onOptions={noop}
      />,
    );
    expect(html).toContain('Việc học cần có thời gian.');
    expect(html).not.toContain('add-word');
    expect(html).not.toContain('part-of-speech');
    expect(html).not.toContain('class="example"');
  });
});
