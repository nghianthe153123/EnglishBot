# P1-002 — Wireframe extension và selection popup

- Trạng thái: BẢN_NHÁP — ưu tiên review side panel đủ ba tab trước
- Cập nhật: 2026-09-29
- Work package: [P1-002](../work-packages/P1-002-extension-information-architecture.md)
- Mức fidelity: cấu trúc và hành vi, chưa phải high-fidelity visual hoặc code UI

> Wireframe này dùng chữ và đường nét trung tính để review hierarchy/flow. Không khóa màu, font hoặc độ nổi; không phải ảnh mockup cuối.

## 1. Khung panel chung

```text
┌──────────────────────────────────┐
│ EnglishBot                    [×] │  Header chung
│ example.com · tab hiện tại        │
├──────────────────────────────────┤
│ [ Chat ] [ Từ vựng ] [ Bài học ]  │  D-102
├──────────────────────────────────┤
│                                  │
│ Nội dung của tab đang chọn        │  Cuộn dọc
│                                  │
└──────────────────────────────────┘
```

- Entry mặc định: tab **Chat**.
- Nút đóng panel là điều khiển của trình duyệt; mock không tạo một chức năng sản phẩm mới.
- Header dùng hostname và tên trang đã rút gọn; không phô URL query có thể chứa thông tin nhạy cảm.
- Chiều rộng kiểm tra: 320/360/420 px; thứ tự focus: browser close (nếu thuộc DOM sản phẩm thì không mô phỏng) → tab Chat → Từ vựng → Bài học → điều khiển trong panel theo thứ tự đọc.

## 2. Tab Chat — chưa quét và quét trang

### EXT-CHAT-01 — Chưa quét, có thể capture

```text
┌──────────────────────────────────┐
│ CHAT                             │
│ Bạn đang đọc                     │
│ The science of learning...       │
│ example.com                      │
│                                  │
│ Gửi văn bản đọc được để hỏi đáp. │
│ Không lấy cookie. Lưu tối đa     │
│ 24 giờ.                          │
│                                  │
│ [ Quét tab này ]                 │  CTA chính
│                                  │
│ Chưa có bản quét                 │
│ [Hỏi về trang này…      ] [Gửi]  │  Disabled tới khi có capture
└──────────────────────────────────┘
```

- Chỉ khi người dùng bấm **Quét tab này** mới xin quyền/đọc nội dung theo `activeTab` và gửi capture theo chính sách.
- Copy nêu mục đích, dữ liệu và retention gần CTA; không yêu cầu thêm xác nhận nếu người dùng đã chủ động bấm hành động này.
- Composer chưa khả dụng trước khi capture thành công; lý do thể hiện bằng văn bản, không chỉ dựa vào trạng thái disabled.

### EXT-CHAT-02 — Đang quét

```text
┌──────────────────────────────────┐
│ Đang quét tab hiện tại…          │
│ Đang lấy văn bản đọc được        │
│ [hủy nếu còn an toàn]            │
└──────────────────────────────────┘
```

Không hiển thị phần trăm giả. Khi xử lý xong chuyển thành EXT-CHAT-03; khi lỗi chuyển đến catalog trạng thái mục 6.

### EXT-CHAT-03 — Bản quét thành công và câu trả lời

```text
┌──────────────────────────────────┐
│ ĐÃ QUÉT · Tiếng Anh · 2.430 từ   │
│ The science of learning...       │
│ [Quét lại] [Xóa bản quét]        │  TTL hiển thị trong chi tiết
├──────────────────────────────────┤
│ Bạn: Why does spaced practice    │
│ work better than cramming?       │
│                                  │
│ EnglishBot                       │
│ Spaced practice tạo ra các lần   │
│ nhớ lại sau một khoảng nghỉ...   │
│                                  │
│ [Nguồn 1 · đoạn “spacing effect”]│  Citation bấm được
│                                  │
│ [Hỏi tiếp về trang này…  ] [Gửi] │
└──────────────────────────────────┘
```

- Khu hội thoại cuộn độc lập theo nội dung; composer giữ ở cuối panel khi viewport cho phép.
- Citation là điều khiển có nhãn; kích hoạt sẽ đưa tab nguồn tới anchor và highlight nếu còn hợp lệ (D-111).
- Khi stream, nội dung có trạng thái đang trả lời; không nhân bản nhiều spinner.
- Quét lại thay bản capture đang hoạt động chỉ sau hành động người dùng; hệ thống không lấy tab mới ngầm.

### EXT-CHAT-04 — Câu trả lời không được nguồn hỗ trợ

```text
│ EnglishBot                       │
│ Mình chưa tìm thấy thông tin này │
│ trong nội dung tab đã quét.      │
│ Bạn có thể hỏi hẹp hơn hoặc quét │
│ lại trang sau khi mở nội dung.   │
│                                  │
│ [Hỏi câu khác…           ] [Gửi] │
```

Không dùng web search ngoài capture trừ khi người dùng yêu cầu (D-112); không tạo citation giả.

### EXT-CHAT-05 — Xác nhận xóa bản quét

```text
┌──────────────────────────────────┐
│ Xóa bản quét này?                │
│ Nội dung trang và chat gắn với   │
│ bản quét sẽ không còn dùng được. │
│                                  │
│ [Giữ lại]        [Xóa bản quét]  │
└──────────────────────────────────┘
```

Xóa chỉ xảy ra sau xác nhận; sau khi xóa quay về EXT-CHAT-01. Không xóa từ vựng đã lưu riêng theo D-205.

## 3. Tab Từ vựng

### EXT-WORDS-01 — Chưa có từ đã lưu từ trang này

```text
┌──────────────────────────────────┐
│ TỪ VỰNG                          │
│ Mục đã lưu từ trang hiện tại     │
│                                  │
│ Chưa có từ nào từ trang này.     │
│ Bôi đen từ hoặc cụm từ trên trang│
│ để dịch, nghe phát âm hoặc lưu.  │
│                                  │
│ [Quay lại trang]                 │
└──────────────────────────────────┘
```

Không biến empty state thành lời khẳng định người dùng chưa có từ trong cả tài khoản; dashboard quản lý toàn thư viện thuộc bề mặt khác.

### EXT-WORDS-02 — Danh sách mục từ từ trang hiện tại

```text
┌──────────────────────────────────┐
│ TỪ VỰNG · trang hiện tại         │
│                                  │
│ durable      /ˈdʊrəbəl/          │
│ bền vững; memory → bền lâu       │
│ [Nghe]              [Mở chi tiết]│
├──────────────────────────────────┤
│ retrieve     /rɪˈtriːv/          │
│ gợi nhớ; retrieve information    │
│ [Nghe]              [Mở chi tiết]│
└──────────────────────────────────┘
```

- Mỗi dòng ưu tiên từ + nghĩa theo ngữ cảnh; IPA/part of speech chỉ hiện khi có.
- Không trình bày mastery bằng badge màu nếu chưa có bằng chứng; hành động nghe có text label và chọn accent theo D-107.
- Lựa chọn phạm vi list (chỉ trang hiện tại hay thư viện đầy đủ) vẫn cần owner review trước khi khóa.

## 4. Tab Bài học

### EXT-LESSON-01 — Có mục đến hạn

```text
┌──────────────────────────────────┐
│ BÀI HỌC                          │
│                                  │
│ Ôn từ đến hạn                    │
│ 5 mục cần ôn                     │
│                                  │
│ [ Bắt đầu bài học ]              │  CTA chính
│                                  │
│ Tiến độ                          │
│ 8 lượt ôn hoàn tất tuần này      │  Chỉ khi có data
│ Dựa trên lịch sử trả lời của bạn │
└──────────────────────────────────┘
```

Không hiển thị thời lượng ước tính cho tới khi có căn cứ đo hoặc quy tắc được duyệt. Tiến độ là lịch sử hành vi, không tự suy ra mastery tổng quát (LRN-04).

### EXT-LESSON-02 — Không có mục đến hạn / thư viện rỗng

```text
┌──────────────────────────────────┐
│ BÀI HỌC                          │
│                                  │
│ Chưa có từ đến hạn ôn.           │
│ Các từ bạn lưu sẽ xuất hiện ở đây│
│ khi tới lịch ôn.                 │
│                                  │
│ [Quay lại Chat]                  │
└──────────────────────────────────┘
```

Nếu đã có từ nhưng chưa tới lịch, copy phân biệt “chưa tới hạn” với “chưa có từ”; không tạo lesson rỗng.

## 5. Selection popup — wireframe theo cùng hệ thống

Popup xuất hiện gần selection nhưng phải được đặt lại vị trí khi sát cạnh viewport. Hành động đầu tiên chạy local và không chờ mạng (D-110).

```text
┌──────────────────────────────────┐
│ “desirable difficulty”           │
│ [Dịch] [Nghe] [Giải thích] [Lưu] │  Hành động gọn
└──────────────────────────────────┘
```

```text
┌──────────────────────────────────┐
│ desirable difficulty             │
│ danh từ · /dɪˈzaɪrəbəl.../       │
│ Khó khăn có ích cho việc học.    │
│                                  │
│ Trong câu này: thử thách vừa đủ  │
│ để giúp ghi nhớ bền hơn.         │
│                                  │
│ [Nghe US ▾]       [Lưu từ]       │
└──────────────────────────────────┘
```

- Trước khi người dùng chọn hành động, popup chỉ hiện local selection và lựa chọn; không gửi selection lên mạng.
- Kết quả dịch/giải thích có context câu liền kề khi được phép; không hiển thị text trang rộng hơn selection cần thiết.
- Lưu từ nêu được ngữ cảnh sẽ được giữ cùng từ; có phản hồi đã lưu và hướng thu hồi/xóa nếu được hỗ trợ.
- Nhiều dòng, zoom, trang nền tối, điều hướng trang và selection mất hiệu lực phải được tính trong placement/state review.

## 6. State catalog cho Phase 2 mock

| State ID  | Bề mặt          | Tình huống                        | Nội dung/hành động bắt buộc                                                  | Scenario  |
| --------- | --------------- | --------------------------------- | ---------------------------------------------------------------------------- | --------- |
| ST-EXT-01 | Chat            | Chưa cấp quyền nhưng trang hỗ trợ | Giải thích capture; thao tác xin quyền/quét rõ ràng                          | SCN-01    |
| ST-EXT-02 | Chat            | Sẵn sàng quét                     | CTA “Quét tab này”; nêu mục đích và retention                                | SCN-01    |
| ST-EXT-03 | Chat            | Đang quét                         | Trạng thái đang làm; tránh progress giả; không tạo capture trùng             | SCN-01    |
| ST-EXT-04 | Chat            | Capture thành công/còn mới        | Trang, thời điểm/freshness, composer, citation                               | SCN-01    |
| ST-EXT-05 | Chat            | Trang đã đổi/stale                | Nêu bản đang xem đã cũ; CTA quét lại                                         | SCN-04    |
| ST-EXT-06 | Chat            | Capture hết hạn                   | Không dùng lại nội dung hết TTL; CTA quét lại                                | SCN-04    |
| ST-EXT-07 | Chat            | Câu hỏi không có căn cứ           | Từ chối rõ; cho sửa câu hỏi; không web search mặc định                       | SCN-02    |
| ST-EXT-08 | Chat            | Trang bị hạn chế/không hỗ trợ     | Nêu giới hạn và gợi ý mở trang phù hợp; không retry vô hạn                   | SCN-03    |
| ST-EXT-09 | Chat            | Offline/timeout/server error      | Thông báo gần tác vụ và cho thử lại; giữ dữ liệu an toàn                     | SCN-14    |
| ST-EXT-10 | Chat            | Quota/rate limit                  | Giải thích có thể làm gì tiếp; không lặp request tự động                     | SCN-14    |
| ST-EXT-11 | Chat            | Streaming                         | Cho biết đang trả lời; giữ citation gắn với đoạn tương ứng                   | SCN-01    |
| ST-EXT-12 | Vocabulary      | Không có mục đã lưu từ trang này  | Empty state phân biệt rỗng với lỗi/tải                                       | SCN-08    |
| ST-EXT-13 | Vocabulary      | Có mục đã lưu từ trang này        | Nghĩa ngữ cảnh, audio action có label, save status                           | SCN-05/07 |
| ST-EXT-14 | Selection popup | Selection mất/không hỗ trợ        | Đóng/ẩn an toàn, không gửi request, không làm mất selection không cần thiết  | SCN-06    |
| ST-EXT-15 | Selection popup | Đang dịch/giải thích/phát âm      | Loading/error tương ứng action; cho retry/đổi giọng                          | SCN-05/14 |
| ST-EXT-16 | Lesson          | Có mục đến hạn                    | Số mục, CTA bắt đầu, tiến độ có nguồn                                        | SCN-09    |
| ST-EXT-17 | Lesson          | Không có mục đến hạn              | Empty/next due; không sinh lesson giả                                        | SCN-08    |
| ST-EXT-18 | Chat            | Người dùng từ chối quyền capture  | Giải thích quyền cần thiết; nút thử lại/mở hướng dẫn; không tiếp tục capture | SCN-03    |
| ST-EXT-19 | Chat            | Người dùng xóa bản capture        | Xác nhận trước; chat/capture bị xóa; từ đã lưu còn theo D-205                | SCN-04    |

## 7. Review keyboard, focus và nội dung

- Tablist có tên accessible; tab hiện tại dùng `aria-selected`, `aria-controls` và panel liên kết heading.
- Điều hướng tab dùng phím mũi tên theo pattern tab chuẩn; Tab đi vào nội dung panel. Nếu prototype không triển khai arrow-key behavior thì phải nêu rõ, không tuyên bố đạt.
- Mọi icon-only action có accessible name; CTA không chỉ phân biệt bằng màu.
- Sau capture/quét lỗi/lưu từ, thông báo thay đổi trạng thái được thông báo không gây lặp đọc toàn panel.
- Citation là link/button có nhãn đoạn; focus visible và thứ tự focus theo thứ tự nội dung.
- Nội dung trang được render dưới dạng text không tin cậy; không inject HTML vào panel.

## 8. Scenario walkthrough và điểm owner review

| Flow                        | Success                         | Recoverable failure                    | Unsupported path                                  | Kết quả review                             |
| --------------------------- | ------------------------------- | -------------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| J1 / Chat                   | Quét → hỏi → citation về anchor | Mất mạng, quyền từ chối, stale/expired | Trang bị chặn hoặc nguồn không có đáp án          | Chờ owner review wireframe                 |
| J2 / selection + vocabulary | Chọn → dịch/nghe → lưu          | Provider/audio lỗi, popup sát cạnh     | Selection dài/không phải text hoặc script bị chặn | Chờ owner review popup và thứ tự hành động |

### Quyết định đã chốt

- Tab Từ vựng chỉ hiển thị các mục đã lưu từ trang hiện tại; toàn bộ thư viện thuộc dashboard. Từ chưa lưu không xuất hiện trong danh sách tab.

### Câu hỏi giữ mở, không tự quyết

- Khi người dùng chọn cả cụm/câu, hành động “Lưu” tạo vocabulary item đại diện theo từ nào? Chưa thêm behavior tự tách câu thành nhiều từ vì chưa có quyết định.

High-fidelity visual và component UI không thuộc deliverable này; sau khi owner duyệt IA/wireframe, tiếp tục P1-003/P1-004 theo dependency và cổng phase.
