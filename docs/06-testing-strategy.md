# Chiến lược kiểm thử

## Mục tiêu

Kiểm thử phải chứng minh EnglishBot đúng chức năng, có căn cứ, bảo vệ quyền riêng tư, có thể phục hồi và vận hành được. Code do AI tạo phải đáp ứng yêu cầu bằng chứng tương đương hoặc nghiêm ngặt hơn code do con người viết.

## Các tầng kiểm thử

| Tầng                 | Mục đích                                                | Công cụ điển hình                                       | Thời điểm chạy                   |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------- | -------------------------------- |
| Tĩnh                 | Format, lint, type, dependency, secret                  | Checkstyle/Spotless, ESLint, TypeScript, scanner        | Mọi thay đổi                     |
| Unit                 | Quy tắc domain thuần và trường hợp biên                 | JUnit, AssertJ, Vitest                                  | Mọi thay đổi                     |
| Property             | Invariant của scheduler, chuẩn hóa, chunking            | jqwik/QuickTheories, fast-check                         | Khi module liên quan thay đổi    |
| Kiến trúc            | Buộc tuân thủ ranh giới module                          | ArchUnit                                                | Mọi backend build                |
| Component            | Hành vi controller/service/repository hoặc UI component | Spring test, Testing Library                            | Mọi thay đổi                     |
| Hợp đồng             | OpenAPI, MCP, provider adapter                          | Schemathesis/fixture tùy chỉnh, MCP inspector, WireMock | Mọi thay đổi tích hợp            |
| Database             | Migration, constraint, query, đồng thời                 | Testcontainers PostgreSQL/Redis                         | CI                               |
| Tích hợp             | Nhiều module thật với provider bên ngoài giả            | Testcontainers, WireMock                                | CI                               |
| Browser E2E          | Hành trình tiện ích/dashboard                           | Playwright với profile tiện ích                         | CI/hằng đêm                      |
| Visual/accessibility | Layout và tương tác tiếp cận được                       | So sánh ảnh, axe                                        | Khi đổi UI/hằng đêm              |
| Đánh giá AI          | Grounding, citation, dịch, an toàn                      | Bộ công cụ đánh giá có phiên bản                        | Staging/hằng đêm/trước phát hành |
| Hiệu năng            | Độ trễ, đồng thời, ngân sách tài nguyên/chi phí         | k6/Gatling/JFR                                          | Cổng phase/trước phát hành       |
| Bảo mật              | Auth, injection, secret, dependency                     | SAST/DAST/threat test thủ công                          | CI và trước release              |
| UAT                  | Hành vi sản phẩm với luồng thực tế                      | Checklist có phê duyệt                                  | Cổng phase                       |

## CI xác định và kiểm thử AI thật

CI không được phụ thuộc vào model thật để xác định tính đúng đắn.

### CI xác định

- Fake AI gateway trả về structured fixture có phiên bản.
- Fixture lỗi provider bao phủ timeout, JSON sai, refusal, quota và stream không đầy đủ.
- Clock cố định và ID có seed được dùng cho test học tập và hết hạn.
- Hành vi MCP/Quizlet bên ngoài được mô phỏng tại ranh giới adapter.

### Đánh giá bằng model thật

- Chạy riêng với credential rõ ràng và ngân sách chi phí.
- Không làm developer bị chặn vì provider tạm thời lỗi.
- Có thể chặn phát hành khi ngưỡng chất lượng có ý nghĩa thống kê bị giảm.
- Lưu phiên bản prompt/template, tham chiếu model, phiên bản dataset, điểm, độ trễ và chi phí.

## Các bộ test cốt lõi

### Corpus thu thập trình duyệt

Duy trì ít nhất 30–50 fixture được phê duyệt hoặc trang có thể tái tạo, bao gồm:

- Layout tin tức/bài viết.
- Trang tài liệu.
- Blog.
- Ứng dụng một trang.
- Trang rất dài.
- Bảng và danh sách.
- Heading lồng nhau.
- Shadow DOM tại nơi dự kiến hỗ trợ.
- Frame cùng origin và khác origin.
- Nội dung lazy/dynamic.
- Trang test có đăng nhập.
- Trang không hỗ trợ và trang bị trình duyệt hạn chế.
- HTML đối kháng và instruction ẩn.

Assertion gồm độ bao phủ văn bản trích xuất, loại bỏ nhiễu, thứ tự heading, content hash ổn định, anchor và giới hạn kích thước capture.

### Bộ đánh giá Q&A có căn cứ

Mỗi trường hợp lưu:

- Fixture/phiên bản trang.
- Câu hỏi người dùng.
- Đoạn bằng chứng bắt buộc.
- Claim trả lời có thể chấp nhận.
- Liệu hành vi đúng có phải là từ chối trả lời hay không.
- Claim không được hỗ trợ bị cấm.

Chỉ số:

- Retrieval recall tại k.
- Độ chính xác citation.
- Độ bao phủ citation.
- Tỷ lệ claim được hỗ trợ.
- Độ chính xác từ chối trả lời.
- Độ trễ token đầu tiên và tổng thời gian.
- Token input/output đã dùng.

### Bộ dịch/phát âm

Bao phủ:

- Từ đa nghĩa trong các câu khác nhau.
- Phrasal verb.
- Thành ngữ.
- Dạng biến đổi và ánh xạ lemma.
- Dấu câu và văn bản trộn Việt/Anh.
- Vùng chọn từ, cụm từ và câu.
- Chọn phát âm Anh-Mỹ/Anh-Anh.
- Browser TTS không khả dụng và server TTS lỗi.

### Bộ learning engine

Hàm lập lịch nhận trạng thái trước, điểm review, thời gian review và phiên bản thuật toán, rồi tạo trạng thái tiếp theo.

Kiểm thử:

- Lần gặp đầu tiên.
- Review đúng và sai.
- Học lại sau khi mastered.
- Gửi trùng hoặc retry.
- Review qua nửa đêm và thay đổi ngày/múi giờ.
- Không hoạt động trong thời gian rất dài.
- Replay phiên bản thuật toán.
- Tạm dừng và tiếp tục bài học.

### Bộ MCP

- Danh sách tool và JSON schema.
- OAuth/scope hợp lệ và không hợp lệ.
- Quyền sở hữu capture.
- Share hết hạn và thu hồi.
- Hành vi phê duyệt giữa tool chỉ đọc và tool thay đổi dữ liệu.
- Argument quá lớn hoặc độc hại.
- Prompt injection trong output của tool.
- Timeout, retry và lỗi transport không đầy đủ.
- Tạo audit event.

### Bộ Quizlet

- Xử lý delimiter tab/dấu phẩy/gạch ngang nếu định dạng được chọn hỗ trợ.
- Escape newline, tab, dấu nháy và Unicode.
- Từ trùng và định nghĩa trống.
- So sánh preview batch với payload được tải/sao chép.
- Tính idempotent của export lặp lại.
- Lỗi khi import file do người dùng cung cấp.
- Xác nhận rõ ràng trước khi tuyên bố hoàn tất.

## Ma trận kiểm thử bảo mật

| Rủi ro                   | Kiểm thử bắt buộc                                                             |
| ------------------------ | ----------------------------------------------------------------------------- |
| Phân quyền object bị lỗi | Truy cập capture, từ, lesson hoặc export ID của người dùng khác               |
| Prompt injection         | Nội dung trang/MCP cố ghi đè instruction hoặc gọi tool                        |
| Rò rỉ secret             | Quét bundle tiện ích, log, lỗi, source map và artifact                        |
| XSS                      | Render nội dung thu thập, bản dịch, citation và output MCP độc hại            |
| SSRF                     | Gửi URL provider/MCP và URL chuyển hướng ngoài chính sách cho phép            |
| CSRF/lạm dụng phiên      | Thử endpoint ghi có xác thực trình duyệt                                      |
| Replay                   | Tái sử dụng share grant, OAuth callback, review và idempotency key export     |
| Cạn tài nguyên           | Trang quá lớn, vùng chọn dài, nhiều chunk, request dồn dập                    |
| Xóa dữ liệu              | Xóa account/capture và chứng minh dữ liệu suy ra được xóa hoặc tombstone đúng |

## Ngân sách hiệu năng

Ngưỡng chính xác được khóa sau phép đo đường cơ sở Phase 4. Test harness phải đo:

- Độ trễ tương tác UI tiện ích không qua mạng.
- Thời gian trích xuất theo kích thước trang.
- Thời gian upload và lưu capture.
- Độ trễ retrieval ở kích thước corpus đại diện.
- Thời gian tới token đầu tiên và hoàn tất câu trả lời.
- Số kết nối SSE đồng thời.
- Độ trễ truy vấn từ vựng và từ đến hạn.
- Mức bão hòa database pool.
- Mức sử dụng token/audio AI theo tính năng.

Không chấp nhận tối ưu nếu thiếu số đo trước/sau.

## Cổng test theo phase

| Phase | Cổng tối thiểu                                                             |
| ----- | -------------------------------------------------------------------------- |
| 1     | Hoàn tất review hành trình, kiến trúc, quyền riêng tư và failure mode      |
| 2     | Mock E2E, accessibility và kịch bản visual đều đạt                         |
| 3     | Hợp đồng, migration, constraint và integration test repository đều đạt     |
| 4     | Lát cắt có xác thực đạt CI và smoke test staging                           |
| 5A    | Đạt ngưỡng đánh giá extraction và grounded Q&A                             |
| 5B    | Đạt bộ test selection, audio fallback, chuẩn hóa và export                 |
| 5C    | Đạt property scheduler, replay, lesson E2E và phục hồi gián đoạn           |
| 6     | Đạt kiểm thử tuân thủ MCP, phân quyền, injection và Quizlet adapter        |
| 7     | Đạt hồi quy đầy đủ, tải, bảo mật, accessibility, phục hồi, UAT và rollback |

## Mức nghiêm trọng của lỗi

- **S1:** lộ/mất dữ liệu, vượt xác thực, luồng cốt lõi không dùng được, tool thực hiện hành động nguy hiểm. Chặn mọi phát hành.
- **S2:** sai trạng thái học, grounded answer lỗi thường xuyên, tính năng lớn hỏng không có cách tránh. Chặn beta nếu không được chấp nhận rõ ràng.
- **S3:** lỗi giới hạn có cách tránh, vấn đề visual/accessibility đáng kể. Xếp lịch trước hoặc ngay sau beta tùy tác động.
- **S4:** lỗi thẩm mỹ hoặc cải tiến tác động thấp.

## Bằng chứng kiểm thử

Mỗi gói công việc ghi:

- Lệnh test và môi trường.
- Mã commit/build.
- Tóm tắt kết quả tự động.
- Vị trí ảnh/report/log.
- Phiên bản dataset/model/template khi đánh giá model thật.
- Trường hợp bỏ qua đã biết kèm người chịu trách nhiệm và phase xử lý.
