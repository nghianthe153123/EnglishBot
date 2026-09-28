# Mô hình dữ liệu

## Trạng thái

Đây là **mô hình logic tạm thời**. Nó xác định quyền sở hữu và nhu cầu scale dự kiến, nhưng schema vật lý không được khóa cho đến khi bản mô phỏng có thể chạy của Phase 2 và bảng ánh xạ UI sang dữ liệu được phê duyệt.

## Nguyên tắc thiết kế

- PostgreSQL là system of record.
- Mỗi backend module sở hữu bảng và invariant của mình.
- Dữ liệu do người dùng tạo và dữ liệu thu thập luôn có chủ sở hữu và phân loại retention.
- Nội dung trang thô, chunk đã suy ra, embedding và ngữ cảnh học được lưu có vòng đời khác nhau.
- Lưu nối tiếp bằng chứng như encounter và review; suy ra mastery hiện tại thông qua chuyển trạng thái được kiểm soát.
- Dùng ID dạng UUID/ULID không mang ý nghĩa tại ranh giới bên ngoài.
- Dùng timestamp UTC và lưu riêng múi giờ người dùng.
- Ưu tiên dữ liệu bền vững được chuẩn hóa; dùng JSONB cho payload provider, anchor và nội dung bài tập có phiên bản.
- Không bao giờ lưu credential OpenAI, ChatGPT, trình duyệt hoặc Quizlet dưới dạng plaintext.

## Các nhóm entity

### Định danh

| Entity          | Trường quan trọng                                      | Ghi chú                               |
| --------------- | ------------------------------------------------------ | ------------------------------------- |
| `users`         | id, email, locale, timezone, level, status, created_at | Hồ sơ người dùng bền vững             |
| `devices`       | id, user_id, installation_id, platform, last_seen_at   | Lần cài đặt tiện ích                  |
| `auth_sessions` | id, user_id, token_hash, expires_at, revoked_at        | Bản ghi phiên phía server nếu sử dụng |

### Bản thu thập và retrieval

| Entity                 | Trường quan trọng                                                                                                           | Ghi chú                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `captures`             | id, user_id, device_id, canonical_url_hash, display_url, title, language, status, content_hash, retention_class, expires_at | Aggregate root của bản thu thập  |
| `documents`            | id, capture_id, extractor_version, cleaned_text_ref, token_count, created_at                                                | Phiên bản trích xuất đã làm sạch |
| `document_chunks`      | id, document_id, ordinal, heading_path, text, token_count, anchor_json, embedding                                           | Bằng chứng có thể tìm kiếm       |
| `capture_share_grants` | id, capture_id, user_id, audience, scope, expires_at, revoked_at                                                            | Chia sẻ MCP rõ ràng              |

`display_url` có thể được mã hóa hoặc bỏ qua trong chế độ nhạy cảm về quyền riêng tư. HTML thô mặc định không được lưu; nếu lưu thì nằm trong object storage và database chỉ giữ tham chiếu.

### Hội thoại

| Entity              | Trường quan trọng                                                                                       | Ghi chú                               |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `conversations`     | id, user_id, capture_id, title, status, created_at                                                      | Ban đầu thường gắn với một capture    |
| `messages`          | id, conversation_id, role, content, model_ref, created_at                                               | Chỉ lưu theo chế độ retention đã chọn |
| `message_citations` | message_id, chunk_id, quote_hash, start_offset, end_offset, ordinal                                     | Ánh xạ bằng chứng có thể xác minh     |
| `ai_usage_events`   | id, user_id, feature, provider, model, input_units, output_units, latency_ms, cost_estimate, created_at | Telemetry chi phí và hiệu năng        |

### Từ vựng

| Entity            | Trường quan trọng                                                                                        | Ghi chú                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `lexemes`         | id, language, normalized_form, lemma, part_of_speech                                                     | Bản ghi ngôn ngữ đã chuẩn hóa dùng chung |
| `word_senses`     | id, lexeme_id, definition, translation, ipa, accent, source, version                                     | Nhiều nghĩa/cách phát âm                 |
| `user_words`      | id, user_id, lexeme_id, preferred_sense_id, state, mastery_score, stability, difficulty, due_at, version | Trạng thái học thuộc người dùng          |
| `word_encounters` | id, user_word_id, capture_id, original_form, context_excerpt, action, occurred_at                        | Bằng chứng chỉ ghi nối tiếp              |

Ràng buộc duy nhất không được hợp nhất sai các ngôn ngữ hoặc từ loại khác nhau. Khóa chống trùng cuối cùng được xác thực bằng kịch bản mô phỏng trước migration V1.

### Học tập

| Entity                 | Trường quan trọng                                                                             | Ghi chú                        |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------------------ |
| `lessons`              | id, user_id, status, scheduled_for, started_at, completed_at, generator_version               | Aggregate bài học              |
| `lesson_items`         | id, lesson_id, user_word_id, item_type, position, content_json, expected_answer_json          | Bài tập được sinh có phiên bản |
| `review_attempts`      | id, lesson_item_id, user_word_id, grade, response_time_ms, submitted_answer_json, reviewed_at | Kết quả bất biến               |
| `review_state_changes` | id, user_word_id, attempt_id, previous_state_json, next_state_json, algorithm_version         | Audit lịch ôn có thể tái tạo   |

Bộ lập lịch học phải là hàm thuần có phiên bản để có thể chạy lại kết quả lịch sử trong test.

### Tích hợp

| Entity                     | Trường quan trọng                                                                            | Ghi chú                        |
| -------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------ |
| `integration_accounts`     | id, user_id, provider, external_account_ref, encrypted_token_ref, scopes, expires_at, status | Liên kết tài khoản provider    |
| `integration_audit_events` | id, account_id, action, request_hash, outcome, created_at                                    | Audit tích hợp nhạy cảm        |
| `export_batches`           | id, user_id, provider, status, format_version, item_count, payload_ref, created_at           | Batch xuất tương thích Quizlet |
| `export_batch_items`       | batch_id, user_word_id, external_ref, status, error_code                                     | Kết quả theo từng mục          |
| `sync_jobs`                | id, account_id, direction, cursor, status, attempt_count, next_attempt_at, error_summary     | Đồng bộ trực tiếp có điều kiện |

## Quan hệ chính

```text
user 1---* device
user 1---* capture 1---* document 1---* document_chunk
capture 1---* capture_share_grant
user 1---* conversation 1---* message 1---* message_citation
message_citation *---1 document_chunk
lexeme 1---* word_sense
user 1---* user_word *---1 lexeme
user_word 1---* word_encounter
user 1---* lesson 1---* lesson_item 1---* review_attempt
user_word 1---* review_attempt 1---1 review_state_change
user 1---* export_batch 1---* export_batch_item
```

## Kế hoạch index ban đầu

- `captures(user_id, created_at desc)`.
- `captures(user_id, content_hash)` để chống trùng.
- `document_chunks(document_id, ordinal)`.
- Chỉ tạo vector index trên embedding của chunk sau khi đánh giá truy vấn đại diện.
- `user_words(user_id, state, due_at)`.
- Khóa duy nhất dự kiến cho `user_words(user_id, lexeme_id)`.
- `word_encounters(user_word_id, occurred_at desc)`.
- `lessons(user_id, scheduled_for, status)`.
- `sync_jobs(status, next_attempt_at)`.

## Phân loại retention

| Phân loại        | Ví dụ                                        | Mặc định                            |
| ---------------- | -------------------------------------------- | ----------------------------------- |
| Tạm thời         | Bản thu thập đang hoạt động chưa chia sẻ     | Theo phiên hoặc TTL ngắn            |
| Ngắn hạn         | Bản thu thập chia sẻ MCP, ngữ cảnh hội thoại | TTL có thể cấu hình                 |
| Học tập bền vững | Từ của người dùng, lịch sử ôn                | Đến khi người dùng xóa              |
| Vận hành         | Metadata audit và sử dụng                    | Thời gian tối thiểu theo chính sách |
| Secret           | OAuth token                                  | Mã hóa; xóa khi ngắt kết nối        |

## Chính sách migration

- Flyway migration chỉ tiến về phía trước trong production.
- Migration phải thêm trước khi xóa.
- Thay đổi phá hủy cần quy trình mở rộng/chuyển dữ liệu/thu hẹp theo nhiều bước.
- Mỗi migration có test database trống và test nâng cấp từ phiên bản trước.
- Backfill dữ liệu phải có thể tiếp tục lại và quan sát được.
- Thay đổi schema phải cập nhật hợp đồng API, fixture và bảng truy vết trong cùng gói công việc.

## Danh sách kiểm tra khóa database ở Phase 3

- Có bảng ánh xạ UI sang dữ liệu đã được phê duyệt.
- Mọi trường lưu bền vững có chủ sở hữu và phân loại retention.
- Invariant của aggregate được viết thành test.
- Mẫu truy vấn và cardinality dự kiến được ghi lại.
- PII và secret được phân loại.
- Hành vi xóa và xuất dữ liệu được đặc tả.
- Index tương ứng với truy vấn đã chứng minh.
- Mock fixture chuyển thành database fixture mà không thay đổi ngữ nghĩa.
- Chủ sản phẩm phê duyệt đường cơ sở schema và ADR.
