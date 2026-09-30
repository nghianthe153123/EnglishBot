# ADR-008 — Khảo sát tự động thao tác Quizlet

- Trạng thái: Chấp nhận
- Ngày: 2026-09-30
- Phạm vi quyết định: cho phép khảo sát; chưa có bằng chứng PoC hay triển khai production.

## Lựa chọn của chủ dự án

Nếu chưa xác minh được API/connector chính thức dùng từ EnglishBot, khảo sát tự động thao tác giao diện Quizlet trong trình duyệt người dùng đã đăng nhập. Mục tiêu vẫn là tự import/tạo bộ thẻ; copy text thủ công không thay AC.

## P1-102 phải chứng minh

- Client/host permission có thể thao tác luồng tạo bộ thẻ và import chính thức trên giao diện đã đăng nhập, trong tài khoản test đúng owner.
- Không copy cookie/password hoặc dùng endpoint nội bộ không tài liệu hóa. Mất đăng nhập/CAPTCHA/quyền/DOM thay đổi báo trạng thái cần thao tác hoặc không khả dụng; không tự vượt cơ chế đăng nhập.
- Batch snapshot nhập đúng term/definition/ngôn ngữ; tạo set có ID/URL/bằng chứng tài khoản.
- Restart/tab đóng/worker suspend, timeout sau submit và đối soát trước retry không gây set trùng.
- Quyền tự tạo theo cấu hình người dùng, trạng thái job và cách tắt/recover rõ.

## Quan hệ với ADR-004 và cổng implementation

Thay thế phần cấm khảo sát UI automation cho mục tiêu Phase 1 này. ADR-004 vẫn chặn external write production khi chưa có channel đã được kiểm chứng/chấp nhận. Sau spike, ghi kết quả GO/NO-GO và contract/auth/permission/retry cụ thể vào ADR này trước P1-108. Không diễn giải chấp nhận khảo sát thành “đã tạo Quizlet thành công”. Đồng bộ hai chiều và đọc mastery Quizlet vẫn ngoài Phase 1.
