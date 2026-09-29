# P1-002: Thiết kế IA, extension và selection popup

- Trạng thái: ĐANG_LÀM
- Phase: 1
- Module/bề mặt sở hữu: extension UX
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-001, cổng A
- ID yêu cầu: J1, J2, CAP-01..03, CHAT-01..04, SEL-01..04, D-102, D-110, D-111, D-112, PRIV-01..03, NFR-08, NFR-09

## Mục tiêu

Khóa cấu trúc thông tin, navigation, wireframe độ chi tiết thấp và catalog trạng thái cho side panel và selection popup.

## Trong phạm vi

- IA chung và ba tab `Chat`, `Từ vựng`, `Bài học`.
- Consent capture, scan, summary, Q&A streaming, citation và recapture.
- Selection popup dịch/phát âm/giải thích/lưu với phản hồi local tức thời.
- Empty/loading/error/offline/permission/expired/quota/unsupported states.
- Edge case nhiều dòng, viewport edge, zoom, dark page và navigation.

## Ngoài phạm vi

- High-fidelity visual, component React, browser API hoặc extraction logic.
- Contract/schema ổn định.

## Hợp đồng và invariant

- Không capture ngầm; quyền `activeTab` gắn với hành động người dùng.
- Nội dung trang là không đáng tin và không được render như HTML có thể thực thi.
- Câu trả lời không có bằng chứng phải từ chối rõ ràng.
- Mỗi action/state có ID để Phase 2 dùng mock fixture.

## Tiêu chí nghiệm thu

- [ ] AC1: Sitemap và navigation side panel không có đường cụt.
- [ ] AC2: J1/J2 có wireframe xuyên suốt và recovery path.
- [ ] AC3: Tất cả trạng thái bắt buộc trong UX baseline được ánh xạ vào màn hình.
- [ ] AC4: Citation, consent, retention, revoke/recapture được thể hiện rõ.
- [ ] AC5: Popup khả dụng ở 320/360/420 px và có keyboard/focus behavior mô tả.
- [ ] AC6: Chủ dự án duyệt thuật ngữ và thứ tự ưu tiên hành động.

## Kế hoạch kiểm thử

- [ ] Scenario walkthrough J1/J2 ở success/failure/unsupported.
- [ ] Coverage matrix screen → state → action → next state.
- [ ] Keyboard/focus/label/heading review ở mức wireframe.
- [ ] Privacy review cho consent và selection context.
- [ ] Docs-check và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/design/phase-1-information-architecture.md` và `docs/design/phase-1-extension-wireframes.md`.
- Không thêm dependency thiết kế hoặc code UI trong gói này.
- P1-001 và cổng A đã hoàn tất ngày 2026-09-29. Chủ dự án yêu cầu đi theo phase: bắt đầu bằng wireframe side panel đủ ba tab; không tạo high-fidelity visual hoặc component UI trong P1-002.
- High-fidelity mockup chỉ bắt đầu sau khi P1-002/P1-003 và design foundation/accessibility P1-004 đạt các cổng tương ứng; mockup trước đó sẽ dễ khóa sớm màu, typography và thành phần chưa được duyệt.
- Owner decision `RESOLVED-P1-002-01` (2026-09-29): tab Từ vựng chỉ hiển thị các mục đã lưu từ trang hiện tại; toàn thư viện nằm ở dashboard. UX baseline và IA đã phản ánh lựa chọn này.
- Kiểm tra tài liệu local ngày 2026-09-29: format, docs-check và secret scan đạt; CI từ xa đang chờ commit chứa wireframe.

## Rủi ro và rollback

- Rủi ro: quá tải side panel hoặc popup che nội dung trang.
- Rollback: quay về hierarchy đã duyệt gần nhất; phương án thử nghiệm để appendix, không ghi đè baseline.
