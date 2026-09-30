# Hệ thống UX/UI — Phase 1

## Nguyên tắc

Giao diện Phase 1 hỗ trợ tra cứu nhanh khi đọc web. Dùng Wirefigma theo [bản tham chiếu](design/reference/WIREFIGMA_DESIGN_SYSTEM.md) và sample để chọn token, component và behavior phù hợp cho popup, options và hàng đợi nhỏ. Không dùng lại baseline ba tab side panel hay trang dashboard. Không tạo mockup mới trong gói P1-R01; chủ dự án yêu cầu xóa các mockup EnglishBot cũ.

P1-101 tạo [hồ sơ review UX](design/p1-101-owner-review.md), [wireframe chữ](design/phase-1-extension-wireframes.md), [quyền/layout](design/p1-101-permissions-and-layout.md) và [checklist](design/p1-101-review-checklist.md). Chi tiết UX P1-101 đã được owner duyệt ngày 2026-10-01 (D-P1-15) làm baseline cho P1-103; mockup/hợp đồng và UI runtime chưa được duyệt hoặc kiểm thử. Riêng activation đã được owner chốt ngày 2026-09-30: bật trên tab hiện tại, có tùy chọn ghi nhớ quyền riêng cho từng website (D-P1-11).

## Bề mặt và luồng chính

### Selection và popup pointer

1. Người dùng chọn văn bản trên trang được cấp quyền. Extension chỉ chuẩn bị hành động local; không gửi request.
2. Action local cho phép chủ động chọn **Dịch**. Popup nhỏ neo gần vị trí con trỏ/selection, đặt lại khi vượt viewport và giữ nội dung đọc được dù trang có nền tối.
3. Click **Dịch** mở popup ngay ở trạng thái loading và gửi selection tối thiểu đến provider đã chọn. Popup tự chuyển sang kết quả/lỗi; retry chỉ xuất hiện để phục hồi lỗi. Có đóng và focus return.
4. Từ đơn hiển thị term, POS, nghĩa, câu ví dụ và nút **Add** riêng. Cụm/câu chỉ hiển thị bản dịch nghĩa, không Add.

Popup keyboard-operable: focus nhìn thấy, Escape đóng, focus quay lại trigger hợp lý, trạng thái tải/lỗi được công bố bằng văn bản, selection dài/multiline không làm popup vượt viewport. Các chi tiết tương tác được kiểm chứng ở wireframe, không tự thêm tính năng.

### Translation result và Add queue là hai trạng thái khác nhau

Từ đơn có đủ POS/nghĩa/ví dụ sau validate sẽ được persist vào DB để lần tra sau có thể reuse. Điều này không tự đưa từ vào queue. Nút Add riêng tạo một queue item idempotent cho người dùng. Cụm/câu không có rich word record hoặc Add.

Queue nhỏ cho biết số từ hợp lệ đã Add và N do người dùng cấu hình. Không có giá trị mặc định; khi chưa cấu hình, UI yêu cầu thiết lập và không tạo batch. Khi đạt ngưỡng, UI thể hiện đang tạo, đã xác minh, đang reconcile, unavailable hoặc unknown. Không báo thành công trước bằng chứng set Quizlet.

### Options

Options cấu hình provider (Google Cloud Translation API hoặc AI BYOK), AI key theo quy trình backend, ngôn ngữ và quyền cần thiết. AI key dùng cho AI mode và cho POS/câu ví dụ enrichment của từ trong Google mode khi cache chưa đủ; Google translation cho cụm/câu không cần AI key. Mọi selection được dịch bằng provider đã chọn. Giải thích quyền trước khi content script bắt đầu phát hiện selection. Bôi đen không tự cấp `activeTab` hay gọi mạng.

## Wireframe chức năng (mô tả, không phải mockup)

```text
Trang đang đọc
  chọn “ephemeral”
       └── action local: [Dịch]
             └── popup cạnh selection
                   term: ephemeral
                   POS: adjective
                   nghĩa: ...
                   ví dụ: ...
                   [Add]
                   trạng thái dịch / lỗi / đóng

Queue nhỏ: 4 từ đã Add · ngưỡng N: cần cấu hình · trạng thái batch/Quizlet
```

```text
Options: Provider [Google | AI BYOK]
         AI API key (AI mode và Google word enrichment; xử lý backend)
         Quyền cần thiết và giải thích
         Lỗi cấu hình / lưu / thử lại
```

## Trạng thái và recovery

| Vùng        | Trạng thái cần thiết                                                              | Hành vi                                                                               |
| ----------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Selection   | chưa chọn, selection hết hạn/không hợp lệ                                         | Không request; giải thích hoặc đóng action.                                           |
| Translation | idle, loading, result, offline, timeout, quota, key/provider error                | Retry rõ ràng; giữ selection khi an toàn; không fallback provider.                    |
| Word        | chưa lưu, đã reuse, persist lỗi                                                   | Nêu trạng thái DB; không cho Add đến khi record hợp lệ.                               |
| Add         | chưa Add, đang Add, đã Add, lỗi/unknown                                           | Chống double submit; retry idempotent; queue state không nhập nhằng với cache.        |
| Quizlet     | dưới ngưỡng, tạo batch, đang tạo set, verified, reconciling, unavailable, unknown | Chỉ verified set mới báo thành công; giữ batch và hỗ trợ reconcile/retry chống trùng. |
| Options     | chưa cấu hình, lưu thành công, key invalid, provider lỗi/quota                    | Key không hiển thị lại đầy đủ hoặc xuất hiện trong log; chỉ dùng provider được chọn.  |

## Accessibility, privacy và layout

- Tuân thủ ngữ nghĩa control Wirefigma; label rõ, icon-only có accessible name, focus ring hiện diện, không dựa vào màu duy nhất.
- Popup có tương phản đủ trên nền trang bất kỳ, nhưng không tự suy ra dark theme/palette chưa được nguồn xác nhận.
- Không đọc DOM toàn trang để tạo context; chỉ selection cần thiết. Không ghi URL/cookie/session nếu không có yêu cầu và phê duyệt riêng.
- Cấp quyền content script được giải thích trước; quyền browser theo manifest/ADR, không mô tả `activeTab` sai.
- Thông báo loading/lỗi và kết quả dùng vùng live phù hợp; đóng popup trả focus có thể dự đoán.

## Thành phần dữ liệu và trạng thái lưu

| UI                 | Nguồn                                                       | Lưu trữ                            | Hành vi lỗi                                                                         |
| ------------------ | ----------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| Dịch selection     | Provider đã chọn                                            | Kết quả tạm trước validate         | Cho retry đúng provider, không fallback.                                            |
| POS/nghĩa/ví dụ từ | DB cache theo ngôn ngữ/provider/sense và provenance/version | Bền vững sau validate              | Báo lỗi persist, không khẳng định đã lưu.                                           |
| Add queue          | Queue của người dùng                                        | Bền vững, idempotent               | Trạng thái unknown cần đối soát; không nhân đôi.                                    |
| Text import/batch  | Các queue item đủ điều kiện                                 | Batch bền vững                     | Giữ batch, validate delimiter; retry/reconcile.                                     |
| Quizlet set        | Tài khoản người dùng qua kênh được hỗ trợ                   | External; liên kết evidence/status | Verified/unavailable/unknown; không khẳng định thành công khi chưa có set evidence. |

## Câu hỏi còn chờ

Kênh Quizlet production cần feasibility proof; owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu official channel không dùng được. Provider/model AI cụ thể, auth và schema vẫn chưa khóa. N do người dùng cấu hình; không có mặc định. Mockup, dashboard và visual evidence cũ không phải baseline hiện hành.
