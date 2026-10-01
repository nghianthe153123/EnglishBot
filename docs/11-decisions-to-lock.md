# Danh sách quyết định hiện hành

## Đường cơ sở và thẩm quyền

Ngày 2026-09-30 chủ dự án thay thế phạm vi Phase 1 bằng [ADR-006](decisions/ADR-006-phase-1-translation-scope.md). Quyết định cũ lưu tại [bản trước điều chỉnh](history/2026-09-30-decisions-before-rebaseline.md); không dùng bảng cũ như cổng triển khai hiện hành.

“CHẤP_NHẬN” là lựa chọn chủ dự án đã nêu. “CHƯA_CHỐT” không cho phép AI tự đặt mặc định. Ba lựa chọn N, enrichment và khảo sát Quizlet đã được owner trả lời trong cùng phiên. “CẦN_THỬ_NGHIỆM” là năng lực chưa có bằng chứng. Các giá trị kỹ thuật trong mô hình DB/API mới vẫn là đề xuất trước gói khóa tương ứng.

## Phase 1 hiện hành

| ID      | Quyết định                                                                                            | Trạng thái / nguồn                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| D-P1-01 | Chỉ selection translation, word DB/reuse, Add và tự tạo bộ thẻ Quizlet                                | CHẤP_NHẬN — yêu cầu owner 2026-09-30                                                                                            |
| D-P1-02 | Hai lựa chọn Google API chính thức và AI bằng API key người dùng                                      | CHẤP_NHẬN; AI vendor/model cụ thể chưa chọn                                                                                     |
| D-P1-03 | Bôi đen hiện action local; click mới mở popup nhỏ cạnh con trỏ và gọi dịch                            | CHẤP_NHẬN                                                                                                                       |
| D-P1-04 | Từ loại, nghĩa và câu ví dụ của từ phải lưu DB để dùng lại                                            | CHẤP_NHẬN; thay phần persistence để mở ở DEFERRED-P1-002-03                                                                     |
| D-P1-05 | Add riêng cho từ, đủ N thì tự tạo batch/text import                                                   | CHẤP_NHẬN: N do người dùng cấu hình, không mặc định; chưa cấu hình không tạo batch                                              |
| D-P1-06 | Tự import/tạo bộ thẻ Quizlet đúng tài khoản                                                           | CHẤP_NHẬN mục tiêu; CẦN_THỬ_NGHIỆM kênh ở P1-102                                                                                |
| D-P1-07 | Dùng Wirefigma tại C:\SystemDesign, hủy mockup cũ                                                     | CHẤP_NHẬN nguồn thiết kế; không phải duyệt UI mới                                                                               |
| D-P1-08 | AI vendor/model, auth/deploy, vòng đời/mã hóa BYOK                                                    | CHƯA_CHỐT; P1-103/104, ADR-007 đề xuất                                                                                          |
| D-P1-09 | Nguồn POS/example khi Google dịch từ                                                                  | CHẤP_NHẬN: Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ                                                                 |
| D-P1-10 | Kênh Quizlet: tích hợp chính thức dùng được hay khảo sát browser automation                           | CHẤP_NHẬN KHẢO SÁT: dùng browser đã đăng nhập nếu official channel chưa dùng được; production cần spike GO/ADR-008              |
| D-P1-11 | Bật trên tab hiện tại; tùy chọn ghi nhớ quyền riêng từng website                                      | CHẤP_NHẬN UX — owner trả lời P1-101 ngày 2026-09-30; manifest/runtime CẦN_THỬ_NGHIỆM ở P1-105; selection không tự cấp activeTab |
| D-P1-12 | Nghĩa/sense và ngữ cảnh câu ví dụ; cache key/dedupe/xóa đang xử lý                                    | CHƯA_CHỐT chi tiết contract ở P1-103, schema ở P1-104                                                                           |
| D-P1-13 | Bài học Phase 1 là bộ thẻ Quizlet, chưa hứa lesson/khóa Learn riêng                                   | Ánh xạ kế hoạch; xác minh với năng lực channel tại P1-102                                                                       |
| D-P1-14 | Phân tầng gate: P1-101 spec/số học; P1-103 mock visual/keyboard; P1-105 quyền/interaction; P1-109 E2E | CHẤP_NHẬN — owner trả lời P1-101 ngày 2026-09-30; mọi test vẫn bắt buộc, không phải miễn kiểm thử                               |

Owner đã trả lời cả ba câu hỏi trong P1-R01: N cấu hình không mặc định; Google + AI BYOK cho từ; khảo sát thao tác giao diện Quizlet. Đã đồng bộ PRD/roadmap/package/architecture; chưa suy ra PoC production đã đạt.

### D-P1-15 — Duyệt UX P1-101

- CHẤP_NHẬN ngày 2026-10-01: chủ dự án trả lời “ok tôi duyệt phần tiếp theo là thực thi P1-103 đúng ko”.
- Phê duyệt [hồ sơ UX P1-101](design/p1-101-owner-review.md): luồng, bố trí popup, focus/đóng, Options/queue, state catalog và token/component ở mức đặc tả.
- P1-101 HOÀN_TẤT cổng đặc tả; P1-103 SẴN_SÀNG, chưa thực thi. Mockup/hợp đồng P1-103 cần owner duyệt riêng. Không tự chốt model/auth/schema/Quizlet hoặc coi runtime test đã chạy; đề xuất rule chung vẫn chờ phê duyệt riêng.

## Quyết định nền tảng còn hiệu lực

### D-P1-16…18 — Quyết định trong P1-103 ngày 2026-10-01

- D-P1-16 CHẤP_NHẬN: một mục liền có dấu nháy/gạch nối bên trong vẫn là từ đơn; nhiều mục là cụm/câu.
- D-P1-17 CHẤP_NHẬN: chỉ gửi phần bôi đen, tra nghĩa phổ biến độc lập và AI soạn ví dụ theo nghĩa trả về. Không gửi surrounding context hoặc khẳng định nghĩa theo ngữ cảnh trang. Chốt phần nghĩa/ví dụ của D-P1-12; cache/dedupe/schema vẫn cần duyệt hợp đồng.
- D-P1-18 CHẤP_NHẬN: lưu/thay N không tạo batch ngay; chỉ Add mới thành công kế tiếp kiểm tra queue chưa gán batch. Không thay đổi snapshot đã tạo.
- Owner yêu cầu bắt đầu P1-103; xem [hồ sơ mock/hợp đồng](design/p1-103-contract-review.md). Chưa duyệt mock/hợp đồng mới và chưa mở P1-104.

Java 21/Spring Boot; React/TypeScript; monorepo; mock-first/contract-first; PostgreSQL/Flyway; modular monolith; public module interface; ownership/auth; không plaintext secret; không đọc cookie/session trang. D-001..004/006/009 và ADR-001/002/005 tiếp tục cho phạm vi nhỏ.

Redis, pgvector, SSE chat, object storage, MCP, TTS, scheduler và dashboard không phải dependency Phase 1. Chat/capture retention/share-grant decisions cũ HOÃN theo tính năng.

## Phần bị thay thế của baseline cũ

| Quyết định cũ                      | Hiệu lực hiện hành                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| D-005, D-101..104                  | Side panel/Chat/dashboard/art direction cũ bị thay thế bởi popup nhỏ + Wirefigma               |
| D-010                              | Kế hoạch 26 tuần cũ là lịch sử; phạm vi mới 16–27 ngày làm việc ước lượng có gate              |
| D-311                              | Không BYOK beta cũ bị thay thế; Phase 1 có AI BYOK                                             |
| D-008, ADR-004                     | Manual import không đủ AC mới; chặn external write khi channel chưa kiểm chứng vẫn áp dụng     |
| D-201..209, D-401..405, D-501..507 | Chỉ tái xét phần liên quan khi tính năng được mở lại; không tự triển khai trong Phase 1        |
| DEFERRED-P1-002-03                 | Lưu câu ví dụ đã được quyết định có; yêu cầu nghĩa/ngữ cảnh/family cũ không tự mở rộng Phase 1 |

## Nhật ký

| Ngày       | Người chỉ đạo | Nội dung                                                                                                           | Tài liệu                                                         |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 2026-09-28 | Chủ dự án     | Duyệt baseline trước; giữ lịch sử và bằng chứng Phase 0                                                            | Bản trước điều chỉnh, ADR-001..004                               |
| 2026-09-30 | Chủ dự án     | Thu hẹp Phase 1; N cấu hình không mặc định; Google + AI cho từ; cho phép khảo sát UI Quizlet; dùng C:\SystemDesign | ADR-006/008; P1-R01                                              |
| 2026-09-30 | Chủ dự án     | P1-101: chốt bật tab hiện tại, ghi nhớ quyền từng website là tùy chọn; chưa duyệt toàn bộ UX mới                   | D-P1-11; [quyền/layout](design/p1-101-permissions-and-layout.md) |

Cổng UI/contract/schema vẫn cần kết quả review của gói mới. Không lấy duyệt P1-001 cũ làm bằng chứng UI/schema mới đã duyệt.

Ngày 2026-09-30 owner duyệt phân tầng gate D-P1-14. Ngày 2026-10-01 owner duyệt bộ UX P1-101 theo D-P1-15; đây là phê duyệt riêng, không suy ra từ câu trả lời phân tầng gate.
