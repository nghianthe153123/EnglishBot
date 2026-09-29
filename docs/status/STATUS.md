# Trạng thái dự án

## Ảnh chụp hiện tại

- Ngày: 2026-09-29
- Trạng thái tổng thể: Phase 0 đã hoàn tất; kế hoạch Phase 1 đang chờ duyệt
- Phase đang hoạt động: chưa có; Phase 1 chưa được phép thực thi
- Gói công việc đang hoạt động: chưa có
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
- P0-002 — repository và build layout.
- P0-003 — môi trường, secret và cổng CI.
- P0-004 — dry run quy trình AI.
- Cổng Phase 0 — ba job CI đạt trên commit `f91dae1`.

## Quyết định tiếp theo

Danh sách đầy đủ nằm tại [`docs/11-decisions-to-lock.md`](../11-decisions-to-lock.md).

Ưu tiên hiện tại:

1. Chủ dự án đọc và duyệt [`Phase 1 — Phạm vi sản phẩm, hướng UI và kiến trúc hệ thống`](../phases/phase-01-product-ui-architecture.md).
2. Khi được duyệt, chuyển Phase 1 sang `ĐANG_THỰC_HIỆN` và P1-001 sang `SẴN_SÀNG`.
3. Chỉ mở P1-002 đến P1-007 sau khi dependency và cổng A/B tương ứng đạt.

## Rủi ro đang mở

| Rủi ro                                       | Trạng thái | Phản ứng hiện tại                                      |
| -------------------------------------------- | ---------- | ------------------------------------------------------ |
| Khả dụng API trực tiếp của Quizlet           | Mở         | Không đặt trên critical path; import/export trước      |
| OpenAI Java SDK thay đổi                     | Mở         | Ẩn SDK sau interface AI gateway                        |
| Trích xuất trang trình duyệt không đồng nhất | Mở         | Xây corpus và cổng chất lượng trước khi duyệt Q&A      |
| Prompt injection từ nội dung trang/MCP       | Mở         | Coi nội dung là không đáng tin; dùng bộ test đối kháng |
| Tải review code do AI tạo                    | Mở         | Gói nhỏ, giới hạn hai task đồng thời, cổng bằng chứng  |

## Lịch sử cổng phase

| Phase | Kết quả  | Ngày       | Bằng chứng                                               |
| ----- | -------- | ---------- | -------------------------------------------------------- |
| 0     | Hoàn tất | 2026-09-29 | `docs/phases/phase-00-closeout.md`, CI run `36452278392` |
