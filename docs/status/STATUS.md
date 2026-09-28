# Trạng thái dự án

## Ảnh chụp hiện tại

- Ngày: 2026-09-28
- Trạng thái tổng thể: Phase 0 đang ở cổng xác minh remote
- Phase đang hoạt động: Phase 0 — Nền tảng
- Gói công việc đang hoạt động: P0-002, P0-003 và P0-004 đang `ĐANG_REVIEW`
- Mục tiêu phát hành: beta có kiểm soát sau Phase 7

## Đã hoàn thành

- Tuyên bố dự án ban đầu.
- Đường cơ sở yêu cầu sản phẩm.
- Đặc tả bề mặt UX/UI và kịch bản mô phỏng.
- Đề xuất kiến trúc modular monolith.
- Mô hình dữ liệu tạm thời.
- Lộ trình bàn giao và kiểm thử 26 tuần.
- Quy trình quản trị thực thi và kiểm thử bằng AI.
- Đường cơ sở bảo mật/quyền riêng tư.
- Phân rã công việc và truy vết yêu cầu.
- Phê duyệt toàn bộ hướng quyết định và ADR nền tảng.
- P0-001 — phê duyệt đường cơ sở.

## Quyết định tiếp theo

Danh sách đầy đủ nằm tại [`docs/11-decisions-to-lock.md`](../11-decisions-to-lock.md).

Ưu tiên hiện tại:

1. Push commit thực thi Phase 0 lên GitHub.
2. Xác minh ba job CI từ checkout sạch.
3. Nếu CI đạt, cập nhật bằng chứng và đóng P0-002 đến P0-004 cùng Phase 0.
4. Giữ mọi gói Phase 1 ở trạng thái chưa sẵn sàng cho tới khi có chỉ đạo tiếp theo.

## Rủi ro đang mở

| Rủi ro                                       | Trạng thái | Phản ứng hiện tại                                      |
| -------------------------------------------- | ---------- | ------------------------------------------------------ |
| Khả dụng API trực tiếp của Quizlet           | Mở         | Không đặt trên critical path; import/export trước      |
| OpenAI Java SDK thay đổi                     | Mở         | Ẩn SDK sau interface AI gateway                        |
| Trích xuất trang trình duyệt không đồng nhất | Mở         | Xây corpus và cổng chất lượng trước khi duyệt Q&A      |
| Prompt injection từ nội dung trang/MCP       | Mở         | Coi nội dung là không đáng tin; dùng bộ test đối kháng |
| Tải review code do AI tạo                    | Mở         | Gói nhỏ, giới hạn hai task đồng thời, cổng bằng chứng  |

## Lịch sử cổng phase

| Phase | Kết quả       | Ngày | Bằng chứng                         |
| ----- | ------------- | ---- | ---------------------------------- |
| 0     | Đang xác minh | —    | `docs/phases/phase-00-closeout.md` |
