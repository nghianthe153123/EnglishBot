# P1-004: Định nghĩa design foundation và accessibility

- Trạng thái: ĐANG_REVIEW
- Phase: 1
- Module/bề mặt sở hữu: shared UI
- Mức rủi ro: Chuẩn
- Phụ thuộc để soạn: cấu trúc P1-002 và P1-003 đủ ổn định; cổng B là điều kiện phê duyệt sau khi P1-004 được review
- ID yêu cầu: D-104, D-105, D-106, D-107, NFR-08, NFR-09

## Mục tiêu

Định nghĩa nền semantic cho visual, responsive và accessibility đủ để Phase 2 xây design system nhất quán mà không tự chọn giá trị tùy ý.

## Trong phạm vi

- Vai trò màu, typography, spacing 4 px, radius, elevation, motion và icon rule.
- Art direction theo yêu cầu chủ dự án: sản phẩm học tập/đọc hiểu có cảm giác biên tập và thủ công, lấy typography/nội dung làm trọng tâm; tránh gradient/glow, glassmorphism, thẻ KPI trang trí và mô-típ AI/SaaS đại trà.
- Light/dark theo hệ thống, focus ring, reduced motion.
- Breakpoint/viewport tham chiếu cho extension và dashboard.
- Keyboard behavior, focus order, label, heading, error, live region và contrast target.
- Quy tắc copy tiếng Việt và nội dung học song ngữ.

## Ngoài phạm vi

- Token value production cuối cùng, component implementation, logo/brand campaign hoặc pixel-perfect visual.

## Hợp đồng và invariant

- Target WCAG 2.2 AA khi khả thi.
- Không chỉ dùng màu để truyền đạt trạng thái.
- Mọi tương tác chính khả dụng bằng bàn phím và có focus visible.
- Animation có phương án giảm chuyển động.

## Tiêu chí nghiệm thu

- [x] AC1: Semantic token taxonomy có ma trận bao phủ toàn bộ nhóm state ID của extension/dashboard trong deliverable; chờ kiểm chứng bằng mockup.
- [x] AC2: Viewport và responsive behavior được ghi rõ cho extension 320/360/420 và dashboard 390/1024/1440 px.
- [x] AC3: Checklist bao phủ keyboard, focus, name/role/value, contrast, reflow và motion; kiểm thử UI chạy thật thuộc Phase 2.
- [x] AC4: Copy/terminology guideline đối chiếu J1–J5, selection từ đơn/cụm-câu, MCP và Quizlet; chờ owner review copy cuối.
- [ ] AC5: Chủ dự án duyệt foundation để P2-001 triển khai token/component.

## Kế hoạch kiểm thử

- [x] Token-to-screen coverage review: ma trận `ST-EXT-01..21` và toàn bộ nhóm `DB-*` trong deliverable.
- [x] Keyboard/focus walkthrough J1–J5 ở mức wireframe; chưa phải test bằng bàn phím trên UI chạy thật.
- [x] Contrast intent và light/dark state review bằng cặp token semantic; chưa có palette thật để đo tỷ lệ.
- [x] Format, docs-check, secrets scan và diff-check đạt tại local ngày 2026-09-30.
- [ ] CI đạt trên commit chứa deliverable.

## Ghi chú triển khai

- Deliverable: `docs/design/phase-1-design-foundations.md`.
- Chỉ dẫn art direction được ghi nhận từ yêu cầu review mockup ngày 2026-09-29. Lý do: tránh cảm giác template AI; tác động: cần owner review bằng lựa chọn thị giác khi P1-004 mở. Đây là ràng buộc về cách trình bày, không thêm chức năng hay dependency.
- 2026-09-30: chủ dự án yêu cầu thực hiện P1-003 và P1-004, đồng thời giữ quyền chốt mockup. Bản foundation được soạn để review; chưa tự đánh dấu hoàn tất/cổng B.
- Xung đột thứ tự: bản gói cũ đặt “cổng B” làm phụ thuộc đầu vào của P1-004, trong khi cổng B yêu cầu foundation được duyệt. Diễn giải theo kế hoạch Phase 1: P1-004 bắt đầu sau khi cấu trúc P1-002/P1-003 ổn định; cổng B là điều kiện hoàn tất. Không dùng xung đột này để tự phê duyệt.
- Đề xuất cho kế hoạch Phase 2: ghi một checkpoint chủ dự án duyệt mockup trước khi khóa giá trị token/component production. Lý do: chủ dự án giữ quyền chốt phần mockup; tác động tới thứ tự review P2-001 và UI mock P2-003..005. Chưa tự coi đây là thay đổi đã duyệt đối với WBS/phase plan.

## Rủi ro và rollback

- Rủi ro: khóa style quá sớm trước khi mock chạy được.
- Rollback: chỉ khóa semantic roles/targets; giá trị visual cụ thể có thể điều chỉnh ở Phase 2 qua review có bằng chứng.
