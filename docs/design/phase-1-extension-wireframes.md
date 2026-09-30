# Wireframe chức năng — popup pointer, options và queue

- Trạng thái: đặc tả hành vi chữ cho P1-R01; không phải mockup high-fidelity hay code UI.
- Tham chiếu component/token: [Wirefigma](reference/WIREFIGMA_DESIGN_SYSTEM.md) và sample cùng thư mục.
- Không còn baseline side panel ba tab. Chủ dự án yêu cầu xóa mockup EnglishBot cũ; gói này không tạo mockup mới.

## EXT-SEL-01 — Selection và action local

```text
Trang web
  selection: “resilient”
      [Dịch]
```

Selection chỉ hiện action cục bộ, không gửi request trước click. Khi click, popup nhỏ neo gần con trỏ/selection; reposition/clamp nếu sát mép viewport. Khi selection biến mất hoặc tab điều hướng, popup đóng/hiển thị trạng thái stale mà không dùng selection cũ âm thầm.

## EXT-POP-01 — Từ đơn, đang tải

```text
┌──────────────────────────────┐
│ resilient                 [×]│
│ Đang dịch và chuẩn bị dữ liệu…│
└──────────────────────────────┘
```

Click **Dịch** ở EXT-SEL-01 mở popup loading tương ứng (EXT-POP-01 cho từ, EXT-POP-03 cho cụm/câu) ngay và bắt đầu request tới provider đã chọn. Không yêu cầu click lần hai. Trạng thái loading có nhãn truy cập được; không tạo nội dung giả hoặc phần trăm giả. Khi kết quả sẵn sàng, popup tự chuyển sang EXT-POP-02 hoặc trạng thái kết quả cụm/câu.

## EXT-POP-02 — Từ đơn, kết quả

```text
┌──────────────────────────────┐
│ resilient                 [×]│
│ tính từ                      │
│ kiên cường; có khả năng phục │
│ hồi sau khó khăn             │
│ Ví dụ: The resilient team... │
│                              │
│ [Add]                         │
└──────────────────────────────┘
```

Hiển thị term, POS, nghĩa và câu ví dụ. Nút Add có các trạng thái thay thế, không đồng thời: **Add** (chưa Add), **Đang thêm…**, **Đã thêm ✓** hoặc lỗi/đang xác minh. Trạng thái cache/persist không được trình bày như trạng thái queue. Trong luồng Google từ, UI nêu rõ Google dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ; cần AI key khi enrichment chưa có trong cache. Nếu cache đủ dữ liệu thì dùng lại mà không gọi provider. Với AI mode, AI dịch selection trực tiếp.

## EXT-POP-03 — Cụm/câu: loading rồi kết quả

```text
┌──────────────────────────────┐
│ “in the long run”         [×]│
│ Đang dịch bằng provider đã chọn…
├──────────────────────────────┤
│ về lâu dài                   │
│ [Thử lại]                    │
└──────────────────────────────┘
```

EXT-SEL-01 click mở popup loading ngay, không có click Dịch thứ hai. Popup tự hiển thị translation meaning khi xong. Cụm/câu luôn dịch bằng provider người dùng chọn: AI mode dùng AI; Google mode dùng Google và không cần AI key/enrichment. Không hiển thị POS/example/word family/TTS/Add và không tạo rich word entry.

## EXT-POP-04 — Lỗi và phục hồi

```text
Không thể dịch: quota của provider đã đạt.
Provider hiện tại: Google
[Thử lại] [Mở Options] [Đóng]
```

Copy nêu lỗi key/network/quota/provider và bước tiếp theo cụ thể. Retry dùng cùng provider. Không có nút fallback tự động. Persist/Add timeout có trạng thái `đang xác minh`/`chưa rõ` và retry idempotent.

## EXT-OPT-01 — Options

```text
Provider dịch
(•) Google Cloud Translation API
( ) AI dùng API key của tôi (BYOK)

AI API key: [••••••••••••]
  Cần cho AI mode và enrichment POS/ví dụ của từ khi chọn Google,
  nếu cache chưa có dữ liệu đầy đủ. Google cụm/câu không cần key này.
Trạng thái: đã lưu / cần kiểm tra / lỗi

Quyền extension
Selection detection cần quyền trên trang được bật.
[Xem và cấp quyền]
[Lưu]
```

Key BYOK được gửi qua backend theo quyết định auth/secret; không lưu ở extension storage, không render lại đầy đủ và không ghi log. UX giải thích quyền trước khi content script chạy. Không khẳng định bôi đen tự cấp `activeTab`.

## EXT-QUEUE-01 — Queue và ngưỡng

```text
Từ đã Add: 4 / N
N: do người dùng cấu hình
Batch: chưa đủ ngưỡng
Quizlet: —
```

N không có giá trị mặc định. Nếu người dùng chưa cấu hình N, nêu “Cần cấu hình ngưỡng” và không tạo batch. Khi đạt N, nêu đang tạo batch/set, verified, reconciling, unavailable hoặc unknown. Không cho người dùng nhầm với “đã lưu result”. Không khẳng định set được tạo nếu chưa có evidence.

## State catalog

| ID       | State                                             | Hành vi                                                                                    |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| SEL-01   | Action local                                      | Không request; click mở popup ngay và bắt đầu dịch.                                        |
| POP-01   | Loading                                           | Popup mở ngay sau click; tự chuyển sang result/error; thông báo trạng thái; chống gửi lặp. |
| POP-02   | Word result/cache hit                             | Hiện ba trường từ; cho Add riêng.                                                          |
| POP-03   | Phrase result                                     | Chỉ nghĩa dịch; không Add.                                                                 |
| POP-04   | Network/quota/key/provider error                  | Giữ provider; retry hoặc mở Options.                                                       |
| POP-05   | Persist/Add unknown                               | Đối soát; retry idempotent; không báo thành công sớm.                                      |
| OPT-01   | Provider/key chưa cấu hình hoặc lỗi               | Hướng dẫn cấu hình; không gửi key lên client storage.                                      |
| QUEUE-01 | Dưới N / đủ N                                     | Đếm đúng item hợp lệ đã Add, duy nhất, chưa gán batch.                                     |
| QZ-01    | Creating/reconciling/verified/unavailable/unknown | Verified chỉ khi có evidence set.                                                          |

## Keyboard, focus, viewport

Focus ring theo Wirefigma; mọi nút có tên rõ. Popup đóng bằng Escape và trả focus về trigger hợp lý; tab order không bị trap. Live status dùng cho loading/result/error. Popup tránh che selection khi có thể, clamp vào viewport, hỗ trợ zoom và selection multiline. Không tự chế dark palette; dùng màu/token có nguồn và đảm bảo nền popup tách biệt với trang.

## Ma trận hành trình và requirement

| Surface                       | Requirements                        |
| ----------------------------- | ----------------------------------- |
| Selection + popup             | P1-TR-01…05, P1-UI-01, P1-SEC-01/03 |
| Rich word persist/reuse + Add | P1-WD-01…03                         |
| Queue, text import, Quizlet   | P1-QZ-01…04                         |
| Options, BYOK, quyền          | P1-TR-02/05, P1-SEC-02/03           |

Owner đã chốt N do người dùng cấu hình, Google dịch nghĩa + AI BYOK enrichment POS/ví dụ cho từ, và cho phép khảo sát browser automation Quizlet nếu official channel không dùng được. Kênh production vẫn cần feasibility proof; chưa phải bằng chứng PoC. Provider/model, auth và schema vẫn chưa khóa. Đây là spec chức năng; visual review ở viewport thuộc gói UI sau khi owner khóa design và không có ảnh mockup cũ làm bằng chứng baseline.
