# Mô hình dữ liệu — Phase 1

Mô hình logic đề xuất, chưa là schema/migration đã khóa. Phạm vi: [ADR-006](decisions/ADR-006-phase-1-translation-scope.md). Thứ tự: prototype → contract → DB → implementation trong [kế hoạch Phase 1](phases/phase-01-product-ui-architecture.md).

## Hai hành vi lưu khác nhau

Dịch **từ** và validate đủ POS/nghĩa/ví dụ → lưu DB để tái sử dụng. **Add** đưa word entry đã lưu vào hàng đợi Quizlet; lookup/cache hit không tự Add. Cụm/câu không có Add và không lưu lịch sử bền vững mặc định.

## Entity đề xuất

| Entity                  | Trường chính                                                                                                                                                                                                                                                | Module/chính sách                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| users/owner profile     | id, locale, timezone, status                                                                                                                                                                                                                                | identity; cơ chế auth chốt P1-104                         |
| provider_configurations | id, user_id, provider, model_ref, encrypted_secret_ref, status, version                                                                                                                                                                                     | configuration; không key plaintext                        |
| user_settings           | user_id, translation_provider, quizlet_threshold, quizlet_channel, external_account_ref                                                                                                                                                                     | configuration; N nullable khi chưa cấu hình               |
| word_entries            | id, user_id, original_form, normalized_form, source_language, target_language, part_of_speech, meaning, example_sentence, sense_key, translation_provider, enrichment_source, schema_version, provider_version, context_fingerprint, created_at, updated_at | vocabulary; POS/nghĩa/ví dụ bắt buộc khi READY            |
| added_words             | id, user_id, word_entry_id, dedupe_key, status, added_at, version                                                                                                                                                                                           | vocabulary; QUEUED/CLAIMED/EXPORTED                       |
| quizlet_batches         | id, user_id, channel, external_account_ref, threshold_snapshot, format_version, payload_text, payload_hash, item_count, status, created_at, external_set_id, external_set_url                                                                               | integration; payload immutable; TEXT_READY khác SUCCEEDED |
| quizlet_batch_items     | batch_id, added_word_id, ordinal, term_snapshot, definition_snapshot                                                                                                                                                                                        | integration; snapshot đúng các từ đã claim                |
| integration_jobs        | id, batch_id, operation_key, status, attempt_count, next_attempt_at, lease_until, safe_error_code, last_external_result_ref                                                                                                                                 | integration; bền vững; đối soát UNKNOWN                   |

Bảng vật lý, ID, encoding secret và schema_version khóa trong P1-103/104. Không có captures/chunks/messages/embeddings/lessons/review_attempts/share_grants trong migration Phase 1.

## Cache và bất biến

- Entry thuộc người dùng; không chia sẻ nghĩa/ngữ cảnh/BYOK giữa tài khoản.
- Lookup identity có ngôn ngữ nguồn/đích, dạng chuẩn hóa, provider/version và sense/context khi cần. Không unique toàn cục chỉ theo lowercase word.
- Giữ original form, apostrophe/hyphen và các nghĩa khác nhau. Quy tắc lemma/sense phải có fixture trước unique index.
- POS/nghĩa/ví dụ lưu bền vững, có provenance/version; model output thiếu trường không ghi READY.
- Translation provider và enrichment source ghi riêng nếu chọn Google + AI/từ điển. D-P1-09 đã chốt Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ; lưu provenance hai bước riêng.
- Cache hit đúng entry không gọi provider lại. Invalidation/versioning có test; không áp TTL capture 24h cũ lên dữ liệu từ.
- Add chống trùng theo owner + ngôn ngữ + từ/nghĩa đã chọn; không dựa riêng vào ID cache có thể thay đổi giữa provider. Khóa cuối qua P1-103.
- Foreign key và ownership check ngăn Add/batch tham chiếu entry người khác.

## Transaction batch và chống tạo trùng

N do người dùng cấu hình và không có mặc định; chỉ số hợp lệ đã cấu hình mới kích hoạt batch. Chưa có N không tự tạo batch. Thay đổi N áp dụng cho từ QUEUED chưa claim, không thay threshold_snapshot/payload của batch đã tạo; hành vi kích hoạt khi đổi N khóa bằng fixture trong P1-103/107. Transaction claim đúng N từ READY, QUEUED, duy nhất và chưa batch; ghi snapshot/text/job atomically. Request Add đồng thời và nhiều worker không claim cùng một mục.

Unique `quizlet_batch_items(added_word_id)` giữ một mục thuộc tối đa một batch theo chính sách ban đầu. Cho phép xuất lại cùng từ ở batch khác cần quyết định riêng/versioned membership; không làm yếu invariant để retry. UNIQUE `integration_jobs(operation_key)` chống job nội bộ trùng. Write bên ngoài vẫn cần kiểm chứng idempotency/reconciliation.

State inventory đề xuất:

```text
QUEUED → TEXT_READY → WAITING_CHANNEL → CREATING → SUCCEEDED
                                    ↘ FAILED_RETRYABLE
                                    ↘ UNKNOWN → RECONCILING → SUCCEEDED / FAILED_CONFIRMED
```

P1-103 khóa transition. UNKNOWN không tự retry create. SUCCEEDED cần set ID/URL và account evidence. Channel chưa xác minh → WAITING_CHANNEL, không giả success/xóa từ khỏi queue.

## Query/index cần chứng minh

| Query              | Index dự kiến                                         |
| ------------------ | ----------------------------------------------------- |
| Lookup đúng scope  | user_id + lookup_key/version (khóa sau fixture sense) |
| Add trùng          | unique user_id + dedupe_key                           |
| Claim N mục        | user_id + status + added_at + id                      |
| Batch của owner    | user_id + created_at + id                             |
| Worker lease/retry | status + next_attempt_at + lease_until                |
| Đối soát set       | user_id + channel + external_set_id khi có            |

Index thêm sau query thực tế. Kiểm tra concurrency trong P1-104/107; không vector index.

## Retention, xóa và migration

- Kết quả từ lưu đến khi người dùng xóa. URL/ngữ cảnh gốc không bắt buộc; không lưu toàn trang.
- Phrase/sentence chỉ trong request/popup, không audit/log nội dung.
- Secret rotate/disconnect không xóa sai dữ liệu từ. Không plaintext key/cookie/session Quizlet.
- Audit chỉ owner/action/status/hash an toàn, không selection/key.
- Xóa word/batch đang xử lý cần chính sách trước production; không cascade mất job UNKNOWN. Xóa cache không tự xóa bộ thẻ trên Quizlet.
- PostgreSQL/Flyway theo ADR nền tảng. Forward-only migration có test DB trống/upgrade; rollback ứng dụng dùng schema tương thích.

## Cổng khóa DB P1-104

Prototype + mapping UI→data đã duyệt; contract P1-103 khóa; enrichment/cache/sense rõ; ownership/auth/secret rõ; Add/batch concurrency/UNKNOWN có test; retention/xóa được mô tả. P1-R01 không tạo migration hay khẳng định schema production đã duyệt.
