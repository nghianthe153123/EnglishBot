# Hệ thống UX và UI

## Mục đích

Tài liệu này định nghĩa các bề mặt UI và trạng thái phải được xác thực bằng dữ liệu mô phỏng trước khi khóa hợp đồng API và database. Có thể dùng Figma, nhưng ứng dụng mô phỏng có thể chạy được mới là sản phẩm nghiệm thu.

## Các bề mặt UI

### 1. Side panel của tiện ích

Giao diện sử dụng hằng ngày chính gồm ba khu vực cấp cao nhất:

- **Chat** — trạng thái thu thập, tóm tắt, hội thoại có căn cứ và citation.
- **Từ vựng** — chỉ các từ đã lưu từ trang hiện tại; toàn thư viện được quản lý trong dashboard.
- **Bài học** — số lượng từ đến hạn và lối vào bài học nhanh.

Khung giao diện đề xuất:

```text
┌──────────────────────────────────┐
│ EnglishBot       Tab hiện tại: Bật│
├──────────────────────────────────┤
│ Chat       Từ vựng       Bài học│
├──────────────────────────────────┤
│ Tiêu đề trang                    │
│ 2.430 từ · Tiếng Anh · Mới       │
│                                  │
│ Câu trả lời của trợ lý...        │
│ [Nguồn 1] [Nguồn 2]              │
│                                  │
│ Hỏi về trang này...           ➤  │
└──────────────────────────────────┘
```

Các trạng thái bắt buộc:

- Chưa có quyền.
- Trang bị hạn chế/không được hỗ trợ.
- Sẵn sàng quét.
- Đang quét.
- Quét thất bại kèm hướng dẫn thử lại.
- Đã thu thập và còn mới.
- Trang đã thay đổi; đề xuất thu thập lại.
- Bản thu thập đã hết hạn.
- Ngoại tuyến.
- Bị giới hạn tần suất hoặc hết quota.
- Đang stream câu trả lời.
- Câu trả lời có căn cứ kèm citation.
- Câu trả lời không được nội dung trang hỗ trợ.

### 2. Bong bóng hành động khi chọn văn bản

Tương tác đầu tiên xuất hiện ngay từ code local và không được chờ phản hồi mạng.

Selection được phân loại thành **một từ đơn** hoặc **cụm/câu nhiều từ**. Popup ban đầu chỉ hiển thị selection và loại nhận diện; không gọi mạng trước hành động rõ ràng.

- **Từ đơn:** mở thẻ từ vựng có bản dịch theo ngữ cảnh, từ loại, một câu ví dụ mới do AI soạn và các dạng cùng họ từ (ví dụ `learn`, `learner`, `learning`); cho phép phát âm và lưu từ.
- **Cụm/câu:** chỉ hiển thị bản dịch nghĩa; không có phát âm, từ loại, câu ví dụ, word family, giải thích bổ sung hoặc lưu từ.

Nội dung/hành động của thẻ từ đơn:

- Bản dịch tiếng Việt theo ngữ cảnh.
- Phát âm và lựa chọn giọng.
- Lưu từ.

Các trường trong thẻ mở rộng:

- Nội dung được chọn ban đầu.
- Lemma đã chuẩn hóa khi phù hợp.
- Từ loại.
- IPA hoặc ký hiệu phát âm khi có.
- Bản dịch tiếng Việt theo ngữ cảnh.
- Một câu ví dụ mới do AI soạn.
- Danh sách dạng cùng họ từ; không bao gồm từ đồng nghĩa/trái nghĩa.
- Điều khiển phát âm Anh-Mỹ/Anh-Anh.
- Hành động lưu từ.

Chưa chốt ở P1-002: câu ví dụ AI phải bám nghĩa trong ngữ cảnh trang hay dùng nghĩa phổ biến độc lập; câu ví dụ và word family có được lưu cùng mục từ hay không. Chuyển hai quyết định này sang phase thiết kế DB/API để đánh giá cùng mô hình dữ liệu và vòng đời nội dung.

Bong bóng phải xử lý được vùng chọn nhiều dòng, mép viewport, zoom, trang nền tối và điều hướng trang.

### 3. Bảng điều khiển web

Các route:

| Route           | Mục đích                                                          |
| --------------- | ----------------------------------------------------------------- |
| `/today`        | Bài học đến hạn, từ mới, hoạt động gần đây                        |
| `/vocabulary`   | Tìm kiếm, lọc, sửa, xuất hàng loạt                                |
| `/lessons`      | Bài học đang chờ, lịch sử và tiến độ ôn tập có bằng chứng         |
| `/sources`      | Bản thu thập và ngữ cảnh được giữ lại                             |
| `/integrations` | Luồng MCP và Quizlet                                              |
| `/settings`     | Trình độ, giọng, quyền riêng tư, thời gian lưu, domain bị từ chối |

Tiến độ tổng quan được hiển thị trong `/today`; lịch sử ôn và bằng chứng tiến độ theo bài học nằm trong `/lessons`. Không tạo route `/progress` riêng trong beta (D-103; xác nhận P1-001 ngày 2026-09-29).

### 4. Trạng thái chia sẻ MCP/ChatGPT

Tiện ích hiển thị:

- Dữ liệu nào sẽ được chia sẻ.
- Thời điểm hết hạn.
- Tài khoản EnglishBot đang kết nối.
- Hành động thu hồi.
- Thời điểm truy cập MCP gần nhất khi có.

ChatGPT không có quyền truy cập “tab hiện tại” một cách vô hình hoặc vĩnh viễn.

## Kiến trúc thông tin

```text
EnglishBot
├── Ngữ cảnh
│   ├── Bản thu thập đang hoạt động
│   ├── Tóm tắt
│   └── Chat có căn cứ
├── Học tập
│   ├── Từ vựng
│   ├── Bài học hằng ngày
│   └── Tiến độ trong Hôm nay/Bài học
├── Nguồn
│   ├── Bản thu thập
│   └── Đoạn ngữ cảnh
└── Kiểm soát
    ├── Tích hợp
    ├── Quyền riêng tư
    └── Cài đặt
```

## Design token

Ứng dụng mô phỏng phải thiết lập token thay vì nhúng các giá trị tùy ý:

- Vai trò màu: nền, bề mặt, chính, thành công, cảnh báo, nguy hiểm, chữ, chữ phụ, focus ring.
- Kiểu chữ: display, heading, body, label, đoạn code/nguồn.
- Khoảng cách: thang cơ sở 4 px.
- Bo góc: nhỏ, vừa, lớn, dạng viên thuốc.
- Độ nổi: popup, panel, modal.
- Chuyển động: phản hồi nhanh, chuyển tiếp thường, phương án giảm chuyển động.

Tiện ích phải ưu tiên chiều rộng hẹp. Component của bảng điều khiển có thể responsive, nhưng beta hướng tới desktop.

## Kịch bản dữ liệu mô phỏng

Ứng dụng mô phỏng có thể chạy được phải chứa các kịch bản xác định:

1. Bài viết tiếng Anh dài có mười phần nguồn.
2. Bài viết ngắn không có câu trả lời cho câu hỏi mẫu.
3. Trang động được đánh dấu hết mới sau khi thu thập.
4. Trang bị hạn chế.
5. Bản dịch cho từ có nhiều nghĩa.
6. Chọn cụm từ và cả câu.
7. Lần gặp từ trùng từ nguồn thứ hai.
8. Thư viện từ vựng trống.
9. Hai mươi từ đến hạn với mức mastery khác nhau.
10. Dữ liệu xuất Quizlet có dòng trùng và không hợp lệ.
11. MCP ở các trạng thái chưa kết nối, đã kết nối, đã chia sẻ, hết hạn và bị thu hồi.
12. Timeout mạng, vượt quota và lỗi server có thể phục hồi.

Mock fixture phải dùng ID ổn định và nằm trong package dùng chung để Storybook, UI test và API contract test cùng sử dụng một bộ ví dụ.

## Cổng nghiệm thu UX trước khi khóa database

Phase 2 không thể hoàn tất cho đến khi:

- Mọi hành trình cốt lõi đã chấp nhận đều có thể thao tác xuyên suốt bằng dữ liệu mô phỏng.
- Có đủ trạng thái trống, tải, lỗi, hết mới, ngoại tuyến và quyền truy cập.
- Chủ sản phẩm phê duyệt điều hướng và thuật ngữ.
- Kiểm tra accessibility không có lỗi nghiêm trọng.
- Màn hình được kiểm tra trực quan ở chiều rộng hẹp của tiện ích và viewport desktop/mobile của dashboard.
- Mỗi trường hiển thị được phân loại là dữ liệu suy ra, tạm thời, bền vững hoặc bên ngoài.
- Mỗi hành động người dùng được ánh xạ thành command/query trong bản nháp hợp đồng API.

## Bảng ánh xạ UI sang dữ liệu

Với mỗi màn hình được phê duyệt, ghi lại:

| Thành phần UI           | Nguồn           | Lưu trữ           | Độ mới             | Quyền            | Hành vi khi lỗi           |
| ----------------------- | --------------- | ----------------- | ------------------ | ---------------- | ------------------------- |
| Tiêu đề trang           | Bản thu thập    | TTL               | Thời điểm thu thập | Chủ bản thu thập | Hiển thị không khả dụng   |
| Citation                | Chunk/anchor    | Theo bản thu thập | Thời điểm thu thập | Chủ bản thu thập | Tắt điều hướng            |
| Mastery của từ          | Learning engine | Bền vững          | Tức thời           | Chỉ người dùng   | Hiển thị giá trị gần nhất |
| Trạng thái xuất Quizlet | Export batch    | Bền vững          | Trạng thái job     | Chỉ người dùng   | Thử lại hoặc tải nội dung |

Bảng đầy đủ được tạo trong Phase 2 và trở thành đầu vào cho schema cuối ở Phase 3.
