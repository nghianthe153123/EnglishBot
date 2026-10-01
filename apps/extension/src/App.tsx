import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import {
  classifySelection,
  validThreshold,
  type Provider,
  type TranslationRequest,
} from '@englishbot/api-contracts';
import {
  MockBackend,
  WORD_FIXTURES,
  PHRASE_FIXTURES,
  type MockScenario,
} from '@englishbot/mock-fixtures';
import { OptionsContent, PopupContent, QueueContent } from './components.js';
import { positionPopup, type Point } from './position.js';
import type { PopupView } from './view-model.js';

const scenarios: readonly { value: MockScenario; label: string }[] = [
  { value: 'success', label: 'Thành công' },
  { value: 'cache', label: 'Cache đầy đủ' },
  { value: 'quota', label: 'Hết quota' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'key-invalid', label: 'AI key không hợp lệ' },
  { value: 'network', label: 'Mất kết nối provider' },
  { value: 'malformed', label: 'Phản hồi sai cấu trúc' },
  { value: 'persist-failed', label: 'Lưu từ thất bại' },
  { value: 'persist-unknown', label: 'Chưa rõ kết quả lưu từ' },
  { value: 'add-unknown', label: 'Chưa rõ kết quả Add' },
  { value: 'add-failed', label: 'Add thất bại' },
  { value: 'quizlet-unavailable', label: 'Quizlet chưa khả dụng' },
  { value: 'quizlet-unknown', label: 'Quizlet outcome unknown' },
  { value: 'quizlet-verified-mock', label: 'Quizlet verified · MOCK' },
];

export function App() {
  const [backend] = useState(() => new MockBackend());
  const [active, setActive] = useState(false);
  const [remember, setRemember] = useState(false);
  const [manager, setManager] = useState(false);
  const [options, setOptions] = useState(false);
  const [dark, setDark] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [threshold, setThreshold] = useState('');
  const [thresholdError, setThresholdError] = useState('');
  const [keyConfigured, setKeyConfigured] = useState(false);
  const [scenario, setScenario] = useState<MockScenario>('success');
  const [selection, setSelection] = useState<{ text: string; anchor: Point } | null>(null);
  const [popup, setPopup] = useState<PopupView | null>(null);
  const [position, setPosition] = useState<Point>({ x: 8, y: 8 });
  const [added, setAdded] = useState(false);
  const [addUnknown, setAddUnknown] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  const [, render] = useState(0);
  const popupElement = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const generation = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const nativeAnchor = useRef<{ range: Range; offset: Point } | null>(null);
  const pendingTimer = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  function closePopup(restore = true) {
    generation.current++;
    if (pendingTimer.current !== null) globalThis.clearTimeout(pendingTimer.current);
    setPopup(null);
    setSelection(null);
    if (restore && returnFocus.current?.isConnected) returnFocus.current.focus();
  }

  function capture(text: string, anchor: Point) {
    if (!active || !text.trim()) return;
    generation.current++;
    setPopup(null);
    setAdded(false);
    setAddUnknown(false);
    setAddMessage('');
    returnFocus.current =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : article.current;
    setSelection({ text: text.trim(), anchor });
  }

  useEffect(() => {
    function selectionChanged() {
      const native = globalThis.getSelection();
      if (!active || !native || native.rangeCount === 0 || !native.toString().trim()) return;
      const range = native.getRangeAt(0);
      if (!article.current?.contains(range.commonAncestorContainer)) return;
      const rect = range.getBoundingClientRect();
      nativeAnchor.current = { range: range.cloneRange(), offset: { x: 0, y: 0 } };
      capture(native.toString(), { x: rect.right, y: rect.bottom });
    }
    document.addEventListener('selectionchange', selectionChanged);
    return () => document.removeEventListener('selectionchange', selectionChanged);
  }, [active]);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!popup || !(event.target instanceof Node) || popupElement.current?.contains(event.target))
        return;
      closePopup(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && (popup || selection)) {
        event.preventDefault();
        closePopup();
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [popup, selection]);

  useLayoutEffect(() => {
    if (!popup || !selection || !popupElement.current) return;
    const element = popupElement.current;
    function place() {
      const vv = globalThis.visualViewport;
      const viewport = {
        width: vv?.width ?? globalThis.innerWidth,
        height: vv?.height ?? globalThis.innerHeight,
        offsetLeft: vv?.offsetLeft ?? 0,
        offsetTop: vv?.offsetTop ?? 0,
      };
      element.style.width = `${Math.min(320, viewport.width - 16)}px`;
      element.style.maxHeight = `${viewport.height - 16}px`;
      const rect = element.getBoundingClientRect();
      const currentRect = nativeAnchor.current?.range.getBoundingClientRect();
      const anchor =
        currentRect && nativeAnchor.current
          ? {
              x: currentRect.right + nativeAnchor.current.offset.x,
              y: currentRect.bottom + nativeAnchor.current.offset.y,
            }
          : selection!.anchor;
      setPosition(positionPopup(anchor, { width: rect.width, height: rect.height }, viewport));
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(element);
    globalThis.addEventListener('resize', place);
    globalThis.addEventListener('scroll', place, true);
    globalThis.visualViewport?.addEventListener('resize', place);
    globalThis.visualViewport?.addEventListener('scroll', place);
    return () => {
      observer.disconnect();
      globalThis.removeEventListener('resize', place);
      globalThis.removeEventListener('scroll', place, true);
      globalThis.visualViewport?.removeEventListener('resize', place);
      globalThis.visualViewport?.removeEventListener('scroll', place);
    };
  }, [popup, selection]);

  useLayoutEffect(() => {
    if (popup?.state === 'loading')
      popupElement.current
        ?.querySelector<HTMLButtonElement>('[data-testid="popup-close"]')
        ?.focus();
  }, [popup?.state]);

  useEffect(
    () => () => {
      if (pendingTimer.current !== null) globalThis.clearTimeout(pendingTimer.current);
    },
    [],
  );

  function translate() {
    if (!selection) return;
    const snapshot = selection;
    const token = ++generation.current;
    setPopup({ state: 'loading', text: snapshot.text });
    setAdded(false);
    setAddUnknown(false);
    setAddMessage('');
    pendingTimer.current = globalThis.setTimeout(() => {
      if (generation.current !== token) return;
      const outcome =
        provider === null
          ? {
              ok: false as const,
              code: 'provider-required' as const,
              message: 'Chọn Google hoặc AI trong Cài đặt trước khi dịch.',
            }
          : backend.lookup({
              requestId: `mock-request-${token}`,
              text: snapshot.text,
              kind: classifySelection(snapshot.text),
              provider,
              sourceLanguage: 'en',
              targetLanguage: 'vi',
            } satisfies TranslationRequest);
      setPopup({ state: 'result', text: snapshot.text, outcome });
      render((value) => value + 1);
    }, 350);
  }

  function addWord() {
    if (
      popup?.state !== 'result' ||
      !popup.outcome.ok ||
      popup.outcome.result.kind !== 'word' ||
      addUnknown ||
      added
    )
      return;
    const word = popup.outcome.result;
    const result = backend.add(word.recordId, `mock-add:${word.recordId}`);
    setAdded(result.state === 'added' || result.state === 'already-added');
    setAddUnknown(result.state === 'unknown');
    setAddMessage(
      result.state === 'error'
        ? 'Add thất bại (mock), queue không đổi. Có thể thử Add lại tường minh.'
        : result.state === 'unknown'
          ? 'Kết quả Add chưa rõ (mock). Không gửi lại; cần đối soát command trước.'
          : 'Đã Add vào queue mô phỏng.',
    );
    render((value) => value + 1);
  }

  function saveOptions() {
    const value = validThreshold(threshold);
    if (threshold.trim() && value === null) {
      setThresholdError('N phải là số nguyên dương hợp lệ. Cấu hình đã lưu không thay đổi.');
      return;
    }
    backend.saveThreshold(value);
    setThresholdError('');
    render((version) => version + 1);
  }

  const triggerStyle: CSSProperties | undefined = selection
    ? {
        position: 'fixed',
        left: Math.max(8, Math.min(selection.anchor.x + 8, globalThis.innerWidth - 88)),
        top: Math.max(8, Math.min(selection.anchor.y + 8, globalThis.innerHeight - 48)),
        zIndex: 20,
      }
    : undefined;

  return (
    <main className={`review-host${dark ? ' dark-page' : ''}`}>
      <header className="review-header">
        <strong>EnglishBot</strong>
        <span>P1-103 · Bản review mock</span>
      </header>
      <p className="mock-notice">
        Dữ liệu mẫu trong bộ nhớ. Không đọc tab thật, không gọi Google/AI, không lưu DB hay tạo
        Quizlet thật.
      </p>
      <nav className="review-toolbar" aria-label="Công cụ review">
        <button type="button" data-testid="manager-toggle" onClick={() => setManager(!manager)}>
          Tiện ích
        </button>
        <button type="button" onClick={() => setOptions(!options)}>
          Cài đặt
        </button>
        <label>
          <input
            type="checkbox"
            checked={dark}
            onChange={(event) => setDark(event.target.checked)}
          />{' '}
          Nền bài đọc tối
        </label>
      </nav>
      {manager && (
        <section className="manager" aria-label="Quản lý tiện ích mô phỏng">
          <h2>Trên trang này</h2>
          <p>
            Bật để nhận diện phần bôi đen trên bài mẫu. Chỉ gửi selection khi bấm Dịch. Đây không
            phải quyền Chrome thật.
          </p>
          <button
            type="button"
            data-testid="activate"
            onClick={() => {
              setActive(!active);
              closePopup(false);
            }}
          >
            {active ? 'Tắt trên tab hiện tại · mock' : 'Bật trên tab hiện tại · mock'}
          </button>
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />{' '}
            Ghi nhớ website · mô phỏng, không lưu
          </label>
          <QueueContent
            words={backend.getQueue()}
            batches={backend.getBatches()}
            threshold={backend.threshold}
            onOptions={() => setOptions(true)}
          />
        </section>
      )}
      {options && (
        <section className="options" aria-label="Cài đặt EnglishBot">
          <OptionsContent
            provider={provider}
            threshold={threshold}
            thresholdError={thresholdError}
            keyConfigured={keyConfigured}
            onProvider={setProvider}
            onThreshold={setThreshold}
            onSave={saveOptions}
            onClose={() => setOptions(false)}
          />
        </section>
      )}
      <article
        ref={article}
        className="reading-page article"
        tabIndex={0}
        aria-label="Bài đọc mẫu"
        onPointerUp={(event) => {
          const native = globalThis.getSelection();
          if (!native || !native.rangeCount || !native.toString().trim()) return;
          const range = native.getRangeAt(0);
          if (!article.current?.contains(range.commonAncestorContainer)) return;
          const rect = range.getBoundingClientRect();
          nativeAnchor.current = {
            range: range.cloneRange(),
            offset: { x: event.clientX - rect.right, y: event.clientY - rect.bottom },
          };
          capture(native.toString(), { x: event.clientX, y: event.clientY });
        }}
      >
        <p>READING NOTE · 01</p>
        <h1>Learning takes time.</h1>
        <p>
          Small habits help us stay <span data-word="resilient">resilient</span>. We{' '}
          <span data-word="adapt">adapt</span> when our plans change, and{' '}
          <span data-word="sustain">sustain</span> progress by practising every day.
        </p>
        <p>
          Highlight a word or the title, then press Dịch. A definition is only the beginning; a
          useful example makes a new word easier to remember.
        </p>
        <p>
          The layout test word is{' '}
          <span data-word="antidisestablishmentarianism">antidisestablishmentarianism</span>.
        </p>
      </article>
      <details className="test-controls">
        <summary>Khu vực kiểm thử mock · không phải UI sản phẩm</summary>
        <label>
          Kịch bản
          <select
            data-testid="scenario"
            value={scenario}
            onChange={(event) => {
              const value = event.target.value as MockScenario;
              backend.scenario = value;
              setScenario(value);
              closePopup(false);
            }}
          >
            {scenarios.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            data-testid="mock-key"
            type="checkbox"
            checked={keyConfigured}
            onChange={(event) => {
              backend.keyConfigured = event.target.checked;
              setKeyConfigured(event.target.checked);
            }}
          />{' '}
          Mô phỏng backend đã có AI key (không nhận key thật)
        </label>
        <p>Selection mẫu cho kiểm tra bàn phím/viewport:</p>
        <div className="review-toolbar">
          {[
            ...WORD_FIXTURES.map((word) => word.term),
            ...PHRASE_FIXTURES.map((phrase) => phrase.text),
          ].map((text) => (
            <button
              type="button"
              key={text}
              data-testid={`select-${text}`}
              onClick={(event) => {
                nativeAnchor.current = null;
                capture(text, { x: event.clientX || 20, y: event.clientY || 20 });
              }}
            >
              {text}
            </button>
          ))}
        </div>
        <output data-testid="trace">Calls mô phỏng: {backend.trace.join(' → ') || '0'}</output>
      </details>
      {selection && !popup && (
        <button
          type="button"
          className="translate-action"
          style={triggerStyle}
          data-testid="translate"
          onPointerDown={(event) => event.preventDefault()}
          onClick={translate}
        >
          Dịch
        </button>
      )}
      {popup && (
        <div
          ref={popupElement}
          className="popup"
          role="dialog"
          aria-label="Kết quả dịch EnglishBot"
          data-testid="popup"
          style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 30 }}
        >
          <PopupContent
            view={popup}
            added={added}
            adding={addUnknown}
            addMessage={addMessage}
            onClose={() => closePopup()}
            onRetry={translate}
            onOptions={() => {
              closePopup(false);
              setOptions(true);
            }}
            onAdd={addWord}
          />
        </div>
      )}
    </main>
  );
}
