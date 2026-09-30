# P1-003: Thiết kế dashboard và luồng tích hợp

- Trạng thái: ĐANG_REVIEW
- Phase: 1
- Module/bề mặt sở hữu: web dashboard, MCP/Quizlet UX
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-001, cổng A
- ID yêu cầu: J3, J4, J5, VOC-01..03, LRN-01..04, MCP-01..03, QZ-01..03, D-103, D-503..507, NFR-08, NFR-09

## Mục tiêu

Khóa navigation, wireframe và trạng thái của dashboard beta cùng các luồng chia sẻ ChatGPT/MCP và xuất/import Quizlet được hỗ trợ.

## Trong phạm vi

- Sáu route beta `/today`, `/vocabulary`, `/lessons`, `/sources`, `/integrations`, `/settings`.
- Tiến độ tổng quan ở `/today`; lịch sử ôn và bằng chứng ở `/lessons` theo D-103 và `RESOLVED-P1-001-01`. `/progress` bị bỏ khỏi scope do xung đột route đã được owner giải quyết.
- Empty/loading/error/stale/offline/permission states cho từng route và failure/recovery của MCP/Quizlet.
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

- [x] AC1: Sáu route có mục đích, entry point, empty/error state và hành động chính trong deliverable; chờ owner xác nhận.
- [x] AC2: J3–J5 có wireframe cấu trúc xuyên suốt và failure/recovery path trong deliverable; chờ owner xác nhận.
- [x] AC3: MCP flow thể hiện dữ liệu chia sẻ, TTL 30 phút, account, revoke tức thì và last access trong deliverable; chờ owner xác nhận.
- [x] AC4: Quizlet flow bao phủ preview, invalid/duplicate, copy/import chủ động và confirmation trung thực; direct sync vẫn ngoài beta.
- [x] AC5: Bố cục 390/1024/1440 px được đặc tả và đã kiểm tra trực quan qua ba ảnh wireframe tĩnh của route `/integrations` trong `docs/evidence/`; UI chạy thật vẫn kiểm tra ở Phase 2.
- [ ] AC6: Chủ dự án duyệt navigation và phạm vi route beta.

## Kế hoạch kiểm thử

- [x] Walkthrough J3–J5 với scenario ID và trạng thái có ID trong deliverable.
- [x] Route/state/action coverage matrix trong deliverable.
- [x] Keyboard/focus/error recovery review ở mức wireframe.
- [x] Privacy/security review cho share, revoke, approval, export/import ở mức luồng; threat/test runtime còn thuộc giai đoạn triển khai tích hợp.
- [x] Docs-check, secrets scan, format và diff-check đạt trên bản tài liệu P1-003.
- [ ] Owner duyệt navigation và phạm vi route beta; AC6 chưa đạt.
- [x] Bằng chứng visual review tại 390/1024/1440 px: `docs/evidence/p1-003-integrations-*.png`, đối chiếu nguồn SVG tương ứng; ngày 2026-09-30.

## Ghi chú triển khai

- Deliverable: `docs/design/phase-1-dashboard-and-integrations.md`.
- 2026-09-30: gói được chủ dự án yêu cầu bắt đầu dù trạng thái trước đó là NHÁP; hiện chuyển ĐANG_REVIEW khi đã có deliverable để owner kiểm tra. Không tự đánh dấu HOÀN_TẤT/cổng B.
- Xung đột scope: route `/progress` trong bản gói ban đầu xung đột D-103 và `RESOLVED-P1-001-01`; dùng sáu route D-103, gộp tiến độ vào `/today` và `/lessons`. Không sửa nguồn chuẩn khác.
- Không tạo high-fidelity mockup, dashboard UI, API hoặc schema. Bản này cung cấp đầu vào để owner review trước P1-004/mockup.

## Rủi ro và rollback

- Rủi ro: dashboard ôm quá nhiều chức năng hoặc integration flow tạo cảm giác truy cập vĩnh viễn.
- Rollback: giữ route beta tối thiểu, chuyển chi tiết không bắt buộc sang backlog và ghi lý do.
