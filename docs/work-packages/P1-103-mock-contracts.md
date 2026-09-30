# P1-103: Prototype mô phỏng và hợp đồng request/result/state

- Trạng thái: NHÁP
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

- [ ] AC1: Hợp đồng request-result/error Google/AI kiểm tra được fixture hợp lệ và không hợp lệ.
- [ ] AC2: Hợp đồng word và phrase/sentence ngăn Add phrase; POS/example sai cấu trúc không được chấp nhận âm thầm.
- [ ] AC3: Định danh cache/provenance tách biệt với trạng thái Add trong mock và hợp đồng.
- [ ] AC4: Batch snapshot, quy tắc TAB/newline, trạng thái Quizlet unavailable/unknown và định danh đối soát được nêu rõ.
- [ ] AC5: Owner duyệt hợp đồng trước P1-104; trường chưa quyết định ghi `CHƯA_CHỐT`.
- [ ] AC6: Popup/Options/queue mock có ảnh và bằng chứng review 320/360/420 CSS px, cả nền trang sáng/tối, mép viewport/nội dung dài, keyboard/focus/Escape, zoom/reflow theo [checklist P1-101](../design/p1-101-review-checklist.md) UAT-101-09…17. Owner duyệt mock riêng; không dùng test số học/screenshot Wirefigma dashboard thay UI EnglishBot.

## Kế hoạch kiểm thử

### Tự động

- [ ] Test schema/hợp đồng, fixture provider xác định, lỗi và idempotency.
- [ ] Xác nhận fixture và dữ liệu serialize phía client không chứa credential live.

### Thủ công/trực quan/model thật

- [ ] Owner walkthrough hợp đồng; không cần gọi provider thật.
- [ ] Review visual/keyboard của mock xác định theo AC6; lưu ảnh, viewport/browser/version và kết quả từng ca. Fake permission không thay test browser quyền thực P1-105.

### Lệnh bắt buộc

```text
pnpm run test
pnpm run docs:check
```

## Ghi chú triển khai

- Dự kiến: module hợp đồng/mô phỏng và fixture; chọn file sau khi khảo sát repo.
- Cờ tính năng: tích hợp production giữ tắt tới cổng phát hành; P1-108 có thể bật riêng cho nhóm thử nghiệm sau khi được duyệt.

## Rủi ro và rollback

- Rủi ro: hợp đồng đóng băng lựa chọn chưa được owner duyệt hoặc phụ thuộc quá mức một provider.
- Rollback: version hóa bản nháp, quay về scope gần nhất đã duyệt; không đổi hợp đồng consumer âm thầm.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ implementation.
- Bằng chứng thủ công: chờ owner review.
- Báo cáo/ảnh: cần bản so sánh hợp đồng và biên bản review.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: có xét ranh giới BYOK và selection.
- Database migration: không.
- Giới hạn đã biết: kênh Quizlet, model cụ thể và auth/deployment còn chờ quyết định.
- Gói tiếp theo: P1-104 sau review.
