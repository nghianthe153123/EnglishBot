# ADR-003: Mô hình quyền riêng tư active-tab và chia sẻ rõ ràng

- Trạng thái: Chấp nhận
- Ngày: 2026-09-28

## Bối cảnh

EnglishBot cần đọc tab trình duyệt hiện tại và có thể lộ dữ liệu capture được chọn qua MCP. Quyền trình duyệt rộng và vĩnh viễn sẽ tạo rủi ro bảo mật/quyền riêng tư không cần thiết.

## Quyết định

- Chỉ capture tab sau thao tác rõ ràng của người dùng bằng quyền active-tab tạm thời khi có thể.
- Không đọc cookie, password field, page storage hoặc authentication token.
- Chia sẻ với ChatGPT/MCP là một hành động rõ ràng riêng biệt.
- MCP dùng share grant có scope, thời hạn và khả năng thu hồi.
- ChatGPT không thể suy ra tab đang hoạt động nếu thiếu tham chiếu capture/share do tiện ích tạo.

## Hệ quả

- Một số tự động hóa bớt liền mạch nhưng ý định người dùng rõ ràng.
- Không thể capture trang hạn chế và một số frame khác origin.
- UI phải hiển thị nổi bật trạng thái capture và chia sẻ.
