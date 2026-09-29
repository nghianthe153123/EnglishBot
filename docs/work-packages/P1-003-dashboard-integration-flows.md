# P1-003: Thiết kế dashboard và luồng tích hợp

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: web dashboard, MCP/Quizlet UX
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-001, cổng A
- ID yêu cầu: J3, J4, J5, VOC-01..03, LRN-01..04, MCP-01..03, QZ-01..03, D-103, D-503..507, NFR-08, NFR-09

## Mục tiêu

Khóa navigation, wireframe và trạng thái của dashboard beta cùng các luồng chia sẻ ChatGPT/MCP và xuất/import Quizlet được hỗ trợ.

## Trong phạm vi

- Route `/today`, `/vocabulary`, `/lessons`, `/sources`, `/progress`, `/integrations`, `/settings`.
- Empty/loading/error/stale/offline/permission states cho từng route.
- Bắt đầu/kết thúc bài học, bằng chứng tiến độ, vocabulary filter/edit/export.
- MCP connect/share/expire/revoke/last-access và approval cho side effect.
- Quizlet preview, validation, duplicate, copy/export và user-provided import flow.

## Ngoài phạm vi

- Thuật toán học, direct Quizlet sync, OAuth provider cụ thể, code dashboard hoặc API.

## Hợp đồng và invariant

- Không tuyên bố Quizlet đã nhận dữ liệu nếu chưa có xác nhận.
- Share grant mặc định 30 phút và có thể thu hồi ngay.
- Tool ghi dữ liệu luôn cần phê duyệt rõ ràng.
- Progress không được tuyên bố mastery thiếu căn cứ.

## Tiêu chí nghiệm thu

- [ ] AC1: Mọi route có mục đích, entry point, empty/error state và hành động chính.
- [ ] AC2: J3–J5 có wireframe xuyên suốt và failure/recovery path.
- [ ] AC3: MCP flow thể hiện dữ liệu chia sẻ, TTL, account, revoke và last access.
- [ ] AC4: Quizlet flow bao phủ preview, invalid/duplicate, copy/import và confirmation trung thực.
- [ ] AC5: Dashboard được review ở 390/1024/1440 px.
- [ ] AC6: Chủ dự án duyệt navigation và phạm vi route beta.

## Kế hoạch kiểm thử

- [ ] Walkthrough J3–J5 với scenario ID.
- [ ] Route/state/action coverage matrix.
- [ ] Keyboard/focus/error recovery review.
- [ ] Security review cho share, revoke, approval và export.
- [ ] Docs-check và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/design/phase-1-dashboard-and-integrations.md`.

## Rủi ro và rollback

- Rủi ro: dashboard ôm quá nhiều chức năng hoặc integration flow tạo cảm giác truy cập vĩnh viễn.
- Rollback: giữ route beta tối thiểu, chuyển chi tiết không bắt buộc sang backlog và ghi lý do.
