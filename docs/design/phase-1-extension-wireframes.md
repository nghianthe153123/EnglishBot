# Wireframe chức năng — P1-101

- Trạng thái: đặc tả hành vi chữ để owner review; chưa phải UI/code đã duyệt.
- Mọi chi tiết mới trong tài liệu này đều là **ĐỀ_XUẤT_CHỜ_OWNER**.
- Nguồn yêu cầu: [P1-101](../work-packages/P1-101-scope-wirefigma-ux.md), [PRD](../01-product-requirements.md), [hệ thống UX/UI](../02-ux-ui-system.md), [IA Phase 1](phase-1-information-architecture.md), [nền tảng thiết kế](phase-1-design-foundations.md), [Wirefigma](reference/WIREFIGMA_DESIGN_SYSTEM.md) và [sample](reference/wirefigma-sample.html).
- Không dùng dashboard/side panel lịch sử làm baseline; đây là wireframe chữ, không phải mockup.

## Nguyên tắc và ranh giới

- Selection chỉ tạo action local. Không gửi request, không đọc nội dung trang khác, không cấp quyền do người dùng bôi đen.
- Một lần bấm **Dịch** mở popup loading ngay và khởi chạy đúng một request theo provider đã chọn. Không có bước bấm Dịch lần hai.
- Translation result/cache và việc **Add** vào queue là hai trạng thái riêng. Lookup không tự Add.
- Selection là nội dung web không tin cậy; chỉ gửi selection tối thiểu sau thao tác rõ ràng.
- Provider/model AI cụ thể, auth/key lifecycle, ngưỡng hợp lệ của N, và contract lưu trữ chưa được tài liệu này quyết định.

```text
Selection → action local → click Dịch (một lần) → popup loading
                                                ├→ result → đóng
                                                └→ error → retry hoặc đóng
```

Retry chỉ là recovery của nhánh lỗi, luôn giữ provider đã chọn. Phrase/sentence ở nhánh result không có nút **Thử lại** thường trực.

## EXT-SEL-01 — Selection và action local

```text
Trang đã được bật quyền
  selection: “resilient”
      [Dịch]
```

Action là nút local gắn với selection hiện tại. Nếu người dùng bôi đen selection mới khi request đang chạy, đóng/reset popup cũ và hiện action cho selection mới; request cũ vẫn gắn với snapshot cũ, phản hồi muộn không được mở lại popup hoặc ghi đè lượt mới. Selection mới không tự gửi request; người dùng phải bấm **Dịch** trên action tương ứng để bắt đầu lượt mới. Tương tác vào popup/Options không được coi là selection mới của trang.

Quyền, trang hạn chế, vị trí/clamp, cài mới/cấp/thu hồi quyền do đặc tả [quyền và layout P1-101](p1-101-permissions-and-layout.md) sở hữu. Việc bôi đen không được mô tả như tự kích hoạt `activeTab` hoặc tự cấp quyền.

## EXT-POP-01 — Popup loading sau click

```text
┌──────────────────────────────────┐
│ resilient                     [×]│
│ Đang tra cứu…                    │
└──────────────────────────────────┘
```

Click **Dịch** mở popup ngay trong loading và gửi một request cho selection snapshot cùng provider hiện được chọn. Popup tự chuyển sang kết quả hoặc lỗi. Chống click lặp khi request đang chạy; không phát request thứ hai từ cùng một click. Không hiển thị phần trăm tiến độ giả.

Nếu người dùng đóng popup, điều hướng tab hoặc thu hồi quyền trong khi request đang chạy, popup/lượt đó được đánh dấu đóng hoặc hết hiệu lực; phản hồi đến muộn không được mở lại popup hay ghi đè kết quả của selection/request mới. Không tự khởi chạy lại request khi selection thay đổi, popup đóng, điều hướng hoặc quyền được cấp lại.

## EXT-POP-02 — Word result

```text
┌──────────────────────────────────┐
│ resilient                     [×]│
│ Từ loại: adjective                │
│ Nghĩa: kiên cường; có khả năng    │
│ phục hồi sau khó khăn             │
│ Ví dụ: The resilient team…        │
│ Nguồn: Google · POS/ví dụ: AI BYOK│
│ Đã lưu để dùng lại                │
│ [Add]                             │
└──────────────────────────────────┘
```

Word hiển thị term, POS, nghĩa, câu ví dụ, provenance theo dữ liệu thực có, trạng thái persist/cache và action **Add** riêng. Ví dụ chỉ là minh họa nội dung wireframe, không phải dữ liệu được tạo hoặc cam kết cố định.

`[Add]` chỉ enabled khi kết quả word đã đạt `READY`, được validate và persist thành công. Khi đang thiếu key, enrichment/cache chưa đủ, validation thất bại, persist lỗi hoặc persist chưa rõ, Add disabled. Không bịa POS/ví dụ hoặc coi dữ liệu chưa persist là sẵn sàng Add. Khi Add đã thành công, hiện trạng thái queue `Đã thêm`; không suy ra từ đó rằng dữ liệu vừa được cache (và cũng không suy ngược cache thành đã Add).

Cache word đầy đủ dùng lại mà không gọi provider. Cache chưa đủ không được trình bày như kết quả hoàn chỉnh. Không tự Add khi lookup/cache hit.

## EXT-POP-03 — Phrase/sentence result

```text
┌──────────────────────────────────┐
│ “in the long run”             [×]│
│ Bản dịch                         │
│ về lâu dài                       │
│ Nguồn: Google                    │
└──────────────────────────────────┘
```

Chỉ hiển thị selection làm nhãn ngữ cảnh, bản dịch nghĩa và provider thực tế. Không hiển thị POS, enrichment, câu ví dụ, word family, TTS, nút Add hoặc rich-word persist. Thành công không có nút **Thử lại** thường trực. Retry chỉ xuất hiện trong trạng thái lỗi.

## EXT-POP-04 — Lỗi và phục hồi

```text
Không thể hoàn tất tra cứu.
Provider đã chọn: AI BYOK
Thiếu API key. Hãy cấu hình key trong Options.
[Mở Options] [Thử lại] [Đóng]
```

Thông báo nêu nguyên nhân/bước tiếp theo khi biết; retry dùng cùng provider và cùng request snapshot còn hiệu lực. Không fallback sang provider khác. Lỗi không được trình bày như dữ liệu tra cứu đã lưu. Nếu key thiếu cho word enrichment trong Google mode, nêu rằng nghĩa Google không đủ để tạo word result sẵn sàng và Add vẫn disabled; không gọi AI hoặc giả lập enrichment.

Nếu lượt request đã hết hiệu lực do đóng/navigation/quyền bị thu hồi hoặc request mới hơn, không render phản hồi lỗi/kết quả cũ lên UI đang đại diện lượt mới.

## Ma trận provider và provenance

Thiếu provider/key chưa cấu hình: ưu tiên Mở Options, không cho retry request mới cho đến khi có cấu hình cần thiết. Popup lỗi minh họa ở trên là danh mục control có thể có, không bắt buộc luôn bật cả ba; retry chỉ enabled khi snapshot/quyền/cấu hình còn hợp lệ. Timeout persist/Add/Quizlet cần đối soát theo contract, không mặc định retry create/write.

| Selection                                        | Provider đã chọn      | Cache                              | Thực hiện                                                                                         | Hiển thị provenance / Add                                                                          |
| ------------------------------------------------ | --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Word                                             | Google                | Word cache đủ                      | Dùng cache; không gọi provider                                                                    | Nguồn/cache theo metadata có thật; Add chỉ sau validate và persist                                 |
| Word                                             | Google                | Cache thiếu, AI BYOK đã cấu hình   | Google dịch nghĩa; AI BYOK bổ sung POS/ví dụ còn thiếu                                            | Nêu Google cho nghĩa và AI BYOK cho phần enrichment thực tế; Add khi `READY` và persist thành công |
| Word                                             | Google                | Cache thiếu, AI BYOK chưa cấu hình | Không bịa/hoàn tất một phần thành rich result; chỉ rõ cần cấu hình AI key                         | Nêu thiếu key; Add disabled                                                                        |
| Phrase/câu                                       | Google                | —                                  | Chỉ Google dịch nghĩa; không gọi AI, không cần AI key                                             | Nêu Google; không Add                                                                              |
| Mọi selection                                    | AI BYOK               | Cache word đủ nếu là word          | Word cache đủ thì reuse không gọi provider; các selection cần dịch được dịch qua AI theo lựa chọn | Nêu provider/cache theo thực tế; không fallback                                                    |
| Selection cần gọi AI, không có word cache đầy đủ | AI BYOK chưa cấu hình | Cache thiếu hoặc phrase/câu        | Dừng và hướng dẫn cấu hình; không giả kết quả                                                     | Nêu thiếu key; word Add disabled; word cache đầy đủ vẫn reuse không cần gọi AI                     |

Không chọn model, auth flow hoặc trạng thái lưu secret tại đây. Key gửi qua backend theo quyết định bảo mật hiện hành; không echo lại key, ghi key vào extension storage/log, hoặc mô phỏng rằng một giá trị placeholder là key đã lưu. Provenance chỉ được nêu khi nguồn thực tế đã xác định; không suy đoán provider từ nội dung.

## EXT-OPT-01 — Options

```text
Provider dịch
( ) Google Cloud Translation API
( ) AI dùng API key của tôi (BYOK)
Chưa có provider nào được chọn

AI API key
[Nhập key để cấu hình…]
Trạng thái: Chưa cấu hình
Key được gửi để xử lý qua backend; không hiển thị lại giá trị đã gửi.

Ngưỡng batch N
[           ]
Nhập ngưỡng theo nhu cầu của bạn. Chưa có ngưỡng được cấu hình.

Quyền trang
[Xem hướng dẫn quyền và layout]
[Lưu cấu hình]
```

Provider là lựa chọn tường minh; không đánh dấu mặc định hoặc tự chọn thay người dùng. Key dùng ô nhập một lần để gửi backend; sau khi gửi không giả vờ rằng key đã lưu bằng cách render lại một giá trị che/mặt nạ. Khi đã có key, trạng thái chỉ nói `Đã cấu hình` và action `Thay key` mở nhập mới. Chưa chốt provider/model/auth hoặc chi tiết lưu key.

N để trống khi chưa cấu hình, có label và hint nhưng không có placeholder số/default. Lưu hoặc thay cấu hình là thao tác riêng, không dịch selection và không tự gọi provider. Nếu có chức năng kiểm tra key, đó phải là click riêng, được giải thích rõ; không kiểm tra ngầm khi bôi đen hoặc khi mở Options. Nội dung/quy trình quyền dẫn sang [đặc tả quyền và layout](p1-101-permissions-and-layout.md).

Owner đã chốt bật tab hiện tại, có tùy chọn ghi nhớ quyền từng website. Vùng quản lý mở từ icon extension hiển thị [Bật trên tab này]/[Tắt trên tab này] theo trạng thái, tùy chọn ghi nhớ không bật sẵn, queue nhỏ và link Options. Không đặt action cần quyền vào trang chưa được phép. Wireframe Options phía trên mô tả trạng thái chưa cấu hình; [Thay key] chỉ xuất hiện khi backend xác nhận đã cấu hình key, không đồng thời với input mới như hai bước bắt buộc.

## EXT-QUEUE-01 — Queue nhỏ và batch

Queue là vùng quản lý nhỏ trong extension (Options/quản lý), không tạo route, dashboard hoặc side panel mới.

```text
Từ đã Add hợp lệ: 4
Ngưỡng N: Chưa cấu hình
Cần cấu hình N để tạo batch. Các từ đã Add vẫn nằm trong queue.

Batch: Chưa tạo
Quizlet: Chưa có trạng thái xác minh
```

Trình bày ba tình huống cấu hình N:

| N state                                  | Queue/batch UI                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| Chưa cấu hình                            | Cho phép Add từ đủ điều kiện; nhắc cấu hình N; không tạo batch                         |
| Không hợp lệ theo contract được chốt sau | Báo cần sửa cấu hình; không tạo batch; không tự đề xuất giá trị                        |
| Đã cấu hình hợp lệ                       | Hiển thị số từ hợp lệ đã Add so với N; thể hiện trạng thái batch theo kết quả hệ thống |

Không tự đặt min/max N hoặc quy tắc tác động khi người dùng đổi N; các điều đó chờ contract sau. Queue chỉ tính từ hợp lệ, duy nhất, đã Add và chưa gán batch theo invariant sản phẩm. Trạng thái batch/set có thể gồm `Chưa đủ ngưỡng`, `Đang tạo`, `Đã xác minh`, `Không khả dụng`, `Chưa rõ` (và `Đang đối soát` nếu contract xác nhận). Chỉ `Đã xác minh` khi có bằng chứng set. Nếu kết quả tạo set chưa rõ, không có nút tự retry tạo set; không tuyên bố đã liên kết tài khoản Quizlet hoặc thành công khi channel chưa khả dụng/được xác minh. Không tạo trạng thái account giả.

## Catalog trạng thái

| ID       | State                            | Hiển thị/hành vi                                                                                                              |
| -------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| SEL-01   | Action local                     | Không network; click **Dịch** khởi tạo một request và mở popup loading ngay.                                                  |
| POP-01   | Loading/request pending          | Gắn request với selection snapshot; chống gửi lặp; không nút Dịch lần hai.                                                    |
| POP-02   | Word result/cache hit đủ         | Hiển thị term/POS/nghĩa/ví dụ và provenance có thật; cache hit không gọi provider; Add vẫn độc lập và cần điều kiện sẵn sàng. |
| POP-03   | Phrase result                    | Chỉ selection label + bản dịch + provenance; không enrichment/Add/rich persist/retry thường trực.                             |
| POP-04   | Network/quota/key/provider error | Lỗi có recovery; retry chỉ ở lỗi, giữ provider; Mở Options khi phù hợp.                                                       |
| POP-05   | Persist/Add failed hoặc unknown  | Nêu chưa lưu/chưa rõ; không Add khi persist chưa xác nhận; không báo thành công giả.                                          |
| POP-06   | Word ready/persisted             | Có term/POS/nghĩa/ví dụ đã validate và persist; bật Add riêng.                                                                |
| POP-07   | Partial enrichment/cache thiếu   | Báo phần còn thiếu; chưa `READY`, Add disabled; tuân theo ma trận provider, không fallback.                                   |
| POP-08   | Missing AI key                   | Nêu cấu hình cần thiết theo provider/selection; không giả dữ liệu, không fallback; Add disabled với word chưa ready.          |
| POP-09   | Closed/stale/superseded          | Close, navigation, permission revoke hoặc request mới làm lượt cũ hết hiệu lực; phản hồi muộn không ghi đè/mở lại UI.         |
| ADD-01   | Add pending                      | Chống submit lặp; chỉ từ `READY` đã validate/persist mới được Add.                                                            |
| ADD-02   | Added                            | Xác nhận queue item đã Add; không hàm ý việc cache vừa xảy ra.                                                                |
| ADD-03   | Add error/unknown                | Trình bày lỗi/chưa rõ; không báo Added giả. Thử lại nếu được phép phải idempotent theo contract.                              |
| OPT-01   | Provider/key chưa cấu hình       | Provider không có lựa chọn mặc định; chỉ thao tác rõ ràng mới lưu/thay key hoặc kiểm tra key.                                 |
| QUEUE-01 | N unset/invalid/configured       | Cho Add khi N unset nhưng không batch; invalid chờ contract; configured hiển thị count/N.                                     |
| QZ-01    | Batch/set state                  | `Đang tạo`, `Đã xác minh`, `Không khả dụng`, `Chưa rõ`; xác minh cần evidence. Không auto retry tạo ở unknown.                |

## Thứ tự tương tác và keyboard/focus

- Popup là non-modal. Dùng ngữ nghĩa phù hợp cho popup/status; không khai báo `aria-modal="true"`, không giữ focus trong popup và không focus trap.
- Focus bàn phím nhìn thấy; action/button có tên rõ, nút icon đóng có accessible name. `Escape` đóng popup. Khi đóng, trả focus về trigger hợp lý nếu trigger còn tồn tại và có thể nhận focus.
- Loading/result/error được công bố bằng trạng thái chữ phù hợp, không phụ thuộc màu đơn độc. Không đánh cắp focus khi kết quả async đến.
- Retry chỉ có trong trạng thái lỗi và dùng provider/request snapshot còn hiệu lực. Phrase result thành công không có retry thường trực.
- Clamp/vị trí popup, xử lý zoom/viewport, permission states và hành vi selection cụ thể thuộc [đặc tả quyền và layout P1-101](p1-101-permissions-and-layout.md); wireframe này không định nghĩa lại.

## Trường hợp selection mơ hồ

Từ có dấu gạch nối hoặc dấu nháy có thể gây nhập nhằng giữa word và phrase. Ghi nhận làm quyết định cho P1-103; đặc tả này không thêm UI chọn nghĩa/loại selection và không đặt thuật toán phân loại.

## Đối chiếu invariant và yêu cầu

| Invariant/requirement                                            | Phần mô tả                                    |
| ---------------------------------------------------------------- | --------------------------------------------- |
| P1-TR-01, SEC-01: không request trước click; selection tối thiểu | EXT-SEL-01, EXT-POP-01                        |
| P1-TR-02, WD-01/02: provider/cache/provenance/validate/persist   | Ma trận provider, EXT-POP-02, catalog         |
| P1-TR-03/05: popup đóng/keyboard, recovery, không fallback       | EXT-POP-04, thứ tự tương tác                  |
| P1-TR-04: phrase chỉ nghĩa, không Add                            | EXT-POP-03, POP-03                            |
| WD-03: Add tách biệt, chỉ rich word sẵn sàng                     | EXT-POP-02, ADD-01…03                         |
| QZ-01…04: N user-configured, batch/set và evidence               | EXT-QUEUE-01, QUEUE-01, QZ-01                 |
| SEC-02/03: key/backend và quyền                                  | EXT-OPT-01; đặc tả quyền/layout được liên kết |
| Selection/request race                                           | EXT-SEL-01, EXT-POP-01/04, POP-09             |

## Còn chờ owner / giới hạn

- Toàn bộ wireframe và chi tiết UX mới tại đây: **ĐỀ_XUẤT_CHỜ_OWNER**; AC1–AC6 chưa được coi là owner duyệt.
- Chưa có review trực quan/browser test hoặc ảnh chụp 320/360/420 px; tài liệu chữ không phải bằng chứng layout.
- Provider/model/auth/key lifecycle và API/schema chưa khóa; kênh Quizlet production chưa có feasibility proof.
- Min/max N, validate N và cách đổi N khi queue/batch đã có dữ liệu chờ contract/quyết định phù hợp.
