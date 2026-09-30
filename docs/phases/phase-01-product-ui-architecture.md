# Phase 1 — Dịch selection, từ vựng và Quizlet

- Trạng thái: kế hoạch đã qua cổng điều chỉnh tài liệu P1-R01 (2026-09-30); chưa có tính năng mới nào được tuyên bố hoàn tất.
- Work packages: P1-101..P1-109.
- Ước lượng: 16–27 ngày làm việc tuần tự, gồm triển khai, kiểm thử và owner review; không phải cam kết và không gán ngày lịch.
- Thực thi: một package tại một thời điểm. P1-102 khảo sát khả thi Quizlet có thể chạy sớm để tìm vướng mắc.
- Cổng sản phẩm: owner review phạm vi/UX → mock + review hợp đồng → DB/BYOK → triển khai module → E2E/UAT/phát hành.

## Mục tiêu

Bàn giao extension có thể dịch selection qua Google Cloud Translation hoặc AI bằng API key người dùng; selection chỉ cho hành động local cho tới khi người dùng click Dịch, mở popup nhỏ cạnh pointer. Khi chọn Google, phrase/sentence chỉ gọi Google Translation, không gọi AI; khi chọn AI, phrase/sentence được dịch qua AI provider đã chọn nhưng không Add/enrich thành từ. Google word gọi AI BYOK bổ sung POS/example. Từ đã hoàn chỉnh được lưu DB và tái sử dụng; cache đầy đủ không gọi lại provider. Add là hành động riêng vào queue. N do user cấu hình, không có giá trị mặc định; unset thì không tạo batch. Khi đạt N từ hợp lệ đã Add, tạo text import và tự tạo bộ thẻ trong Quizlet của người dùng.

Tự tạo Quizlet là yêu cầu bắt buộc, không được tính đạt bằng thao tác copy/export thủ công. Kênh, account ownership, set creation, auth, retry và reconcile phải được xác minh trước integration. Không khẳng định tạo Learn lesson riêng.

## Trong và ngoài phạm vi

Trong phạm vi: popup/options/queue cần thiết theo Wirefigma; selection/action; Google/AI adapter; DB persistence/reuse; Add; threshold/batch; tự tạo Quizlet qua kênh được duyệt; E2E, quyền riêng tư/bảo mật, trực quan/khả năng tiếp cận và UAT.

Ngoài phạm vi: capture/crawl toàn trang, Chat/Q&A/citation, dashboard, MCP server, TTS, word family, scheduler/mastery, bài học nội bộ. P0 và package P1-001..007 cũ được giữ lịch sử; không đổi ID hay dùng làm bằng chứng hoàn tất tính năng mới. Phase 2–7 cũ bị thay thế/hoãn và không có lịch mở rộng mới.

## Các package và dependency

### Phân công AI theo độ khó

Root/senior giữ quyết định phạm vi, contract/schema, auth/BYOK, migration, chống trùng/concurrency và outcome tạo Quizlet chưa rõ. Sub-agent model/effort thấp hơn làm tài liệu, copy UI, fixture xác định và component cô lập sau khi hợp đồng được khóa; root review trước merge. Không giao toàn bộ P1-104 hoặc P1-108 cho model thấp mà thiếu review chuyên sâu.

Trong gói lớn, thực thi các bước nhỏ tuần tự: P1-104 tách owner/auth → word persistence/migration → credential lifecycle; P1-105 tách selection/permission → popup/state → provider adapter; P1-108 tách account/permission → import/create → đối soát/retry. Mỗi bước có test và diff riêng, không đồng thời thay schema, secret và tích hợp bên ngoài trong một phiên khó review.

| ID     | Nội dung                       | Dependency/status                                     |
| ------ | ------------------------------ | ----------------------------------------------------- |
| P1-101 | Phạm vi/UX theo Wirefigma      | Có thể chuẩn bị; cần owner duyệt                      |
| P1-102 | Khảo sát khả thi Quizlet       | Có thể chạy sớm; không code tích hợp trước quyết định |
| P1-103 | Prototype mô phỏng và hợp đồng | P1-101; owner review                                  |
| P1-104 | DB/migration/auth/BYOK         | P1-103 + ADR/quyết định bảo mật-dữ liệu               |
| P1-105 | Selection/popup/provider dịch  | P1-103/104 + thiết kế permission                      |
| P1-106 | Enrichment/cache/reuse/Add     | P1-104/105; Google word dùng AI BYOK cho POS/example  |
| P1-107 | Ngưỡng N/batch/import          | P1-106; N do user cấu hình, không có giá trị mặc định |
| P1-108 | Tự tạo Quizlet set             | P1-102 khả thi, P1-107 và owner/ADR duyệt kênh        |
| P1-109 | E2E/UAT/phát hành              | P1-101..108; không đạt nếu thiếu auto-create          |

P1-102 có thể chạy sớm song song với chuẩn bị tài liệu nếu không sửa cùng hợp đồng. Các gói còn lại thực hiện từng lượt một gói. Ước lượng effort và bằng chứng chi tiết ở [WBS](../09-work-breakdown.md) và các work package P1-101..109.

## Gate

### Gate 1 — Scope và UX

- Phạm vi nhất quán với baseline sản phẩm/UX mới; popup chỉ sau click, phrase chỉ dịch, nguồn/checksum Wirefigma được xác minh.
- Permission story mô tả đúng: bôi đen không tự cấp `activeTab`/content-script permission.
- Owner đã quyết định N và enrichment: N do user cấu hình, không có giá trị mặc định; khi chọn Google, phrase/sentence không gọi AI; khi chọn AI, phrase/sentence dịch qua provider đó; Google word gọi AI BYOK bổ sung POS/example. Kênh Quizlet vẫn `CHƯA_CHỐT` tới khi P1-102 và ADR/owner review hoàn tất.

### Gate 2 — Prototype/mock và contract

- Request/result/state, provider selection, error/recovery, queue/batch và Quizlet outcome contract có mock xác định.
- Fake provider tại boundary; no silent fallback; contract test đạt.

### Gate 3 — DB/BYOK

- Schema/migration được owner duyệt; migration DB rỗng/nâng cấp, cô lập user, validation POS/example và trạng thái cache/reuse/Add có test đạt.
- BYOK/key storage/log redaction theo ADR; không lưu secret ở extension.

### Gate 4 — Implementation và release

- Selection, provider, persistence, Add, batch và Quizlet auto-create đạt traceability.
- E2E word→translate→DB reuse→Add→threshold→auto-create; phrase→translate only.
- Fresh install, permission denied/grant/revoke/restricted pages, restart/service worker; Chrome rồi Edge.
- Visual/a11y ở 320/360/420 px, keyboard/focus/contrast; security/privacy negative tests.
- Quizlet test account đúng owner; chỉ success khi có set URL/ID; timeout-unknown dừng retry tự động và reconcile trước lần thử sau.
- Owner UAT/release review có báo cáo và bằng chứng đã che thông tin nhạy cảm.

Danh mục test đầy đủ ở [chiến lược kiểm thử](../06-testing-strategy.md); requirement mapping tại [traceability](../10-traceability.md). Nếu kênh Quizlet chưa được chứng minh/duyệt, P1-108 và Phase 1 chưa đạt đầy đủ. Không cập nhật STATUS trong gói rebaseline tài liệu này; chỉ root cập nhật sau gate.

## Lịch sử

Tài liệu này thay thế kế hoạch Phase 1 cũ ngày 2026-09-30. Phase 1 cũ là phạm vi tài liệu/design kéo theo Phase 2–7; những mô tả, gói và thời lượng đó vẫn có thể xem trong các package lịch sử và git history, nhưng không phải baseline thực thi hiện hành. P1-001 từng HOÀN_TẤT trên scope cũ; P1-002 từng ĐANG_LÀM; P1-003 từng ĐANG_REVIEW. Trạng thái lịch sử không được chuyển thành “feature mới hoàn tất”.
