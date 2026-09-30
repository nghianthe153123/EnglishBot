# Trạng thái dự án

## Ảnh chụp hiện tại

- Ngày: 2026-10-01.
- Phase đang hoạt động: Phase 1 — dịch selection, dữ liệu từ và tự tạo bộ thẻ Quizlet.
- Gói điều chỉnh: P1-R01 ĐÃ_XÁC_MINH sau cổng tài liệu; [báo cáo](../evidence/P1-R01-rebaseline.md).
- P1-101: HOÀN_TẤT cổng đặc tả/UX, owner duyệt ngày 2026-10-01; [hồ sơ](../design/p1-101-owner-review.md), [bằng chứng](../evidence/P1-101-design-review.md).
- Công việc tiếp theo: P1-103 SẴN_SÀNG (mock UI và hợp đồng), chưa bắt đầu thực thi. P1-102 cần khảo sát sớm để giảm rủi ro Quizlet; gói khác giữ NHÁP/điều kiện phụ thuộc.
- Code production tính năng: chưa bắt đầu; chưa đánh dấu Phase 1 hoàn tất.
- Phạm vi có thẩm quyền: ADR-006/008, [PRD](../01-product-requirements.md), [kế hoạch Phase 1](../phases/phase-01-product-ui-architecture.md).

## Những gì đã được xác minh

- Phase 0 giữ trạng thái hoàn tất: [closeout](../phases/phase-00-closeout.md), CI run 36452278392/commit f91dae1.
- P1-001 từng hoàn tất baseline cũ trên abc5d36; không dùng làm bằng chứng scope/tính năng mới.
- P1-R01 đã đối soát và sửa README, product/UX/design, roadmap/testing/traceability, architecture/data/security/environment, ADR/decisions, prompts và work packages.
- Có 9 gói P1-101..109; tổng dự toán 16–27 ngày công gồm triển khai/testing/review, chưa tính chờ bên ngoài.
- Wirefigma từ C:\SystemDesign đã có snapshot/attribution/hash trong repository. Mockup cũ gỡ khỏi baseline, có bản phục hồi cục bộ; evidence dashboard cũ có thể phục hồi từ Git.
- Format, docs-check 70 Markdown, secret scan 117 file và staged diff-check đạt ở cổng tài liệu. Không có migration, key thật, mockup mới hoặc thao tác tài khoản Quizlet thật.
- Baseline đã push `origin/main` tại `79c2f08`; [CI 36743901948](https://github.com/nghianthe153123/EnglishBot/actions/runs/36743901948) hoàn tất thành công trên baseline đó. Cập nhật ghi nhận CI chỉ là metadata tài liệu.
- P1-101 baseline `cfbc196`: docs-check 77 Markdown, formatter, secret scan 124 file, 16 test tooling và diff-check đạt; nguồn Wirefigma khớp hash, 432 ca clamp số học đạt. [CI 36748996409](https://github.com/nghianthe153123/EnglishBot/actions/runs/36748996409) hoàn tất thành công. Owner duyệt UX sau baseline này; ảnh/UI runtime chưa có và không bị báo là đã đạt.

## Quyết định owner đã chốt

1. Google dịch nghĩa + AI BYOK bổ sung từ loại/ví dụ cho từ; Google dịch cụm/câu không cần AI. AI mode vẫn dịch selection bằng AI. Cache đầy đủ reuse không gọi provider lại.
2. N do người dùng cấu hình, không có mặc định; chưa cấu hình thì không tạo batch.
3. Nếu chưa dùng được tích hợp chính thức, khảo sát tự động thao tác giao diện Quizlet trong trình duyệt đã đăng nhập. ADR-008 cho phép khảo sát, chưa chứng minh PoC production.
4. Bật extension trên tab hiện tại; ghi nhớ quyền riêng từng website là tùy chọn (D-P1-11).
5. Gate P1-101 là spec/số học và duyệt UX; P1-103 visual/keyboard trên mock; P1-105 quyền/interaction thật; P1-109 E2E/release. Bộ UX P1-101 được duyệt ngày 2026-10-01, mockup/hợp đồng P1-103 cần lượt duyệt riêng.

Ngoài Phase 1: capture toàn trang, Chat/Q&A, dashboard, MCP server, TTS/word family, scheduler/mastery và bài học nội bộ. Lịch 26 tuần/Phase 2–7 cũ là lịch sử, chưa có lịch mở rộng mới.

## Cổng kỹ thuật còn lại

| Nội dung                                      | Trạng thái                                | Gói xử lý           |
| --------------------------------------------- | ----------------------------------------- | ------------------- |
| UX popup/options/queue và quyền site          | Đặc tả đã duyệt; chưa review UI chạy thật | P1-103/105          |
| AI vendor/model, auth/deploy, key lifecycle   | Chưa khóa chi tiết                        | P1-103/104, ADR-007 |
| Contract/cache sense/dedupe/schema            | Mô hình đề xuất, chưa migration           | P1-103/104          |
| Quizlet channel/account/create/reconciliation | Cần spike và bằng chứng trước production  | P1-102/108          |
| E2E, UAT và release                           | Chưa thực hiện                            | P1-109              |

N/enrichment không còn là câu hỏi sản phẩm chưa được trả lời. Việc kênh Quizlet chưa được kiểm chứng không cho phép hạ mục tiêu tự tạo thành copy/export thủ công.

## Lịch sử cổng

| Cổng                  | Kết quả                                  | Ngày       | Bằng chứng                               |
| --------------------- | ---------------------------------------- | ---------- | ---------------------------------------- |
| Phase 0               | Hoàn tất                                 | 2026-09-29 | closeout/CI 36452278392                  |
| P1-001 baseline cũ    | Hoàn tất, phạm vi đã bị thay thế         | 2026-09-29 | package lịch sử/abc5d36                  |
| P1-R01 cổng tài liệu  | Đã xác minh                              | 2026-09-30 | báo cáo P1-R01 và lệnh kiểm tra          |
| P1-101 UX/đặc tả      | Hoàn tất, owner duyệt; runtime chưa chạy | 2026-10-01 | P1-101 owner-review/evidence; CI cfbc196 |
| Phase 1 tính năng mới | Chưa hoàn tất                            | —          | chờ P1-101..109                          |
