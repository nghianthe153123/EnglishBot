# Ma trận truy vết yêu cầu

Ma trận này ngăn tính năng được triển khai mà không có test và ngăn test lệch khỏi yêu cầu sản phẩm. Cập nhật khi yêu cầu, module sở hữu, gói công việc hoặc cổng phát hành thay đổi.

| Yêu cầu | Module/bề mặt sở hữu          | Gói công việc chính     | Bằng chứng bắt buộc                   |
| ------- | ----------------------------- | ----------------------- | ------------------------------------- |
| CAP-01  | Extension, capture            | P5A-001                 | Test quyền và browser E2E             |
| CAP-02  | Extension, capture, retrieval | P5A-001, P5A-002        | Corpus trích xuất                     |
| CAP-03  | Capture                       | P5A-002                 | Test hết mới/thay đổi                 |
| CAP-04  | Đã hoãn                       | Tương lai               | Không thuộc cổng beta                 |
| CHAT-01 | Conversation                  | P4-005, P5A-005         | API/browser E2E                       |
| CHAT-02 | Conversation, extension       | P4-005, P4-006          | Integration test SSE                  |
| CHAT-03 | Retrieval, conversation       | P5A-005                 | Đánh giá citation                     |
| CHAT-04 | Conversation                  | P5A-006                 | Đánh giá từ chối trả lời              |
| SEL-01  | Extension                     | P5B-001                 | Interaction/visual/accessibility test |
| SEL-02  | AI gateway, vocabulary        | P5B-002                 | Bộ dịch theo ngữ cảnh                 |
| SEL-03  | Extension, AI gateway         | P5B-003                 | Test audio/fallback                   |
| SEL-04  | Vocabulary                    | P5B-004, P5B-005        | Domain và E2E test                    |
| VOC-01  | Vocabulary, learning          | P5B-004, P5C-001        | State-machine test                    |
| VOC-02  | Vocabulary                    | P5B-004                 | Normalization/property test           |
| VOC-03  | Vocabulary, dashboard         | P5B-005                 | API/UI test                           |
| LRN-01  | Learning                      | P5C-001, P5C-002        | Scheduler property/replay test        |
| LRN-02  | Learning                      | P5C-003                 | Test invariant bài học                |
| LRN-03  | Learning, AI gateway          | P5C-004, P5C-005        | Contract generator + E2E              |
| LRN-04  | Learning, dashboard           | P5C-006                 | Test tính bằng chứng                  |
| MCP-01  | Integration MCP, identity     | P6-001, P6-002          | Protocol/auth test                    |
| MCP-02  | Integration MCP, retrieval    | P6-003                  | Test quyền sở hữu/scope/tool          |
| MCP-03  | Integration MCP, learning     | P6-004                  | Contract test tool                    |
| QZ-01   | Integration Quizlet           | P5B-006                 | Test định dạng/idempotency            |
| QZ-02   | Integration Quizlet           | P6-006                  | Fixture validation import             |
| QZ-03   | Có điều kiện                  | Tương lai               | Cần ADR tích hợp được duyệt           |
| PRIV-01 | Capture, identity, UI         | P3-002, P4-003          | Test TTL/xóa/E2E                      |
| PRIV-02 | Extension, capture            | P5A-001                 | Test denylist/quyền                   |
| PRIV-03 | Tất cả                        | P0-003, P7-002          | Quét secret và review bảo mật         |
| NFR-01  | Platform                      | P0-003, P7-002          | Xác minh deployment/TLS               |
| NFR-02  | Platform                      | P0-003, P7-002          | Quét secret/diễn tập xoay vòng        |
| NFR-03  | Identity, mọi API             | P4-002, P7-002          | Ma trận phân quyền                    |
| NFR-04  | Capture, conversation, MCP    | P5A-006, P6-007         | Bộ test injection                     |
| NFR-05  | Platform                      | P4-001, P7-001          | Test không trạng thái/tải             |
| NFR-06  | Persistence                   | P3-003, P3-004, P7-004  | Tương thích migration/rollback        |
| NFR-07  | Gateway/tích hợp              | P4-004, P6-007          | Contract/failure test                 |
| NFR-08  | UI dự án kiểm soát            | P2-007, P7-003          | Báo cáo axe/accessibility thủ công    |
| NFR-09  | API/UI                        | Mọi gói tính năng       | Test trạng thái lỗi                   |
| NFR-10  | AI gateway/platform           | P4-007, P5A-007, P7-001 | Telemetry mức sử dụng/chi phí         |
