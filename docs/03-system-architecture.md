# Kiến trúc hệ thống — Phase 1

Đường cơ sở ngày 2026-09-30 theo [ADR-006](decisions/ADR-006-phase-1-translation-scope.md). Java 21/Spring Boot, React/TypeScript và modular monolith tiếp tục theo ADR-001/005. [ADR-007](decisions/ADR-007-translation-byok-boundaries.md) ghi phần thiết kế cần xác minh trước production.

## Runtime tối thiểu

```text
Trang được cấp quyền
  → content script: selection + vị trí pointer, action Dịch local
  → click Dịch → popup → background/service worker extension
  → HTTPS backend Java/Spring Boot
       ├─ translation: Google adapter hoặc AI adapter dùng BYOK
       ├─ vocabulary: POS/nghĩa/ví dụ, DB reuse, Add
       └─ quizlet: ngưỡng N, text batch, job tạo bộ thẻ
            ↓
       PostgreSQL: từ, queue, snapshot batch, trạng thái job
            ↓ kênh đã kiểm chứng
       Quizlet: bộ thẻ thuộc tài khoản người dùng
```

Không triển khai Redis, pgvector, retrieval, SSE chat, object storage hoặc MCP server trong Phase 1. Scaffold `apps/web` từ Phase 0 vẫn có thể tồn tại nhưng không mở task dashboard.

## Ranh giới module

| Module                 | Sở hữu                                                           | Interface được sử dụng                               |
| ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| identity/configuration | Chủ sở hữu, quyền truy cập, provider config, secret reference, N | API xác thực/cấu hình công khai                      |
| translation            | Request dịch từ/text, lựa chọn provider, output validation       | Provider adapter; public vocabulary lookup interface |
| vocabulary             | Word entry, cache/reuse, trạng thái Add và chống trùng           | Public identity/config interface                     |
| integration-quizlet    | Snapshot batch, format import, job và đối soát set               | Public vocabulary interface/event, channel adapter   |
| platform               | Database, clock, ID, transaction, log đã redact                  | Không sở hữu nghiệp vụ                               |

Tên module là thiết kế, chưa tạo module code mới trong phiên này. Không truy cập repository của module khác; domain không import SDK Google/AI hay DOM type. Endpoint provider nằm trong adapter allowlist, không nhận URL tùy ý từ trang hoặc output AI.

## Selection và quyền trình duyệt

1. Người dùng kích hoạt extension trên site hoặc cấp quyền host theo site qua luồng đã duyệt. Bôi đen không tự cấp `activeTab` và không tự inject content script.
2. Content script phân loại local một từ so với cụm/câu và ghi vị trí pointer/selection rect; không đọc toàn trang.
3. Bôi đen chỉ hiện action Dịch. Khi click, mở popup nhỏ cạnh pointer, giới hạn trong viewport, rồi gửi nội dung đã giới hạn.
4. Background thực hiện request tới backend; content script không tiếp xúc provider key.
5. Request gắn selection/request ID. Kết quả cũ không ghi đè selection mới sau navigation/close/đổi selection. Trạng thái bền vững không đặt riêng trong RAM worker MV3 có thể bị suspend.
6. Popup render text an toàn, có loading/error/retry/close và keyboard/focus behavior.

Ưu tiên thao tác kích hoạt rõ ràng + quyền site tối thiểu. Detect liên tục trên nhiều site cần optional host permission đã được cấp. Không hứa cài xong detect mọi trang chỉ bằng `activeTab`; chi tiết chốt trong P1-101/105.

## Dịch và bổ sung dữ liệu từ

- Provider chọn rõ: Google Cloud Translation API chính thức hoặc AI API dùng key người dùng. Không dùng endpoint Google Translate không tài liệu hóa, cookie ChatGPT hoặc subscription ChatGPT làm credential API.
- Cụm/câu: chỉ dịch, kết quả tạm trong popup, không Add hoặc lưu lịch sử bền vững mặc định.
- Từ: kiểm tra cache DB trước; kết quả hợp lệ chứa POS, nghĩa và câu ví dụ. Lưu DB để dùng lần sau, độc lập với nút Add.
- Cache phân biệt user, ngôn ngữ, provider/version và nghĩa/sense khi cần. Nếu nghĩa/ngữ cảnh không phù hợp thì không tái dùng mù quáng.
- Google Translation không có POS/example trong response. D-P1-09 đã chốt: Google dịch nghĩa, AI BYOK bổ sung POS/ví dụ cho từ. UI cấu hình thể hiện rõ Google + AI cho từ; thiếu AI key và không có cache đầy đủ thì báo cần cấu hình, chưa bật Add. Google dịch cụm/câu không gọi AI; AI mode vẫn dịch mọi selection bằng AI.
- Enrichment/DB write lỗi: thông báo dữ liệu chưa đủ/chưa lưu; không bật Add hoặc giả hoàn tất.

## Add → batch → Quizlet

1. Add chỉ áp dụng word entry hợp lệ. Add idempotent, không tạo queue item trùng do double-click/retry.
2. Trong transaction, đếm các từ duy nhất, hợp lệ, đã Add và chưa thuộc batch. Đạt N đã cấu hình thì claim đúng N mục, tạo batch snapshot + payload + job bền vững cùng transaction. N do người dùng cấu hình, không có mặc định; chưa cấu hình thì không tự chạy.
3. Batch giữ nguyên term/definition/version dù word entry thay đổi về sau. Format `term<TAB>definition`, mỗi card một dòng; xử lý delimiter theo hợp đồng kiểm chứng.
4. Worker/adapter tạo bộ thẻ đúng tài khoản qua kênh được P1-102 xác minh và quyết định tích hợp chấp nhận. Không dùng endpoint riêng tư hoặc copy cookie. ADR-008 đã cho phép khảo sát thao tác giao diện Quizlet trong trình duyệt đã đăng nhập khi tích hợp chính thức chưa dùng được; chỉ production sau spike GO và contract/permission được khóa.
5. Ghi thành công chỉ khi có set ID/URL và bằng chứng chủ sở hữu phù hợp. Timeout có thể đã tạo set → UNKNOWN → đối soát trước retry. Local idempotency không tự bảo đảm Quizlet không tạo trùng.
6. Lỗi/quyền hết hạn không làm mất batch. Text import có thể hiển thị phục hồi, nhưng không tính là đã đạt mục tiêu tự tạo Quizlet.

“Bài học Quizlet” trong kế hoạch này là bộ thẻ có thể mở để học; không hứa tự tạo khóa Learn hoặc lesson object riêng nếu chưa được chứng minh.

## Inventory API đề xuất

P1-103 khóa OpenAPI sau prototype; đây chưa là hợp đồng ổn định.

| Command/query                    | Mục đích                                                                  |
| -------------------------------- | ------------------------------------------------------------------------- |
| POST /translations               | Dịch selection; word có entry ID/trạng thái persist, text chỉ có bản dịch |
| POST /words/{id}/add             | Add idempotent theo quyền sở hữu                                          |
| GET /quizlet-batches/{id}        | Payload/status/phục hồi, không secret                                     |
| POST /quizlet-batches/{id}/retry | Chỉ retry khi outcome đã xác minh an toàn                                 |
| PUT /settings/translation        | Provider/model/reference key; không trả lại key                           |
| PUT /settings/quizlet            | N/kênh/tài khoản/quyền tự tạo sau khi được chốt                           |

REST + polling trạng thái job đủ cho Phase 1. PostgreSQL giữ state; job sống qua restart. Provider adapter có timeout/retry giới hạn; write bên ngoài phụ thuộc capability thực tế. Auth, nơi deploy và vòng đời BYOK là cổng P1-104, không mặc định deploy public không xác thực.

## Mở rộng và kiểm chứng

Index theo owner/lookup key, phân trang queue/batch; không tải toàn bộ từ vào RAM. Giữ public interface để thêm tính năng sau. Cache phân tán, broker hoặc tách service chỉ thêm khi tải đo được cần và có ADR. Chat/MCP/dashboard/scheduler cũ HOÃN, chưa có lịch mở lại.

Cổng kiến trúc: module dependency test; OpenAPI/client compatibility; provider fault tests; DB migration/concurrency; user isolation; secret artifact scan; restart worker/job và reconciliation. Nguồn xác minh provider: [khảo sát khả thi](product/phase-1-provider-feasibility.md).
