# Nền tảng thiết kế Phase 1

- Trạng thái: hướng sử dụng token/component; không phải mockup hay theme production đã được owner duyệt.
- Nguồn: [Wirefigma Design System](reference/WIREFIGMA_DESIGN_SYSTEM.md) và [sample](reference/wirefigma-sample.html).
- Phạm vi áp dụng: popup pointer, options và queue nhỏ. Dashboard và side panel cũ không thuộc baseline.

## Nguyên tắc thị giác

Ưu tiên thứ bậc nội dung, nhãn cụ thể, thao tác rõ và khoảng trắng. Dùng primitive/semantic token của Wirefigma; không tự chế palette hay dark-mode token chưa được xác minh. Token có giá trị triển khai chuẩn hóa trong tài liệu nguồn cần được phân biệt với giá trị quan sát trực tiếp từ Figma. Dùng component phù hợp như Button, Button Icon, Text Input, Dropdown, Tag, Notification, Tooltip và overlay; không sao chép dashboard mẫu thành yêu cầu.

## Token có nguồn

Tham khảo đúng tên và giá trị trong Wirefigma source: `neutral.900`, `neutral.600`, `neutral.300`, `neutral.100`, `white`, `yellow`, `accent`; semantic `background.*`, `text.*`, `icon.*`, `stroke.*`; spacing `2, 4, 6, 8, 12, 16, 20` px quan sát và các mức mở rộng `24–48` px chuẩn hóa; radius `4, 8, 24, 40, 999` px; typography Text 1–5. Trước khi dùng cần lưu ý tài liệu nguồn nêu rõ mã hex, font stack và một số mức spacing/kích thước là chuẩn hóa, không Inspect-verified.

Không định nghĩa lại màu success/warning/danger hoặc dark palette riêng nếu Wirefigma không có token xác nhận. Trạng thái cần được biểu đạt bằng chữ/icon phù hợp chứ không dựa màu đơn độc. Focus theo nguồn dùng vòng accent; kiểm tra contrast thực tế khi prototype được làm.

## Ánh xạ cho các surface trong scope

| Surface           | Component/behavior tham chiếu                        | Nguyên tắc                                                                                                            |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Selection action  | Button/Tooltip                                       | Hành động local, label “Dịch”, chưa gọi mạng.                                                                         |
| Popup gần con trỏ | Compact Card/Dropdown/Notification, Button Icon đóng | Surface rõ trên trang; clamp viewport; không chặn selection/focus.                                                    |
| Rich word result  | Typography Text 3–5, Button primary/outline          | Thứ bậc term → POS/nghĩa/ví dụ → Add riêng.                                                                           |
| Phrase result     | Typography + Button                                  | Chỉ nghĩa dịch và retry/close.                                                                                        |
| Options           | Radio/Select/Text Input/Toggle nếu phù hợp           | Label thật, focus/disabled/error state, không đưa secret vào client storage.                                          |
| Queue             | Tag/Notification/compact Card                        | Hiển thị số Add, N do người dùng cấu hình; chưa cấu hình thì hướng dẫn thiết lập; batch và verified/unknown bằng chữ. |

Không kế thừa layout desktop hai cột, sidebar, card grid hoặc dashboard responsive Wirefigma nếu không phù hợp các popup/options/queue nhỏ.

## Typography, spacing và radius

Giữ thang Text 1–5 của nguồn, tối đa ba cấp trên popup. Chọn các mức nhỏ/compact từ thang spacing quan sát; không tự nêu pixel ngoài token nguồn. Control compact/default lấy 32/40 px theo source khi phù hợp, đảm bảo keyboard focus và target đủ dùng. Button/input có radius S (4 px), container popup tham khảo radius M (8 px); chỉ dùng radius L/XL nếu component nguồn tương ứng và kích thước surface biện minh.

## Accessibility và trạng thái

- Button có text/accessible name; icon-only close có aria-label và tooltip.
- Keyboard focus hiển thị; Escape đóng; trả focus về trigger khi khả thi.
- Loading, lỗi, retry, Added và Quizlet verified/unavailable/unknown có nội dung trạng thái, không chỉ màu.
- Popup clamp viewport, giữ thứ tự đọc và không che hoàn toàn vị trí selection; hỗ trợ zoom/reflow.
- Không giả định dark mode được Wirefigma cung cấp. Nếu app cần tương thích nền trang tối, popup phải dùng surface rõ theo token đã xác minh và được kiểm tra trực quan.
- Giảm motion theo `prefers-reduced-motion`; thông tin trạng thái vẫn có khi không animation.

## Không thuộc baseline

Hướng “Trang sách/Sổ tay” trong tài liệu thiết kế cũ; dashboard shell và integrations screens; token/visual artifacts EnglishBot cũ; high-fidelity mockup mới. Chủ dự án yêu cầu xóa mockup cũ ở lane root và không tạo mockup trong P1-R01.
