# Khả thi provider — Phase 1

- Khảo sát: 2026-09-30.
- Phân biệt yêu cầu đã chốt và năng lực cần spike; tài liệu này không phải bằng chứng integration code đã hoạt động.

## Google Translation

[REST TranslateTextResponse chính thức](https://docs.cloud.google.com/translate/docs/reference/rest/v3/TranslateTextResponse) mô tả translatedText, model, detectedLanguageCode và glossaryConfig. Không có part_of_speech hoặc example_sentence trong response này.

Hệ quả: Google đủ cho bản dịch text; rich word card cần một nguồn enrichment khác. D-P1-09 đã chốt Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ. Google dịch cụm/câu không cần AI; AI mode vẫn dịch cụm/câu bằng AI; cache word đầy đủ không cần gọi provider lại. Không nhầm kết quả hiển thị trên website Google Translate với contract Cloud Translation API. Adapter/chủ sở hữu project/credential/quota chốt trong P1-103/104.

## Quizlet

Nguồn đã kiểm tra:

1. [Creating sets by importing content](https://help.quizlet.com/hc/en-us/articles/360029977151-Creating-sets-by-importing-content): import trên website, term/definition có delimiter và mỗi dòng trở thành card; tạo/save/publish là bước riêng sau import.
2. [Create flashcard sets directly in Claude](https://help.quizlet.com/hc/en-us/articles/49258738112525-Create-flashcard-sets-directly-in-Claude): có connector Quizlet trong Claude tạo bộ thẻ và mở để học trên Quizlet.
3. Đường dẫn developer cũ `https://quizlet.com/api/2.0/docs` không truy cập được bằng công cụ khảo sát. Đây không phải bằng chứng “Quizlet hoàn toàn không có API”.

Chưa xác minh: một API/connector được tài liệu hóa, cho phép ứng dụng EnglishBot riêng xác thực người dùng và tự tạo bộ thẻ. Connector trong Claude không tự chứng minh backend Java/extension được cấp quyền gọi cùng năng lực. Không giả định có Quizlet MCP công khai hoặc dùng endpoint nội bộ.

## Spike P1-102 và tiêu chí go/no-go

| Hạng mục                                           | Bằng chứng bắt buộc                                                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Kênh chính thức/API/connector                      | Contract hiện hành, cách đăng ký/cấp quyền, client EnglishBot có quyền dùng                                                 |
| Chủ sở hữu                                         | Tạo set trong đúng tài khoản test; account mismatch bị chặn                                                                 |
| Tạo từ batch                                       | Text import hoặc ánh xạ term/definition có cùng nội dung snapshot; set ID/URL xác nhận                                      |
| Quyền và credential                                | Không copy cookie/password; revoke/expiry/relogin được mô tả                                                                |
| Retry/outcome unknown                              | Timeout sau create không gây set trùng; có reconciliation thực tế                                                           |
| Browser automation đã được owner cho phép khảo sát | PoC trên trình duyệt test đã đăng nhập, host permission/DOM capability, giới hạn và recovery; cập nhật ADR trước production |

GO chỉ khi kênh được kiểm chứng và quyết định liên quan đã xử lý. Nếu không đạt, P1-108 chưa được mở và Phase 1 chưa đáp ứng mục tiêu tự tạo Quizlet. Batch/text vẫn có thể thực hiện và test riêng. Copy/import thủ công chỉ là fallback đề xuất nếu chủ dự án chấp nhận thay đổi phạm vi sau này.

Không thiết kế thêm MCP server EnglishBot để giải quyết mục tiêu này; không thêm scheduler hay bài học nội bộ. “Bài học” ở Phase 1 là bộ thẻ Quizlet, không tự hứa lesson/khóa Learn riêng.
