# P1-101: Chốt phạm vi và UX theo Wirefigma

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: UX extension và phạm vi sản phẩm
- Mức rủi ro: Nâng cao
- Phụ thuộc: Phase 0; P1-R01
- ID yêu cầu: P1-TR-01, P1-TR-03, P1-TR-04, P1-UI-01, P1-SEC-01, P1-SEC-03

## Mục tiêu

Owner duyệt luồng tối thiểu selection → click Dịch → popup, options, hàng đợi Add và batch theo Wirefigma trước khi chốt mock và hợp đồng.

## Bối cảnh

P1-R01 thay thế baseline Phase 1 cũ ngày 2026-09-30. Owner đã chốt: khi chọn Google, phrase/sentence chỉ gọi Google Translation, không gọi AI; khi chọn AI, phrase/sentence dịch qua AI provider đã chọn; với Google word, AI BYOK bổ sung POS/example. N do user cấu hình, không có giá trị mặc định và nếu chưa cấu hình thì không tạo batch. Kênh Quizlet vẫn cần khảo sát và quyết định triển khai. Chỉ dùng Wirefigma cho giao diện cần thiết; không sao chép dashboard mẫu hoặc tạo mockup mới trong gói này.

## Trong phạm vi

- Xác minh nguồn/checksum Wirefigma do root đưa vào repository; chọn token, component, hành vi phù hợp cho popup/options/hàng đợi.
- Đặc tả selection chỉ hiện hành động local; click Dịch mới mở popup cạnh con trỏ, giới hạn trong viewport, hỗ trợ đóng/focus/bàn phím.
- Luồng word và phrase/sentence; tách Add khỏi lookup; cấu hình provider và cách kích hoạt quyền.
- Luồng cài mới, chưa có quyền, cấp/thu hồi quyền, trang bị hạn chế; giải thích rõ bôi đen không tự cấp activeTab/content-script permission.

## Ngoài phạm vi

- Code production/mockup, API/schema, dashboard/side panel, Chat/capture/MCP/TTS/word family.
- Tự chọn model/provider cụ thể ngoài quyết định AI BYOK; tự chốt kênh Quizlet production.

## Hợp đồng và invariant

- Không có mạng trước khi người dùng click rõ ràng; selection là đầu vào không đáng tin cậy.
- Phrase/sentence chỉ dịch, không Add.
- Không yêu cầu quyền hoặc quét trang khi không cần.

## Tiêu chí nghiệm thu

- [ ] AC1: Owner duyệt sơ đồ tương tác từ hành động local → click → popup → kết quả/lỗi/đóng.
- [ ] AC2: UX phân biệt word với phrase/sentence; chỉ word có Add và Add tách khỏi lookup.
- [ ] AC3: Đặc tả popup ở cạnh con trỏ, zoom, đóng, keyboard/focus cho viewport 320/360/420 px.
- [ ] AC4: Ma trận quyền gồm cài mới/chưa cấp/cấp/thu hồi/trang hạn chế; không hàm ý selection tự cấp quyền.
- [ ] AC5: Tài liệu tham chiếu Wirefigma có nguồn/checksum; dashboard mẫu và mockup cũ không còn là baseline.
- [ ] AC6: UI thể hiện N do user cấu hình, không mặc định; khi chọn Google, phrase/sentence không gọi AI; khi chọn AI, phrase/sentence dịch qua provider đó; Google word dùng AI BYOK bổ sung POS/example; kênh Quizlet chờ khảo sát/quyết định.

## Kế hoạch kiểm thử

### Tự động

- [ ] Kiểm tra tài liệu/liên kết/checksum nếu có script; đối chiếu mã requirement.

### Thủ công/trực quan/model thật

- [ ] Owner walkthrough nhánh thành công/lỗi/không hỗ trợ; review trực quan 320/360/420 px theo Wirefigma.
- [ ] Review quyền, keyboard/focus và tương phản.

### Lệnh bắt buộc

```text
pnpm run docs:check
pnpm run format
```

Ghi lệnh thực sự đã chạy và bằng chứng; không tuyên bố test chưa thực hiện.

## Ghi chú triển khai

- Dự kiến: tài liệu UX/sản phẩm và liên kết Wirefigma; không viết code.
- Cờ tính năng: không áp dụng cho gói thiết kế.

## Rủi ro và rollback

- Rủi ro: nhầm hành động UI selection với quyền đọc selection của trình duyệt.
- Rollback: trở về UX gần nhất đã owner duyệt; lựa chọn chưa chốt tiếp tục nằm trong danh sách quyết định.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ chạy.
- Bằng chứng thủ công: chờ owner walkthrough.
- Báo cáo/ảnh: chờ review; gói này không tạo mockup.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: UX ghi rõ giới hạn permission/selection.
- Database migration: không.
- Giới hạn đã biết: khả năng/kênh Quizlet còn chờ khảo sát và phê duyệt.
- Gói tiếp theo: P1-103 sau gate owner; P1-102 có thể spike sớm.
