# Lộ trình bàn giao và lịch làm việc

## Cơ sở lập kế hoạch

Đường cơ sở này giả định:

- Một chủ dự án/người review làm việc 20–30 giờ tập trung mỗi tuần với sự hỗ trợ triển khai của AI.
- Không quá hai gói công việc độc lập hoạt động cùng lúc.
- Lộ trình 26 tuần từ đường cơ sở kế hoạch đến beta có kiểm soát.
- Kiểm thử, tài liệu và sửa lỗi được tính trong ước lượng của từng phase.
- Phê duyệt bên ngoài cho đồng bộ trực tiếp Quizlet không nằm trên critical path.

Thời gian giám sát và engineering của con người ước tính: **520–780 giờ tập trung**. Thời gian AI sinh code không được xem là thay thế cho review hoặc nghiệm thu.

Nếu người phụ trách chỉ có 10–15 giờ mỗi tuần, hãy dự kiến khoảng 34–40 tuần lịch. Một nhóm nhỏ có kinh nghiệm có thể rút ngắn còn 16–20 tuần, nhưng các cổng phase vẫn phải theo thứ tự.

## Tóm tắt các phase

| Phase |  Tuần | Trọng tâm                                      | Giờ của con người | Tỷ lệ test/review | Sản phẩm tại cổng kết thúc                            |
| ----- | ----: | ---------------------------------------------- | ----------------: | ----------------: | ----------------------------------------------------- |
| 0     |     1 | Repository, governance, đường cơ sở quyết định |             20–30 |               25% | Đường cơ sở dự án được phê duyệt                      |
| 1     |   2–4 | Phạm vi sản phẩm, hướng UI, system design      |             60–90 |               20% | Hành trình, kiến trúc và phạm vi tính năng được duyệt |
| 2     |   5–7 | UI có thể chạy với dữ liệu mô phỏng            |             60–90 |               30% | Ứng dụng mô phỏng qua cổng UX                         |
| 3     |   8–9 | Hợp đồng API và thiết kế database              |             40–60 |               35% | Đường cơ sở schema/API và test migration              |
| 4     | 10–12 | Nền tảng và lát cắt production đầu tiên        |             60–90 |               35% | Luồng có xác thực từ capture đến stream               |
| 5A    | 13–15 | Capture, retrieval, Q&A có căn cứ              |             60–90 |               40% | Hỏi đáp trang có citation đáng tin cậy                |
| 5B    | 16–17 | Chọn văn bản, dịch, TTS, từ vựng/xuất          |             40–60 |               35% | Luồng thu thập từ vựng dùng được                      |
| 5C    | 18–20 | Learning engine và bài học                     |             60–90 |               40% | Luồng học hằng ngày có tính xác định                  |
| 6     | 21–23 | MCP và tích hợp Quizlet được hỗ trợ            |             60–90 |               40% | MCP beta an toàn và import/export Quizlet             |
| 7     | 24–26 | Bảo mật, hiệu năng, UAT, phát hành             |             60–90 |               55% | Bản beta có kiểm soát                                 |

## Lịch chi tiết theo tuần

### Tuần 1 — Phase 0: nền tảng

Triển khai:

- Phê duyệt tuyên bố dự án và phạm vi ngoài mục tiêu.
- Khóa các ADR công nghệ ban đầu.
- Tạo kế hoạch scaffold repository/build.
- Thiết lập ID gói công việc và luồng trạng thái.
- Định nghĩa môi trường và quyền sở hữu secret.

Kiểm thử và review:

- Review toàn bộ tài liệu để tìm xung đột.
- Chạy thử một gói công việc mẫu chỉ bằng tài liệu.
- Xác minh mọi yêu cầu đã chấp nhận đều có phase dự kiến.

Cổng kết thúc:

- Chủ sản phẩm duyệt charter, phạm vi, mô hình bàn giao và hướng kiến trúc.

### Tuần 2 — Phase 1: hành trình người dùng và phạm vi tính năng

- Xác thực persona và năm hành trình cốt lõi.
- Ưu tiên yêu cầu Bắt buộc/Nên có/Có thể.
- Quyết định trải nghiệm ưu tiên tiện ích hay MCP.
- Định nghĩa UX đồng ý thu thập và retention.
- Phác thảo trạng thái lỗi và yêu cầu accessibility.

Review: walkthrough hành trình, phản biện phạm vi và quyền riêng tư.

### Tuần 3 — Phase 1: hướng UI

- Tạo wireframe độ chi tiết thấp cho tiện ích và dashboard.
- Định nghĩa điều hướng, phân cấp thông tin, thuật ngữ và danh mục trạng thái.
- Thiết kế tương tác bong bóng chọn văn bản.
- Thiết kế luồng chia sẻ ChatGPT và xác nhận xuất Quizlet.

Review: walkthrough khả dụng bằng kịch bản thực tế; sửa trước khi tạo visual style.

### Tuần 4 — Phase 1: khóa system design

- Xác nhận ranh giới module và luồng dữ liệu.
- Soạn các operation OpenAPI và danh mục MCP tool.
- Định nghĩa observability, retention và mô hình triển khai.
- Hoàn tất threat model ban đầu.
- Ghi ADR cho các quyết định lớn.

Review: phiên phản biện kiến trúc; kiểm tra dependency và failure mode.

### Tuần 5 — Phase 2: design system và nền tảng mô phỏng

- Chỉ scaffold UI của tiện ích và dashboard.
- Triển khai design token và component dùng chung.
- Tạo mock fixture xác định và interface mock service.
- Thêm Storybook/component test harness nếu được chọn.

Kiểm thử: accessibility component, đường cơ sở snapshot/visual, xác thực mock schema.

### Tuần 6 — Phase 2: bản mô phỏng tiện ích

- Xây side-panel flow và mọi trạng thái capture/chat.
- Xây bong bóng chọn văn bản và thẻ dịch.
- Xây tương tác citation với anchor trang mô phỏng.
- Xây trạng thái quyền, hết mới, hết hạn, ngoại tuyến và lỗi.

Kiểm thử: interaction test, điều hướng bàn phím, visual check chiều rộng hẹp, mock E2E.

### Tuần 7 — Phase 2: dashboard và bản mô phỏng tích hợp

- Xây các luồng Hôm nay, Từ vựng, Bài học, Nguồn, Tích hợp và Cài đặt.
- Xây luồng xem trước/xuất Quizlet.
- Xây luồng kết nối/chia sẻ/thu hồi MCP.
- Hoàn tất bảng ánh xạ UI sang dữ liệu và walkthrough với chủ sản phẩm.

Kiểm thử: mock E2E xuyên suốt, quét accessibility, visual regression, duyệt UX.

Cổng kết thúc: không bắt đầu database production trước khi bản mô phỏng có thể chạy được phê duyệt.

### Tuần 8 — Phase 3: hợp đồng và schema logic

- Chuyển command/query UI thành operation trong bản nháp OpenAPI.
- Hoàn thiện ranh giới aggregate và phân loại lưu trữ.
- Xác thực mẫu truy vấn, cardinality, hành vi xóa và retention.
- Định nghĩa event và hợp đồng idempotency.

Kiểm thử: ví dụ hợp đồng, trường hợp input không hợp lệ, thiết kế test property/invariant.

### Tuần 9 — Phase 3: schema vật lý và đường cơ sở migration

- Tạo Flyway migration V1.
- Tạo database repository/interface và test fixture.
- Sinh hoặc xác thực type API phía frontend.
- Ghi ADR schema và hành vi xóa/xuất dữ liệu.

Kiểm thử: migration trống, migration nâng cấp, constraint, index, integration test bằng Testcontainers.

Cổng kết thúc: schema và hợp đồng được duyệt; ngữ nghĩa mock không thay đổi.

### Tuần 10 — Phase 4: scaffold production

- Tạo ứng dụng Spring Boot modular và production client phía frontend.
- Thêm CI, format, lint, unit test, quét dependency và build artifact.
- Triển khai khung identity/auth và môi trường Docker local.

Kiểm thử: kiểm thử kiến trúc, trường hợp xác thực thất bại, kiểm thử nhanh container.

### Tuần 11 — Phase 4: lát cắt capture có lưu trữ

- Triển khai gửi capture, validation, làm sạch, hashing, TTL và xóa.
- Thêm lưu database và truy vấn trạng thái cơ bản.
- Kết nối tiện ích với capture API thật phía sau cờ tính năng.

Kiểm thử: tích hợp API, giới hạn kích thước, quyền sở hữu, xóa, đồng thời và nội dung sai định dạng.

### Tuần 12 — Phase 4: lát cắt AI streaming

- Triển khai abstraction AI gateway và fake provider.
- Thêm adapter Responses API trong staging.
- Stream câu trả lời cơ bản qua SSE.
- Thêm telemetry về mức sử dụng, độ trễ và lỗi.

Kiểm thử: CI xác định bằng fake provider, mất/kết nối lại SSE, timeout/quota, smoke evaluation giới hạn với provider thật.

### Tuần 13 — Phase 5A: trích xuất vững chắc

- Triển khai content-script extraction và source anchor.
- Thêm làm sạch readability và content hashing.
- Phát hiện trang hạn chế, thay đổi và không hỗ trợ.

Kiểm thử: corpus trích xuất trên các nhóm website đã thống nhất, giới hạn iframe, nội dung động, HTML đối kháng.

### Tuần 14 — Phase 5A: retrieval và citation

- Triển khai chunking, đường cơ sở tìm kiếm từ khóa và vector retrieval tùy chọn.
- Xác thực đầu ra câu trả lời/citation có cấu trúc.
- Triển khai điều hướng nguồn và hành vi khi câu trả lời không được hỗ trợ.

Kiểm thử: bộ chuẩn retrieval, độ toàn vẹn citation, ranh giới chunk, đánh giá hallucination/từ chối trả lời.

### Tuần 15 — Phase 5A: cổng chất lượng Q&A có căn cứ

- Tinh chỉnh extraction, retrieval, ranh giới prompt và UX lỗi.
- Thêm cache và giới hạn token/chi phí.
- Hoàn tất phòng vệ prompt injection cho Q&A chỉ đọc.

Kiểm thử: regression đầy đủ cho Q&A trang, corpus prompt injection, đường cơ sở tải, UAT thủ công.

### Tuần 16 — Phase 5B: chọn văn bản, dịch và TTS

- Kết nối bong bóng chọn văn bản với dịch theo ngữ cảnh.
- Thêm phát âm local và TTS server tùy chọn.
- Thêm lựa chọn giọng, tốc độ, thử lại và thông báo giọng AI.

Kiểm thử: fixture từ/cụm từ/câu, tương tác với layout trang, fallback audio, độ trễ và accessibility.

### Tuần 17 — Phase 5B: từ vựng và xuất Quizlet

- Triển khai lưu lexeme/sense/user-word/encounter.
- Triển khai hợp nhất trùng và chỉnh sửa thủ công.
- Triển khai xem trước tương thích Quizlet và export batch.

Kiểm thử: property chuẩn hóa, giữ ngữ cảnh khi trùng, escape dữ liệu xuất, fixture định dạng import.

### Tuần 18 — Phase 5C: domain học tập

- Triển khai mô hình trạng thái review và bộ lập lịch có phiên bản.
- Triển khai truy vấn từ đến hạn và gửi kết quả review.
- Tạo fixture học có thể replay.

Kiểm thử: unit/property test cho scheduler thuần, ranh giới múi giờ, gửi lặp, replay thuật toán.

### Tuần 19 — Phase 5C: tạo bài học và UI

- Xây tạo lesson, chọn mục có giới hạn, hợp đồng bài tập và UI bài học.
- Thêm generator fallback xác định khi AI provider lỗi.
- Ghi phiên bản generator/model.

Kiểm thử: invariant bài học, xác thực structured output, mock journey E2E, fallback khi AI lỗi.

### Tuần 20 — Phase 5C: cổng chất lượng học tập

- Hoàn thiện hiển thị tiến độ và luồng sửa lỗi.
- Hiệu chỉnh bằng chứng từ chưa thuộc mà không đồng nhất độ khó với việc chưa biết.
- Chạy UAT học tập và sửa điểm không nhất quán.

Kiểm thử: mô phỏng nhiều tuần review, accessibility, phục hồi bài học bị gián đoạn, xuất/xóa dữ liệu.

### Tuần 21 — Phase 6: liên kết tài khoản và transport MCP

- Triển khai endpoint MCP Streamable HTTP.
- Thêm liên kết tài khoản, scope, share grant, hết hạn và thu hồi.
- Triển khai tool metadata và tìm kiếm capture.

Kiểm thử: tuân thủ protocol, ma trận phân quyền, grant hết hạn/thu hồi, test schema tool.

### Tuần 22 — Phase 6: MCP tool học tập và import Quizlet

- Thêm MCP tool liên quan đến từ đến hạn và bài học.
- Thêm import/validation file Quizlet do người dùng cung cấp.
- Hoàn thiện integration audit event.

Kiểm thử: contract test tool, idempotency, xử lý file lỗi, tính đầy đủ của audit.

### Tuần 23 — Phase 6: cổng bảo mật tích hợp

- Review ranh giới prompt injection và phê duyệt tool.
- Chạy kiểm tra tương thích MCP client.
- Xác minh không tồn tại hành vi trực tiếp với Quizlet chưa được hỗ trợ.
- Hoàn thiện tài liệu tích hợp.

Kiểm thử: payload MCP đối kháng, hạ quyền, replay, timeout/retry, luồng ChatGPT thủ công.

### Tuần 24 — Phase 7: gia cố hiệu năng và bảo mật

- Tối ưu truy vấn database và retrieval đã đo lường.
- Thêm rate limiting, kiểm tra backup, cảnh báo và dashboard vận hành.
- Khắc phục phát hiện về phụ thuộc và bảo mật ứng dụng.

Kiểm thử: tải, soak, đồng thời, diễn tập restore, quét secret, quét dependency, DAST khi phù hợp.

### Tuần 25 — Phase 7: UAT beta và bug bash

- Chạy bộ nghiệm thu đầy đủ với phiên duyệt web đại diện.
- Phân loại và sửa lỗi chặn phát hành.
- Xác thực onboarding, quyền riêng tư, hỗ trợ và tài liệu phục hồi.

Kiểm thử: regression, exploratory, visual, accessibility, cross-browser, đánh giá model thật.

### Tuần 26 — Phase 7: phát hành và quan sát

- Tạo artifact tiện ích/backend đã ký.
- Deploy từ staging sang production bằng canary hoặc quyền truy cập beta giới hạn.
- Xác minh migration, telemetry, alert và quy trình rollback.
- Quan sát sử dụng thực và tạo backlog phase tiếp theo.

Cổng kết thúc: checklist phát hành được duyệt, không có lỗi mức 1, rollback đã kiểm tra, giới hạn đã biết được công bố.

## Nhịp làm việc chuẩn mỗi tuần

| Hoạt động                                     | Tỷ lệ thời gian con người |
| --------------------------------------------- | ------------------------: |
| Chuẩn bị phạm vi, gói công việc và quyết định |                       15% |
| Triển khai bằng AI và review code             |                       40% |
| Kiểm thử tự động và thủ công                  |                       25% |
| Tích hợp, sửa lỗi và refactor                 |                       10% |
| Tài liệu, bằng chứng và cập nhật trạng thái   |                       10% |

Trong Phase 7, kiểm thử/sửa lỗi tăng lên ít nhất 55% thời gian tuần.

## Kiểm soát lịch trình

- Cổng kết thúc không đạt sẽ đẩy lùi phase tiếp theo; không được bỏ qua để giữ ngày.
- Dành 15–20% mỗi phase cho việc làm lại do lỗi code AI hoặc hiểu sai yêu cầu.
- Tích hợp bên ngoài phải có fallback để critical path không bị chặn.
- Phạm vi thêm sau khi Phase 2 được duyệt sẽ vào backlog, trừ khi sửa vấn đề bảo mật, pháp lý hoặc khả dụng nền tảng.
