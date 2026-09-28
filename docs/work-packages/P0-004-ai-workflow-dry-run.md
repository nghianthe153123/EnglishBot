# P0-004: Chạy thử quy trình AI

- Trạng thái: ĐANG_REVIEW
- Phase: 0
- Phạm vi sở hữu: quản trị dự án/tooling
- Mức rủi ro: Chuẩn
- Phụ thuộc: P0-002, P0-003

## Mục tiêu

Chứng minh AI coding agent có thể nhận gói công việc, thực hiện thay đổi tooling nhỏ, chạy test, ghi bằng chứng và bàn giao mà không lệch phạm vi.

## Trong phạm vi

- Dùng task tooling nhỏ, ưu tiên kiểm tra tài liệu.
- Thực hiện đủ workflow trạng thái.
- Ghi test evidence theo template.
- Review phạm vi, độ chính xác báo cáo và khả năng tái tạo.
- Cập nhật playbook nếu phát hiện điểm mơ hồ.

## Ngoài phạm vi

- Tính năng sản phẩm, provider bên ngoài hoặc database nghiệp vụ.

## Tiêu chí nghiệm thu

- [x] Agent đọc đúng chuỗi tài liệu bắt buộc.
- [x] Kế hoạch ánh xạ tới từng tiêu chí nghiệm thu.
- [x] Diff chỉ thuộc phạm vi.
- [x] Test đã khai báo được chạy thật và lưu kết quả.
- [x] Báo cáo phân biệt rõ hoàn tất, bỏ qua và giới hạn.
- [ ] Người review có thể tái chạy lệnh từ checkout sạch (đang chờ CI đầu tiên).

## Test bắt buộc

- Kiểm tra liên kết và cấu trúc Markdown.
- Chạy toàn bộ cổng repository liên quan.
- Review thủ công báo cáo so với diff và log test.

## Task dry run được chọn

Tạo cổng kiểm tra liên kết Markdown xác định tại `scripts/check-docs.mjs`, kèm fixture dương/âm tại `tooling/quality-gates.test.mjs`. Task không chạm logic sản phẩm, database hoặc provider ngoài.

## Dòng trạng thái

| Trạng thái    | Bằng chứng                                                          |
| ------------- | ------------------------------------------------------------------- |
| `NHÁP`        | Work package được tạo cùng kế hoạch Phase 0                         |
| `SẴN_SÀNG`    | Chủ dự án yêu cầu thực hiện toàn bộ Phase 0 ngày 2026-09-28         |
| `ĐANG_LÀM`    | Agent đọc chuỗi tài liệu bắt buộc, triển khai checker và test       |
| `ĐANG_REVIEW` | Local quality gate đạt; chuẩn bị push để CI review từ checkout sạch |
| `ĐÃ_XÁC_MINH` | Chờ CI GitHub đạt                                                   |
| `HOÀN_TẤT`    | Chờ cổng Phase 0 đạt và báo cáo closeout                            |

## Báo cáo thực thi

- Phạm vi thay đổi dry run: script docs-check, test của cổng, lệnh package và bước CI tương ứng.
- Test dương: tài liệu có link hợp lệ được chấp nhận.
- Test âm: tài liệu có link thiếu trả đúng một lỗi.
- Test repository: 34 file Markdown đã được kiểm tra thành công ở local.
- Bằng chứng chi tiết: [`docs/evidence/P0-004-dry-run.md`](../evidence/P0-004-dry-run.md).
- Bỏ qua: chưa có.
- Giới hạn: kết quả CI và commit SHA sẽ được điền sau lần chạy remote đầu tiên.
