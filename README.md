# EnglishBot

EnglishBot là hệ thống học tiếng Anh có AI hỗ trợ, được xây dựng quanh tiện ích mở rộng Chrome/Edge, backend Java, bảng điều khiển web và giao diện MCP dành cho ChatGPT. Dự án tuân theo quy trình ưu tiên bản mô phỏng và hợp đồng, để giao diện, dữ liệu và ranh giới module được xác thực trước khi bổ sung logic production.

## Trạng thái hiện tại

- Trạng thái: Phase 0 đã hoàn tất và được CI xác minh
- Phase đang hoạt động: chưa có; Phase 1 chờ lập kế hoạch chi tiết
- Code production: chưa bắt đầu
- Kiến trúc: modular monolith, được thiết kế để có thể tách module về sau
- Backend chính: Java và Spring Boot
- Tiện ích trình duyệt và bảng điều khiển: React và TypeScript

## Khởi tạo môi trường phát triển

### Yêu cầu

- JDK 21 (Temurin hoặc bản phân phối tương thích).
- Node.js 24.16.0, được ghi tại `.nvmrc`.
- `pnpm` 11.7.0, được khóa trong `package.json`.
- Git. Maven toàn cục không bắt buộc vì repository có Maven Wrapper 3.9.11.

### Lệnh chuẩn

```bash
pnpm install --frozen-lockfile
pnpm run verify:all
```

Hoặc chạy riêng từng cổng để truy nguyên lỗi:

```bash
pnpm run quality
pnpm run docs:check
pnpm run secrets:scan
./mvnw --batch-mode --no-transfer-progress verify
```

Trên Windows, dùng `mvnw.cmd` thay cho `./mvnw`. Phase 0 không cần database, Docker, tài khoản OpenAI hoặc secret thật. Sao chép `.env.example` thành `.env` chỉ khi một phase sau yêu cầu cấu hình local; `.env` luôn bị Git bỏ qua.

## Bản đồ tài liệu

Đọc các tài liệu theo thứ tự sau trước khi triển khai code:

1. [Tuyên bố dự án](docs/00-project-charter.md)
2. [Yêu cầu sản phẩm](docs/01-product-requirements.md)
3. [Hệ thống UX và UI](docs/02-ux-ui-system.md)
4. [Kiến trúc hệ thống](docs/03-system-architecture.md)
5. [Mô hình dữ liệu](docs/04-data-model.md)
6. [Lộ trình bàn giao](docs/05-delivery-roadmap.md)
7. [Chiến lược kiểm thử](docs/06-testing-strategy.md)
8. [Quy trình thực thi bằng AI](docs/07-ai-execution-playbook.md)
9. [Bảo mật và quyền riêng tư](docs/08-security-privacy.md)
10. [Cấu trúc phân rã công việc](docs/09-work-breakdown.md)
11. [Truy vết yêu cầu](docs/10-traceability.md)
12. [Danh sách quyết định cần chốt](docs/11-decisions-to-lock.md)
13. [Trạng thái dự án hiện tại](docs/status/STATUS.md)
14. [Môi trường, biến cấu hình và secret](docs/12-environments-and-secrets.md)

Các quyết định kiến trúc được lưu trong [`docs/decisions`](docs/decisions). Các template lập kế hoạch tái sử dụng được lưu trong [`docs/templates`](docs/templates).

Kế hoạch thực thi chi tiết nằm tại [`docs/phases`](docs/phases). [Phase 0 — Nền tảng và khóa quy trình](docs/phases/phase-00-foundation.md) đã hoàn tất; bằng chứng nằm tại [báo cáo kết thúc Phase 0](docs/phases/phase-00-closeout.md). [Kế hoạch Phase 1](docs/phases/phase-01-product-ui-architecture.md) đang chờ chủ dự án duyệt trước khi P1-001 được bắt đầu.

## Nguyên tắc bàn giao

Thứ tự bắt buộc:

```text
Phạm vi sản phẩm
  -> Luồng UI và ranh giới hệ thống
  -> Ứng dụng mô phỏng có thể chạy được
  -> Hợp đồng API đã được xác thực
  -> Thiết kế database đã được xác thực
  -> Lát cắt production xuyên suốt đầu tiên
  -> Các module tính năng
  -> Các tích hợp
  -> Gia cố và phát hành
```

Không tính năng production nào được bỏ qua thứ tự này nếu chưa có quyết định kiến trúc được ghi nhận.

## Định nghĩa hoàn thành

Một gói công việc chỉ hoàn thành khi:

- Các tiêu chí nghiệm thu đều đạt.
- Các kiểm thử tự động bắt buộc đều đạt.
- Bằng chứng thủ công hoặc trực quan được ghi lại khi có yêu cầu.
- Các kiểm tra bảo mật và quyền riêng tư liên quan đều đạt.
- Tài liệu và bảng truy vết đã được cập nhật.
- Không phát sinh phạm vi ngoài yêu cầu.
- Mọi giới hạn còn lại được ghi rõ.
