# P1-101: Chốt phạm vi và UX theo Wirefigma

- Trạng thái: ĐANG_REVIEW
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
- [x] AC2: Đặc tả UX phân biệt word với phrase/sentence; chỉ word có Add và Add tách khỏi lookup. Chưa phải test UI runtime.
- [x] AC3: Đặc tả popup ở cạnh con trỏ, zoom, đóng, keyboard/focus cho viewport 320/360/420 px. Đã kiểm tra clamp số học, chưa kiểm tra UI runtime.
- [x] AC4: Ma trận quyền gồm cài mới/chưa cấp/cấp/thu hồi/trang hạn chế; không hàm ý selection tự cấp quyền. Owner chốt bật tab với tùy chọn ghi nhớ site; manifest/runtime chờ kiểm chứng.
- [x] AC5: Tài liệu tham chiếu Wirefigma có nguồn/checksum xác minh khớp; dashboard mẫu và mockup cũ không còn là baseline.
- [x] AC6: Đặc tả UI thể hiện N do user cấu hình, không mặc định; Google cụm/câu không AI; AI mode dùng AI; Google word + AI POS/example; Quizlet chờ khảo sát/quyết định. Chưa test implementation.

## Kế hoạch kiểm thử

### Tự động

- [x] Kiểm tra tài liệu/liên kết/formatter, checksum và đối chiếu mã requirement; kết quả trong báo cáo, chạy lại trên bản cuối trước lưu Git.

### Thủ công/trực quan/model thật

- [ ] Owner walkthrough đặc tả nhánh thành công/lỗi/không hỗ trợ, duyệt UX mới (AC1).
- [x] Root review tài liệu quyền, keyboard/focus và tính tương phản token; không phải test browser.
- Theo D-P1-14 owner duyệt ngày 2026-09-30: review ảnh/keyboard/zoom trên mock 320/360/420 ở P1-103; quyền/interaction thật ở P1-105; browser E2E/release ở P1-109. Test runtime chưa chạy, không bỏ hoặc tính pass. Không tạo mockup/code trong P1-101.

### Lệnh bắt buộc

```text
pnpm run docs:check
pnpm run format
```

Ghi lệnh thực sự đã chạy và bằng chứng; không tuyên bố test chưa thực hiện.

## Ghi chú triển khai

- Dự kiến: tài liệu UX/sản phẩm và liên kết Wirefigma; không viết code.
- Cờ tính năng: không áp dụng cho gói thiết kế.
- Ngày 2026-09-30: owner yêu cầu thực hiện P1-101. Điều kiện Phase 0/P1-R01 đã có; gói được chuyển NHÁP → SẴN_SÀNG → ĐANG_LÀM. Đây là quyền thực hiện, không phải duyệt trước thiết kế UX mới.
- Cho phép hai nhánh tài liệu song song trong duy nhất P1-101, sở hữu file độc lập; root lập kế hoạch, xử lý quyền và tích hợp/review. Chi tiết ở [kế hoạch điều phối](../ai-prompts/P1-101-orchestration.md).
- ĐANG_LÀM → ĐANG_REVIEW: agent A/B đã giao bản thảo; root review, sửa race/cache/mapping và tạo [hồ sơ owner](../design/p1-101-owner-review.md). Owner chốt riêng activation D-P1-11; toàn bộ UX mới chưa được coi là đã duyệt.
- Xung đột gate đã được owner giải quyết: D-P1-14 chấp nhận phân tầng visual/mock P1-103, quyền/interaction P1-105, E2E P1-109; đã cập nhật trách nhiệm trong gói phụ thuộc, không bắt đầu thực thi chúng. AC1 còn chờ duyệt bộ UX; STATUS chưa cập nhật vì gói chưa qua cổng kết thúc.

## Rủi ro và rollback

- Rủi ro: nhầm hành động UI selection với quyền đọc selection của trình duyệt.
- Rollback: trở về UX gần nhất đã owner duyệt; lựa chọn chưa chốt tiếp tục nằm trong danh sách quyết định.

## Bằng chứng

- Build: không áp dụng, chỉ tài liệu; commit sẽ nhận diện qua Git log của file gói sau khi lưu.
- Kết quả kiểm tra: [báo cáo](../evidence/P1-101-design-review.md); hash khớp, contrast số học, 432 ca clamp, docs 77 Markdown/formatter, 16 test tooling, secret scan 124 file và diff-check đạt. Không chạy hoặc claim test UI/feature thật.
- Bằng chứng thủ công: root review tài liệu/nguồn; chờ owner walkthrough và visual runtime.
- Báo cáo/ảnh: hồ sơ chữ và bảng số học có sẵn; không ảnh/mockup mới hoặc sử dụng screenshot dashboard mẫu.

## Báo cáo hoàn thành

- File đã thay đổi: UX/UI cấp cao, IA, wireframes, foundations, decision register, traceability; thêm quyền/layout, owner-review, checklist, bằng chứng và ba prompt/kế hoạch điều phối; cập nhật gói này. Danh sách cụ thể ở báo cáo và Git diff.
- Kết quả tiêu chí nghiệm thu: AC2…6 đạt mức đặc tả/review kỹ thuật; AC1 chờ owner. Kiểm tra UI thật còn chờ, không tuyên bố gói hoàn tất.
- Tác động bảo mật/quyền riêng tư: quyền tab/site tách khỏi quyền gửi selection; không secret client/log; không crawl/session/cookie; thu hồi không hứa xóa dữ liệu đã gửi. Không có dữ liệu tài khoản thật hoặc external write.
- Database migration: không.
- Giới hạn đã biết: duyệt bộ UX còn chờ; visual runtime có gói chịu trách nhiệm nhưng chưa chạy; Quizlet còn chờ khảo sát/phê duyệt; model/auth/schema/cache/sense không tự chốt ở gói này.
- Gói tiếp theo: P1-103 sau gate owner; P1-102 có thể spike sớm.
