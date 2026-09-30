# P1-101 — Quyền trình duyệt, vị trí popup và bàn phím

- Khởi tạo: 2026-09-30; trạng thái: ĐÃ_DUYỆT_ĐẶC_TẢ ngày 2026-10-01 (D-P1-15). Manifest/runtime vẫn cần test ở gói sau.
- Gói: [P1-101](../work-packages/P1-101-scope-wirefigma-ux.md); baseline sản phẩm: [ADR-006](../decisions/ADR-006-phase-1-translation-scope.md).
- Đây là đặc tả UX và ràng buộc triển khai sau, không phải manifest/code đã thực hiện. Không chốt auth, model, schema hay kênh Quizlet.

## 1. Hai thao tác khác nhau

```text
Cài mới → mở icon EnglishBot → đọc giải thích quyền
  → chọn Bật trên tab này (hoặc cấp quyền site đã duyệt)
    → content script được phép phát hiện selection cục bộ
      → bôi đen → action [Dịch], chưa gọi dịch/cache/provider
        → click Dịch → popup loading → lookup/dịch → kết quả hoặc lỗi
```

Thao tác bật extension cấp quyền đọc selection; thao tác Dịch mới cho phép gửi selection. Không nhầm nút Dịch của content script với thao tác có thể cấp `activeTab`: script chưa có quyền thì chưa thể dựng nút đó trên trang. Options hoặc vùng quản lý mở từ icon extension phải giải thích quyền trước activation, không inject script để hiện lời giải thích lên trang chưa có quyền.

Copy đề xuất trước khi bật:

> EnglishBot cần quyền trên trang này để nhận biết phần bạn bôi đen và đặt nút Dịch. Chỉ khi bạn bấm Dịch, phần đã chọn mới được gửi đến máy chủ để tra cứu/dịch. EnglishBot không quét toàn trang hoặc đọc cookie/mật khẩu.

Quyền trình duyệt thực tế có thể rộng hơn hành vi ứng dụng cần; copy không được nói browser chỉ cấp quyền đọc phần bôi đen. Giới hạn này do EnglishBot thực thi và kiểm thử.

## 2. Activation đã được owner chốt

| Phương án                               | Trải nghiệm                                                                 | Ranh giới quyền                                                           | Tình trạng                                |
| --------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| A — Bật trên tab, ghi nhớ site tùy chọn | Mặc định bật rõ ràng trên tab; người dùng có thể chọn ghi nhớ riêng website | `activeTab` tạm thời; optional host cho đúng origin nếu user muốn ghi nhớ | CHẤP_NHẬN — owner trả lời ngày 2026-09-30 |
| B — Chỉ bật trên tab                    | Mỗi tab mới cần thao tác bật; không có ghi nhớ site                         | `activeTab` + `scripting`, không persistent site access                   | Lựa chọn thay thế                         |
| C — Quyền từng website                  | Lần đầu chọn/cấp quyền website, lần sau tự detect trên site đã cấp          | Optional host cho từng origin; không mặc định xin mọi website             | Lựa chọn thay thế                         |

Owner chọn A: “Bật trên tab hiện tại; có tùy chọn ghi nhớ quyền cho từng website”. B/C chỉ giữ làm lịch sử so sánh, không phải quyết định mở. Quyết định sản phẩm nằm ở D-P1-11; manifest/runtime vẫn cần kiểm chứng P1-105. Không chọn `<all_urls>` required hoặc truy cập tất cả site ngầm. Options chỉ liệt kê quyền đã cấp và hành động thu hồi; không tự yêu cầu quyền của site khác khi selection chứa URL.

Nếu dùng A: “Ghi nhớ trên website này” không được bật sẵn; bấm cấp quyền bằng user gesture rồi đợi kết quả thật. Không grant thì vẫn có thể dùng activation tạm thời đã hợp lệ. Nếu dùng B, bỏ toàn bộ control ghi nhớ site. Nếu dùng C, không giả `activeTab` đã cấp quyền persistent.

## 3. Ma trận quyền và trạng thái

| ID      | Tình huống                                                                | Trang web/action                                                                                                                                    | Vùng quản lý extension và phục hồi                                                                                                        | Mạng dịch          |
| ------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| PERM-01 | Cài mới, chưa activation/chưa host grant                                  | Không detect, không action trên trang                                                                                                               | Giải thích quyền, provider chưa chọn, N để trống; nút bật/cấp theo phương án owner chọn                                                   | Không              |
| PERM-02 | Mở icon, đang đọc giải thích                                              | Chưa detect cho tới thao tác bật hợp lệ                                                                                                             | Nêu origin và phạm vi; có thể bỏ qua/đóng                                                                                                 | Không              |
| PERM-03 | Bật tab/cấp site thành công, trang hỗ trợ                                 | Detect selection local; action Dịch xuất hiện sau selection hợp lệ                                                                                  | Hiện quyền đang áp dụng, không tuyên bố mọi tab đã được bật                                                                               | Chỉ sau click Dịch |
| PERM-04 | Từ chối/bị giữ lại quyền                                                  | Không script/action ngoài quyền đã có                                                                                                               | “Chưa được phép hoạt động trên website này”; cho cấp lại bằng click, không loop prompt                                                    | Không              |
| PERM-05 | User tắt EnglishBot trên tab                                              | Gỡ UI/listener; bỏ snapshot tạm; không tự bật lại do select                                                                                         | “Đã tắt trên tab này”; bật lại phải rõ ràng. Không coi đây là browser đã revoke host grant                                                | Không request mới  |
| PERM-06 | Thu hồi host access/browser quyền site                                    | Dừng detect, đóng UI, bỏ kết quả muộn; script cũ phải tự ngừng khi nhận revoke                                                                      | “Quyền website đã bị thu hồi”; khi cần mở quản lý quyền browser. Nếu vẫn còn activeTab tạm, chủ động tắt app trên tab để tôn trọng ý định | Không request mới  |
| PERM-07 | Tab đóng/chuyển sang origin khác                                          | Đóng popup/action, không reuse selection cũ; kiểm tra quyền lại cho tài liệu mới                                                                    | Không hứa quyền tạm đi theo tab sang mọi origin                                                                                           | Không tự dịch      |
| PERM-08 | Điều hướng/reload cùng origin                                             | Selection/request UI của document cũ hết hiệu lực dù quyền browser có thể còn; detect ở tài liệu mới chỉ khi activation/quyền và lifecycle cho phép | Không yêu cầu cấp lại quyền browser vô lý nếu còn hợp lệ; gói P1-105 kiểm tra reinjection                                                 | Không tự dịch      |
| PERM-09 | Trang hạn chế như chrome://, edge://, cửa hàng extension                  | Không inject/action; không thử vượt hạn chế                                                                                                         | “Không hỗ trợ trên trang này. Hãy thử một trang web thông thường.”                                                                        | Không              |
| PERM-10 | file://, chế độ ẩn danh chưa được bật hoặc tài liệu PDF do browser render | Không hứa hỗ trợ bằng quyền site thông thường; không yêu cầu quyền mở rộng để chữa lỗi trong P1-101                                                 | Giải thích chưa hỗ trợ/chưa được bật; kiểm tra chính xác ở P1-105, không mở thêm phạm vi                                                  | Không              |
| PERM-11 | Frame khác origin/selection trong iframe không được phép                  | Không quét frame hoặc xin quyền thêm tự động                                                                                                        | Không giả detect đã hoạt động; phạm vi frame và hỗ trợ cụ thể cần kiểm chứng P1-105                                                       | Không              |
| PERM-12 | Trường mật khẩu hoặc editor/form nhạy cảm                                 | Không dùng value/password/page storage để lấy selection                                                                                             | Không hiện action trong password; khả năng hỗ trợ input/editor thường để P1-103/105 chốt, không đọc ngầm                                  | Không              |

Request đã gửi trước khi revoke/đóng có thể đã chạy và lưu DB hợp lệ; không hứa “thu hồi sẽ xóa dữ liệu đã gửi”. Hủy phía client nếu có thể, không cập nhật UI cũ, không phát sinh Add mới. Đóng popup không rollback Add/batch đã được người dùng chủ động gửi.

## 4. Quyền tối thiểu: đề xuất để manifest sau kiểm chứng

| Capability                          | Quyền/phạm vi dự kiến                         | Không được suy ra                                                                                 |
| ----------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Bật trên tab và inject local UI     | `activeTab`, `scripting` nếu dùng A/B         | Không có quyền persistent tất cả site                                                             |
| Ghi nhớ website nếu owner chọn A/C  | Optional host đúng scheme/origin theo gesture | Không grant toàn bộ wildcard dù manifest có khai báo dải optional để request origin động          |
| Lưu provider lựa chọn/N/preferences | Storage không nhạy cảm nếu implementation cần | Không API key, cookie, password hoặc session token website                                        |
| Gọi backend                         | Host backend cụ thể khi đã khóa auth/deploy   | Không tùy ý URL/provider endpoint do trang đưa vào                                                |
| Tạo set Quizlet                     | Chờ P1-102 chứng minh và ADR khóa kênh        | Không xin quyền Quizlet trong P1-101, không cookies/debugger/webRequest/clipboardRead để né login |

Không thêm `tabs`, history, clipboard, cookies hoặc all-frames như tiện ích mặc định. Manifest cuối cùng và các privilege cần thiết kiểm tra ở P1-103/105, không được coi bảng này là ADR thêm hạ tầng.

## 5. Neo popup và giới hạn kích thước

Thông số sau là lựa chọn layout được owner duyệt ngày 2026-10-01, không phải giá trị Inspect Figma. Color/type/space/radius vẫn lấy token Wirefigma. Các phép tính dùng CSS pixel trong **visual viewport**, không nhân lại devicePixelRatio hoặc page zoom.

- Neo pointer: tọa độ cuối thao tác chọn/click, lấy trước khi focus làm mất selection; giữ snapshot selection tạm local. Nếu dùng keyboard, neo rect cuối của selection, không lấy pointer cũ ở góc xa.
- Đề xuất chiều rộng ưu tiên `320 px`; biên viewport `8 px`, khoảng cách neo `8 px` (space.m). `W = min(320, Vw − 16)`.
- Chiều cao đo từ nội dung; `H = min(Hcontent, Vh − 16)`. Nền đục, viền đủ rõ, body tự cuộn; header đóng và vùng Add/error luôn có thể tiếp cận. Không ép nội dung vào height cố định hoặc cắt mất ví dụ.
- Ưu tiên dưới/phải neo; nếu không vừa thì thử trên/trái. Nếu vẫn không vừa, clamp vào hình chữ nhật visual viewport; không biến thành side panel/fullscreen modal.
- Với gốc viewport `(Vx,Vy)`, `x = clamp(candidateX, Vx+8, Vx+Vw−8−W)` và tương tự `y`. Nếu viewport tạm không đủ 16 px, hoãn hiển thị, không kích thước âm.
- Cách áp tọa độ layout/visual viewport tùy runtime và CSS positioning, phải chuyển về cùng hệ tọa độ trước clamp; không thêm offset hai lần. Pinch zoom/scroll có `visualViewport.offsetLeft/offsetTop` phải test runtime.
- Tính lại vị trí khi scroll, viewport resize/zoom và khi loading đổi chiều cao thành result; không tự gọi mạng lại. Tránh che selection nếu có chỗ; ưu tiên control còn đọc/đóng được nếu không đủ không gian.
- Action Dịch cũng clamp, tối thiểu control 40 px theo nguồn; không hiển thị action đang tải và popup như hai submit khác nhau.
- Term/POS/meaning/example wrap; chuỗi không có khoảng trắng không ép chiều rộng. Cụm/câu dài chỉ bản dịch làm nội dung chính, selection là nhãn có thể xuống dòng; không đọc text xung quanh.

### Kích thước review

| Vw (CSS px) | W đề xuất | Khoảng ngang còn lại                       | Khi zoom                                                |
| ----------- | --------- | ------------------------------------------ | ------------------------------------------------------- |
| 320         | 304       | 8 mỗi bên khi full width                   | 125/200%: dùng Vw thực tế, reflow không nhân số lần nữa |
| 360         | 320       | Tổng 40 px, clamp vẫn giữ biên tối thiểu 8 | Như trên                                                |
| 420         | 320       | Tổng 100 px, không tự giãn thành dashboard | Như trên                                                |

Ở viewport CSS 160 px trong ca stress zoom/reflow, W = 144 px, control xếp dọc; không tuyên bố đây là screenshot ở zoom 400%. Cần kiểm tra UI thật ở bước có UI. Vh ngắn phải cuộn đọc được nghĩa/ví dụ và vẫn đóng/Add được; không chỉ test width.

## 6. Focus và bàn phím

- Popup là **dialog không modal** có tên “Dịch: <selection>”, không `aria-modal=true`, không giữ focus bằng trap. Có surface opaque nhưng không backdrop chặn trang.
- Sau click/Enter/Space trên Dịch, snapshot đã lưu trước khi action mất focus; focus vào nút đóng. Action bị thay bằng popup; không cần click Dịch lần hai. `aria-live=polite` công bố loading rồi kết quả; lỗi rõ bằng text, không spam lặp.
- Selection bằng keyboard: sau Shift+Arrow và thả phím, Tab kế tiếp tới action Dịch khi khả thi; Enter/Space mở popup. Cách đưa action vào thứ tự focus phải được chứng minh trong P1-105 trên DOM thực; không hijack phím tắt browser hoặc Tab toàn trang.
- Thứ tự word: Đóng → Add khi enabled → liên kết/phục hồi nếu có → quay ra trang theo thứ tự focus hợp lý. Phrase không có Add; lúc loading không có control gọi dịch trùng. Tab/Shift+Tab không mắc kẹt và không tự submit; khi focus rời popup thì popup vẫn mở cho đến đóng/selection mới.
- Escape trong popup/action hoặc click Đóng: đóng, trả focus về phần tử hợp lệ đã focus trước action; nếu đã bị xóa thì về vùng selection trên trang khi hợp lệ, không focus body cưỡng bức hoặc gọi API lại. Do action đã được thay, không trả vào nút không còn trong DOM.
- Pointer click ngoài đóng; focus return chỉ nếu focus còn trong popup, không giành focus khỏi link/form người dùng vừa click. Scroll đơn thuần reposition, không dịch lại. Nhánh selection mới đóng/reset popup theo snapshot, kết quả cũ không được hiển thị vào request mới.
- Options giữ radio label, input label/hint/error liên kết, button semantic; key chỉ input thay/nhập một lần, không hiển thị lại giá trị đã lưu. Queue status live thông báo không chuyển focus khi cập nhật tự động.
- Nút có target tối thiểu 40 px theo Wirefigma; focus accent 3 px nằm trên surface trắng/tint và có khoảng thở, không bị clip. Không dùng text.disabled để trình bày hướng dẫn quan trọng.

## 7. Kiểm chứng và giới hạn hiện tại

P1-101 chỉ làm spec: root kiểm tra quyền bằng tài liệu chính thức, checksum nguồn, tính contrast và clamp số học. Chưa có UI mới để chạy DOM focus, screenshot 320/360/420, zoom hoặc restricted-page behavior. Các test **chưa chạy**, không đánh dấu pass; theo phân tầng D-P1-14 được owner duyệt, mock visual/keyboard ở P1-103, permission/interaction thật ở P1-105 và E2E/release ở P1-109. Xem [checklist](p1-101-review-checklist.md); không bỏ test ngầm.

## 8. Nguồn quyền trình duyệt

Đối chiếu ngày 2026-09-30; nội dung trên là suy luận thiết kế áp dụng cho EnglishBot, không phải mô tả implementation đã tồn tại.

- `activeTab` cần invocation như action/context menu/command; không cấp cho trang hạn chế. Quyền có thể còn khi điều hướng cùng origin, bị mất khi chuyển origin hoặc đóng tab. [Tài liệu Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab).
- Optional permissions được request từ user gesture, có thể kiểm tra/tháo quyền và request theo origin thay vì grant mọi site. [Tài liệu Chrome permissions](https://developer.chrome.com/docs/extensions/reference/api/permissions).
- Inject cần `scripting` cùng host access/activeTab, mặc định ở main frame; không suy ra allFrames từ host grant. [Tài liệu Chrome scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting).

Edge và các loại trang/frame hạn chế phải xác minh riêng ở P1-105/109; tài liệu Chrome không thay test Edge.
