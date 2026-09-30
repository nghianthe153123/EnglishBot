# Dashboard và integrations — bị thay thế/hoãn

- Trạng thái: tài liệu lịch sử phạm vi; không phải baseline UX hiện hành và không phải dependency để mở gói Phase 1.
- Cập nhật: 2026-09-30 theo P1-R01.

## Phạm vi hiện hành

Phase 1 không có dashboard, route sản phẩm web, ChatGPT MCP integration, source/capture manager, learning dashboard hay Quizlet import/export thủ công. Hành trình liên quan hiện nằm trong extension: selection translation, options, rich word reuse, Add queue và tự tạo Quizlet set.

Quizlet set trên tài khoản người dùng là mục tiêu tự động bắt buộc. Kênh production cần feasibility proof. Owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu kênh chính thức không dùng được; đây chưa phải bằng chứng PoC đạt. Export thủ công không đáp ứng AC. File này không đặt route hoặc giao diện tạm thay thế.

## Lịch sử

Baseline cũ từng mô tả các route `/today`, `/vocabulary`, `/lessons`, `/sources`, `/integrations`, `/settings` cùng flow MCP, dashboard và Quizlet export/import. Chúng bị hoãn/loại khỏi Phase 1 ngày 2026-09-30 và được giữ ở repository như lịch sử. Không khôi phục route `/progress` hay tạo route mới từ nội dung cũ.

## Wirefigma

Dashboard sample Wirefigma là tài liệu tham khảo design system בלבד. Chỉ lấy token, component và behavior phù hợp cho popup pointer, options và queue nhỏ theo [foundation hiện hành](phase-1-design-foundations.md); không sao chép dashboard mẫu thành yêu cầu sản phẩm.

## Quyết định

Nội dung dashboard cũ không tạo work package/dependency hiện hành. Nếu chủ dự án mở lại dashboard hoặc MCP ở phase khác, cần phạm vi và quyết định mới theo quy trình, không dựa vào tài liệu này như phê duyệt đang hiệu lực.
