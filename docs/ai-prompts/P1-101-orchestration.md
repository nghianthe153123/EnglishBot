# P1-101 — Kế hoạch điều phối và cổng kiểm tra

- Ngày: 2026-09-30; owner yêu cầu thực hiện bằng một agent cấp cao điều phối agent cấp thấp hơn.
- Gói duy nhất: [P1-101](../work-packages/P1-101-scope-wirefigma-ux.md).
- Không triển khai production, prototype, mockup, API, schema hoặc tính năng phase sau.

## Phân công và trình tự

| Bước | Người thực hiện                  | Đầu ra                                                                     | Cổng                                                               |
| ---- | -------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | Root, model hiện hành            | Đọc authority, xác minh nguồn, giới hạn gói                                | Phạm vi không mâu thuẫn ADR-006                                    |
| 2A   | Agent `gpt-6-luna`, effort `low` | Wireframe chữ và danh mục trạng thái theo prompt A                         | Không đổi lựa chọn provider/N/Quizlet đã duyệt                     |
| 2B   | Agent `gpt-6-luna`, effort `low` | Token/component, accessibility, kế hoạch review theo prompt B              | Không thêm palette, không giả bằng chứng UI                        |
| 3    | Root                             | Quyền trình duyệt, IA, hồ sơ owner review                                  | Đọc lại từng file; kiểm tra luồng khó và lỗi                       |
| 4    | Root                             | Hash, tương phản, hình học clamp, formatter, docs links, secret scan, diff | Ghi kết quả thật và giới hạn; không dùng kế hoạch làm kết quả test |
| 5    | Owner                            | Duyệt hoặc yêu cầu sửa UX đề xuất                                          | Chỉ sau duyệt mới khóa baseline và mở gói phụ thuộc                |

Bước 2A/2B được làm song song trên file độc lập trong cùng P1-101. Root sở hữu IA, tài liệu UX cấp cao, quyền, work package, báo cáo và prompt; hai agent không sửa file của root hoặc của nhau. Không tạo thread mới, không tự commit/push từ agent con.

## Hợp đồng giao việc

- Agent A: [prompt chi tiết](P1-101-A-interactions.md), chỉ sửa `docs/design/phase-1-extension-wireframes.md`.
- Agent B: [prompt chi tiết](P1-101-B-foundations-testing.md), chỉ sửa `docs/design/phase-1-design-foundations.md`, tạo `docs/design/p1-101-review-checklist.md`.
- Agent con phải báo file, invariant đã kiểm tra, lệnh thực chạy, điểm chưa chốt và đề xuất quy tắc nếu có. Không tự duyệt UX thay owner.
- Root kiểm tra chéo Word/Phrase, DB/Add, Google/AI, N unset, unknown Quizlet, không mạng trước Dịch và quyền site.

## Điều kiện dừng và giao lại

Không tự chọn auth/model/provider AI, kênh Quizlet production, heuristic phân loại khó hoặc cache/sense/schema. Nếu mâu thuẫn authority phải báo root. Mọi thông số layout/hành vi mới trong hồ sơ là đề xuất chờ owner, không quyết định đã duyệt.

P1-101 không tạo mockup mới: kiểm tra tài liệu, tính tương phản token và hình học chỉ là bằng chứng thiết kế; screenshot, bàn phím/focus và hành vi trình duyệt thật phải được ghi chưa chạy. Không đánh dấu HOÀN_TẤT khi owner hoặc bằng chứng bắt buộc còn thiếu.

## Kết quả điều phối

Hai lane đã giao bản thảo; root tích hợp và sửa selection race, thiếu key/cache hit, mapping requirement và lựa chọn focus/viền theo contrast. Owner chốt activation A (D-P1-11) và phân tầng test (D-P1-14). Gói đang ĐANG_REVIEW vì bộ UX chưa có owner approval; runtime test được giữ bắt buộc tại P1-103/105/109, không miễn test và không mở implementation trước gate.
