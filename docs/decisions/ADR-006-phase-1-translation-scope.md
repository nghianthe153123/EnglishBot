# ADR-006 — Phase 1 dịch selection và tạo bộ thẻ Quizlet

- Trạng thái: Chấp nhận
- Ngày: 2026-09-30
- Thẩm quyền: chủ dự án yêu cầu thu hẹp Phase 1 trong phiên điều chỉnh P1-R01.

## Bối cảnh

Baseline trước đã đưa Chat/quét trang, side panel ba tab, dashboard, MCP và learning engine vào chuỗi thiết kế. Chủ dự án xác nhận Phase 1 chỉ cần extension dịch selection, lưu dữ liệu từ, Add và tự tạo bộ thẻ Quizlet; sử dụng Wirefigma từ `C:\SystemDesign` thay mockup cũ.

## Quyết định đã được chỉ đạo

1. Hai lựa chọn dịch: Google API chính thức hoặc AI qua API key của người dùng.
2. Bôi đen hiện action local; click Dịch mới mở popup nhỏ cạnh con trỏ và gửi request.
3. Từ đơn có từ loại, nghĩa, câu ví dụ; lưu DB để dùng lại. Quyết định này chốt việc lưu ví dụ trước đó để mở.
4. Add riêng cho từ; đủ N từ hợp lệ/duy nhất đã Add thì tự tạo text import và tự tạo bộ thẻ Quizlet đúng tài khoản. Người dùng cấu hình N, không có giá trị mặc định; chưa cấu hình thì không tự tạo batch.
5. Cụm/câu chỉ dịch. Chat/capture/dashboard/MCP/TTS/word family/internal lessons/scheduler/mastery HOÃN khỏi Phase 1.
6. Phase 1 gồm thiết kế, mock, contract, DB, implementation module và testing/bàn giao của phạm vi nhỏ này. P0 đã hoàn tất vẫn giữ nguyên lịch sử.
7. Hủy baseline mockup Trang sách/Sổ tay/side panel cũ. Wirefigma là nguồn design foundation, không tự coi dashboard sample là màn hình EnglishBot đã duyệt.

## Quyết định bổ sung và cổng kỹ thuật còn lại

- Chủ dự án đã chốt N do người dùng cấu hình, không đặt mặc định.
- Chủ dự án đã chốt Google dịch nghĩa + AI BYOK bổ sung POS/example cho từ. Google dịch cụm/câu không cần AI; AI mode vẫn dùng AI để dịch cụm/câu. Cache từ đầy đủ có thể reuse mà không gọi provider.
- AI provider/model và vòng đời BYOK/auth/deploy phải qua gói liên quan.
- Tự tạo Quizlet là mục tiêu bắt buộc; kênh dùng từ EnglishBot chưa được chứng minh. Không hạ AC xuống copy/export thủ công và không khẳng định không có bất kỳ tích hợp Quizlet nào.
- Chủ dự án đã cho phép khảo sát browser automation trong trình duyệt Quizlet đã đăng nhập nếu kênh chính thức không dùng được. ADR-008 ghi phạm vi khảo sát; triển khai còn cần spike chứng minh kênh và cổng production liên quan.

## Quan hệ với quyết định trước

- Thay thế phạm vi hiện hành của D-005/101/102/103/104/311 và kế hoạch 26 tuần D-010 đối với Phase 1; giữ nguyên các nguyên tắc Java/React/monorepo/mock-first/module boundary.
- ADR-004: phần “manual import đủ cho beta” không còn đáp ứng mục tiêu Phase 1 mới. Ràng buộc chưa bật write Quizlet khi chưa kiểm chứng channel vẫn áp dụng. Quyết định channel mới phải cập nhật ADR-004 và AGENTS tương ứng.
- ADR-003: tối thiểu dữ liệu/explicit action vẫn áp dụng; full capture/share grant hiện HOÃN.
- Không tái dùng ID P1-001..007; các gói mới P1-101..109 có ID riêng.

## Hệ quả và cổng

Roadmap nhỏ hơn, nhưng Quizlet trở thành điều kiện kết thúc Phase 1. Spike P1-102 chạy sớm; thất bại hoặc chưa chứng minh kênh thì 108 bị chặn, không báo hoàn tất Phase 1. UI, contract và DB vẫn được kiểm tra/duyệt theo thứ tự trước production.

Ngày 2026-10-01, owner phê duyệt [đặc tả UX P1-101](../design/p1-101-owner-review.md) (D-P1-15). P1-103 đủ điều kiện làm prototype/mock và hợp đồng theo D-P1-14; mockup/hợp đồng cần owner duyệt riêng trước P1-104. Quyết định này không phê duyệt model/auth/schema, kênh Quizlet production hoặc coi runtime test đã đạt.
