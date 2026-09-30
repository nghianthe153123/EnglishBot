# Danh sách quyết định cần chốt

> LƯU TRỮ LỊCH SỬ ngày 2026-09-30. Các lựa chọn/phạm vi dưới đây thuộc baseline trước P1-R01; không dùng làm cổng thực thi hiện hành. Đọc `docs/11-decisions-to-lock.md` và ADR-006/008 cho phạm vi mới.

## Mục đích

Đây là nơi duy nhất tổng hợp các quyết định mà chủ sản phẩm phải phê duyệt. Chủ sản phẩm đã phê duyệt toàn bộ hướng khuyến nghị ngày 2026-09-28. AI vẫn không được tự suy đoán chi tiết nhà cung cấp hoặc kết quả thử nghiệm chưa được xác minh.

Mỗi quyết định đi qua luồng:

```text
CHƯA_CHỐT -> ĐỀ_XUẤT -> CHẤP_NHẬN
                    -> CẦN_THỬ_NGHIỆM
                    -> TỪ_CHỐI
```

Hai trạng thái bổ sung sau phiên duyệt tổng thể:

- `ĐÃ_DUYỆT_THỬ_NGHIỆM`: đã duyệt hướng tiếp cận; kết quả cuối phải qua spike/test được chỉ định.
- `CHẤP_NHẬN_NGUYÊN_TẮC`: đã duyệt nguyên tắc và ràng buộc; nhà cung cấp hoặc chi tiết cuối vẫn cần một cổng lựa chọn riêng.

Khi chấp nhận một quyết định có tác động kiến trúc, phải cập nhật ADR tương ứng sang trạng thái `Chấp nhận`.

## Các quyết định cần chốt ngay trước khi viết code

Đây là cổng quyết định của Phase 0. Tất cả mục từ D-001 đến D-010 phải được xử lý trước khi scaffold production.

| ID    | Quyết định            | Khuyến nghị hiện tại                                             | Lựa chọn khác                                     | Trạng thái |
| ----- | --------------------- | ---------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| D-001 | Kiến trúc backend     | Java modular monolith, module boundary rõ                        | Microservice từ đầu; backend TypeScript           | CHẤP_NHẬN  |
| D-002 | Runtime Java          | Java 21 LTS hoặc LTS mới hơn sau kiểm tra tương thích            | Java 17; bản không phải LTS                       | CHẤP_NHẬN  |
| D-003 | Framework backend     | Spring Boot, Spring MVC, virtual thread khi phù hợp              | WebFlux toàn phần; framework Java khác            | CHẤP_NHẬN  |
| D-004 | Frontend và extension | React + TypeScript                                               | Java/Kotlin biên dịch sang web; framework UI khác | CHẤP_NHẬN  |
| D-005 | Giao diện chính       | Extension side panel là giao diện hằng ngày; MCP là kênh bổ sung | ChatGPT/MCP là giao diện chính                    | CHẤP_NHẬN  |
| D-006 | Quy trình phát triển  | Mock-first rồi contract-first, sau đó mới khóa DB                | Thiết kế DB trước UI                              | CHẤP_NHẬN  |
| D-007 | Quyền đọc trình duyệt | `activeTab`, chỉ capture sau thao tác người dùng                 | Quyền `<all_urls>` vĩnh viễn                      | CHẤP_NHẬN  |
| D-008 | Chiến lược Quizlet    | Import/export có preview trước; direct sync để sau               | UI automation hoặc endpoint không chính thức      | CHẤP_NHẬN  |
| D-009 | Mô hình repository    | Monorepo: frontend, backend, package hợp đồng dùng chung         | Nhiều repository ngay từ đầu                      | CHẤP_NHẬN  |
| D-010 | Năng lực/lịch         | 26 tuần, một chủ dự án 20–30 giờ/tuần, tối đa hai gói song song  | Lịch rút gọn hoặc năng lực khác                   | CHẤP_NHẬN  |

### Phiếu duyệt Phase 0

- [x] D-001 được chốt.
- [x] D-002 được chốt.
- [x] D-003 được chốt.
- [x] D-004 được chốt.
- [x] D-005 được chốt.
- [x] D-006 được chốt.
- [x] D-007 được chốt.
- [x] D-008 được chốt.
- [x] D-009 được chốt.
- [x] D-010 được chốt.
- Người duyệt: Chủ dự án
- Ngày duyệt: 2026-09-28
- Ghi chú/ngoại lệ: Nhà cung cấp cụ thể và kết quả spike vẫn phải qua cổng xác minh tương ứng.

## Các quyết định sản phẩm và UI cần chốt trong Phase 1

| ID    | Quyết định               | Khuyến nghị hiện tại                                                | Tác động nếu chưa chốt                 | Trạng thái |
| ----- | ------------------------ | ------------------------------------------------------------------- | -------------------------------------- | ---------- |
| D-101 | Phạm vi MVP              | Capture + Q&A có citation + dịch/phát âm + lưu từ + Quizlet export  | Không thể khóa mock journey            | CHẤP_NHẬN  |
| D-102 | Cấu trúc side panel      | Ba tab `Chat`, `Từ vựng`, `Bài học`                                 | Điều hướng và mock UI không ổn định    | CHẤP_NHẬN  |
| D-103 | Dashboard beta           | Hôm nay, Từ vựng, Bài học, Nguồn, Tích hợp, Cài đặt                 | Không xác định data query              | CHẤP_NHẬN  |
| D-104 | Phong cách hình ảnh      | Gọn, học thuật, ưu tiên khả năng đọc; light/dark theo hệ thống      | Design token không thể khóa            | CHẤP_NHẬN  |
| D-105 | Ngôn ngữ UI              | Tiếng Việt mặc định; nội dung học song ngữ                          | Ảnh hưởng copy và localization         | CHẤP_NHẬN  |
| D-106 | Mức accessibility        | WCAG 2.2 AA khi khả thi                                             | Không khóa được cổng UI                | CHẤP_NHẬN  |
| D-107 | Giọng phát âm mặc định   | Cho chọn Anh-Mỹ/Anh-Anh; nhớ lựa chọn gần nhất                      | Ảnh hưởng setting và audio cache       | CHẤP_NHẬN  |
| D-108 | Onboarding trình độ      | Người dùng tự chọn CEFR; bài đánh giá ngắn để phase sau             | Ảnh hưởng candidate word và lesson     | CHẤP_NHẬN  |
| D-109 | Trình duyệt beta         | Chrome trước, Edge kiểm tra tương thích trong cùng phase            | Ảnh hưởng test matrix và store release | CHẤP_NHẬN  |
| D-110 | Hành vi selection popup  | Hiện tức thời tại local; gọi mạng sau khi người dùng chọn hành động | Ảnh hưởng quyền riêng tư và UX         | CHẤP_NHẬN  |
| D-111 | Citation UX              | Citation cuộn tới và highlight đoạn nguồn khi có anchor             | Ảnh hưởng extraction contract          | CHẤP_NHẬN  |
| D-112 | Nội dung không có đáp án | Từ chối rõ ràng, không dùng web search nếu người dùng chưa yêu cầu  | Ảnh hưởng grounding policy             | CHẤP_NHẬN  |

### Cổng phê duyệt UI

- [ ] Luồng chính của extension được duyệt.
- [ ] Luồng selection popup được duyệt.
- [ ] Phạm vi dashboard beta được duyệt.
- [ ] Trạng thái trống/tải/lỗi/offline/hết hạn được duyệt.
- [ ] Design token và accessibility target được duyệt.
- [ ] Mỗi màn hình có mock scenario tương ứng.

## Các quyết định dữ liệu và quyền riêng tư cần chốt trước Phase 3

| ID    | Quyết định                 | Khuyến nghị hiện tại                                                           | Lựa chọn cần duyệt             | Trạng thái          |
| ----- | -------------------------- | ------------------------------------------------------------------------------ | ------------------------------ | ------------------- |
| D-201 | Retention capture mặc định | 24 giờ, cho phép chọn không lưu hoặc 7 ngày                                    | Theo phiên / 24 giờ / 7 ngày   | CHẤP_NHẬN           |
| D-202 | Lưu HTML thô               | Tắt mặc định; chỉ lưu text đã làm sạch                                         | Lưu HTML có TTL                | CHẤP_NHẬN           |
| D-203 | Lưu URL đầy đủ             | Lưu URL hiển thị có mã hóa hoặc bỏ query nhạy cảm; thêm URL hash               | Chỉ hash / URL đầy đủ          | ĐÃ_DUYỆT_THỬ_NGHIỆM |
| D-204 | Retention hội thoại        | Theo retention capture; chỉ cấu hình riêng khi có nhu cầu đã chứng minh        | Theo phiên / 7 ngày / bền vững | CHẤP_NHẬN           |
| D-205 | Ngữ cảnh từ vựng           | Được giữ lâu hơn capture khi người dùng chủ động lưu từ                        | Xóa cùng capture               | CHẤP_NHẬN           |
| D-206 | Xóa account                | Xóa bất đồng bộ có trạng thái và audit tối thiểu                               | Xóa đồng bộ                    | CHẤP_NHẬN           |
| D-207 | ID public                  | UUID/ULID không mang ý nghĩa                                                   | ID tuần tự                     | CHẤP_NHẬN           |
| D-208 | Vector hóa nội dung        | Chỉ bật cho trang dài sau đánh giá retrieval                                   | Vector hóa mọi capture         | CHẤP_NHẬN           |
| D-209 | Vị trí embedding           | PostgreSQL `pgvector` ban đầu                                                  | Vector database riêng          | CHẤP_NHẬN           |
| D-210 | Quy tắc chống trùng từ     | `user_id + language + lemma + part_of_speech`, giữ nguyên dạng gốc ở encounter | Chỉ dùng chuỗi lowercase       | ĐÃ_DUYỆT_THỬ_NGHIỆM |

### Điều kiện khóa schema

- [ ] Bản mô phỏng UI đã được phê duyệt.
- [ ] Bảng ánh xạ UI sang dữ liệu hoàn tất.
- [ ] D-201 đến D-210 được xử lý.
- [ ] Mọi trường có chủ sở hữu module.
- [ ] Mọi dữ liệu có retention class.
- [ ] Luồng xóa, export và backup đã được mô tả.
- [ ] Query chính có index plan.

## Các quyết định kỹ thuật cần chốt trước production vertical slice

| ID    | Quyết định          | Khuyến nghị hiện tại                                                                          | Trạng thái           |
| ----- | ------------------- | --------------------------------------------------------------------------------------------- | -------------------- |
| D-301 | Build backend       | Maven multi-module                                                                            | CHẤP_NHẬN            |
| D-302 | Build frontend      | `pnpm` workspace; chỉ thêm Turborepo nếu đem lại giá trị đo được                              | CHẤP_NHẬN            |
| D-303 | Database migration  | Flyway, migration chỉ tiến về trước                                                           | CHẤP_NHẬN            |
| D-304 | ORM/truy cập DB     | Spring Data JPA cho CRUD; SQL rõ ràng cho truy vấn phức tạp                                   | CHẤP_NHẬN            |
| D-305 | Streaming           | SSE cho chat/job progress                                                                     | CHẤP_NHẬN            |
| D-306 | API contract        | OpenAPI là nguồn sự thật, sinh type/client frontend                                           | CHẤP_NHẬN            |
| D-307 | Auth beta           | Account EnglishBot với OAuth/OIDC hoặc magic link; provider được chọn qua spike trước Phase 4 | CHẤP_NHẬN_NGUYÊN_TẮC |
| D-308 | Background job      | Bảng job bền vững/Quartz ban đầu; chưa dùng Kafka                                             | CHẤP_NHẬN            |
| D-309 | Cache/rate limit    | Redis                                                                                         | CHẤP_NHẬN            |
| D-310 | File/object storage | S3-compatible; local dùng MinIO nếu cần artifact                                              | CHẤP_NHẬN            |
| D-311 | OpenAI credential   | Chỉ phía server; chưa hỗ trợ BYOK trong beta                                                  | CHẤP_NHẬN            |
| D-312 | OpenAI SDK          | Dùng Java SDK sau AI gateway interface, có khả năng gọi REST thay thế                         | CHẤP_NHẬN            |
| D-313 | Hosting             | Provider được chọn trước Phase 4; bắt buộc hỗ trợ container, PostgreSQL, Redis, TLS và secret | CHẤP_NHẬN_NGUYÊN_TẮC |
| D-314 | Observability       | OpenTelemetry + structured log + error tracking                                               | CHẤP_NHẬN            |

## Các quyết định học tập cần chốt trước Phase 5C

| ID    | Quyết định            | Khuyến nghị hiện tại                                               | Trạng thái          |
| ----- | --------------------- | ------------------------------------------------------------------ | ------------------- |
| D-401 | Trạng thái từ         | candidate, new, learning, reviewing, mastered, ignored, relearning | CHẤP_NHẬN           |
| D-402 | Tín hiệu “chưa thuộc” | Tra/dịch/lưu/sai quiz là tín hiệu mạnh; độ khó từ chỉ là gợi ý     | CHẤP_NHẬN           |
| D-403 | Scheduler             | FSRS hoặc biến thể được version hóa sau thử nghiệm                 | ĐÃ_DUYỆT_THỬ_NGHIỆM |
| D-404 | Kích thước lesson     | Mặc định 10 mục, cho phép 5–20                                     | CHẤP_NHẬN           |
| D-405 | Loại bài tập beta     | Cloze, chọn đáp án, Anh→Việt, Việt→Anh                             | CHẤP_NHẬN           |
| D-406 | Quyền sửa AI output   | Người dùng được sửa nghĩa, sense và trạng thái                     | CHẤP_NHẬN           |

## Các quyết định MCP và Quizlet cần chốt trước Phase 6

| ID    | Quyết định             | Khuyến nghị hiện tại                                      | Trạng thái           |
| ----- | ---------------------- | --------------------------------------------------------- | -------------------- |
| D-501 | Transport MCP          | Streamable HTTP                                           | CHẤP_NHẬN            |
| D-502 | Liên kết tài khoản MCP | OAuth/OIDC với scope cụ thể; provider được chọn qua spike | CHẤP_NHẬN_NGUYÊN_TẮC |
| D-503 | TTL chia sẻ capture    | 30 phút mặc định, người dùng có thể thu hồi ngay          | CHẤP_NHẬN            |
| D-504 | Tool chỉ đọc           | Có thể chạy tự động trong scope đã cấp                    | CHẤP_NHẬN            |
| D-505 | Tool thay đổi dữ liệu  | Luôn yêu cầu phê duyệt rõ ràng                            | CHẤP_NHẬN            |
| D-506 | Direct sync Quizlet    | Không thuộc beta; chỉ kích hoạt sau ADR và API chính thức | CHẤP_NHẬN            |
| D-507 | Import Quizlet         | Chỉ nhận file/text người dùng chủ động cung cấp           | CHẤP_NHẬN            |

## Các quyết định phát hành cần chốt trước Phase 7

| ID    | Quyết định             | Khuyến nghị hiện tại                                          | Trạng thái |
| ----- | ---------------------- | ------------------------------------------------------------- | ---------- |
| D-601 | Nhóm beta              | Một người dùng chính, sau đó nhóm mời nhỏ                     | CHẤP_NHẬN  |
| D-602 | Ngưỡng extraction      | Ít nhất 90% corpus được duyệt                                 | CHẤP_NHẬN  |
| D-603 | Ngưỡng grounded answer | Ít nhất 90% câu trả lời được chấp nhận có citation hợp lệ     | CHẤP_NHẬN  |
| D-604 | Lỗi chặn release       | S1 luôn chặn; S2 mặc định chặn nếu không có chấp nhận rõ ràng | CHẤP_NHẬN  |
| D-605 | Rollout                | Canary/quyền truy cập giới hạn trước khi mở rộng              | CHẤP_NHẬN  |
| D-606 | Rollback               | Bắt buộc diễn tập rollback ứng dụng và migration tương thích  | CHẤP_NHẬN  |

## Nhật ký phê duyệt

Khi chủ sản phẩm chốt một mục, thêm dòng:

| ID             | Lựa chọn đã chốt                                                                     | Người duyệt | Ngày       | ADR/tài liệu được cập nhật                              |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ---------- | ------------------------------------------------------- |
| ALL-2026-09-28 | Phê duyệt toàn bộ hướng khuyến nghị; giữ cổng spike/provider cho các mục được ghi rõ | Chủ dự án   | 2026-09-28 | ADR-001 đến ADR-004, kế hoạch phase và trạng thái dự án |

## Thứ tự chốt khuyến nghị

1. Chốt D-001 đến D-010.
2. Thực hiện thiết kế UX rồi chốt D-101 đến D-112.
3. Chạy bản mô phỏng, sau đó chốt D-201 đến D-210.
4. Chốt D-301 đến D-314 trước khi scaffold production.
5. Chốt quyết định learning trước Phase 5C.
6. Chốt quyết định MCP/Quizlet trước Phase 6.
7. Chốt ngưỡng phát hành trước Phase 7.
