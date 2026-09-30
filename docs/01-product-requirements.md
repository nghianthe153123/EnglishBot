# Yêu cầu sản phẩm

## Trạng thái yêu cầu

- `ĐỀ_XUẤT`: chưa được phê duyệt để triển khai.
- `CHẤP_NHẬN`: thuộc phạm vi đã lên kế hoạch.
- `HOÃN`: chủ động chuyển sang giai đoạn sau.
- `CÓ_ĐIỀU_KIỆN`: cần năng lực bên ngoài hoặc quyết định bổ sung.

## Các hành trình người dùng cốt lõi

### J1 — Hiểu tab đang hoạt động

1. Người dùng mở side panel của tiện ích.
2. Tiện ích giải thích dữ liệu sẽ được thu thập.
3. Người dùng chọn **Quét tab này**.
4. EnglishBot trích xuất và tóm tắt nội dung được hỗ trợ.
5. Người dùng đặt câu hỏi.
6. EnglishBot stream câu trả lời có căn cứ kèm tham chiếu nguồn.
7. Khi chọn nguồn, hệ thống cuộn tới và làm nổi bật đoạn gốc nếu có thể.

### J2 — Học văn bản được chọn

1. Người dùng chọn một từ, cụm từ hoặc câu.
2. Extension phân loại cục bộ lựa chọn thành một từ đơn hoặc cụm/câu nhiều từ; chỉ gửi dữ liệu sau hành động rõ ràng của người dùng.
3. Với từ đơn, người dùng mở thẻ từ vựng gồm nghĩa theo ngữ cảnh, từ loại, câu ví dụ mới do AI soạn và các dạng cùng họ từ; có thể nghe phát âm hoặc lưu từ.
4. Với cụm/câu, người dùng chỉ nhận bản dịch nghĩa; không hiện phát âm, giải thích thêm hoặc lưu từ.
5. Từ đơn được lưu sẽ ghi nhận ngữ cảnh trang và tín hiệu lần gặp.
6. Các từ trùng được hợp nhất thành một bản ghi học tập.

### J3 — Hoàn thành bài học hằng ngày

1. Bảng điều khiển hiển thị từ đến hạn và từ mới.
2. Người dùng bắt đầu bài học với số lượng mục giới hạn.
3. Bài tập thu thập độ chính xác và thời gian phản hồi.
4. Learning engine cập nhật mức độ ghi nhớ và ngày ôn tiếp theo.
5. Tổng kết bài học giải thích tiến độ và các từ khó.

### J4 — Sử dụng dữ liệu đã thu thập trong ChatGPT

1. Người dùng chủ động chia sẻ bản thu thập đang hoạt động với ChatGPT.
2. EnglishBot cấp tham chiếu bản thu thập có thời hạn ngắn.
3. ChatGPT gọi các MCP tool của EnglishBot dưới tài khoản người dùng đã liên kết.
4. MCP chỉ trả về nội dung hoặc kết quả tìm kiếm đã được cấp quyền.
5. Hành động nhạy cảm cần phê duyệt rõ ràng và được audit.

### J5 — Xuất sang Quizlet

1. Người dùng chọn một tập con từ vựng.
2. EnglishBot cho xem trước từ và định nghĩa.
3. Người dùng xử lý lỗi xác thực hoặc từ trùng.
4. EnglishBot tạo nội dung văn bản tương thích với Quizlet.
5. Người dùng sao chép hoặc mở luồng import của Quizlet.
6. EnglishBot ghi nhận batch xuất nhưng không khẳng định đã xuất bản thành công nếu chưa có xác nhận.

## Yêu cầu chức năng

| ID      | Yêu cầu                                                                                        |  Ưu tiên | Trạng thái   | Phase dự kiến |
| ------- | ---------------------------------------------------------------------------------------------- | -------: | ------------ | ------------- |
| CAP-01  | Chỉ thu thập tab đang hoạt động sau thao tác của người dùng                                    | Bắt buộc | CHẤP_NHẬN    | 4/5A          |
| CAP-02  | Trích xuất tiêu đề, URL, ngôn ngữ, heading, văn bản dễ đọc và anchor nguồn                     | Bắt buộc | CHẤP_NHẬN    | 5A            |
| CAP-03  | Phát hiện nội dung trang đã thay đổi hoặc hết mới                                              |   Nên có | CHẤP_NHẬN    | 5A            |
| CAP-04  | Hỗ trợ PDF, trang nhiều hình và OCR                                                            |   Có thể | HOÃN         | 7+            |
| CHAT-01 | Đặt câu hỏi về một bản thu thập                                                                | Bắt buộc | CHẤP_NHẬN    | 4/5A          |
| CHAT-02 | Stream câu trả lời tới side panel                                                              | Bắt buộc | CHẤP_NHẬN    | 4             |
| CHAT-03 | Gắn citation nguồn có thể kiểm chứng                                                           | Bắt buộc | CHẤP_NHẬN    | 5A            |
| CHAT-04 | Thông báo khi câu trả lời không được trang hỗ trợ                                              | Bắt buộc | CHẤP_NHẬN    | 5A            |
| SEL-01  | Phát hiện văn bản được chọn và hiển thị hành động theo ngữ cảnh                                | Bắt buộc | CHẤP_NHẬN    | 5B            |
| SEL-02  | Dịch bằng ngữ cảnh câu xung quanh                                                              | Bắt buộc | CHẤP_NHẬN    | 5B            |
| SEL-03  | Phát âm và cho phép chọn giọng                                                                 | Bắt buộc | CHẤP_NHẬN    | 5B            |
| SEL-04  | Lưu từ cùng ngữ cảnh nguồn                                                                     | Bắt buộc | CHẤP_NHẬN    | 5B            |
| SEL-05  | Phân loại từ đơn với cụm/câu; từ đơn có từ loại, ví dụ AI mới và word family; cụm/câu chỉ dịch | Bắt buộc | CHẤP_NHẬN    | 5B            |
| VOC-01  | Duy trì các trạng thái candidate, learning, reviewing, mastered, ignored                       | Bắt buộc | CHẤP_NHẬN    | 5C            |
| VOC-02  | Hợp nhất các lần gặp lặp lại của cùng một từ đã chuẩn hóa                                      | Bắt buộc | CHẤP_NHẬN    | 5B/5C         |
| VOC-03  | Cho phép sửa thủ công nghĩa, trạng thái và metadata phát âm                                    |   Nên có | CHẤP_NHẬN    | 5C            |
| LRN-01  | Tạo lịch ôn có tính xác định từ kết quả ôn tập                                                 | Bắt buộc | CHẤP_NHẬN    | 5C            |
| LRN-02  | Tạo bài học có giới hạn từ từ vựng đến hạn                                                     | Bắt buộc | CHẤP_NHẬN    | 5C            |
| LRN-03  | Hỗ trợ bài tập điền từ, chọn đáp án, nhớ lại và đọc hiểu theo ngữ cảnh                         |   Nên có | CHẤP_NHẬN    | 5C            |
| LRN-04  | Hiển thị tiến độ mà không tạo ra tuyên bố mastery thiếu căn cứ                                 | Bắt buộc | CHẤP_NHẬN    | 5C            |
| MCP-01  | Liên kết tài khoản EnglishBot với MCP client                                                   | Bắt buộc | CHẤP_NHẬN    | 6             |
| MCP-02  | Tìm kiếm trong bản thu thập được chia sẻ rõ ràng                                               | Bắt buộc | CHẤP_NHẬN    | 6             |
| MCP-03  | Liệt kê từ đến hạn/chưa thuộc và tạo bài học                                                   |   Nên có | CHẤP_NHẬN    | 6             |
| QZ-01   | Xem trước và xuất văn bản tương thích Quizlet                                                  | Bắt buộc | CHẤP_NHẬN    | 5B/6          |
| QZ-02   | Import file Quizlet do người dùng cung cấp                                                     |   Nên có | CHẤP_NHẬN    | 6             |
| QZ-03   | Đồng bộ trực tiếp với Quizlet                                                                  |   Có thể | CÓ_ĐIỀU_KIỆN | 7+            |
| PRIV-01 | Cấu hình thời gian lưu và xóa bản thu thập                                                     | Bắt buộc | CHẤP_NHẬN    | 4             |
| PRIV-02 | Chặn thu thập trên domain bị từ chối                                                           | Bắt buộc | CHẤP_NHẬN    | 4             |
| PRIV-03 | Không bao giờ lưu cookie phiên trình duyệt hoặc ChatGPT                                        | Bắt buộc | CHẤP_NHẬN    | Tất cả        |

## Yêu cầu phi chức năng

| ID     | Yêu cầu                                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | Mọi lưu lượng mạng bên ngoài môi trường local đều dùng TLS.                                                           |
| NFR-02 | Secret chỉ ở phía server và được cung cấp qua secrets manager hoặc biến môi trường.                                   |
| NFR-03 | Mọi API ghi dữ liệu phải được xác thực, phân quyền, kiểm tra dữ liệu và audit khi nhạy cảm.                           |
| NFR-04 | Nội dung trang được coi là dữ liệu không đáng tin cậy và tách biệt khỏi system/tool instruction.                      |
| NFR-05 | Backend hỗ trợ scale ngang mà không phụ thuộc vào trạng thái người dùng nằm trong process.                            |
| NFR-06 | Database migration chỉ tiến về trước, có phiên bản, được kiểm thử và tương thích ngược trong lúc deploy.              |
| NFR-07 | Provider bên ngoài được truy cập qua adapter có timeout, retry, circuit breaker và test double.                       |
| NFR-08 | Mục tiêu accessibility là WCAG 2.2 AA cho UI do dự án kiểm soát khi khả thi.                                          |
| NFR-09 | Trạng thái lỗi cho người dùng phải chỉ rõ cách phục hồi và không lộ secret hoặc stack trace thô.                      |
| NFR-10 | Kiểm soát chi phí gồm giới hạn kích thước nội dung, chống trùng, cache, quota và theo dõi mức sử dụng theo tính năng. |

## Quyết định sản phẩm cần chốt trong Phase 1

Danh sách quyết định, phương án khuyến nghị và trạng thái phê duyệt đầy đủ được quản lý tập trung tại [`docs/11-decisions-to-lock.md`](11-decisions-to-lock.md).

- Chat trong tiện ích hay ChatGPT MCP là giao diện sử dụng hằng ngày chính. Khuyến nghị hiện tại: ưu tiên tiện ích.
- Thời gian lưu bản thu thập mặc định: chỉ trong phiên, 24 giờ hoặc 7 ngày.
- Trình độ người học mặc định và độ sâu của bài đánh giá onboarding.
- OpenAI API key chỉ do hệ thống sở hữu hay hỗ trợ BYOK về sau.
- Phát âm tiếng Anh ban đầu: Mỹ, Anh hoặc cho người dùng chọn.
- Phiên bản Chrome và Edge tối thiểu được hỗ trợ.
