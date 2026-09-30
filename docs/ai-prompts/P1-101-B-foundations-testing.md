# Prompt B — P1-101: Wirefigma và review UX

Bạn là agent thường quy `gpt-6-luna`, effort `low`, do root điều phối. Workspace `D:\EnglishBot`. Đọc đầy đủ AGENTS.md và `C:\Users\tuannghia\.codex\RTK.md`; mọi shell command bắt đầu `rtk`, sửa file bằng apply_patch. Đọc README, docs/status/STATUS.md, docs/07-ai-execution-playbook.md, docs/work-packages/P1-101-scope-wirefigma-ux.md theo thứ tự. Sau đó đọc design foundations, Wirefigma SOURCE.md, WIREFIGMA_DESIGN_SYSTEM.md đầy đủ, sample phần token/component và docs/06-testing-strategy.md. Không sửa code production.

## Sở hữu file độc lập

Chỉ sửa `docs/design/phase-1-design-foundations.md`; tạo `docs/design/p1-101-review-checklist.md`. Không sửa file root/agent A, không commit/push hoặc gọi agent khác.

## Nhiệm vụ cụ thể

1. Ánh xạ token/component thực tế từ nguồn cho action Dịch, popup non-modal, rich word/phrase, Options và queue nhỏ. Một CTA dark trong mỗi vùng, action phụ outline/ghost; không gradient/shadow lớn/dashboard/icon trang trí/brand mới. Typography 16/24,14/20,12/16 tối đa ba cấp; space 8/12/16/20; radius 4/8. Control dùng 40 (hoặc48 nếu yêu cầutouch), không tự thêm size44 ngoài nguồn.
2. Token sáng đục trên nền trang sáng/tối; không tạo dark palette. Phân biệt quan sát vs chuẩn hóa nguồn, kiểm tra nguyên tắc contrast. Neutral300/lightstroke không đủ tương phản cho boundary control cần thiết: root tính số thật, không claim pass; dùng stroke.dark cho boundary cần nhận biết, stroke nhẹ chỉ divider trang trí. Caption muted thay disabled cho nội dung thiết yếu, focusaccent3px có khoảng thở.
3. Popup là dialog không modal: role dialog, accessible name, không aria-modal=true/trap; focus-visible, label/aria-describedby/radio native, aria-live polite cho tải/kết quả; lỗi không spam, icon đóng accessible name. Trạng thái không chỉ màu. Không dùng tooltip làm nơi duy nhất chứa hướng dẫn/key/provider.
4. Tạo checklist owner walkthrough thành công/lỗi/restricted/provider/N với IDs UAT-101-xx và map AC1…AC6/requirements. Đưa casepointer edges320/360/420, zoom125/200/reflow400%, keyboard-only, multiline/longcontent/selectionchange/revoke; tính geometry không thay visual runtime.
5. Tách review tài liệu, kiểm tra số học có thể chạy hiện tại và browser/UI/screenshot phải chờ gói có UI. Không tự đánh dấu đã chạy. P1-101 không cho mockup/code production, nên screenshot runtime không thể coi pass; ghi rõ gate/owner cần giải quyết, không bỏ test im lặng. Owner approval chưa có.
6. Đề xuất tái sử dụng một quy tắc có ích nếu có, ghi ĐỀ_XUẤT chưa duyệt, không sửa AGENTS hoặc mở feature mới.

Kế hoạch viewport/quyền chi tiết trỏ sang `p1-101-permissions-and-layout.md` root tạo. Giữ tất cả N/model/provider/channel chưa khóa theo authority; không đề xuất defaultN. Formatter chỉ các file mình, báo root các lệnh thật/test chưa thực hiện. Không sửa STATUS/ADR/PRD.
