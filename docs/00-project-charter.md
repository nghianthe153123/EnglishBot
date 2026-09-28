# Tuyên bố dự án

## Tầm nhìn sản phẩm

EnglishBot giúp người học hiểu tiếng Anh trong lúc duyệt web. Hệ thống đọc nội dung được người dùng cho phép từ tab trình duyệt đang hoạt động, trả lời câu hỏi có căn cứ, dịch và phát âm văn bản được chọn, theo dõi mức độ ghi nhớ từ vựng, tạo bài học và chuẩn bị dữ liệu học cho Quizlet.

## Người dùng chính

Bản phát hành đầu tiên hướng tới một người học nói tiếng Việt, quan tâm đến quyền riêng tư và sử dụng Chrome hoặc Edge trên máy tính. Mô hình dữ liệu có xét tới yêu cầu nhiều người dùng và thương mại hóa, nhưng các yêu cầu này không được làm chậm bản beta cho một người dùng.

## Kết quả sản phẩm

1. Người dùng có thể hiểu một trang tiếng Anh mà không cần rời khỏi trang đó.
2. Câu trả lời dựa trên nội dung đã thu thập và trỏ ngược về nguồn.
3. Việc tra hoặc trả lời sai một từ sẽ đóng góp bằng chứng cho mô hình học cá nhân.
4. Hệ thống chuyển từ vựng đến hạn thành bài học tập trung hằng ngày.
5. Từ vựng có thể được chuyển sang Quizlet qua quy trình được hỗ trợ và có bước xem lại.
6. ChatGPT có thể truy cập dữ liệu trang được chia sẻ rõ ràng qua MCP mà không cần truy cập cookie trình duyệt.

## Các ràng buộc định hướng

- Java và Spring Boot là nền tảng backend.
- Các bề mặt trình duyệt dùng TypeScript vì API tiện ích trình duyệt là API JavaScript.
- UI và luồng tương tác phải được xác thực bằng dữ liệu mô phỏng trước khi khóa thiết kế database production.
- Backend ban đầu là modular monolith.
- Quyền riêng tư theo cơ chế chủ động đồng ý: tiện ích chỉ thu thập tab sau thao tác của người dùng.
- Dự án không tự động hóa endpoint riêng tư của ChatGPT hoặc trích xuất thông tin phiên ChatGPT.
- Đồng bộ trực tiếp với Quizlet phụ thuộc vào API chính thức được hỗ trợ hoặc tích hợp được phê duyệt.
- Đầu ra AI không được tin tưởng chỉ vì có định dạng tốt; bắt buộc phải có grounding và đánh giá.

## Chỉ số thành công cho beta

| Khu vực         | Mục tiêu beta                                                                            |
| --------------- | ---------------------------------------------------------------------------------------- |
| Thu thập        | Trích xuất đúng nội dung bài viết chính trên ít nhất 90% bộ trang kiểm thử đã thống nhất |
| Grounding       | Ít nhất 90% câu trả lời thực tế được chấp nhận có citation hỗ trợ hợp lệ                 |
| UX chọn văn bản | Thẻ dịch xuất hiện trong 300 ms, không tính thời gian chờ dịch qua mạng                  |
| Chat            | Token trả lời đầu tiên đáp ứng ngân sách hiệu năng đã thống nhất trên trang thông thường |
| Từ vựng         | Các từ trùng được hợp nhất mà không làm mất lần gặp hoặc ngữ cảnh                        |
| Học tập         | Mỗi kết quả ôn tập tạo ra trạng thái ôn tiếp theo có tính xác định                       |
| Quyền riêng tư  | Không có OpenAI key, integration token hoặc cookie trình duyệt trong bundle tiện ích     |
| Độ tin cậy      | Không còn lỗi mức nghiêm trọng 1 khi phát hành beta                                      |

Các con số hiệu năng phụ thuộc vào hosting và lựa chọn model sẽ được chốt trong kiểm thử tải ở Phase 4.

## Giả định bàn giao

- Một người đóng vai trò chủ sản phẩm/người review điều hành quy trình coding bằng AI.
- Người phụ trách có thể dành 20–30 giờ tập trung mỗi tuần.
- AI có thể tạo code nhanh, nhưng review của con người, quyết định sản phẩm, QA trực quan và phê duyệt phát hành vẫn là điểm giới hạn lịch trình.
- Tối đa hai gói công việc độc lập được hoạt động đồng thời.
- Gói công việc tác động cùng module hoặc schema phải chạy tuần tự.

## Ngoài phạm vi của beta đầu tiên

- Ứng dụng di động.
- Tự động truy cập mọi tab trình duyệt đang mở.
- Thu thập nền mà không có sự đồng ý của người dùng.
- Thu thập toàn bộ website.
- Lớp học cộng tác thời gian thực.
- Tự động xuất bản lên Quizlet qua endpoint không được tài liệu hóa.
- Microservice ở quy mô production.
- Web agent tự chủ đa mục đích.

## Quản trị

- Chủ sản phẩm: phê duyệt phạm vi, UI, hành vi quyền riêng tư và bản phát hành.
- Hồ sơ kiến trúc: `docs/decisions`.
- Nguồn sự thật hiện tại: `docs/status/STATUS.md`.
- Đơn vị triển khai: một file gói công việc.
- Cổng phát hành: mọi yêu cầu được ánh xạ và test bắt buộc trong `docs/10-traceability.md` đều đạt.
