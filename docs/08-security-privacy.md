# Kế hoạch bảo mật và quyền riêng tư

## Mục tiêu bảo mật

- Chỉ thu thập sau thao tác rõ ràng của người dùng.
- Chỉ gửi lượng nội dung tối thiểu cần cho tính năng đã chọn.
- Giữ secret khỏi tiện ích và browser storage.
- Coi nội dung trang, output model và output MCP là không đáng tin cậy.
- Hành động tích hợp nhạy cảm phải rõ ràng, có scope, có thể thu hồi và audit.
- Cung cấp quyền kiểm soát retention và xóa dữ liệu dễ hiểu cho người dùng.

## Phân loại dữ liệu

| Phân loại           | Ví dụ                                      | Cách xử lý                                        |
| ------------------- | ------------------------------------------ | ------------------------------------------------- |
| Công khai           | Tài liệu sản phẩm, văn bản trang công khai | Kiểm soát truyền/lưu tiêu chuẩn                   |
| Nội dung người dùng | Trang thu thập, câu hỏi, ngữ cảnh từ vựng  | Theo quyền sở hữu, mã hóa, retention giới hạn     |
| Nhạy cảm            | Văn bản intranet/email riêng, lịch sử học  | Tối thiểu hóa, redact, TTL ngắn mặc định          |
| Secret              | API key, OAuth token, session token        | Kho secret phía server, mã hóa, không log         |
| Vận hành            | Request ID, độ trễ, mã lỗi                 | Không chứa văn bản capture thô nếu chưa phê duyệt |

## Kiểm soát bắt buộc

### Tiện ích

- Ưu tiên `activeTab` và `scripting` thay vì quyền vĩnh viễn trên mọi site.
- Duy trì denylist mặc định cho cài đặt trình duyệt, ngân hàng, password manager và nhóm nhạy cảm khác khi nhận diện được.
- Không đọc password input, hidden form value, cookie, local storage hoặc authentication token của trang.
- Làm sạch mọi HTML lấy từ trang trước khi render.
- Hiển thị rõ trạng thái thu thập/chia sẻ và điều khiển thu hồi.

### Backend

- Xác thực và phân quyền mọi tài nguyên thuộc người dùng.
- Kiểm tra quyền sở hữu object, không dựa vào việc ID khó đoán.
- Kiểm tra kích thước request, content type, schema và tần suất.
- Mã hóa provider token và xoay vòng server secret.
- Redact secret và nội dung capture khỏi log.
- Áp dụng xóa theo TTL cho capture, chunk, embedding, câu trả lời cache và share grant.
- Dùng idempotency cho thao tác ghi có thể retry.

### AI và MCP

- Tách instruction đáng tin cậy khỏi nội dung trang/tool không đáng tin cậy.
- Không cho nội dung trang chọn tool hoặc đích đến tùy ý.
- Allowlist MCP tool được lộ ra trong từng workflow.
- Yêu cầu phê duyệt cho side effect thay đổi dữ liệu hoặc bên ngoài.
- Xác thực output model có cấu trúc trước khi dùng trong domain.
- Log tên tool, kết quả phân quyền, request hash đã giới hạn, trạng thái kết quả và metadata an toàn.

## Kịch bản threat model

- Trang chứa text ẩn yêu cầu model xuất dữ liệu người dùng.
- Trang độc hại tạo HTML nhằm chạy trong panel tiện ích.
- Người dùng đoán capture hoặc lesson ID của người khác.
- MCP server bị xâm phạm yêu cầu nội dung capture không cần thiết.
- Model trả citation giả hoặc markup có thể thực thi.
- Retry tạo review hoặc export trùng.
- Build tiện ích vô tình chứa API key.
- Capture đã xóa vẫn còn trong embedding, cache, backup hoặc payload audit.

Mỗi kịch bản cần test hoặc kiểm soát vận hành được ghi lại trước beta.

## Retention và xóa dữ liệu

- Retention mặc định của capture thô/đã làm sạch được quyết định trong Phase 1 và hiển thị trước lần capture đầu.
- Ngữ cảnh từ đã lưu chỉ được tồn tại lâu hơn capture khi hành vi sản phẩm nêu rõ.
- Xóa capture phải xóa hoặc gỡ liên kết chunk, embedding, message và share grant theo invariant đã ghi.
- Ngắt tích hợp phải thu hồi và xóa credential đã lưu.
- Xóa account có thể bất đồng bộ nhưng phải quan sát được và có mục tiêu hoàn tất được ghi lại.
- Hết hạn backup được ghi riêng với xóa dữ liệu đang hoạt động.

## Cổng bảo mật phát hành

- Threat model đã cập nhật.
- Test ma trận phân quyền đạt.
- Bộ prompt injection đạt ngưỡng đã duyệt.
- Quét secret artifact tiện ích sạch.
- Quét dependency và container không còn lỗi critical/high chưa được chấp nhận.
- Diễn tập xóa dữ liệu và phục hồi backup đạt.
- Thông báo quyền riêng tư khớp với telemetry, retention và provider thực tế.
- Quy trình sự cố và xoay credential đã được kiểm tra.
