# Cấu trúc phân rã công việc

## Quy tắc

- Đây là backlog đã lên kế hoạch, không phải quyền thực thi mọi hạng mục.
- Một dòng chỉ có thể triển khai sau khi tạo file gói công việc chi tiết và đánh dấu `SẴN_SÀNG`.
- ID được giữ ổn định kể cả khi lịch thay đổi.

## Phase 0 — Nền tảng

| ID     | Gói công việc                                 | Phụ thuộc | Bằng chứng chính          |
| ------ | --------------------------------------------- | --------- | ------------------------- |
| P0-001 | Review và phê duyệt charter, phạm vi, roadmap | Không     | Hồ sơ quyết định đã duyệt |
| P0-002 | Khóa ADR về cấu trúc repository/build         | P0-001    | ADR + kế hoạch scaffold   |
| P0-003 | Định nghĩa môi trường, secret và cổng CI      | P0-002    | Ma trận môi trường        |
| P0-004 | Chạy thử workflow gói công việc bằng AI       | P0-001    | Gói mẫu đã hoàn thành     |

## Phase 1 — Sản phẩm, UI và kiến trúc

| ID     | Gói công việc                                       | Phụ thuộc              | Bằng chứng chính       |
| ------ | --------------------------------------------------- | ---------------------- | ---------------------- |
| P1-001 | Xác thực persona, hành trình và ưu tiên tính năng   | P0-001                 | PRD đã duyệt           |
| P1-002 | Thiết kế kiến trúc thông tin và trạng thái tiện ích | P1-001                 | Wireframe đã duyệt     |
| P1-003 | Thiết kế dashboard và luồng tích hợp                | P1-001                 | Wireframe đã duyệt     |
| P1-004 | Định nghĩa design token và mục tiêu accessibility   | P1-002, P1-003         | Đặc tả UI              |
| P1-005 | Khóa ranh giới module và kiến trúc runtime          | P1-001                 | ADR kiến trúc          |
| P1-006 | Threat model cho hành trình ban đầu                 | P1-001, P1-005         | Threat model đã review |
| P1-007 | Soạn operation OpenAPI và danh mục MCP tool         | P1-002, P1-003, P1-005 | Bản nháp hợp đồng      |

## Phase 2 — Thiết kế mô phỏng có thể chạy

| ID     | Gói công việc                                 | Phụ thuộc      | Bằng chứng chính               |
| ------ | --------------------------------------------- | -------------- | ------------------------------ |
| P2-001 | Scaffold UI workspace và design system        | P1-004         | Danh mục component             |
| P2-002 | Tạo kịch bản mock dùng chung có phiên bản     | P1-001, P1-007 | Package fixture/test           |
| P2-003 | Xây shell tiện ích mô phỏng và các trạng thái | P2-001, P2-002 | Visual/interaction test        |
| P2-004 | Xây bong bóng chọn văn bản mô phỏng           | P2-001, P2-002 | Interaction/accessibility test |
| P2-005 | Xây hành trình dashboard mô phỏng             | P2-001, P2-002 | Mock E2E test                  |
| P2-006 | Xây luồng tích hợp MCP/Quizlet mô phỏng       | P2-002, P2-005 | Mock E2E test                  |
| P2-007 | Hoàn tất bảng UI-dữ liệu và cổng UX           | P2-003..P2-006 | Chủ sản phẩm duyệt             |

## Phase 3 — Hợp đồng và database

| ID     | Gói công việc                                  | Phụ thuộc      | Bằng chứng chính       |
| ------ | ---------------------------------------------- | -------------- | ---------------------- |
| P3-001 | Hoàn thiện API command, query và hợp đồng lỗi  | P2-007         | OpenAPI contract test  |
| P3-002 | Hoàn thiện aggregate, retention và quy tắc xóa | P2-007         | Review dữ liệu         |
| P3-003 | Tạo schema vật lý V1 và index                  | P3-001, P3-002 | Flyway migration       |
| P3-004 | Tạo database fixture và repository test        | P3-003         | Báo cáo Testcontainers |
| P3-005 | Sinh/xác thực TypeScript API client và type    | P3-001         | Build hợp đồng client  |
| P3-006 | Phê duyệt ADR đường cơ sở schema               | P3-003, P3-004 | ADR đã duyệt           |

## Phase 4 — Lát cắt nền tảng xuyên suốt

| ID     | Gói công việc                                            | Phụ thuộc      | Bằng chứng chính                |
| ------ | -------------------------------------------------------- | -------------- | ------------------------------- |
| P4-001 | Scaffold ứng dụng Spring Boot modular                    | P0-002, P3-006 | Build + ArchUnit                |
| P4-002 | Triển khai khung identity và phân quyền                  | P4-001         | Test auth âm                    |
| P4-003 | Triển khai tạo/trạng thái/xóa capture                    | P4-002, P3-004 | Integration test API            |
| P4-004 | Triển khai AI gateway fake và adapter OpenAI             | P4-001         | Contract test adapter           |
| P4-005 | Triển khai stream phản hồi bằng SSE                      | P4-003, P4-004 | Integration test stream         |
| P4-006 | Kết nối tiện ích với lát cắt xuyên suốt sau cờ tính năng | P3-005, P4-005 | Kiểm thử nhanh E2E trên staging |
| P4-007 | Thêm telemetry và event chi phí cơ bản                   | P4-004, P4-005 | Bằng chứng dashboard/log        |

## Phase 5A — Capture và Q&A có căn cứ

| ID      | Gói công việc                                        | Phụ thuộc        | Bằng chứng chính          |
| ------- | ---------------------------------------------------- | ---------------- | ------------------------- |
| P5A-001 | Triển khai active-tab extraction và làm sạch         | P4-006           | Báo cáo corpus trích xuất |
| P5A-002 | Triển khai source anchor và phát hiện hết mới        | P5A-001          | Browser E2E               |
| P5A-003 | Triển khai chunking và đường cơ sở retrieval từ khóa | P5A-001          | Đánh giá retrieval        |
| P5A-004 | Chỉ đánh giá/thêm vector retrieval khi có căn cứ     | P5A-003          | ADR + số liệu so sánh     |
| P5A-005 | Triển khai câu trả lời có căn cứ và citation         | P5A-002, P5A-003 | Đánh giá Q&A              |
| P5A-006 | Thêm phòng vệ prompt injection và từ chối trả lời    | P5A-005          | Bộ test đối kháng         |
| P5A-007 | UAT Q&A và sửa lỗi phase                             | P5A-001..P5A-006 | Cổng phase đã duyệt       |

## Phase 5B — Chọn văn bản và từ vựng

| ID      | Gói công việc                                 | Phụ thuộc        | Bằng chứng chính           |
| ------- | --------------------------------------------- | ---------------- | -------------------------- |
| P5B-001 | Triển khai bong bóng chọn văn bản production  | P2-004, P4-006   | Browser E2E                |
| P5B-002 | Triển khai hợp đồng dịch theo ngữ cảnh        | P4-004, P5B-001  | Bộ test dịch               |
| P5B-003 | Triển khai browser TTS và server TTS fallback | P5B-001          | Test audio/fallback        |
| P5B-004 | Triển khai aggregate từ vựng và encounter     | P3-006           | Domain/repository test     |
| P5B-005 | Kết nối luồng lưu/đã biết/bỏ qua/sửa          | P5B-002, P5B-004 | UI/API E2E                 |
| P5B-006 | Triển khai preview xuất tương thích Quizlet   | P5B-004          | Test định dạng/idempotency |

## Phase 5C — Học tập

| ID      | Gói công việc                                            | Phụ thuộc        | Bằng chứng chính         |
| ------- | -------------------------------------------------------- | ---------------- | ------------------------ |
| P5C-001 | Định nghĩa và triển khai scheduler có phiên bản          | P5B-004          | Property/replay test     |
| P5C-002 | Triển khai gửi review và truy vấn đến hạn                | P5C-001          | API/concurrency test     |
| P5C-003 | Triển khai lesson aggregate và lựa chọn xác định         | P5C-002          | Domain test              |
| P5C-004 | Triển khai AI exercise generator có cấu trúc và fallback | P4-004, P5C-003  | Contract/evaluation test |
| P5C-005 | Triển khai UI bài học và phục hồi gián đoạn              | P2-005, P5C-003  | Browser E2E              |
| P5C-006 | Triển khai màn hình bằng chứng tiến độ                   | P5C-002, P5C-005 | UI/API test              |
| P5C-007 | UAT học tập mô phỏng nhiều tuần                          | P5C-001..P5C-006 | Cổng phase đã duyệt      |

## Phase 6 — Workflow MCP và Quizlet

| ID     | Gói công việc                                         | Phụ thuộc       | Bằng chứng chính    |
| ------ | ----------------------------------------------------- | --------------- | ------------------- |
| P6-001 | Triển khai shell MCP Streamable HTTP server           | P4-001          | Protocol test       |
| P6-002 | Triển khai liên kết tài khoản MCP và scope            | P4-002, P6-001  | Ma trận auth        |
| P6-003 | Triển khai capture share grant và tool tìm kiếm       | P5A-005, P6-002 | Test tool           |
| P6-004 | Triển khai MCP tool từ đến hạn và bài học             | P5C-003, P6-002 | Test tool           |
| P6-005 | Triển khai integration audit và chính sách phê duyệt  | P6-002..P6-004  | Bằng chứng bảo mật  |
| P6-006 | Triển khai import file Quizlet do người dùng cung cấp | P5B-006         | Fixture import      |
| P6-007 | Chạy compatibility, injection và integration UAT      | P6-003..P6-006  | Cổng phase đã duyệt |

## Phase 7 — Gia cố và beta

| ID     | Gói công việc                               | Phụ thuộc          | Bằng chứng chính             |
| ------ | ------------------------------------------- | ------------------ | ---------------------------- |
| P7-001 | Hoàn tất đường cơ sở hiệu năng và khắc phục | Mọi module cốt lõi | Báo cáo tải                  |
| P7-002 | Hoàn tất review bảo mật và khắc phục        | Mọi module cốt lõi | Cổng bảo mật                 |
| P7-003 | Hoàn tất accessibility và cross-browser     | Mọi module UI      | Báo cáo accessibility/visual |
| P7-004 | Xác minh backup, restore, xóa và rollback   | Platform hoàn tất  | Bằng chứng diễn tập          |
| P7-005 | Chạy UAT beta và bug bash                   | P7-001..P7-004     | Báo cáo UAT                  |
| P7-006 | Build, deploy, canary và quan sát beta      | P7-005             | Checklist phát hành          |
