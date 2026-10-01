import type { ReactElement } from 'react';
import type { TranslationResult, WordResult } from '@englishbot/api-contracts';
import type { OptionsProps, PopupProps, QueueProps } from './view-model.js';

function isReadyWord(result: TranslationResult): result is WordResult {
  return result.kind === 'word' && result.persisted && Boolean(result.recordId);
}

export function PopupContent({
  view,
  added,
  adding,
  addMessage,
  onClose,
  onOptions,
  onRetry,
  onAdd,
}: PopupProps): ReactElement {
  const result = view.state === 'result' && view.outcome.ok ? view.outcome.result : null;
  const word = result && isReadyWord(result) ? result : null;
  const phrase = result?.kind === 'phrase' ? result : null;
  const lookupError = view.state === 'result' && !view.outcome.ok ? view.outcome : null;
  const provenanceCaption = word
    ? word.provenance.provider === 'google' && word.provenance.enrichment
      ? `Nghĩa: Google ${word.provenance.version} · Từ loại/ví dụ: ${word.provenance.enrichment.provider.toUpperCase()} ${word.provenance.enrichment.version}`
      : `Nghĩa/từ loại/ví dụ: AI ${word.provenance.version}`
    : null;

  return (
    <div className="popup-content">
      <header className="popup-header">
        <h2>Kết quả dịch</h2>
        <button
          className="icon-button"
          type="button"
          aria-label="Đóng"
          data-testid="popup-close"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      <div className="popup-body">
        <p className="popup-term">{word ? word.term : view.text}</p>
        {view.state === 'loading' ? (
          <p aria-live="polite">Đang dịch…</p>
        ) : (
          <div aria-live="polite" className="result-content">
            {word ? (
              <>
                <p className="part-of-speech">{word.pos}</p>
                <p>{word.definition}</p>
                <p className="example">{word.example}</p>
                {provenanceCaption && <p className="provenance-caption">{provenanceCaption}</p>}
                <p className="text-muted">
                  {word.cacheHit
                    ? `Đã dùng lại từ cache · DB mô phỏng${word.recordId ? ` · ID ${word.recordId}` : ''}`
                    : `Đã lưu từ · DB mô phỏng${word.recordId ? ` · ID ${word.recordId}` : ''}`}
                </p>
              </>
            ) : phrase ? (
              <p>{phrase.definition}</p>
            ) : lookupError ? (
              <p>{lookupError.message}</p>
            ) : (
              <p role="alert">Không thể dùng kết quả từ này vì thiếu dữ liệu hợp lệ.</p>
            )}
          </div>
        )}
        {lookupError &&
          ['provider-required', 'key-required', 'key-invalid'].includes(lookupError.code) && (
            <button className="button button-secondary" type="button" onClick={onOptions}>
              Mở cài đặt
            </button>
          )}
        {lookupError && ['persist-unknown', 'add-unknown'].includes(lookupError.code) && (
          <p className="status-message">
            Kết quả chưa rõ. Không thử lại tự động; cần đối soát trước.
          </p>
        )}
        {lookupError &&
          ![
            'unavailable',
            'provider-required',
            'key-required',
            'key-invalid',
            'persist-unknown',
            'add-unknown',
          ].includes(lookupError.code) && (
            <button className="button button-secondary" type="button" onClick={onRetry}>
              Thử lại
            </button>
          )}
        {addMessage && (
          <p aria-live="polite" className="status-message">
            {addMessage}
          </p>
        )}
      </div>
      {word && (
        <footer className="popup-footer">
          <button
            className="button button-primary"
            type="button"
            data-testid="add-word"
            disabled={adding || added}
            onClick={onAdd}
          >
            {adding ? 'Chờ đối soát' : added ? 'Đã thêm' : 'Thêm vào hàng đợi'}
          </button>
        </footer>
      )}
    </div>
  );
}

export function OptionsContent({
  provider,
  threshold,
  thresholdError,
  keyConfigured,
  onProvider,
  onThreshold,
  onSave,
  onClose,
}: OptionsProps): ReactElement {
  return (
    <section className="options-content" aria-labelledby="options-title">
      <header className="surface-header">
        <div>
          <h1 id="options-title">Cài đặt</h1>
          <p className="text-muted">Chọn cách dịch và số từ cần gom cho mỗi bộ thẻ.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={onClose}>
          Đóng cài đặt
        </button>
      </header>

      <fieldset className="form-group" aria-describedby="google-provider-help">
        <legend>Nhà cung cấp dịch</legend>
        <label className="radio-row">
          <input
            type="radio"
            name="provider"
            value="google"
            checked={provider === 'google'}
            onChange={() => onProvider('google')}
          />
          <span>Google</span>
        </label>
        <label className="radio-row">
          <input
            type="radio"
            name="provider"
            value="ai"
            checked={provider === 'ai'}
            onChange={() => onProvider('ai')}
          />
          <span>AI</span>
        </label>
        <p id="google-provider-help" className="help-text">
          Khi dùng Google, AI bổ sung từ loại và ví dụ cho từ, trừ khi cache đã có đủ dữ liệu. Cụm
          từ và câu không dùng AI bổ sung.
        </p>
      </fieldset>

      <div className="form-group">
        <label htmlFor="threshold">Số từ cho mỗi bộ thẻ (N)</label>
        <input
          id="threshold"
          className="text-input"
          data-testid="threshold"
          type="text"
          inputMode="numeric"
          value={threshold}
          aria-invalid={Boolean(thresholdError)}
          aria-describedby={thresholdError ? 'threshold-help threshold-error' : 'threshold-help'}
          onChange={(event) => onThreshold(event.currentTarget.value)}
        />
        {thresholdError && (
          <p id="threshold-error" className="form-error">
            {thresholdError}
          </p>
        )}
        <p id="threshold-help" className="help-text">
          Để trống nếu chưa muốn tạo bộ thẻ tự động.
        </p>
      </div>

      <div className="key-status">
        <h2>Khóa AI (mô phỏng)</h2>
        <p>
          {keyConfigured ? 'Đã cấu hình khóa AI (mô phỏng).' : 'Chưa cấu hình khóa AI (mô phỏng).'}
        </p>
        <p className="mock-notice">Không nhập API key thật vào bản mock.</p>
      </div>

      <button
        className="button button-primary"
        type="button"
        data-testid="save-options"
        onClick={onSave}
      >
        Lưu cài đặt
      </button>
    </section>
  );
}

const batchLabels = {
  unsent: 'Chưa gửi',
  unavailable: 'Quizlet chưa khả dụng',
  unknown: 'Chưa rõ kết quả — cần đối soát',
  'verified-mock': 'Đã xác minh (mock)',
} as const;

function QueueWord({ word }: { word: WordResult }): ReactElement {
  return (
    <li className="queue-word">
      <span>{word.term}</span>
      <span>{word.definition}</span>
    </li>
  );
}

export function QueueContent({ words, batches, threshold, onOptions }: QueueProps): ReactElement {
  const assignedIds = new Set(batches.flatMap((batch) => batch.items.map((item) => item.recordId)));
  const pendingWords = words.filter((word) => !assignedIds.has(word.recordId));
  return (
    <section className="queue" aria-labelledby="queue-title">
      <header className="surface-header">
        <div>
          <h1 id="queue-title">Hàng đợi</h1>
          <p className="text-muted">
            {words.length} từ đã thêm · {pendingWords.length} từ đang chờ
          </p>
        </div>
      </header>
      {threshold === null && (
        <div className="notice">
          <p>Hãy cài đặt số từ N để bắt đầu tạo bộ thẻ.</p>
          <button className="button button-secondary" type="button" onClick={onOptions}>
            Mở cài đặt
          </button>
        </div>
      )}
      {threshold !== null && (
        <p className="queue-progress" aria-live="polite">
          Đang chờ {pendingWords.length} / {threshold} từ để tạo batch mô phỏng.
        </p>
      )}
      {pendingWords.length > 0 ? (
        <ul className="queue-list">
          {pendingWords.map((word) => (
            <QueueWord key={word.recordId} word={word} />
          ))}
        </ul>
      ) : (
        <p className="empty-state">Chưa có từ nào trong hàng đợi.</p>
      )}
      {batches.map((batch) => (
        <article className="batch" key={batch.snapshotId}>
          <h2>Bộ thẻ mô phỏng</h2>
          <p>Mã snapshot: {batch.snapshotId}</p>
          <p>Ngưỡng tại thời điểm tạo: {batch.thresholdSnapshot}</p>
          <p className="batch-state">{batchLabels[batch.state]}</p>
          {batch.state === 'verified-mock' && batch.setId && <p>ID bộ thẻ mock: {batch.setId}</p>}
          {batch.state === 'verified-mock' && batch.accountId && (
            <p>Tài khoản mô phỏng: {batch.accountId}</p>
          )}
          <label htmlFor={`import-${batch.snapshotId}`}>Văn bản import chỉ đọc</label>
          <textarea
            id={`import-${batch.snapshotId}`}
            className="import-text"
            readOnly
            value={batch.importText}
            rows={Math.min(8, Math.max(3, batch.items.length))}
          />
        </article>
      ))}
    </section>
  );
}
