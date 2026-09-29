# P1-004: Định nghĩa design foundation và accessibility

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: shared UI
- Mức rủi ro: Chuẩn
- Phụ thuộc: P1-002, P1-003, cổng B
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

- [ ] AC1: Semantic token taxonomy bao phủ mọi surface/state trong wireframe.
- [ ] AC2: Viewport và responsive behavior được ghi rõ.
- [ ] AC3: Accessibility checklist bao phủ keyboard, focus, name/role/value, contrast và motion.
- [ ] AC4: Copy/terminology guideline không mâu thuẫn giữa extension/dashboard.
- [ ] AC5: Chủ dự án duyệt foundation để P2-001 triển khai token/component.

## Kế hoạch kiểm thử

- [ ] Token-to-screen coverage review.
- [ ] Manual keyboard/focus walkthrough trên wireframe.
- [ ] Contrast intent và dark/light state review.
- [ ] Docs-check và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/design/phase-1-design-foundations.md`.
- Chỉ dẫn art direction được ghi nhận từ yêu cầu review mockup ngày 2026-09-29. Lý do: tránh cảm giác template AI; tác động: cần owner review bằng lựa chọn thị giác khi P1-004 mở. Đây là ràng buộc về cách trình bày, không thêm chức năng hay dependency.

## Rủi ro và rollback

- Rủi ro: khóa style quá sớm trước khi mock chạy được.
- Rollback: chỉ khóa semantic roles/targets; giá trị visual cụ thể có thể điều chỉnh ở Phase 2 qua review có bằng chứng.
