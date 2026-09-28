# Kiến trúc hệ thống

## Kiểu kiến trúc

EnglishBot bắt đầu dưới dạng modular monolith với các module có thể kiểm thử độc lập. Cách này giữ deployment và transaction đơn giản, đồng thời tạo ranh giới rõ ràng để tách thành dịch vụ về sau.

## Các thành phần runtime

```text
Tiện ích Chrome/Edge            Bảng điều khiển web
React + TypeScript              React + TypeScript
          \                         /
           \ HTTPS + SSE           /
            v                     v
             Backend EnglishBot
              Java/Spring Boot
  ┌──────────────┬──────────────┬──────────────┐
  │ Thu thập/Chat│ Từ vựng      │ Tích hợp     │
  │ Truy xuất    │ Học tập      │ MCP/Quizlet  │
  └──────────────┴──────────────┴──────────────┘
       │              │                │
       v              v                v
 PostgreSQL/pgvector Redis        OpenAI/MCP/TTS
       │
       v
 Object storage cho artifact tùy chọn cần lưu lại
```

## Ranh giới module backend

| Module                | Sở hữu                                                          | Có thể phụ thuộc vào           |
| --------------------- | --------------------------------------------------------------- | ------------------------------ |
| `identity`            | Người dùng, thiết bị, phiên, ngữ cảnh phân quyền                | shared kernel                  |
| `capture`             | Vòng đời bản thu thập, metadata tài liệu, kết quả làm sạch      | identity, shared kernel        |
| `retrieval`           | Chia chunk, embedding, tìm kiếm ngữ nghĩa/từ khóa, anchor nguồn | interface của capture          |
| `conversation`        | Hội thoại, tin nhắn, điều phối câu trả lời, citation            | retrieval, AI gateway          |
| `vocabulary`          | Lexeme, nghĩa, lần gặp, trạng thái từ của người dùng            | identity, tham chiếu capture   |
| `learning`            | Lịch ôn, lần làm bài, bài học, mục bài học                      | interface của vocabulary       |
| `integration-mcp`     | Xác thực MCP, tool, resource, audit                             | chỉ public application service |
| `integration-quizlet` | Ánh xạ import/export và sync job                                | interface của vocabulary       |
| `ai-gateway`          | Request OpenAI, structured output, TTS, telemetry chi phí       | chỉ hạ tầng                    |
| `platform`            | Database, cache, job, storage, observability                    | không sở hữu domain            |

Quy tắc:

- Một module sở hữu bảng và invariant của mình.
- Module khác gọi application service hoặc nhận event đã công bố.
- Controller không truy cập repository trực tiếp.
- Domain module không import kiểu dữ liệu của OpenAI SDK.
- Payload đặc thù provider không được rò vào domain entity.

## Cấu trúc repository đề xuất

```text
apps/
├── extension/                 Tiện ích trình duyệt React/TypeScript
└── web/                       Dashboard React/TypeScript

backend/
├── application/               Phần lắp ráp Spring Boot
├── modules/
│   ├── identity/
│   ├── capture/
│   ├── retrieval/
│   ├── conversation/
│   ├── vocabulary/
│   ├── learning/
│   ├── integration-mcp/
│   └── integration-quizlet/
├── gateways/
│   └── ai-gateway/
└── platform/

packages/
├── api-contracts/             TypeScript client/type sinh từ OpenAPI
├── ui/                        UI component/token dùng chung
└── mock-fixtures/             Kịch bản sản phẩm xác định
```

Cấu trúc build system chính xác được khóa trong ADR của Phase 0 trước khi scaffold code.

## Luồng dữ liệu cốt lõi

### Thu thập và trả lời

1. Tiện ích yêu cầu quyền active-tab sau thao tác của người dùng.
2. Content script trích xuất dữ liệu DOM được hỗ trợ trong isolated world.
3. Tiện ích loại bỏ các trường có vẻ chứa secret và gửi bản thu thập đã giới hạn kích thước.
4. Backend phân quyền, làm sạch, băm, chống trùng và lưu theo chính sách retention.
5. Retrieval lập chỉ mục chunk khi nội dung vượt ngưỡng truyền trực tiếp vào ngữ cảnh.
6. Conversation yêu cầu retrieval cung cấp các chunk nguồn liên quan.
7. AI gateway gửi instruction đáng tin cậy tách biệt với nội dung không đáng tin cậy.
8. Đầu ra câu trả lời/citation có cấu trúc được xác thực.
9. SSE stream event hiển thị tới client.

### Chọn văn bản và từ vựng

1. Tiện ích ghi nhận vùng chọn cùng ngữ cảnh xung quanh đã giới hạn.
2. Vocabulary chuẩn hóa nội dung mà không làm mất dạng gốc.
3. AI hoặc nguồn từ điển bổ sung nghĩa theo ngữ cảnh.
4. Khi lưu, hệ thống tạo hoặc cập nhật `user_word` và thêm một encounter.
5. Learning sử dụng bằng chứng encounter/review nhưng không suy ra mastery chỉ từ độ khó của trang.

### Truy cập MCP

1. Người dùng liên kết MCP client bằng OAuth hoặc luồng liên kết tài khoản tương đương đã được phê duyệt.
2. Người dùng tạo share grant có thời hạn ngắn cho một bản thu thập.
3. MCP tool xác thực tài khoản, scope, quyền sở hữu capture, thời hạn và quyền tool.
4. MCP tìm kiếm hoặc trả về các chunk đã giới hạn, không bao giờ trả credential trình duyệt.
5. Việc truy cập được ghi log và có thể thu hồi.

## Kiểu API

- REST cho CRUD và command.
- SSE cho stream câu trả lời model và tiến độ job.
- OpenAPI là nguồn sự thật cho HTTP API nội bộ.
- MCP Streamable HTTP cho MCP client.
- Idempotency key cho tạo capture, gửi review và tạo export.
- Phân trang bằng cursor cho dữ liệu lịch sử.
- Chi tiết lỗi theo kiểu RFC 7807.

## Kế hoạch scale

### Beta ban đầu

- Một backend deployment với nhiều instance không trạng thái nếu cần.
- PostgreSQL là system of record và vector store.
- Redis dùng cho cache ngắn hạn, rate limiting và điều phối phân tán.
- Bảng scheduled/job dùng cho công việc nền bền vững.

### Điều kiện kích hoạt việc tách module

Chỉ tách module khi tồn tại ít nhất một điều kiện:

- Nhiều lần cần scale độc lập và đã đo lường được.
- Nhịp deployment bị module không liên quan cản trở.
- Cần cô lập vì bảo mật/tuân thủ.
- Có bằng chứng đo lường về tranh chấp database.
- Module cần runtime khác biệt đáng kể.

Ứng viên tách đầu tiên có khả năng là worker AI/retrieval và worker tích hợp. Identity, vocabulary và learning nên ở cùng nhau cho đến khi ranh giới transaction trở thành vấn đề đo được.

## Môi trường triển khai

| Môi trường | Mục đích                                      | Chính sách dữ liệu                     |
| ---------- | --------------------------------------------- | -------------------------------------- |
| Local      | Phát triển và kiểm thử xác định               | Mặc định chỉ dùng fixture tổng hợp     |
| CI         | Cổng chất lượng tự động                       | Container và fixture tạm thời          |
| Staging    | Kiểm thử tích hợp, UAT và đánh giá model thật | Tài khoản test không nhạy cảm          |
| Production | Beta/sử dụng thật                             | Mã hóa, lưu theo chính sách người dùng |

## Cổng chất lượng kiến trúc

- ArchUnit kiểm tra các phụ thuộc module bị cấm.
- Hợp đồng API sinh hoặc xác thực type phía client.
- Database migration chạy được từ database trống và snapshot bản phát hành trước.
- Tích hợp bên ngoài có contract test và mô phỏng lỗi.
- Observability gồm request ID, error ID an toàn cho người dùng, module, độ trễ, token sử dụng và trạng thái job.
