# P1-002 — Information architecture của extension

- Trạng thái: BẢN_NHÁP — cần owner review cùng wireframe
- Cập nhật: 2026-09-29
- Work package: [P1-002](../work-packages/P1-002-extension-information-architecture.md)
- Cơ sở: D-102, D-105, D-110, D-111, D-112; J1, J2; [P1-001 đã duyệt](../product/phase-1-scope-and-journeys.md)

## 1. Mục tiêu cấu trúc

Side panel giúp người dùng chuyển qua lại giữa ba việc mà không mất ngữ cảnh trang:

1. **Chat** — quét trang, hỏi nội dung và kiểm chứng câu trả lời qua nguồn.
2. **Từ vựng** — chỉ xem các mục đã lưu từ trang hiện tại, mở hành động nghe/mở chi tiết.
3. **Bài học** — bắt đầu lượt ôn ngắn và xem trạng thái ôn tập có căn cứ.

Tab Chat là điểm vào mặc định vì J1 bắt đầu từ trang đang đọc. Tên trang/ngữ cảnh hiện tại được giữ ở header chung; mỗi tab có một mục đích và một hành động chính, không nhân đôi điều hướng dashboard.

## 2. Cây điều hướng

```text
Extension side panel
├── Header chung
│   ├── Nhận diện EnglishBot
│   └── Tab hiện tại (tên trang rút gọn; domain)
├── Chat [mặc định]
│   ├── Trạng thái quyền/capture hiện tại
│   ├── Tóm tắt bản quét (chỉ khi đã quét)
│   ├── Hội thoại và citation (chỉ khi đã có câu hỏi)
│   └── Composer hỏi về trang
├── Từ vựng
│   ├── Chỉ mục đã lưu từ trang hiện tại
│   ├── Nghĩa/ngữ cảnh/IPA khi có
│   └── Hành động nghe hoặc mở chi tiết
└── Bài học
    ├── Empty state nếu không có từ đến hạn
    ├── Tóm tắt số mục đến hạn
    ├── Bắt đầu bài học
    └── Tiến độ ôn tập có bằng chứng
```

Tiến độ tổng quan vẫn thuộc Hôm nay/Bài học theo xác nhận `RESOLVED-P1-001-01`; không tạo route hay tab Tiến độ mới.

## 3. Thứ bậc thông tin và hành động

| Vị trí           | Thông tin/hành động                                                | Ưu tiên                                                                    |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Header           | EnglishBot, tab hiện tại                                           | Cố định; gọn để dành chiều cao cho nội dung                                |
| Navigation       | Chat / Từ vựng / Bài học                                           | Luôn hiện; trạng thái chọn phân biệt bằng nền/nhãn, không chỉ bằng màu     |
| Chat — chưa quét | Giải thích ngắn về dữ liệu, nút “Quét tab này”                     | Hành động chính duy nhất của trạng thái                                    |
| Chat — đã quét   | Tên trang, freshness/retention, nội dung hội thoại                 | Câu trả lời và citation là trọng tâm; composer cuối panel                  |
| Từ vựng          | Chỉ các mục đã lưu từ trang hiện tại, nghĩa/ngữ cảnh và trạng thái | Danh sách ưu tiên văn bản; từ chưa lưu chỉ xuất hiện trong selection popup |
| Bài học          | Số mục đến hạn, thời lượng ước tính nếu có căn cứ, CTA             | Một CTA “Bắt đầu bài học”; tiến độ là thông tin phụ                        |
| Inline state     | Quyền, mạng, hết hạn, lỗi/quota                                    | Gần phần bị ảnh hưởng; luôn có hành động phục hồi                          |

## 4. Quy tắc giữ ngữ cảnh

- Chuyển tab không tự quét trang, gửi dữ liệu hoặc tạo bài học.
- Khi người dùng điều hướng sang tab khác rồi quay lại, giữ lịch sử và trạng thái chưa gửi trong phiên panel khi khả thi; nội dung đã hết retention phải hiện trạng thái hết hạn.
- Khi tab trình duyệt đổi, header cập nhật tên trang; capture cũ không bị thay bằng nội dung tab mới cho tới khi người dùng chọn quét.
- Citation chỉ điều hướng tới anchor của chính bản capture; khi anchor không còn hợp lệ, vẫn hiển thị nguồn nhưng nêu giới hạn.
- Selection popup là điểm vào thao tác trên văn bản, không thay navigation ba tab và không mở panel phụ bắt buộc.

## 5. Chiều rộng và hành vi responsive

| Chiều rộng panel | Hành vi                                                                                               |
| ---------------: | ----------------------------------------------------------------------------------------------------- |
|           320 px | Một cột; tiêu đề và domain được cắt có dấu ba chấm; tab vẫn đủ nhãn; composer không bị co mất nút gửi |
|           360 px | Baseline hẹp; nội dung citation xuống dòng tự nhiên, không tạo cuộn ngang                             |
|           420 px | Dùng khoảng trống thêm cho đoạn văn, không thêm cột/sidebar phụ                                       |

Panel cuộn dọc theo nội dung; header và tab có thể giữ ở đầu nếu không che vùng đọc. Không khóa chiều cao giả định theo một màn hình cụ thể.

## 6. Ranh giới P1-002 / P1-004

P1-002 chốt hierarchy, copy, trạng thái và thứ tự thao tác; không khóa palette, font thương hiệu, shadow, radius hoặc component React. D-104 yêu cầu gọn, học thuật, ưu tiên đọc và theo light/dark hệ thống.

**Chỉ dẫn thị giác do chủ dự án yêu cầu:** tránh hình thức nhận diện chung chung của sản phẩm AI; hướng tới giao diện biên tập, có tính người làm, lấy typography và nội dung làm trọng tâm. Không dùng gradient tím/xanh, glassmorphism, glow, dàn thẻ số liệu trang trí hay biểu tượng AI làm trang trí mặc định. Cụ thể hóa token, type scale, spacing và accessibility thuộc P1-004 sau khi IA/wireframe extension và dashboard được duyệt.

Lý do: tạo cảm giác như một công cụ học tập/đọc hiểu đáng tin, thay vì template AI/SaaS đại trà. Tác động: P1-004 phải kiểm tra nguyên tắc thị giác này cùng tương phản, dark mode và WCAG; không có tính năng hoặc dependency mới.

## 7. Câu hỏi còn mở

- Không còn câu hỏi điều hướng side panel cấp sản phẩm; ba tab đã được duyệt ở D-102.
- **Đã chốt với owner ngày 2026-09-29:** tab Từ vựng trong extension chỉ hiển thị mục đã lưu từ trang hiện tại; không hiển thị mọi từ hoặc từ mới chưa lưu. Toàn thư viện thuộc dashboard.
- Cụ thể hóa nội dung tiến độ trong tab Bài học chờ walkthrough J3; không thêm metric không có nguồn dữ liệu.
