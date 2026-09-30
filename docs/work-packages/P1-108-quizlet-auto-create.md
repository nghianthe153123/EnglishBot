# P1-108: Tự tạo Quizlet set qua kênh đã xác minh và được chấp nhận

- Trạng thái: BỊ_CHẶN — kênh đang `CHƯA_CHỐT`; P1-102 chưa chứng minh khả năng; cần quyết định owner/ADR và phụ thuộc P1-107.
- Phase: 1
- Module/bề mặt sở hữu: tích hợp Quizlet/backend
- Mức rủi ro: Cao
- Phụ thuộc: P1-102 có kết luận khả thi; owner chấp nhận kênh (có thể gồm browser automation nếu được duyệt); P1-107; ADR identity/secret
- ID yêu cầu: P1-QZ-03, P1-QZ-04, P1-SEC-02

## Mục tiêu

Tự tạo Quizlet set trên đúng tài khoản người dùng từ batch snapshot qua kênh đã xác minh và được owner chấp nhận.

## Bối cảnh

Import web/connector Claude không đồng nghĩa EnglishBot có API được phép gọi. Khảo sát P1-102 kiểm tra kênh chính thức trước; nếu không dùng được, có thể khảo sát browser automation trong browser Quizlet đã đăng nhập. Owner cho phép khảo sát này nhưng chưa xác nhận PoC hoặc production. Cần bằng chứng khả thi, quyết định owner/ADR và xử lý bảo mật trước triển khai. Copy/export thủ công không đạt AC. Chỉ khẳng định tạo set/cards, không nói đã tạo Learn lesson riêng.

## Trong phạm vi

- Hợp đồng channel/auth/account ownership và thao tác tạo set.
- Idempotency key gắn với batch snapshot bất biến.
- Xử lý timeout, quota, mất đăng nhập, sai tài khoản, unavailable và outcome unknown; dừng retry tự động nếu unknown.
- Đối soát trước retry và bằng chứng URL/ID.
- Kiểm thử trực tiếp có nhãn riêng trên tài khoản thử nghiệm được phép.

## Ngoài phạm vi

- Dùng kênh/API riêng hoặc browser automation production trước quyết định/ADR rõ ràng.
- Bài học nội bộ, scheduler, MCP hoặc coi copy thủ công là hoàn tất.

## Hợp đồng và invariant

- Chỉ thao tác đúng user/account; không lộ credential.
- Chỉ báo tạo set thành công khi nhận và liên kết bằng chứng remote URL/ID.
- Timeout sau thao tác tạo chuyển sang UNKNOWN; không retry tự động, phải đối soát trước.
- Idempotency theo batch ổn định để tránh tạo set trùng.

## Tiêu chí nghiệm thu

- [ ] AC1: Có quyết định owner chấp nhận kênh và ADR/review bảo mật trước code production; kênh chưa duyệt vẫn là blocker.
- [ ] AC2: Test account chứng minh set được tạo dưới đúng tài khoản và ghi nhận URL/ID.
- [ ] AC3: Sai tài khoản/mất đăng nhập/unavailable thất bại an toàn và có cách khôi phục.
- [ ] AC4: Timeout sau tạo vào trạng thái UNKNOWN, tắt retry tự động và yêu cầu đối soát trước retry thủ công.
- [ ] AC5: Gửi lại cùng batch idempotent, không thể tạo set trùng.
- [ ] AC6: Fake CI xác định; live test có nhãn, không có secret trong Git/CI mặc định; không khẳng định Learn lesson.

## Kế hoạch kiểm thử

### Tự động

- [ ] Fake connector contract test cho success/failure/timeout/sai tài khoản, idempotency và đối soát.
- [ ] Security test credential redaction, user/account isolation và replay.

### Thủ công/trực quan/model thật

- [ ] E2E trên tài khoản thử nghiệm được phép; ghi URL/ID đã che thông tin nhạy cảm, loại provider/tài khoản, thời điểm và kết quả.

### Lệnh bắt buộc

```text
./mvnw --batch-mode --no-transfer-progress verify
pnpm run test
pnpm run secrets:scan
```

Live test chạy riêng, có nhãn và không dùng secret của CI mặc định.

## Ghi chú triển khai

- Dự kiến: adapter tích hợp qua public application interface; chọn module/file sau review kiến trúc.
- Cờ tính năng: tắt mặc định; sau khi khảo sát và được duyệt có thể bật cho test cohort trong gate P1-108 để chạy live test. Phát hành chung chờ P1-109.

## Rủi ro và rollback

- Rủi ro cao: set ngoài hệ thống bị trùng, sai tài khoản, kênh không hỗ trợ hoặc lộ credential.
- Rollback: tắt cờ tích hợp và dừng gửi mới; giữ outcome unknown để đối soát; không tự xóa set của người dùng.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ implementation.
- Bằng chứng thủ công: đang bị chặn chờ quyết định kênh.
- Báo cáo/ảnh: cần URL/ID set đã che thông tin nhạy cảm.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: liên kết tài khoản ngoài và xử lý credential, mức rủi ro cao.
- Database migration: có thể cần lưu outcome/idempotency; tuân chính sách migration tiến tới.
- Giới hạn đã biết: kênh vẫn `CHƯA_CHỐT`; cho phép khảo sát browser automation không đồng nghĩa PoC đạt hay production được duyệt.
- Gói tiếp theo: P1-109 sau khi có bằng chứng P1-108.
