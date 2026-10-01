# P1-103: Prototype mô phỏng và hợp đồng request/result/state

- Trạng thái: CẦN_CHỈNH_SỬA — đã kết thúc 3 vòng thực thi/kiểm thử/review ngày 2026-10-01. AC1–4 đạt phạm vi mock; AC5 chờ owner, AC6 còn thiếu zoom trình duyệt thật 125%/200% và owner duyệt mock. Dừng tự động sửa code, không mở vòng 4; cần quyết định của chủ dự án cho bước còn lại.
- Phase: 1
- Module/bề mặt sở hữu: hợp đồng extension/API
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-101, sau khi owner duyệt scope
- ID yêu cầu: P1-TR-02, P1-TR-04, P1-TR-05, P1-WD-02, P1-WD-03, P1-QZ-02, P1-QZ-04, P1-SEC-02

## Mục tiêu

Tạo prototype mô phỏng xác định và hợp đồng có thể review cho dịch selection, cache/Add từ, batch text và kết quả Quizlet trước khi làm DB/triển khai.

## Bối cảnh

Mock/hợp đồng là gate trước DB theo P1-R01. Không thiết kế API cho Chat/capture/dashboard/MCP. Theo owner: khi chọn Google, phrase/sentence chỉ gọi Google Translation, không gọi AI; khi chọn AI, phrase/sentence được dịch qua AI provider đã chọn nhưng không Add/enrich thành từ; Google word gọi AI BYOK để bổ sung POS/example; N do user cấu hình, không có mặc định và chưa cấu hình thì không tạo batch. Kênh Quizlet vẫn chờ khảo sát/quyết định triển khai.

## Trong phạm vi

- Request/result/error/state cho Google Translation và AI BYOK; chọn provider rõ ràng; lỗi key/quota/timeout/response sai cấu trúc.
- Word so với phrase/sentence; trường POS/definition/example đã validate và provenance/version; chiều khóa cache gồm language/provider/sense.
- Queue item/idempotency Add; text import term TAB definition; trạng thái batch sent/unsent/unknown; response tạo Quizlet gồm URL/ID.
- Fixture/fake xác định tại ranh giới provider; schema/hợp đồng cho ca âm tính.
- Theo D-P1-14 owner duyệt từ P1-101: prototype UI mock popup/Options/queue theo UX được owner duyệt, kèm screenshot và keyboard/focus/zoom review; không tích hợp provider/Quizlet production.

## Ngoài phạm vi

- Tích hợp provider/Quizlet production, schema/migration.
- Tự chọn model/provider cụ thể, auth/deployment hoặc kênh Quizlet production.

## Hợp đồng và invariant

- Không fallback ngầm; hợp đồng UI biểu đạt không gọi mạng trước click.
- Phrase/sentence không thể Add; output từ không hợp lệ không được persist.
- Outcome tạo set không rõ không được retry tự động; định danh snapshot/idempotency phải rõ.
- Theo ADR được duyệt, API secret chỉ nhận vào, không trả lại hoặc ghi log.

## Tiêu chí nghiệm thu

- [x] AC1: Hợp đồng request-result/error Google/AI kiểm tra được fixture hợp lệ và không hợp lệ.
- [x] AC2: Hợp đồng word và phrase/sentence ngăn Add phrase; POS/example sai cấu trúc không được chấp nhận âm thầm.
- [x] AC3: Định danh cache/provenance tách biệt với trạng thái Add trong mock và hợp đồng.
- [x] AC4: Batch snapshot, quy tắc TAB/newline, trạng thái Quizlet unavailable/unknown và định danh đối soát được nêu rõ.
- [ ] AC5: Owner duyệt hợp đồng trước P1-104; trường chưa quyết định ghi `CHƯA_CHỐT`.
- [ ] AC6: Popup/Options/queue mock có ảnh và bằng chứng review 320/360/420 CSS px, cả nền trang sáng/tối, mép viewport/nội dung dài, keyboard/focus/Escape, zoom/reflow theo [checklist P1-101](../design/p1-101-review-checklist.md) UAT-101-09…17. Owner duyệt mock riêng; không dùng test số học/screenshot Wirefigma dashboard thay UI EnglishBot.

## Kế hoạch kiểm thử

### Tự động

- [x] Test schema/hợp đồng, fixture provider xác định, lỗi và idempotency; reviewer vòng 3 chạy 173 test/7 file đạt.
- [x] Xác nhận fixture và dữ liệu serialize phía client không chứa credential live; contract từ chối secret fields, mock không nhận key thật, QA không có external request.

### Thủ công/trực quan/model thật

- [ ] Owner walkthrough hợp đồng; không cần gọi provider thật.
- [ ] Review visual/keyboard của mock xác định theo AC6: browser QA tự động đã đạt viewport/keyboard/focus/contrast/reflow; còn zoom browser thật 125%/200% và owner duyệt mock. [Bằng chứng](../evidence/P1-103-implementation-review.md) lưu ảnh/Chrome/version/cases. Fake permission không thay test browser quyền thực P1-105.

### Lệnh bắt buộc

```text
pnpm run test
pnpm run docs:check
```

## Ghi chú triển khai

- Chủ dự án đã duyệt UX P1-101 và yêu cầu bắt đầu P1-103 ngày 2026-10-01. [Kế hoạch điều phối](../ai-prompts/P1-103-orchestration.md) phân chia file, hợp đồng nháp, kiểm thử và tối đa 3 vòng thực thi/kiểm thử/review. Hai lane trong cùng gói được phép dùng file độc lập; hợp đồng phải được root khóa bản nháp trước khi consumer dùng. Root giữ selection/geometry/race/queue và review nâng cao. Mockup và hợp đồng mới vẫn cần owner duyệt ở AC5/AC6.

- Owner chốt ngày 2026-10-01: một mục liền có apostrophe/hyphen bên trong là word, nhiều token là phrase; chỉ gửi selection, dùng nghĩa độc lập thông dụng và ví dụ bám nghĩa trả về; lưu/thay N không đánh giá batch, chỉ lần Add mới thành công kế tiếp đánh giá queue chưa gán batch, các batch đã tạo giữ nguyên. Chi tiết và fixture bắt buộc ở kế hoạch điều phối; model/auth/kênh Quizlet vẫn `CHƯA_CHỐT`.

- Đã triển khai: `apps/extension` host review local, `packages/api-contracts` và `packages/mock-fixtures`; workspace exports/build wrapper theo ADR-009. [Hợp đồng nháp/walkthrough](../design/p1-103-contract-review.md) chưa là API production đã duyệt.
- Cờ tính năng: tích hợp production giữ tắt tới cổng phát hành; P1-108 có thể bật riêng cho nhóm thử nghiệm sau khi được duyệt.

## Rủi ro và rollback

- Rủi ro: hợp đồng đóng băng lựa chọn chưa được owner duyệt hoặc phụ thuộc quá mức một provider.
- Rollback: version hóa bản nháp, quay về scope gần nhất đã duyệt; không đổi hợp đồng consumer âm thầm.

## Bằng chứng

- Build/commit: build primary và checkout sạch có cùng artifact `index-BWyYoBck.js`/`index-D2aiA4mf.css`; commit chưa tạo tại thời điểm review cuối.
- Kết quả test tự động: reviewer chạy `rtk pnpm run test` 173 test/7 file PASS; `rtk pnpm run lint` và `rtk proxy git diff --check` PASS. Root quality/frozen install/clean build/dev smoke PASS; docs-check81 Markdown, secrets scan179 files và cached whitespace PASS. Exact commands và giới hạn ở [báo cáo](../evidence/P1-103-implementation-review.md).
- Bằng chứng runtime: [browser JSON](../evidence/P1-103/browser-results.json) Chrome 154.0.8037.59 PASS 46 checks, 0 external requests/page errors; ảnh thật đã được root và reviewer xem. Chưa có actual zoom125%/200% hoặc owner approval.
- Báo cáo/ảnh: [implementation review](../evidence/P1-103-implementation-review.md), [contract/walkthrough](../design/p1-103-contract-review.md).
- Điều phối/model/vòng lặp: [P1-103-orchestration](../ai-prompts/P1-103-orchestration.md); vòng 1/2 cần sửa, vòng 3 không còn blocker mock AC1–4 nhưng chưa qua AC5/AC6. Planner/reviewer GPT 6.1/high, hai lane GPT 6 luna/medium; metadata model/effort root chưa xác minh.

## Báo cáo hoàn thành

- File đã thay đổi: source/contracts/fixtures/build/test/QA và tài liệu P1-103 được liệt kê trong [báo cáo](../evidence/P1-103-implementation-review.md); file người dùng AGENTS/playbook được giữ ngoài thay đổi gói.
- Kết quả tiêu chí nghiệm thu: AC1–4 đạt phạm vi mock; AC5 CHỜ_OWNER; AC6 CHƯA_QUA_CỔNG. Đây là bàn giao review, không báo cáo gói hoàn tất.
- Tác động bảo mật/quyền riêng tư: selection-only và render text an toàn; không provider/DB/Quizlet production, secret thật hoặc quyền browser thật.
- Database migration: không.
- Giới hạn đã biết: actual zoom125%/200% và owner duyệt còn thiếu; auth/cache multi-owner/model/schema/kênh Quizlet production chưa chốt. Không còn lỗi kỹ thuật mock AC1–4 được reviewer phát hiện ở vòng 3.
- Bước tiếp theo: owner/người kiểm thử được chỉ định xác minh zoom và owner duyệt hợp đồng/mock; sau quyết định và cổng mới mở P1-104. Không tiếp tục tự sửa hoặc cập nhật STATUS khi cổng còn thiếu.
