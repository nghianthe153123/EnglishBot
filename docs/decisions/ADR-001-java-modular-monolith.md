# ADR-001: Java modular monolith

- Trạng thái: Chấp nhận
- Ngày: 2026-09-28

## Bối cảnh

EnglishBot cần logic domain học tập phức tạp, persistence, xác thực, adapter AI/provider, streaming, MCP và background job. Hệ thống phải tiếp tục dễ hiểu khi phần lớn code được AI tạo.

## Quyết định

- Dùng Java 21 hoặc runtime LTS mới hơn đã được phê duyệt cùng Spring Boot cho backend.
- Bắt đầu bằng modular monolith với API module và quyền sở hữu bảng rõ ràng.
- Dùng React và TypeScript cho tiện ích trình duyệt và dashboard.
- Dùng kiểm thử kiến trúc để ngăn phụ thuộc backend bị cấm.
- Ẩn OpenAI SDK và SDK provider khác sau gateway interface.

## Hệ quả

Tích cực:

- Mô hình domain và transaction mạnh.
- Hệ sinh thái bảo mật, migration, kiểm thử và observability trưởng thành.
- Một deployment và phát triển local đơn giản hơn.
- Ranh giới rõ để tách về sau.

Đánh đổi:

- Code trình duyệt vẫn dùng ngôn ngữ/toolchain thứ hai.
- Không được trộn tùy tiện stack reactive và blocking.
- Phải cưỡng chế kỷ luật module vì process boundary không tự làm việc đó.

## Điều kiện xem xét lại

- Nhu cầu scale độc lập đã đo lường.
- Ràng buộc nhóm/runtime khiến LTS đã chọn không phù hợp.
- Một module cần cô lập vì bảo mật hoặc availability.
