# Trạng thái dự án

## Ảnh chụp hiện tại

- Ngày: 2026-09-29
- Trạng thái tổng thể: Phase 0 đã hoàn tất; Phase 1 đang thực hiện giới hạn tại P1-001
- Phase đang hoạt động: Phase 1 — Phạm vi sản phẩm, hướng UI và kiến trúc hệ thống
- Gói công việc đang hoạt động: P1-001 — Phạm vi sản phẩm và hành trình (đã được owner duyệt, đang review CI)
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

1. Xác nhận CI/cổng A cho P1-001; chủ dự án đã duyệt baseline, walkthrough và kiểm tra local đã ghi trong [deliverable](../product/phase-1-scope-and-journeys.md).
2. Nếu cổng A đạt, đánh dấu P1-001 hoàn tất và P1-002 sẵn sàng để bắt đầu wireframe extension.
3. Chỉ mở các gói còn lại sau khi dependency và cổng A/B tương ứng đạt.

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
