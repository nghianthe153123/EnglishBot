# P1-102: Khảo sát khả thi kênh tự tạo Quizlet

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: tích hợp và khảo sát khả thi
- Mức rủi ro: Cao
- Phụ thuộc: P1-R01; có thể khảo sát sớm, không phụ thuộc hoàn tất P1-101
- ID yêu cầu: P1-QZ-03, P1-QZ-04, P1-SEC-02

## Mục tiêu

Xác minh bằng tài liệu và thử nghiệm được ủy quyền liệu EnglishBot có thể tạo set Quizlet trên đúng tài khoản người dùng qua một kênh khả dụng, được owner chấp nhận.

## Bối cảnh

Quizlet có tài liệu về nhập liệu web và connector Claude, nhưng chưa xác minh EnglishBot có thể gọi chúng. Tự tạo set là yêu cầu; copy/export thủ công không đạt. Khảo sát chỉ phát hiện blocker, không tự cấp quyền triển khai tích hợp.

## Trong phạm vi

- Xác định API/connector/luồng browser được phép, điều khoản/quyền, xác thực, chủ tài khoản và khả năng khởi chạy từ extension/backend.
- Xác minh tạo set, nhận URL/ID, lỗi/quota/mất đăng nhập, timeout sau tạo, retry/đối soát và idempotency.
- Thử trên test account được phép; lưu bằng chứng đã loại thông tin nhạy cảm và kết luận khả năng.
- Trước tiên khảo sát kênh chính thức; nếu không dùng được, khảo sát browser automation trong browser Quizlet đã đăng nhập theo cho phép của owner. Khảo sát không đồng nghĩa PoC đạt hoặc production được duyệt; cần ADR trước triển khai.

## Ngoài phạm vi

- Ghi dữ liệu lên tài khoản production bên ngoài; dùng private endpoint không được hỗ trợ. UI automation trong test browser Quizlet đã đăng nhập được ADR-008 cho phép khảo sát/PoC; không được xem là phê duyệt ghi dữ liệu production.
- Khẳng định đã tạo Learn lesson riêng; kết quả là set/cards trừ khi có bằng chứng khác.

## Hợp đồng và invariant

- Không để lộ credential; sai tài khoản thì không báo thành công.
- Timeout/outcome không rõ phải dừng retry tự động cho tới khi đối soát.
- Chỉ báo thành công khi có bằng chứng URL/ID của set.

## Tiêu chí nghiệm thu

- [ ] AC1: Báo cáo dẫn nguồn sơ cấp về kênh, quyền/điều khoản, chủ tài khoản và khả năng tạo set.
- [ ] AC2: Thử nghiệm test account chứng minh hoặc phủ định việc tạo set, ghi nhận URL/ID nếu có.
- [ ] AC3: Lỗi, mất đăng nhập, timeout sau tạo, đối soát/idempotency được mô tả và kiểm chứng ở mức khả thi.
- [ ] AC4: Trước hết khảo sát kênh chính thức. Nếu không dùng được, khảo sát/PoC UI automation trong test browser Quizlet đã đăng nhập theo ADR-008; quyền khảo sát không đồng nghĩa PoC đạt hay production được duyệt.
- [ ] AC5: Kết luận `FEASIBLE` hoặc `BLOCKED`, nêu điều kiện tiên quyết/quyết định owner; copy/export không được tính thành công.
- [ ] AC6: Không có secret trong Git/log/bằng chứng; không triển khai tích hợp production.

## Kế hoạch kiểm thử

### Tự động

- [ ] Nếu tạo probe, chỉ dùng cho test, không commit credential; kiểm thử hợp đồng outcome/idempotency bằng fake.

### Thủ công/trực quan/model thật

- [ ] Review tài liệu chính thức; thử live trên test account có nhãn riêng nếu được phép.
- [ ] Ghi các bước, ngày, loại tài khoản (không ghi PII), kết quả và URL/ID đã che thông tin nhạy cảm.

### Lệnh bắt buộc

```text
pnpm run docs:check
```

Ghi lệnh/probe live trong bằng chứng riêng; không đưa secret vào command history.

## Ghi chú triển khai

- Dự kiến: báo cáo khả thi và bằng chứng; không có code production.
- Cờ tính năng: không áp dụng cho khảo sát; P1-108 có cờ/cohort riêng sau phê duyệt.

## Rủi ro và rollback

- Rủi ro: kênh không được EnglishBot hỗ trợ/cho phép hoặc không chứng minh được chủ tài khoản.
- Rollback: dừng trước khi tạo dữ liệu ngoài test account; nếu kết luận `BLOCKED`, giữ P1-108 và gate release chưa đạt, không thay bằng export thủ công.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chưa chạy.
- Bằng chứng thủ công: chờ khảo sát/thử nghiệm.
- Báo cáo/ảnh: cần báo cáo đã loại thông tin nhạy cảm.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: đánh giá xác thực, chủ tài khoản và xử lý secret.
- Database migration: không.
- Giới hạn đã biết: kênh Quizlet đang `CHƯA_CHỐT`.
- Gói tiếp theo: P1-108 chỉ sau khi khả thi và được owner duyệt.
