# P1-001: Xác thực persona, hành trình và ưu tiên tính năng

- Trạng thái: ĐANG_REVIEW
- Phase: 1
- Module/bề mặt sở hữu: product governance
- Mức rủi ro: Nâng cao
- Phụ thuộc: Phase 0 hoàn tất
- ID yêu cầu: J1–J5, CAP-01..04, CHAT-01..04, SEL-01..04, VOC-01..03, LRN-01..04, MCP-01..03, QZ-01..03, PRIV-01..03, D-101, D-105, D-108, D-109

## Mục tiêu

Tạo một phạm vi MVP/beta có thể kiểm chứng, với persona, năm hành trình và ưu tiên đủ rõ để mọi quyết định UI/kiến trúc sau đó không cần AI tự suy đoán.

## Bối cảnh

PRD hiện đã mô tả J1–J5 và danh sách yêu cầu, nhưng Phase 1 phải xác thực thứ tự, vai trò từng bề mặt, trạng thái lỗi và giới hạn beta trước khi vẽ wireframe.

## Trong phạm vi

- Persona chính, năng lực, bối cảnh, mục tiêu và giới hạn.
- Walkthrough J1–J5 với happy path, recoverable failure và unsupported path.
- Đối soát Bắt buộc/Nên có/Có thể và non-goal beta.
- Thuật ngữ cốt lõi, consent capture, retention 24 giờ, Chrome-first/Edge-compatible.
- Ma trận requirement → journey và backlog scenario Phase 2.

## Ngoài phạm vi

- Wireframe chi tiết, visual style, code UI, API/schema và provider selection.
- Nghiên cứu người dùng quy mô lớn; nếu chưa có người dùng ngoài chủ dự án, ghi rõ đây là owner-validation baseline.

## Hợp đồng và invariant

- Không thay đổi quyết định đã chấp nhận nếu chưa có decision update.
- Tiện ích là giao diện hằng ngày chính; MCP là kênh bổ sung.
- Capture chỉ xảy ra sau thao tác rõ ràng và không lưu cookie/session token.
- Direct sync Quizlet không thuộc beta.

## Tiêu chí nghiệm thu

- [x] AC1: Có persona chính cùng bối cảnh và mục tiêu rõ ràng; owner đã duyệt baseline.
- [x] AC2: J1–J5 có entry, precondition, happy path, failure/recovery và exit state.
- [x] AC3: Mọi yêu cầu chức năng được giữ/hoãn/loại có lý do và phase.
- [x] AC4: MVP, beta non-goal và vai trò extension/dashboard/MCP không mâu thuẫn.
- [x] AC5: Consent, retention, browser support và thuật ngữ cốt lõi được chủ dự án duyệt.
- [x] AC6: Có danh sách scenario ID đầu vào cho Phase 2.

## Kế hoạch kiểm thử

### Tự động

- [x] Docs-check, format và secret scan đạt local; CI từ xa đang chờ.

### Thủ công

- [x] Walkthrough J1–J5 theo ba nhánh đã ghi trong deliverable.
- [x] Review phản biện scope creep và quyền riêng tư.
- [x] Requirement coverage không có ID Bắt buộc bị bỏ sót.

### Lệnh bắt buộc

```text
pnpm run format
pnpm run docs:check
pnpm run secrets:scan
```

## Ghi chú triển khai

- Deliverable dự kiến: `docs/product/phase-1-scope-and-journeys.md`.
- Dùng ID ổn định `J*`, `REQ-*`, `SCN-*`; không tạo ID trùng với requirement hiện có.
- Chủ dự án đã yêu cầu bắt đầu P1-001 ngày 2026-09-29; phạm vi bắt đầu chỉ bao gồm gói này, không tự mở P1-002..P1-007.
- Deliverable hiện là bản nháp; chủ dự án đã chốt `RESOLVED-P1-001-01`: tiến độ nằm trong Hôm nay/Bài học, không có route `/progress` riêng. UX baseline đã được cập nhật tương ứng.
- Áp dụng quy tắc trong `AGENTS.md`: nếu phát hiện quy tắc/tính năng dùng lại được thì đề xuất cập nhật đúng tài liệu nguồn và nêu lý do, tác động, phase. Trong P1-001 chưa phát hiện tính năng mới ngoài baseline PRD; bất nhất `/progress` đã được xử lý theo xác nhận owner, chưa mở rộng scope.
- Chủ dự án duyệt baseline P1-001 ngày 2026-09-29; kết quả review và lệnh kiểm tra được ghi trong deliverable. Chờ CI từ xa trước khi chuyển trạng thái hoàn tất.

## Rủi ro và rollback

- Rủi ro: phạm vi quá rộng hoặc persona giả định không có bằng chứng.
- Rollback: giữ PRD baseline, ghi đề xuất chưa duyệt trong mục riêng; không âm thầm sửa requirement.
