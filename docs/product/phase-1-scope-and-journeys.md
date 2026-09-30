# P1-001 — Phạm vi sản phẩm và hành trình (lịch sử)

- Trạng thái: HOÀN_TẤT theo quyết định ngày 2026-09-29; baseline phạm vi cũ bị thay thế cho Phase 1 ngày 2026-09-30 bởi [P1-R01](../work-packages/P1-R01-scope-rebaseline.md).
- Tài liệu này được giữ để bảo toàn lịch sử owner approval và cổng đã qua. Các hành trình bên dưới không còn là phạm vi triển khai hiện hành.
- Baseline hiện hành: [PRD](../01-product-requirements.md), [UX/UI](../02-ux-ui-system.md), [P1-R01](../work-packages/P1-R01-scope-rebaseline.md).

## Lịch sử quyết định P1-001

Ngày 2026-09-29, P1-001 ghi nhận kế hoạch rộng hơn gồm capture trang, Chat/Q&A, học tập nội bộ, dashboard, MCP và Quizlet export. Tài liệu được owner duyệt cho thời điểm đó; không xóa lịch sử hoàn tất này. Ngày 2026-09-30, chủ dự án giới hạn lại Phase 1 vào selection translation, rich word persist/reuse, Add queue và tự tạo Quizlet set. Đây là thay đổi phạm vi mới, không sửa ngược lịch sử phê duyệt.

Các phạm vi capture, Chat, dashboard, MCP, bài học/scheduler/mastery nội bộ, TTS, word family, import file Quizlet bị hoãn/loại khỏi Phase 1 hiện hành. Quizlet set là đầu ra học tập trong scope mới.

## Hành trình hiện hành

ID hành trình ổn định được định nghĩa trong tài liệu mới, không tái sử dụng J1–J5 cũ:

- [P1-J1 — Dịch một từ](../01-product-requirements.md#p1-j1--dịch-một-từ)
- [P1-J2 — Dịch cụm hoặc câu](../01-product-requirements.md#p1-j2--dịch-cụm-hoặc-câu)
- [P1-J3 — Add, batch và Quizlet](../01-product-requirements.md#p1-j3--add-batch-và-quizlet)
- [P1-J4 — Provider, key và quyền](../01-product-requirements.md#p1-j4--provider-key-và-quyền)

## Tiêu chí và quyết định còn mở

Xem bảng P1-TR/P1-WD/P1-QZ/P1-UI/P1-SEC trong PRD. Owner đã chốt Google dịch nghĩa kết hợp AI BYOK enrichment POS/ví dụ cho từ; N do người dùng cấu hình không có mặc định. Kênh Quizlet production cần feasibility proof; owner cho phép khảo sát browser automation nếu kênh chính thức không dùng được. Provider/model, auth, schema vẫn chưa khóa.
