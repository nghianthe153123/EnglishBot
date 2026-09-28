# ADR-005: Cấu trúc repository và build

- Trạng thái: Chấp nhận
- Ngày: 2026-09-28
- Chủ sở hữu: Chủ dự án
- Liên quan: D-001, D-002, D-003, D-004, D-009, D-301, D-302; P0-002

## Bối cảnh

EnglishBot cần một nền monorepo có thể dựng lại từ checkout sạch, đồng thời giữ ranh giới rõ giữa backend Java, hai bề mặt React và các package TypeScript dùng chung. Phase 0 không được tạo trước domain hoặc tích hợp ngoài.

## Quyết định

- Dùng một Git monorepo.
- Backend dùng Java 21, Spring Boot 4.1.1 và Maven multi-module.
- Maven Wrapper ghim Maven 3.9.11 là lệnh build chuẩn.
- Workspace frontend dùng Node.js 24.16.0 và `pnpm` 11.7.0.
- `apps/extension` và `apps/web` là hai bề mặt React độc lập.
- `packages/api-contracts`, `packages/ui` và `packages/mock-fixtures` là package TypeScript dùng chung, hiện chỉ có marker tối thiểu.
- `backend/application` là composition root; `backend/platform` chỉ là module hạ tầng tối thiểu. Module nghiệp vụ chỉ được thêm bởi work package của phase sau.
- Chưa dùng công cụ orchestration bổ sung như Turborepo; Maven và `pnpm` đủ cho quy mô hiện tại.
- UTF-8 và LF là chuẩn text của repository; script Windows giữ CRLF khi cần.

## Hệ quả

- Một checkout sạch cần JDK 21 và Node 24; Maven không cần cài toàn cục vì dùng wrapper.
- Local chỉ có JDK 17 có thể chạy build backend qua container JDK 21.
- Việc tách module sau này có đường dẫn rõ, nhưng chưa phát sinh abstraction nghiệp vụ sớm.
- Mọi thay đổi version nền phải cập nhật file ghim, README và ADR thay thế hoặc ADR bổ sung.

## Phương án không chọn

- Multi-repo: tăng chi phí đồng bộ hợp đồng ở giai đoạn đầu.
- Gradle: Maven phù hợp quyết định đã duyệt và giảm thêm một lựa chọn tooling.
- Microservice từ đầu: tăng độ phức tạp vận hành khi chưa có bằng chứng cần scale độc lập.
- Tool orchestration JavaScript bổ sung: chưa có nhu cầu đo được trong Phase 0.
