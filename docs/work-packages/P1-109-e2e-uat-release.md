# P1-109: E2E, UAT và cổng phát hành

- Trạng thái: NHÁP — chưa bắt đầu cho tới khi dependency triển khai có bằng chứng.
- Phase: 1
- Module/bề mặt sở hữu: chất lượng/phát hành
- Mức rủi ro: Cao
- Phụ thuộc: P1-101..108; các quyết định owner bắt buộc đã được xử lý
- ID yêu cầu: P1-TR-01..05, P1-WD-01..03, P1-QZ-01..04, P1-UI-01, P1-SEC-01..03

## Mục tiêu

Chứng minh luồng Phase 1 bằng test CI xác định, E2E đa browser, review bảo mật/quyền riêng tư, bằng chứng trực quan/khả năng tiếp cận và UAT owner trước phát hành chung.

## Bối cảnh

P1-109 là cổng phát hành, không hạ yêu cầu. Tự tạo Quizlet là bắt buộc; copy/export không đạt. N và enrichment đã được owner quyết định; cổng Quizlet chỉ chờ khả năng kênh và ADR/owner approval. Không cập nhật STATUS trước khi toàn cổng đóng và owner duyệt.

## Trong phạm vi

- Word → translate → persist/reuse DB → Add → ngưỡng N → tự tạo Quizlet.
- Phrase/sentence → chỉ translate, không Add.
- Lỗi provider/không fallback ngầm, cache, batch unknown/đối soát.
- Cài mới, thiếu/cấp/thu hồi quyền, trang hạn chế, browser restart/service-worker suspension.
- N unset/invalid/configured, N−1/N/N+1 và thay đổi N khi queue đã có dữ liệu.
- Nếu P1-102/P1-108 dùng browser automation: kiểm tra đăng nhập, CAPTCHA, UI thay đổi, mất tab, worker suspension và timeout/unknown sau khi gửi.
- Chrome trước rồi Edge; popup/options/queue ở 320/360/420 px; keyboard/focus/contrast.
- Review bảo mật/quyền riêng tư, UAT, bằng chứng phát hành/rollback và đối soát traceability.

## Ngoài phạm vi

- Dashboard, Chat/Q&A/capture, MCP, TTS, bài học/scheduler nội bộ, kênh Quizlet chưa duyệt.
- Đánh dấu release đạt khi chỉ có export thủ công hoặc bỏ qua test.

## Hợp đồng và invariant

- Không mạng trước click; phrase không Add; cache không tự Add.
- Không secret trong Git/CI/client/log; selection tối thiểu và không đáng tin cậy.
- Outcome tạo từ xa không rõ thì dừng retry tự động, phải đối soát.
- Thành công cần URL/ID set Quizlet của đúng tài khoản; không khẳng định Learn lesson.

## Tiêu chí nghiệm thu

- [ ] AC1: Toàn bộ package suite, migration và contract test tự động đạt với fake xác định.
- [ ] AC2: Luồng từ đầy đủ đạt; phrase/sentence chỉ dịch đạt.
- [ ] AC3: Ca browser đạt trên Chrome rồi Edge, gồm cài mới/permission/restart/suspension/trang hạn chế.
- [ ] AC4: Bằng chứng trực quan/accessibility gồm popup/options/queue ở 320/360/420 px, keyboard/focus/contrast.
- [ ] AC5: Test provider, DB isolation, output lỗi cấu trúc, secrets, XSS, đồng thời Add/batch, N unset/invalid/configured, N−1/N/N+1 và đổi N khi queue có dữ liệu đạt.
- [ ] AC6: Test account Quizlet được phép chứng minh tạo set đúng tài khoản có URL/ID; timeout unknown được đối soát và idempotency đạt.
- [ ] AC7: Owner UAT đạt; báo cáo package/traceability/security/privacy/rollback đầy đủ.
- [ ] AC8: Quyết định owner chưa chốt hoặc kênh unavailable được ghi blocker; không tuyên bố Phase 1 hoàn tất đầy đủ.

## Kế hoạch kiểm thử

### Tự động

- [ ] Chạy cổng chất lượng/docs/secrets/backend/frontend của repo theo scripts hiện có.
- [ ] Migration DB rỗng/nâng cấp, fake provider/Quizlet, E2E với fixture xác định.

### Thủ công/trực quan/model thật

- [ ] UAT Chrome rồi Edge, gồm vòng đời permission và restart/suspension.
- [ ] Review trực quan/accessibility ở 320/360/420 px.
- [ ] Kiểm thử trực tiếp Google/AI/Quizlet chỉ có nhãn riêng, tài khoản thử nghiệm, bằng chứng đã che thông tin nhạy cảm; không secret trong CI mặc định.
- [ ] Nếu dùng browser automation: ghi kết quả đăng nhập/CAPTCHA/UI thay đổi/mất tab/worker suspension/unknown sau khi gửi; không retry tự động trước đối soát.

### Lệnh bắt buộc

```text
pnpm run verify:all
```

Ghi các lệnh thành phần thực chạy/kết quả, phiên bản browser/build và nơi lưu artifact. Không báo test đã bỏ qua là đạt.

## Ghi chú triển khai

- Dự kiến: E2E fixture/browser test harness và báo cáo phát hành; khảo sát repo trước khi chọn file.
- Cờ tính năng: phát hành theo giai đoạn; test cohort có thể được bật tại gate P1-108 sau phê duyệt. Phát hành chung chỉ sau owner sign-off P1-109; có đường tắt ngay.

## Rủi ro và rollback

- Rủi ro: set ngoài hệ thống trùng/outcome unknown, lộ credential, browser không tương thích, quyết định owner bắt buộc chưa chốt.
- Rollback: tắt cờ provider/Quizlet, dừng thao tác ngoài hệ thống, giữ trạng thái đối soát; không xóa dữ liệu user hoặc set từ xa tự động.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ cổng.
- Bằng chứng thủ công: chờ UAT Chrome/Edge.
- Báo cáo/ảnh: cần bằng chứng visual/test/owner sign-off và URL/ID set.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: kiểm tra bề mặt rủi ro cao và thao tác tài khoản ngoài.
- Database migration: gồm migration reconcile nếu có.
- Giới hạn đã biết: N và enrichment đã được quyết định; kênh Quizlet còn chờ khảo sát/ADR/owner approval.
- Gói tiếp theo: không có trong Phase 1; phase mới cần scope được owner duyệt.
