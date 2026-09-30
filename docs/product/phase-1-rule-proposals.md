# Đề xuất quy tắc dùng lại sau P1-R01

- Trạng thái: ĐỀ_XUẤT, chưa tự áp dụng như quyết định mới.
- Mục đích: ghi nhận bài học khi brainstorming/điều chỉnh theo quy tắc hiện có trong AGENTS.

| Đề xuất                                                                                                  | Lý do và tác động                                                                                  | Nơi cập nhật nếu được duyệt       |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------- |
| Mọi lần thay scope phải lập bản đồ quyết định cũ → mới, giữ ID lịch sử, gỡ artifact đã hủy khỏi baseline | Tránh phiên AI sau đọc tài liệu cũ rồi mở tính năng ngoài scope; P1-R01 đã thực hiện cho phiên này | Playbook/quy trình scope reset    |
| Tích hợp ngoài phải phân biệt mục tiêu sản phẩm, capability đã xác minh và bằng chứng chạy thật          | Không nhầm import text/connector ở sản phẩm khác với API dùng được từ dự án                        | Playbook và template work package |
| Nguồn design system nhập từ ngoài phải có attribution, snapshot/checksum và mức tin cậy giá trị          | Tránh tự chế token hoặc coi HTML sample là màn hình sản phẩm được duyệt                            | Template design foundation        |

Không đề xuất thêm tính năng sản phẩm trong phiên thu hẹp này. Các ý tưởng Chat, MCP, dashboard, phát âm/word family và scheduler giữ ở phạm vi hoãn, không trở thành task Phase 1.
