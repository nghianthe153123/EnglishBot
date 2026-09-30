# Báo cáo P1-R01 — Điều chỉnh phạm vi Phase 1

- Ngày: 2026-09-30.
- Phạm vi: tài liệu/kế hoạch, cấu hình formatter cho snapshot nguồn và gỡ visual cũ. Không code production, migration hoặc thao tác tài khoản Quizlet thật.
- Trạng thái kiểm tra: ĐÃ_XÁC_MINH cổng tài liệu; chưa tính tính năng production đã đạt.

## Kết quả điều tra và chỉnh sửa

| Baseline trước                                                   | Phạm vi sửa theo chủ dự án                                                             |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Side panel ba tab Chat/Từ vựng/Bài học, quét toàn trang/citation | Action local và popup nhỏ sau click Dịch; Chat/capture hoãn                            |
| Dashboard 6 route, MCP, scheduler/mastery/internal lessons       | Ngoài Phase 1; bài học Phase 1 là bộ thẻ Quizlet                                       |
| BYOK bị loại khỏi beta                                           | AI API key trong phạm vi; kỹ thuật key/auth/backend cần gate                           |
| POS/ví dụ persistence còn để mở                                  | POS/nghĩa/ví dụ phải lưu DB và reuse; Add vẫn riêng                                    |
| Chỉ Quizlet export/import thủ công                               | Tự tạo set vẫn bắt buộc; khảo sát channel và browser automation được phép; chưa có PoC |
| Roadmap 26 tuần, dịch tại Phase 5B                               | P1-101..109 nằm trong Phase 1, 16–27 ngày làm việc dự toán có testing/review           |
| Mockup Trang sách/Sổ tay và evidence dashboard                   | Gỡ baseline, dùng Wirefigma snapshot từ C:\SystemDesign                                |

## Quyết định owner trong phiên

1. Google dịch nghĩa; AI BYOK bổ sung từ loại/câu ví dụ cho từ. Google phrase không cần AI; AI mode vẫn dịch phrase bằng AI; cache đầy đủ reuse không gọi lại.
2. Người dùng cấu hình N, không mặc định. N chưa cấu hình/không hợp lệ thì không tạo batch.
3. Khảo sát tự động thao tác Quizlet trong browser đã đăng nhập nếu official channel chưa dùng được. Chỉ cho phép khảo sát, không tự khẳng định production capability.

Đã phản ánh tại ADR-006/008, decision register, PRD, architecture/data, roadmap/testing và các package.

## Điều phối thực tế

| Lane            | Model / effort        | Prompt đã lưu                                          | Đầu ra                                                                     |
| --------------- | --------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Sản phẩm/UX     | gpt-6-luna / low      | [Prompt A](../ai-prompts/P1-R01-A-product-ux.md)       | 9 file phạm vi/UX/design/README; cập nhật theo owner answer và root review |
| Roadmap/testing | gpt-6-luna / low      | [Prompt B](../ai-prompts/P1-R01-B-delivery-testing.md) | Roadmap/WBS/trace/tests, package lịch sử và 9 package mới                  |
| Root            | Phiên điều phối chính | [P1-R01](../work-packages/P1-R01-scope-rebaseline.md)  | ADR/DB/architecture/privacy/khả thi, review/cổng/status                    |

Root review đã sửa: bỏ click Dịch lần hai; Add/Đã thêm là hai state cùng một nút; Google mode từ vẫn cần AI key khi cache thiếu; phrase theo provider đã chọn; không nhầm “cho phép khảo sát” với “đã qua PoC”.

## File và artifact

Các file thay đổi thuộc README/AGENTS, tài liệu 00–12, design/product/phases, ADR/register, prompt, work packages, evidence và .prettierignore. Snapshot nguồn Wirefigma + hash nằm tại [SOURCE](../design/reference/SOURCE.md). C:\SystemDesign không bị thay đổi. Package P0 và code scaffold không thay đổi.

Gỡ 8 file mockup HTML/ảnh QA khỏi đường dẫn hiện hành; bản phục hồi cục bộ nằm tại `C:\Users\tuannghia\.codex\visualizations\2026\09\28\01a0e7f4-8cf3-7083-9a35-09a64f2de4e6\retired-2026-09-30`. Xóa 6 PNG/SVG dashboard khỏi repository; có thể khôi phục từ Git trước P1-R01. Không tạo mockup mới trong gói này.

## Tiêu chí nghiệm thu và lệnh

| Tiêu chí | Kết quả | Bằng chứng                                                                                                     |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| AC1      | Đạt     | Baseline mới xuyên PRD/UX/architecture/DB/roadmap; ID và quyết định cũ được lưu lịch sử                        |
| AC2      | Đạt     | Hai provider, action/popup sau click, word/text, persistence/reuse/Add/N/Quizlet đều có requirement và package |
| AC3      | Đạt     | Khảo sát provider dẫn tài liệu Google/Quizlet chính thức; channel production chưa có PoC được ghi rõ           |
| AC4      | Đạt     | Wirefigma snapshot/hash; 8 file local được gỡ, 6 visual repo được xóa                                          |
| AC5      | Đạt     | 9 work package có AC/test/dependency/rollout; bảng ngày công triển khai và testing/review tổng 16–27           |
| AC6      | Đạt     | Hai sub-agent gpt-6-luna/low đã thực sự làm việc theo prompt; root đối soát và xử lý findings                  |
| AC7      | Đạt     | Các lệnh dưới đây thành công; status chỉ cập nhật sau cổng                                                     |

| Lệnh đã chạy                                            | Kết quả                                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| rtk pnpm exec prettier --write README.md AGENTS.md docs | Định dạng tài liệu; snapshot hai file nguồn được miễn formatter                                                       |
| rtk pnpm run format                                     | Đạt toàn repository                                                                                                   |
| rtk pnpm run docs:check                                 | Đạt 70 file Markdown                                                                                                  |
| rtk pnpm run secrets:scan                               | Đạt 117 file được track sau khi stage cả file mới/deletion                                                            |
| rtk proxy git diff --cached --check                     | Đạt, exit 0; lần đầu phát hiện 2 hard-break trailing spaces ở source Markdown, đã đổi sang backslash và cập nhật hash |
| rtk proxy certutil -hashfile ... SHA256                 | Đã ghi hash bản gốc/snapshot; HTML nguồn khớp byte hash                                                               |

Không chạy backend/frontend feature suite, E2E hoặc live Google/AI/Quizlet trong P1-R01: không có code production hay UI mới được triển khai. Trách nhiệm chạy các test đó nằm trong P1-103..109; không đánh dấu các feature test đó đạt. Không thêm test lặp lại cho thay đổi nội dung tài liệu.

## Giới hạn và công việc tiếp theo

Schema/contract/provider-model/auth/deployment chưa khóa. Quizlet có tài liệu import web và connector Claude nhưng EnglishBot auto-create chưa có PoC; P1-102 cần chứng minh channel/account/outcome/retry. Không có database migration, credential thật hoặc thay đổi dữ liệu bên ngoài. Các gói production giữ NHÁP/điều kiện phụ thuộc và chưa được tính hoàn tất.

Đề xuất quy tắc dùng lại nằm tại [rule proposals](../product/phase-1-rule-proposals.md), vẫn ĐỀ_XUẤT. Bước thực thi tiếp theo là P1-101 scope/UX theo Wirefigma và P1-102 spike sớm theo kế hoạch; không tự mở code production trong báo cáo này.

## Danh sách file trong diff bàn giao

A: thêm; M: sửa; D: xóa. Không có thay đổi file code ứng dụng/backend.

```text
M	.prettierignore
M	AGENTS.md
M	README.md
M	docs/00-project-charter.md
M	docs/01-product-requirements.md
M	docs/02-ux-ui-system.md
M	docs/03-system-architecture.md
M	docs/04-data-model.md
M	docs/05-delivery-roadmap.md
M	docs/06-testing-strategy.md
M	docs/07-ai-execution-playbook.md
M	docs/08-security-privacy.md
M	docs/09-work-breakdown.md
M	docs/10-traceability.md
M	docs/11-decisions-to-lock.md
M	docs/12-environments-and-secrets.md
A	docs/ai-prompts/P1-R01-A-product-ux.md
A	docs/ai-prompts/P1-R01-B-delivery-testing.md
M	docs/decisions/ADR-003-active-tab-explicit-share.md
M	docs/decisions/ADR-004-quizlet-import-first.md
A	docs/decisions/ADR-006-phase-1-translation-scope.md
A	docs/decisions/ADR-007-translation-byok-boundaries.md
A	docs/decisions/ADR-008-quizlet-browser-spike.md
M	docs/decisions/README.md
M	docs/design/phase-1-dashboard-and-integrations.md
M	docs/design/phase-1-design-foundations.md
M	docs/design/phase-1-extension-wireframes.md
M	docs/design/phase-1-information-architecture.md
A	docs/design/reference/SOURCE.md
A	docs/design/reference/WIREFIGMA_DESIGN_SYSTEM.md
A	docs/design/reference/wirefigma-sample.html
A	docs/evidence/P1-R01-rebaseline.md
D	docs/evidence/p1-003-integrations-1024.png
D	docs/evidence/p1-003-integrations-1024.svg
D	docs/evidence/p1-003-integrations-1440.png
D	docs/evidence/p1-003-integrations-1440.svg
D	docs/evidence/p1-003-integrations-390.png
D	docs/evidence/p1-003-integrations-390.svg
A	docs/history/2026-09-30-decisions-before-rebaseline.md
M	docs/phases/README.md
M	docs/phases/phase-01-product-ui-architecture.md
A	docs/product/phase-1-provider-feasibility.md
A	docs/product/phase-1-rule-proposals.md
M	docs/product/phase-1-scope-and-journeys.md
M	docs/status/STATUS.md
M	docs/work-packages/P1-001-product-scope-journeys.md
M	docs/work-packages/P1-002-extension-information-architecture.md
M	docs/work-packages/P1-003-dashboard-integration-flows.md
M	docs/work-packages/P1-004-design-accessibility-foundations.md
M	docs/work-packages/P1-005-runtime-module-design.md
M	docs/work-packages/P1-006-threat-model.md
M	docs/work-packages/P1-007-contract-inventory.md
A	docs/work-packages/P1-101-scope-wirefigma-ux.md
A	docs/work-packages/P1-102-quizlet-feasibility.md
A	docs/work-packages/P1-103-mock-contracts.md
A	docs/work-packages/P1-104-db-byok.md
A	docs/work-packages/P1-105-selection-translation.md
A	docs/work-packages/P1-106-word-cache-add.md
A	docs/work-packages/P1-107-threshold-import-batch.md
A	docs/work-packages/P1-108-quizlet-auto-create.md
A	docs/work-packages/P1-109-e2e-uat-release.md
A	docs/work-packages/P1-R01-scope-rebaseline.md
```
