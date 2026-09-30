# Cấu trúc phân rã công việc

## Quy tắc

- Đây là backlog đã lập kế hoạch, không tự cấp quyền thực thi. Chỉ bắt đầu gói `SẴN_SÀNG` khi dependency, gate và quyết định cần thiết đã đạt.
- Giữ ID ổn định; các gói P1-001..007 cũ là lịch sử, không tái sử dụng ID.
- Mỗi thời điểm chỉ một gói được thực thi. Tài liệu/test độc lập có thể chạy song song sau khi hợp đồng liên quan được duyệt.
- Mỗi package ghi AC, test/bằng chứng, cờ phát hành, rollback và báo cáo. Không tuyên bố tính năng hoàn tất nếu chưa có bằng chứng.

## Phase 0 — Nền tảng (lịch sử giữ nguyên)

| ID     | Gói công việc                               | Phụ thuộc | Bằng chứng                 |
| ------ | ------------------------------------------- | --------- | -------------------------- |
| P0-001 | Review và phê duyệt charter/phạm vi/roadmap | —         | Hồ sơ quyết định           |
| P0-002 | Khóa ADR repository/build                   | P0-001    | ADR/kế hoạch scaffold      |
| P0-003 | Môi trường, secret và CI                    | P0-002    | Ma trận môi trường/cổng CI |
| P0-004 | Dry run workflow AI                         | P0-001    | Package mẫu                |

## Phase 1 — Đường thực thi mới theo P1-R01 (2026-09-30)

Ước lượng tuần tự 16–27 ngày làm việc, gồm triển khai, kiểm thử và owner review; đây không phải cam kết lịch. P1-102 có thể khảo sát sớm.

| ID     | Gói                             | Phụ thuộc                                           | Ngày | Trạng thái/điều kiện                                               | Bằng chứng chính                                        |
| ------ | ------------------------------- | --------------------------------------------------- | ---: | ------------------------------------------------------------------ | ------------------------------------------------------- |
| P1-101 | Phạm vi/UX theo Wirefigma       | Phase 0                                             |  1–2 | NHÁP; được chuẩn bị theo scope mới                                 | Owner duyệt phạm vi, trạng thái UX                      |
| P1-102 | Khảo sát khả thi Quizlet        | P1-R01; có thể khảo sát sớm                         |  1–3 | NHÁP; chỉ khảo sát, không code tích hợp                            | Báo cáo kênh/xác thực/set/lỗi/retry                     |
| P1-103 | Prototype mô phỏng và hợp đồng  | P1-101                                              |  2–3 | NHÁP; cần owner review hợp đồng                                    | Luồng mock + test request/result/state                  |
| P1-104 | DB, migration, auth/BYOK        | P1-103 + ADR/owner decisions                        |  2–3 | NHÁP; triển khai sau khi hợp đồng và quyết định bảo mật được duyệt | Test migration rỗng/nâng cấp, cô lập user, secret       |
| P1-105 | Selection/popup/provider dịch   | P1-103, P1-104; thiết kế permission                 |  3–4 | NHÁP                                                               | Test unit/contract/browser                              |
| P1-106 | Enrichment từ, cache/reuse, Add | P1-104, P1-105                                      |  2–3 | NHÁP; theo owner dùng AI BYOK bổ sung POS/example cho word         | Test domain/cache/Add idempotency                       |
| P1-107 | Ngưỡng N, batch snapshot/import | P1-106                                              |  1–2 | NHÁP; N do user cấu hình, không có mặc định                        | Test unset/invalid/configured, biên/đồng thời/định dạng |
| P1-108 | Tự tạo Quizlet set              | P1-102 khả thi và owner chấp nhận kênh; P1-107; ADR |  2–4 | BỊ_CHẶN: kênh `CHƯA_CHỐT`, chưa có phê duyệt production            | Đối soát/idempotency/test account có nhãn               |
| P1-109 | E2E, UAT, cổng phát hành        | P1-101..108                                         |  2–3 | NHÁP; chỉ đóng khi scope bắt buộc đạt                              | E2E Chrome/Edge, trực quan/bảo mật/UAT                  |

Chi tiết: [P1-101](work-packages/P1-101-scope-wirefigma-ux.md), [P1-102](work-packages/P1-102-quizlet-feasibility.md), [P1-103](work-packages/P1-103-mock-contracts.md), [P1-104](work-packages/P1-104-db-byok.md), [P1-105](work-packages/P1-105-selection-translation.md), [P1-106](work-packages/P1-106-word-cache-add.md), [P1-107](work-packages/P1-107-threshold-import-batch.md), [P1-108](work-packages/P1-108-quizlet-auto-create.md), [P1-109](work-packages/P1-109-e2e-uat-release.md).

## Phase 1 — Các gói P1-001..007 (lịch sử đã bị thay thế)

| ID     | Gói lịch sử                            | Trạng thái trước phiên rebaseline                                | Nội dung mới thay thế                                               |
| ------ | -------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| P1-001 | Persona, hành trình, ưu tiên tính năng | HOÀN_TẤT; bằng chứng owner/CI lịch sử được giữ trong hồ sơ       | Baseline bị P1-R01 thay thế; không chứng minh tính năng mới tồn tại |
| P1-002 | IA, extension, selection popup         | ĐANG_LÀM                                                         | Thay bằng P1-101/P1-105                                             |
| P1-003 | Dashboard và tích hợp                  | ĐANG_REVIEW; bằng chứng review được bảo toàn trong hồ sơ lịch sử | Dashboard/MCP hoãn; câu hỏi Quizlet chuyển P1-102/108               |
| P1-004 | Nền tảng thiết kế/khả năng tiếp cận    | ĐANG_REVIEW; bằng chứng review được bảo toàn trong hồ sơ lịch sử | Wirefigma thuộc P1-101/109; không dùng ảnh visual cũ làm baseline   |
| P1-005 | Thiết kế runtime/module                | NHÁP                                                             | Quyết định BYOK/API liên quan chuyển P1-103/104                     |
| P1-006 | Mô hình đe dọa                         | NHÁP                                                             | Rủi ro selection/BYOK/batch/Quizlet kiểm tra trong P1-104..109      |
| P1-007 | Danh mục hợp đồng                      | NHÁP                                                             | Thay bằng hợp đồng P1-103                                           |

Các package lịch sử giữ ID, trạng thái/bằng chứng có liên quan và ngày tháng. Phần kế hoạch cũ không còn là backlog hiện hành.

## Phase 2+ — Backlog lịch sử, đang hoãn

Phase 2 thiết kế mock chạy được; Phase 3 API/database; Phase 4 capture/AI; Phase 5A capture/Q&A; Phase 5B dịch/từ vựng/TTS; Phase 5C scheduler/bài học nội bộ; Phase 6 MCP/Quizlet; Phase 7 gia cố/beta từng nằm trong roadmap 26 tuần cũ. Roadmap này đã bị thay thế; đây chỉ là tham chiếu lịch sử, không phải công việc được duyệt hoặc lên lịch. Không lập lịch mở rộng Phase 2+ cho tới khi owner duyệt scope mới. Phase 1 hiện hành loại trừ capture toàn trang, Chat/Q&A, dashboard, MCP, TTS, word family, scheduler/mastery và bài học nội bộ.

## Phase 0 và bảo toàn ID

Giữ nguyên ID P0-001..004, trạng thái hoàn thành Phase 0 và bằng chứng. Không tái sử dụng P1-001..007 cho công việc khác; công việc mới dùng P1-101..109.
