# Tuyên bố dự án

## Tầm nhìn

EnglishBot giúp người học tiếng Anh xử lý từ vựng họ gặp khi đọc web. Trong Phase 1, extension cho phép dịch lựa chọn theo yêu cầu, lưu dữ liệu từ hữu ích để tái sử dụng và đưa những từ người dùng chủ động thêm vào bộ thẻ Quizlet.

## Người dùng chính

Người học nói tiếng Việt, dùng Chrome hoặc Edge trên máy tính, muốn tra nhanh mà vẫn kiểm soát nội dung được gửi đi và dữ liệu được lưu.

## Kết quả Phase 1

1. Khi chọn văn bản, người dùng thấy hành động cục bộ; chỉ sau khi bấm **Dịch**, popup nhỏ cạnh con trỏ mới gọi provider đã chọn.
2. Người dùng có thể chọn Google Cloud Translation API hoặc AI BYOK cho mọi selection. Khi chọn Google cho từ, Google dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ; AI key chỉ cần nếu enrichment chưa có trong cache. Cụm/câu dịch bằng provider đã chọn; Google mode không cần AI enrichment. Nếu cache có đủ dữ liệu thì tái sử dụng mà không gọi provider. Key không được lưu trong extension; xử lý phía backend theo ranh giới bảo mật.
3. Từ đơn có từ loại, nghĩa và câu ví dụ. Ba trường này được validate rồi lưu trong DB, có thể tái sử dụng theo ngôn ngữ/provider/sense và provenance/version.
4. Cụm/câu chỉ có bản dịch nghĩa; không có Add.
5. **Add** là hành động riêng cho từ, đưa từ hợp lệ vào queue của người dùng một cách idempotent.
6. Người dùng cấu hình ngưỡng N; không có giá trị mặc định. Nếu chưa cấu hình N, UI yêu cầu thiết lập và không tạo batch. Khi đủ N từ đã Add hợp lệ, chưa gán batch, EnglishBot tạo text import ổn định và tự tạo set Quizlet trong tài khoản người dùng qua kênh đã kiểm chứng. Thành công chỉ được báo khi có bằng chứng set.

N do người dùng cấu hình và luồng enrichment Google bằng AI BYOK đã được chốt. Kênh Quizlet production vẫn cần feasibility proof; owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu kênh chính thức không dùng được. Không coi export thủ công là hoàn thành tiêu chí Quizlet.

## Ngoài phạm vi Phase 1

Chat/Q&A/citation, capture toàn trang, dashboard, MCP server EnglishBot, TTS, word family, lesson/scheduler/mastery nội bộ, ứng dụng di động, và tự động hóa endpoint riêng tư không được tài liệu hóa. Bài học duy nhất trong scope này là bộ thẻ trên Quizlet.

## Ràng buộc và nguyên tắc

- Backend dự kiến Java/Spring Boot; extension TypeScript. Kiến trúc và các quyết định triển khai thuộc tài liệu có thẩm quyền riêng.
- Dùng design system Wirefigma theo [bản tham chiếu](design/reference/WIREFIGMA_DESIGN_SYSTEM.md) và sample kèm theo; chỉ áp dụng token/component/behavior phù hợp popup, options và queue nhỏ.
- Chỉ gửi selection cần thiết sau hành động rõ ràng; không crawl trang, đọc cookie hoặc session.
- Cả từ và cụm/câu dịch bằng provider người dùng chọn. Trong Google mode, từ cần Google translation và AI BYOK enrichment POS/câu ví dụ nếu cache chưa đủ; phrase/câu dùng Google không cần AI key. AI mode dịch trực tiếp bằng AI. UI nêu minh bạch provider; cache đầy đủ được tái sử dụng mà không gọi provider.
- Nội dung provider là dữ liệu cần validate. Lỗi provider/quota/network phải có trạng thái và recovery; không fallback ngầm.
- Không khẳng định tạo Quizlet thành công nếu chưa xác minh set.

## Ghi chú lịch sử

Đường cơ sở P1-001 được chủ dự án duyệt ngày 2026-09-29 cho capture/Q&A, dashboard, học tập nội bộ và MCP. Theo yêu cầu ngày 2026-09-30, phạm vi đó bị thay thế cho Phase 1 bởi P1-R01; nội dung chi tiết được giữ trong tài liệu P1-001 với tư cách lịch sử, không phải phạm vi đang hoạt động. Phase 0 vẫn hoàn tất; P1-R01 chỉ thay đổi tài liệu và không xác nhận tính năng production.

## Quản trị

Chủ dự án quyết định phạm vi, các câu hỏi đang chờ, thiết kế và phát hành. P1-R01 là gói duy nhất cho việc lập lại đường cơ sở. [Status](status/STATUS.md) chỉ cập nhật sau khi gói vượt cổng kết thúc.
