# ADR-002: Ưu tiên bản mô phỏng và hợp đồng

- Trạng thái: Chấp nhận
- Ngày: 2026-09-28

## Bối cảnh

Thứ tự sản phẩm yêu cầu UI và system design được xác thực trước database và tính năng production. Nếu không, AI coding dễ tạo schema quá sớm và logic liên kết chặt.

## Quyết định

- Xây UI có thể chạy bằng fixture xác định dùng chung trước khi khóa schema production.
- Hoàn tất bảng ánh xạ UI sang dữ liệu sau khi bản mô phỏng được duyệt.
- Khóa hợp đồng OpenAPI/domain rồi mới khóa schema database vật lý.
- Giữ nguyên ngữ nghĩa mock khi thay mock service bằng production adapter.

## Hệ quả

- Thiếu sót UI và trạng thái lỗi được tìm thấy trước công việc persistence tốn kém.
- Trường API và database đều có consumer đã chứng minh.
- Phase 2 có thể cảm giác chậm hơn nhưng giảm làm lại ở phase sau.
- Mock fixture trở thành tài sản test lâu dài và cần quản lý phiên bản.
