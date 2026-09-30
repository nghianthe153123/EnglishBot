# Môi trường, biến cấu hình và secret

## Phase 0 và phạm vi Phase 1 mới

CI/scaffold Phase 0 tiếp tục không cần secret thật. Phase 1 mới theo ADR-006 hỗ trợ Google API và AI BYOK qua backend; chưa chọn AI vendor/model, nơi deploy, auth provider hay secret manager. Không thêm cấu hình giả như hành vi production.

## Môi trường

| Môi trường          | Dữ liệu/provider                                          | Credential và cổng                                                     |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| Local               | Fixture + fake provider mặc định; live test có nhãn riêng | Secret cá nhân ngoài Git; không bind public không auth                 |
| CI                  | Fixture xác định, database test tạm thời                  | Không key thật theo mặc định; docs/quality/security checks             |
| Staging/test cohort | Google/AI/Quizlet thật khi channel/config được duyệt      | Test account, secret store, labeled smoke/E2E; BYOK/auth gate          |
| Production Phase 1  | Phạm vi dịch/Add/batch/Quizlet đã qua P1-109              | TLS, ownership/auth, encrypted/session-only secret, rollout có thể tắt |

## Cấu hình hiện có và đề xuất

| Biến/khái niệm                                          | Chủ sở hữu                  | Trạng thái                                                                                                       |
| ------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ENGLISHBOT_ENV                                          | backend/tooling             | Có từ Phase 0                                                                                                    |
| SERVER_PORT                                             | backend                     | Tùy chọn hiện có, mặc định Spring Boot                                                                           |
| OPENAI_API_KEY                                          | server                      | Tên placeholder lịch sử trong .env.example; không có nghĩa đã chọn vendor OpenAI cho BYOK                        |
| Google project/credential reference                     | backend translation adapter | Đề xuất; hình thức/owner project/quota/billing chốt trước live test                                              |
| Per-user AI provider/model + encrypted secret reference | backend configuration       | BYOK trong phạm vi; transport/storage/auth chi tiết chốt P1-104                                                  |
| Quizlet channel/account/grant reference                 | backend integration         | Chờ P1-102/108; không dùng cookie/session export                                                                 |
| N                                                       | cấu hình người dùng         | Người dùng cấu hình, không có mặc định; chưa cấu hình thì không tự tạo batch; không hardcode fixture vào product |

Không thêm biến secret thật vào .env.example trong P1-R01. Mỗi gói thêm cấu hình phải ghi owner, môi trường, bắt buộc/tùy chọn và vòng đời.

## Vòng đời secret và kiểm chứng

UI nhận key chỉ để gửi qua TLS đến backend đã xác thực; client không lưu lại key. Backend trả status/masked reference, không key. Secret mã hóa hoặc session-only, rotate/revoke/delete và log redaction phải được khóa trong ADR trước production.

Repository không chứa .env/token/private key/credential JSON. CI nhận secret từ kho được duyệt chỉ khi live test riêng yêu cầu. Provider endpoints allowlist; không lấy credential từ trang/selection. Khi lộ key, revoke/rotate và ghi nhận sự cố theo quy trình đã duyệt.

Quét hiện có: scripts/scan-secrets.mjs và .gitignore. Secret scan không thay thế test key write-only, log redaction, owner isolation hoặc scan extension bundle. Các test đó nằm trong P1-104/109.
