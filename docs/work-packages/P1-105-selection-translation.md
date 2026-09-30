# P1-105: Selection, popup hành động và translation adapter

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: browser extension/ứng dụng dịch
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-101 được duyệt UX; P1-103 hợp đồng; P1-104 persistence/provider boundary; thiết kế permission
- ID yêu cầu: P1-TR-01..05, P1-UI-01, P1-SEC-01, P1-SEC-03

## Mục tiêu

Cho phép người dùng chủ động dịch selection trong popup nhỏ cạnh con trỏ qua provider đã chọn, với permission và xử lý lỗi rõ ràng.

## Bối cảnh

Bôi đen chỉ hiện hành động local; click Dịch mới mở popup/gửi request. Không được mặc định quyền Chrome/Edge. Selection là đầu vào không đáng tin cậy; không đọc toàn trang/cookies/session.

## Trong phạm vi

- Thu selection tối thiểu và xử lý click; định vị/clamp popup, đóng, focus/bàn phím.
- Định tuyến word với phrase/sentence; Google Cloud Translation/AI BYOK adapter theo hợp đồng duyệt.
- Lỗi key/quota/network/timeout/provider; provider phải chọn rõ, không fallback ngầm.
- Khi chọn Google, phrase/sentence không cần AI key; Google word thiếu key hiển thị đang chờ enrichment/credential và không bịa nội dung.
- Cài mới, chưa có quyền, cấp/thu hồi quyền, trang bị hạn chế.
- D-P1-11 đã chốt bật tab hiện tại, tùy chọn ghi nhớ từng site không bật sẵn. Thực hiện [ma trận PERM-01…12](../design/p1-101-permissions-and-layout.md); chưa cấp không inject, selection không cấp activeTab, revoke dừng listener/UI/request mới và kết quả muộn không ghi đè.

## Ngoài phạm vi

- Enrichment/Add từ (P1-106), queue/Quizlet create (P1-107/108), whole-page capture, Chat/dashboard/MCP/TTS.
- Tự cấp quyền, truy cập cookie/session hoặc quét toàn trang.

## Hợp đồng và invariant

- Không request mạng trước click rõ ràng.
- Phrase/sentence chỉ dịch; không Add.
- Không render selection như HTML; lỗi có thể khôi phục và truy cập được.
- Không fallback provider ngầm; không lưu credential trong extension/log client.

## Tiêu chí nghiệm thu

- [ ] AC1: Word/phrase/sentence đi đúng hợp đồng; phrase/sentence không thể Add.
- [ ] AC2: Hành động local không gây side effect mạng; popup chỉ mở sau click cạnh con trỏ và luôn trong viewport.
- [ ] AC3: Đóng/focus/bàn phím và viewport 320/360/420 px đạt UX đã duyệt.
- [ ] AC4: Timeout/quota/key sai/response lỗi có trạng thái rõ, khôi phục được và không fallback ngầm.
- [ ] AC5: Khi chọn Google, phrase/sentence dịch được mà không có AI key; khi chọn AI, phrase/sentence được dịch qua AI provider đã chọn và không có Add/enrichment từ.
- [ ] AC6: Google word thiếu key báo chờ enrichment, không tạo POS/example giả; cache đầy đủ không gọi provider.
- [ ] AC7: Test permission bao gồm cài mới/chưa cấp/cấp/thu hồi/trang hạn chế trên Chrome và Edge.
- AC7 nhận gate runtime từ P1-101 theo D-P1-14: ghi từng PERM-01…12 là đạt/không hỗ trợ theo phạm vi đã duyệt/không đạt, browser/version và evidence; include activation tab, opt-in site, deny/revoke, reload/cross-origin, frame/restricted. Không coi mock permission P1-103 là bằng chứng thật.
- [ ] AC8: Test XSS/selection không tin cậy đạt; không crawl trang hoặc truy cập cookie/session.

## Kế hoạch kiểm thử

### Tự động

- [ ] Unit/component, adapter contract với fake xác định, assertion không mạng trước click, negative test XSS/permission.

### Thủ công/trực quan/model thật

- [ ] Review trực quan/keyboard/focus 320/360/420 px; Chrome trước rồi Edge.
- [ ] Test Google/AI thật có nhãn riêng trên cấu hình/tài khoản thử nghiệm, không dùng secret CI.
- [ ] Test phrase ở cả Google mode (không cần AI key) và AI mode; test word thiếu AI key và trạng thái enrichment chờ credential.

### Lệnh bắt buộc

```text
pnpm run test
pnpm run build
```

## Ghi chú triển khai

- Dự kiến: selection/overlay extension và module dịch; chọn file sau khảo sát repo.
- Cờ tính năng: cấu hình provider và cờ release cho phép test cohort sau khi được duyệt; tắt được khi gặp vấn đề permission/provider.

## Rủi ro và rollback

- Rủi ro: permission trình duyệt không cung cấp selection nếu thiếu luồng kích hoạt được hỗ trợ.
- Rollback: tắt action/provider call; giữ UI local với trạng thái không hỗ trợ rõ ràng.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chưa chạy.
- Bằng chứng thủ công: chờ ma trận browser/visual.
- Báo cáo/ảnh: chờ bằng chứng package.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: ranh giới selection, permission và XSS.
- Database migration: không.
- Giới hạn đã biết: cần chứng minh khả năng permission trên browser.
- Gói tiếp theo: P1-106.
