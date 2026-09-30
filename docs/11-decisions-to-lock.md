# Danh sách quyết định hiện hành

## Đường cơ sở và thẩm quyền

Ngày 2026-09-30 chủ dự án thay thế phạm vi Phase 1 bằng [ADR-006](decisions/ADR-006-phase-1-translation-scope.md). Quyết định cũ lưu tại [bản trước điều chỉnh](history/2026-09-30-decisions-before-rebaseline.md); không dùng bảng cũ như cổng triển khai hiện hành.

“CHẤP_NHẬN” là lựa chọn chủ dự án đã nêu. “CHƯA_CHỐT” không cho phép AI tự đặt mặc định. Ba lựa chọn N, enrichment và khảo sát Quizlet đã được owner trả lời trong cùng phiên. “CẦN_THỬ_NGHIỆM” là năng lực chưa có bằng chứng. Các giá trị kỹ thuật trong mô hình DB/API mới vẫn là đề xuất trước gói khóa tương ứng.

## Phase 1 hiện hành

| ID      | Quyết định                                                                  | Trạng thái / nguồn                                                                                                 |
| ------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| D-P1-01 | Chỉ selection translation, word DB/reuse, Add và tự tạo bộ thẻ Quizlet      | CHẤP_NHẬN — yêu cầu owner 2026-09-30                                                                               |
| D-P1-02 | Hai lựa chọn Google API chính thức và AI bằng API key người dùng            | CHẤP_NHẬN; AI vendor/model cụ thể chưa chọn                                                                        |
| D-P1-03 | Bôi đen hiện action local; click mới mở popup nhỏ cạnh con trỏ và gọi dịch  | CHẤP_NHẬN                                                                                                          |
| D-P1-04 | Từ loại, nghĩa và câu ví dụ của từ phải lưu DB để dùng lại                  | CHẤP_NHẬN; thay phần persistence để mở ở DEFERRED-P1-002-03                                                        |
| D-P1-05 | Add riêng cho từ, đủ N thì tự tạo batch/text import                         | CHẤP_NHẬN: N do người dùng cấu hình, không mặc định; chưa cấu hình không tạo batch                                 |
| D-P1-06 | Tự import/tạo bộ thẻ Quizlet đúng tài khoản                                 | CHẤP_NHẬN mục tiêu; CẦN_THỬ_NGHIỆM kênh ở P1-102                                                                   |
| D-P1-07 | Dùng Wirefigma tại C:\SystemDesign, hủy mockup cũ                           | CHẤP_NHẬN nguồn thiết kế; không phải duyệt UI mới                                                                  |
| D-P1-08 | AI vendor/model, auth/deploy, vòng đời/mã hóa BYOK                          | CHƯA_CHỐT; P1-103/104, ADR-007 đề xuất                                                                             |
| D-P1-09 | Nguồn POS/example khi Google dịch từ                                        | CHẤP_NHẬN: Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ                                                    |
| D-P1-10 | Kênh Quizlet: tích hợp chính thức dùng được hay khảo sát browser automation | CHẤP_NHẬN KHẢO SÁT: dùng browser đã đăng nhập nếu official channel chưa dùng được; production cần spike GO/ADR-008 |
| D-P1-11 | Activation và quyền content script theo site                                | CẦN_THỬ_NGHIỆM; P1-101/105; selection không tự cấp activeTab                                                       |
| D-P1-12 | Nghĩa/sense và ngữ cảnh câu ví dụ; cache key/dedupe/xóa đang xử lý          | CHƯA_CHỐT chi tiết contract ở P1-103, schema ở P1-104                                                              |
| D-P1-13 | Bài học Phase 1 là bộ thẻ Quizlet, chưa hứa lesson/khóa Learn riêng         | Ánh xạ kế hoạch; xác minh với năng lực channel tại P1-102                                                          |

Owner đã trả lời cả ba câu hỏi trong P1-R01: N cấu hình không mặc định; Google + AI BYOK cho từ; khảo sát thao tác giao diện Quizlet. Đã đồng bộ PRD/roadmap/package/architecture; chưa suy ra PoC production đã đạt.

## Quyết định nền tảng còn hiệu lực

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

| Ngày       | Người chỉ đạo | Nội dung                                                                                                           | Tài liệu                           |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| 2026-09-28 | Chủ dự án     | Duyệt baseline trước; giữ lịch sử và bằng chứng Phase 0                                                            | Bản trước điều chỉnh, ADR-001..004 |
| 2026-09-30 | Chủ dự án     | Thu hẹp Phase 1; N cấu hình không mặc định; Google + AI cho từ; cho phép khảo sát UI Quizlet; dùng C:\SystemDesign | ADR-006/008; P1-R01                |

Cổng UI/contract/schema vẫn cần kết quả review của gói mới. Không lấy duyệt P1-001 cũ làm bằng chứng UI/schema mới đã duyệt.
