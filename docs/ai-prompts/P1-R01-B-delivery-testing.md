# Prompt điều phối — Lane B: roadmap, gói thực thi và testing

## Cấu hình phiên

- Model: `gpt-6-luna`; reasoning effort: `low`.
- Repository: `D:\EnglishBot`.
- Gói duy nhất: `docs/work-packages/P1-R01-scope-rebaseline.md`.
- Vai trò: lập lại lịch thực thi Phase 1 và kiểm thử; root review/tích hợp.

## Thứ tự đọc

Đọc AGENTS, `C:\Users\tuannghia\.codex\RTK.md`, README, STATUS, playbook, P1-R01, prompt lane A để dùng đúng ID requirement. Đọc đầy đủ các file được quyền sửa bên dưới và `docs/templates/work-package.md`; các quyết định chưa trả lời giữ CHƯA_CHỐT. Shell prefix `rtk`, chỉnh sửa bằng `apply_patch`.

## Quyền sửa độc quyền

- `docs/05-delivery-roadmap.md`
- `docs/06-testing-strategy.md`
- `docs/09-work-breakdown.md`
- `docs/10-traceability.md`
- `docs/phases/README.md`
- `docs/phases/phase-01-product-ui-architecture.md`
- `docs/work-packages/P1-001-product-scope-journeys.md` đến `P1-007-contract-inventory.md` (ghi lịch sử/bị thay thế; giữ ID và bằng chứng lịch sử).
- Tạo `docs/work-packages/P1-101-scope-wirefigma-ux.md`, `P1-102-quizlet-feasibility.md`, `P1-103-mock-contracts.md`, `P1-104-db-byok.md`, `P1-105-selection-translation.md`, `P1-106-word-cache-add.md`, `P1-107-threshold-import-batch.md`, `P1-108-quizlet-auto-create.md`, `P1-109-e2e-uat-release.md`.

Không sửa STATUS, nguồn sản phẩm/UX của lane A, ADR/architecture/data/security của root hoặc file P0. Không commit/push. Không format toàn repo khi lane khác đang sửa.

## Đường cơ sở và lịch

### Cập nhật sau câu trả lời trong cùng phiên

Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ; Google dịch cụm/câu không cần AI; AI mode vẫn dịch mọi selection bằng AI; cache đầy đủ không gọi provider. N do người dùng cấu hình, không có mặc định, chưa cấu hình không tạo batch. Owner cho phép khảo sát thao tác giao diện Quizlet trong trình duyệt đã đăng nhập nếu channel chính thức chưa dùng được (ADR-008); chưa có kết quả PoC. Root đã gửi cập nhật này và yêu cầu lane B đồng bộ.

Phạm vi Phase 1 theo P1-R01: Google/AI BYOK dịch selection, popup sau click cạnh pointer, word có POS/nghĩa/ví dụ lưu DB và reuse, Add, N, text import tự tạo và tự tạo bộ thẻ Quizlet. Cụm/câu chỉ dịch. Không Chat/capture/dashboard/MCP/TTS/family/scheduler/internal lessons trong Phase 1. Tất cả implementation, testing và release nhỏ này đều nằm trong Phase 1; không tiếp tục để dịch ở Phase 5B hoặc DB ở Phase 3 cũ.

Giữ thứ tự owner yêu cầu: scope/UI → prototype mock/contract → DB → triển khai module → E2E/UAT. Spike Quizlet có thể thực hiện sớm để phát hiện blocker, không tự code tích hợp trước quyết định. P1-101..109 và thời lượng dùng đúng P1-R01 (16–27 ngày làm việc tuần tự, không phải cam kết; lịch ghi cả implementation + test + owner review). Tách thời gian review chủ dự án khỏi runtime AI; nêu giả định năng lực là ước lượng. Không gán ngày lịch giả. Chỉ mở một gói tại một thời điểm, tài liệu/test độc lập có thể song song sau hợp đồng đã duyệt.

P1-101 được phép chuẩn bị theo scope mới. Gói có dependency/chưa chốt giữ NHÁP hoặc BỊ_CHẶN đúng lý do; không gắn HOÀN_TẤT cho feature chưa tồn tại. Các package cũ giữ dấu lịch sử; P1-001 từng hoàn tất nhưng baseline bị thay thế. Không dùng lại ID cũ cho tính năng mới.

## Gate và khả thi

- Google Translation không trả POS/example: gói 106 dùng AI BYOK bổ sung theo lựa chọn owner; UI phải minh bạch Google + AI cho từ, không bịa giá trị.
- N cấu hình không mặc định; QZ01 chỉ tính từ đã Add hợp lệ/duy nhất/chưa batch, không tính lookup hay duplicate Add. Chưa cấu hình không chạy batch.
- Quizlet import web và connector Claude có nguồn chính thức; chưa xác minh EnglishBot gọi được. Gói 102 kiểm tra channel chính thức rồi khảo sát UI automation được owner cho phép. Phải chứng minh auth/account ownership, set creation, lỗi/retry và khả năng chạy từ extension/backend. Nếu channel không khả dụng, 108 chưa mở; 109 không đạt đầy đủ chỉ vì copy/export được.
- Dừng automatic retries ở outcome unknown, đối soát trước retry; batch snapshot và idempotency chống tạo set trùng.
- activeTab cần thao tác kích hoạt extension; bôi đen không tự cấp quyền content script. Kiểm thử fresh install, chưa quyền, cấp/thu hồi quyền, restricted page.

## Testing phải đủ nhưng nằm đúng phạm vi

Mỗi gói mới có AC rõ/requirement ID, dependency, file/module dự kiến, test và bằng chứng, rollback/feature flag, checklist report. Dùng fake provider tại ranh giới, deterministic LLM fixture trong CI; live Google/AI/Quizlet kiểm thử có nhãn riêng trên test account, không secret trong Git/CI mặc định.

Ma trận testing gồm:

1. Selection: single word/phrase/sentence, punctuation/apostrophe/hyphen/multiline, empty, selection đổi trong khi request đang chạy, close popup, near viewport edge, zoom, keyboard, XSS/untrusted selection, không gọi mạng trước click.
2. Providers: Google/AI request/result, timeout/quota/invalid key, malformed AI/POS/example, không fallback ngầm; Google phrase không dùng AI; Google từ cần AI enrichment trừ cache đầy đủ; cache hit không gọi lại.
3. DB: POS/nghĩa/ví dụ persist trước và sau restart; từ nhiều nghĩa/provider/language không ghi đè sai; user isolation; lookup cache không tự Add; migration empty/upgrade; không secret/plaintext trong log.
4. Add/batch: double click, concurrency, N−1/N/N+1, nhiều batch, duplicate/retry, N chưa cấu hình/sai/được cấu hình/thay đổi khi queue có dữ liệu; snapshot immutable, delimiter/newline/unicode, delete/cancel và trạng thái chưa gửi/unknown.
5. Quizlet: đúng tài khoản, mất đăng nhập/quyền/CAPTCHA/DOM đổi/tab đóng/worker suspend, account mismatch, unknown timeout sau create, idempotency/reconcile; chỉ thành công khi có set URL/ID và bằng chứng; không khẳng định tạo Learn lesson riêng.
6. E2E: word→translate→DB reuse→Add→threshold→auto create set; phrase→translate only; Google word enrichment theo decision; browser restart/service-worker suspension; Chrome rồi Edge.
7. UI visual: popup/options/queue theo Wirefigma tại 320/360/420, keyboard/focus/contrast, không có dashboard/Chat baseline.

Roadmap Phase 2+ cũ đưa vào mục lịch sử/phạm vi hoãn; chưa được lên lịch mở rộng. Traceability chỉ dùng requirement P1 mới cho đường thực thi mới, lịch sử ID cũ liên kết riêng. Báo cáo root file thay đổi, AC/test mapping, assumptions và blocker; root chạy checks cuối.
