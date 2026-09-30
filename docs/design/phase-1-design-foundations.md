# Nền tảng thiết kế Phase 1

- Trạng thái: hướng dẫn dùng token/component; chưa phải mockup, theme production hay baseline UX được owner duyệt.
- Phạm vi: hành động Dịch, popup kết quả không modal, Options và queue nhỏ. Dashboard/side panel không thuộc baseline.
- Nguồn: [Wirefigma Design System](reference/WIREFIGMA_DESIGN_SYSTEM.md), [sample HTML](reference/wirefigma-sample.html), [snapshot provenance/checksum](reference/SOURCE.md).
- Quyết định: chỉ dùng component/tên token có trong snapshot. Giá trị được ghi là “chuẩn hóa để triển khai” không được mô tả là Inspect-verified. Sample là dashboard minh họa, không phải giao diện mục tiêu.

## Ngôn ngữ hiển thị

Ưu tiên thứ bậc nội dung, nhãn cụ thể, một hành động chính và khoảng trắng. Không thêm gradient, shadow lớn, icon trang trí, brand mới, dashboard shell hay dark palette. Dùng tối đa ba cấp chữ trên popup; state phải có nhãn/nội dung, không chỉ mã màu. Các quyết định layout và hành vi còn phụ thuộc owner được đánh dấu là đề xuất, không tự trở thành tiêu chuẩn đã duyệt.

## Token và độ tin cậy nguồn

| Nhóm       | Tham chiếu Wirefigma                                                                                                                             | Cách áp dụng và giới hạn                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Màu        | `neutral.900`, `neutral.600`, `neutral.300`, `neutral.100`, `white`, `yellow`, `accent`; semantic `background.*`, `text.*`, `icon.*`, `stroke.*` | Dùng tên semantic. Mã hex/semantic mapping trong bản trích xuất là giá trị chuẩn hóa, không phải xác minh Inspect. Không tạo palette tối hoặc màu success/warning/danger mới.                                                 |
| Action     | Button, Button Icon, Button Group                                                                                                                | Một CTA nền tối (`neutral.900`) trong mỗi vùng; action phụ outline/ghost. Không giả định trạng thái hover/disabled đạt contrast nếu chưa đo.                                                                                  |
| Typography | Text 3: 16/24; Text 4: 14/20; Text 5: 12/16                                                                                                      | Ba cấp tối đa. Đây là các mức được chọn từ đề xuất trong snapshot, không xác nhận cỡ chữ từ Inspect. Không dùng Text 1/2 trên popup compact.                                                                                  |
| Spacing    | `space.m` 8, `space.l` 12, `space.xl` 16, `space.2xl` 20 px                                                                                      | Các mức 8/12/16/20 thuộc thang được nguồn ghi nhận quan sát. Dùng nhất quán cho gap/padding; không đưa mức ngoài nguồn vào đặc tả này.                                                                                        |
| Radius     | `radius.s` 4 px, `radius.m` 8 px                                                                                                                 | Dùng S cho control/tag, M cho card/popup nhỏ. Không dùng radius trang trí L/XL.                                                                                                                                               |
| Control    | 40 px; 48 px khi yêu cầu touch target                                                                                                            | 40 px là control mặc định đã chuẩn hóa trong nguồn và cũng là touch target tối thiểu của nguồn. 48 px chỉ khi cần vùng chạm lớn hơn. Không thêm 44 px không có trong nguồn. Kích thước này cần được kiểm tra trên UI runtime. |
| Focus      | `accent`, vòng focus 3 px, có offset/khoảng thở                                                                                                  | Dùng focus-visible, không đổi kích thước layout. Màu accent là giá trị chuẩn hóa; contrast thực tế phải được đo trên UI.                                                                                                      |
| Border     | `stroke.dark` cho boundary control cần nhận biết; `stroke.light` chỉ divider/trang trí                                                           | `neutral.300`/stroke nhạt không được coi là boundary control đạt yêu cầu khi chưa xác minh contrast. `stroke.dark` là lựa chọn semantic có trong nguồn; vẫn cần đo trên runtime.                                              |

Không đặt tên/mã màu cục bộ thay cho semantic token. Nền extension phải là surface sáng dễ phân biệt với trang; khi nội dung web phía sau tối, không suy ra dark mode từ Wirefigma. Popup vẫn dùng surface sáng theo token đã có. Đây là chỉ dẫn thiết kế đang chờ review, không phải bằng chứng tương phản đạt chuẩn trên mọi trang.

## Ánh xạ surface

| Surface                 | Component/behavior tham chiếu                             | Ánh xạ nội dung                                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hành động Dịch          | Button; Tooltip chỉ bổ sung                               | Hành động local với nhãn “Dịch”; chọn/bôi đen không gửi mạng. Một CTA dark trong vùng. Không đặt hướng dẫn/provider/key chỉ trong tooltip.                                                                                    |
| Popup gần con trỏ       | Compact Card, Dropdown/overlay, Notification, Button Icon | Dialog không modal, có tên truy cập được, hiển thị kết quả/trạng thái và nút đóng có accessible name. Không trap focus, không `aria-modal=true`. Bố trí/clamp xem [quyền và layout P1-101](p1-101-permissions-and-layout.md). |
| Kết quả word            | Typography Text 3–5, Button primary và outline/ghost      | Term → POS → nghĩa → ví dụ → Add riêng. Add là thao tác chính của vùng kết quả từ; chỉ enabled với word hợp lệ đã persist. Thông tin kết quả vẫn ưu tiên thứ tự đọc.                                                          |
| Kết quả phrase/sentence | Typography và Button                                      | Nghĩa dịch, retry khi phù hợp và close. Không hiện Add. Google mode không gọi AI cho phrase/sentence; AI mode dịch selection qua provider đã chọn.                                                                            |
| Options                 | Native Radio, Select, Text Input; Toggle khi phù hợp      | Label thật, mô tả và lỗi gắn với control. Không lưu secret trong client storage. Một CTA dark trong vùng; action phụ outline/ghost. Provider/model chưa khóa; không điền giá trị mặc định giả định.                           |
| Queue nhỏ               | Tag, Notification, compact Card                           | Hiển thị số mục đã Add, batch/trạng thái bằng chữ. N do người dùng cấu hình, không có mặc định; khi chưa cấu hình, hướng dẫn thiết lập và không tạo batch. Không ngụ ý Quizlet đã xác minh thành công.                        |

Không kế thừa layout desktop hai cột, sidebar, card grid hoặc responsive dashboard của sample. Wireframe chữ, quyền trang, vị trí con trỏ, clamp và bố cục kiểm tra thuộc tài liệu P1-101 liên kết ở trên, không được suy diễn thành kết quả screenshot runtime.

## Hành vi truy cập và trạng thái

- Dùng semantic/native control khi có thể; label phải gắn với input, không dùng placeholder thay label.
- Popup là dialog không modal: `role="dialog"`, accessible name; không `aria-modal="true"` và không giữ focus bên trong. Có focus-visible; Escape đóng; trả focus về trigger khi hợp lý.
- Radio dùng native radio; mô tả/lỗi liên kết bằng `aria-describedby`. Icon-only close có accessible name.
- Loading/kết quả cập nhật qua `aria-live="polite"`; không thông báo lặp/spam. Lỗi có nội dung và hành động retry phù hợp.
- Loading, error, Added và trạng thái Quizlet verified/unavailable/unknown có chữ hoặc biểu tượng kèm chữ; không chỉ đổi màu. Không tuyên bố verified khi chưa có bằng chứng set URL/ID.
- Giữ thứ tự đọc, không che hoàn toàn selection khi có thể; hỗ trợ zoom/reflow và `prefers-reduced-motion`. Bố cục theo viewport/permission được mô tả ở checklist và file quyền/layout.

## Kiểm tra contrast và giới hạn bằng chứng

Wirefigma trích xuất nêu body/label phải đạt WCAG AA nhưng các mã màu trong đó được chuẩn hóa. Đặc biệt `neutral.300`/`stroke.light` không đủ căn cứ để dùng làm viền control cần nhận biết; ưu tiên `stroke.dark` cho boundary chức năng, còn viền nhạt chỉ làm divider trang trí. Caption muted chỉ dùng cho thông tin phụ; nội dung thiết yếu không được làm mờ như disabled. Cần tính contrast chính xác và kiểm tra trên giao diện runtime trước khi kết luận pass. Hành động này được giao cho root ở bước kiểm tra độc lập; tài liệu này không ghi nhận phép tính hoặc kết quả chưa thực hiện.

Root đã tính số học và ghi [bằng chứng](../evidence/P1-101-design-review.md): text.default/trắng 17.38:1, muted/trắng 6.72:1, muted/tint 5.94:1; focus accent đục/trắng 5.74:1. Stroke.default/trắng chỉ 2.32:1 và stroke.light/trắng 1.40:1, không đủ làm tín hiệu boundary duy nhất. HTML sample dùng focus alpha 0.28, xấp xỉ 1.59:1 trên trắng; đề xuất chọn accent đục trong MD, không copy focus mờ của sample. Số học đạt cho cặp được chọn không thay review computed style/focus/UI runtime. Không sửa nguồn hoặc thêm palette.

Không có screenshot/browser UI trong gói này: P1-101 không cho tạo mockup hay code production. Kiểm tra screenshot, bàn phím/focus, zoom và môi trường trang sáng/tối phải chờ gói có UI runtime và owner walkthrough; xem [review checklist](p1-101-review-checklist.md). Đây là gate chưa đạt/đang chờ, không phải ngoại lệ âm thầm khỏi test.

## Ngoài baseline

Dashboard shell/integrations, theme tối, visual artifacts EnglishBot cũ, mockup mới và lựa chọn provider/model/kênh Quizlet. Quy tắc bổ sung (đề xuất, chưa duyệt): trong checklist UX, ghi riêng bằng chứng tài liệu, kiểm tra số học/contrast và quan sát runtime; lý do là kế hoạch hoặc token không chứng minh hành vi UI. Không cập nhật AGENTS/playbook vì đây là đề xuất áp dụng cho hồ sơ P1-101, chờ owner xem xét.
