# Bảo mật và quyền riêng tư — Phase 1

Áp dụng cho selection translation, BYOK, word DB và batch Quizlet theo ADR-006. Capture/MCP/citation không thuộc threat model phát hành hiện tại.

## Dữ liệu và quyền

| Dữ liệu                        | Xử lý                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| Selection từ/cụm/câu           | Chỉ gửi sau click Dịch; giới hạn kích thước; không đọc toàn trang                       |
| POS/nghĩa/ví dụ từ             | Lưu DB theo owner để reuse; lookup không tự Add                                         |
| Phrase/sentence                | Tạm trong request/popup; không ghi lịch sử/log nội dung mặc định                        |
| API key và credential tích hợp | Secret backend; không plaintext/client storage/log/artifact                             |
| Queue/batch/set reference      | Ownership rõ, trạng thái bền vững, text snapshot; không tuyên bố set đã tạo khi UNKNOWN |

Không đọc cookie/password/page storage/token phiên của website hoặc ChatGPT. Content script chỉ hoạt động sau activation/quyền site; bôi đen không tự cấp activeTab. Quyền tối thiểu chốt ở P1-101/105, site Quizlet chỉ bổ sung nếu kênh đã chấp nhận cần.

## BYOK và provider

UI cấu hình có thể nhận key để gửi một lần qua TLS đến backend đã xác thực; sau đó chỉ hiển thị masked status/reference. Không lưu key trong extension/browser storage hoặc trả key đầy đủ qua GET. Lưu key mã hóa hay session-only phía backend, cơ chế xoay vòng/xóa, auth/deploy là quyết định P1-104/ADR-007 trước production.

Google project credential cũng server-only. Endpoint/model nằm trong allowlist; không nhận URL tùy ý để tránh request đến đích do nội dung trang/AI chọn. Lỗi/log redact key/selection; usage chỉ metadata cần thiết. Google dịch nghĩa + AI BYOK bổ sung từ loại/ví dụ đã được chủ dự án chốt; cấu hình/UI phải thể hiện rõ luồng hai provider cho từ. Google dịch cụm/câu không gọi AI; AI mode dịch selection bằng AI.

## Untrusted input và dữ liệu nhiều người dùng

- Selection và output provider là dữ liệu không tin cậy: render text, không HTML thực thi.
- Instruction AI tách selection; nội dung selection không được cấp quyền gọi tool hoặc thay đổi account.
- Validate schema/POS/nghĩa/ví dụ trước READY; incomplete không Add.
- Mọi request DB/queue/batch kiểm tra owner, không dựa vào ID khó đoán.
- Cache và key theo user; không reuse giữa người dùng.
- Add, batch claim và job có idempotency/concurrency tests.

## Quizlet và tác động bên ngoài

Tự tạo bộ thẻ là yêu cầu owner; owner đã cho phép khảo sát browser automation trên trình duyệt Quizlet đã đăng nhập nếu kênh chính thức chưa dùng được. Channel production còn cần bằng chứng spike. ADR-004 vẫn chặn external write chưa được kiểm chứng; P1-102 phải xác minh quyền client/account và khả năng tạo set. ADR-008 ghi lựa chọn khảo sát browser automation; kết quả spike phải cập nhật trước implementation và kiểm tra permission, phiên đăng nhập hiện có và recovery; không copy cookie hoặc tự vượt cơ chế đăng nhập.

Enable tự tạo chỉ trong tài khoản/quyền người dùng đã cấu hình, đúng batch và threshold. Chỉ báo SUCCEEDED với set evidence. Timeout sau create → UNKNOWN → đối soát; không loop create vô hạn. Không tự xóa bộ thẻ trên tài khoản như rollback.

## Xóa, revoke và test gate

Đến P1-104 phải mô tả: xóa cache/queue/batch, batch đang chạy/UNKNOWN, disconnect/rotate key, owner delete và retention audit. Xóa local không ngầm xóa external set. UI báo chưa lưu khi DB write fail.

Test gate trong P1-104..109: secret scan bundle/storage/log; owner isolation; XSS/prompt injection; key lỗi/hết hạn/quota; selection đổi/restart; double Add/concurrent claim; account mismatch/revoke; timeout sau create và reconcile; migration DB rỗng/upgrade. Live test dùng tài khoản/credential test riêng, có nhãn và bằng chứng đã redact.
