# EnglishBot

EnglishBot giúp người học tiếng Anh tra nhanh từ, cụm từ và câu ngay trên trang đang đọc, lưu dữ liệu từ vựng hữu ích và đưa các từ đã chọn vào bộ thẻ Quizlet.

## Phạm vi hiện hành

Phase 1 tập trung vào một luồng extension gọn:

- Người dùng chọn văn bản; extension hiện hành động cục bộ và chỉ gửi yêu cầu sau khi người dùng bấm **Dịch**.
- Dịch mọi selection bằng Google Cloud Translation API hoặc AI BYOK theo lựa chọn người dùng. Với từ ở Google mode, AI BYOK bổ sung POS/câu ví dụ nếu cache chưa đủ; giao diện nêu rõ enrichment này.
- Popup nhỏ mở cạnh con trỏ. Từ đơn có từ loại, nghĩa và câu ví dụ; ba trường được lưu trong database để tái sử dụng. Cụm/câu chỉ có bản dịch nghĩa.
- Nút **Add** riêng đưa từ hợp lệ vào hàng đợi. Người dùng cấu hình ngưỡng N; nếu chưa cấu hình, hệ thống yêu cầu thiết lập và chưa tạo batch. Khi đạt ngưỡng, EnglishBot tạo text import và tự tạo bộ thẻ trong tài khoản Quizlet người dùng qua kênh đã kiểm chứng.

Chat, thu thập toàn trang, dashboard, MCP server, TTS, word family, lesson/scheduler và mastery nội bộ không thuộc Phase 1. Trong phạm vi này, bộ thẻ Quizlet là đầu ra học tập. Text import thủ công không đáp ứng yêu cầu tự tạo Quizlet.

## Trạng thái dự án

- Phase 0 đã hoàn tất; phạm vi P1-001 cũ đã được thay thế qua P1-R01 và giữ làm lịch sử.
- P1-R01 đã qua cổng điều chỉnh tài liệu ngày 2026-09-30. Kế hoạch hiện hành gồm P1-101..109; chưa có tính năng production được xác nhận hoàn tất.
- P1-101 hoàn tất cổng UX/đặc tả sau phê duyệt owner ngày 2026-10-01. P1-103 đã có prototype local và hợp đồng nháp để review; chưa hoàn tất cổng owner/zoom trình duyệt thật và chưa tích hợp dịch/DB/Quizlet production.
- Công nghệ đã chốt: Java/Spring Boot cho backend, React/TypeScript cho extension và modular monolith. Provider/model, auth, schema và chi tiết tích hợp vẫn đang được xác minh.
- N do người dùng cấu hình; chưa có giá trị mặc định. Với từ ở Google mode, Google dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ theo quyết định đã chốt; cache đầy đủ được dùng lại mà không gọi provider.
- Owner cho phép khảo sát browser automation Quizlet nếu kênh chính thức không khả dụng; feasibility proof và lựa chọn triển khai vẫn cần hoàn tất.

## Khởi tạo môi trường

### Yêu cầu

- JDK 21 (Temurin hoặc tương thích).
- Node.js 24.16.0 theo `.nvmrc`.
- `pnpm` 11.7.0 theo `package.json`.
- Git. Maven toàn cục không bắt buộc vì repository có Maven Wrapper 3.9.11.

### Lệnh chuẩn

```bash
pnpm install --frozen-lockfile
pnpm run verify:all
```

Có thể chạy riêng `pnpm run quality`, `pnpm run docs:check`, `pnpm run secrets:scan` và `./mvnw --batch-mode --no-transfer-progress verify`. Trên Windows dùng `mvnw.cmd`. Dùng fixture cho kiểm thử; không cần key provider thật để chạy cổng tài liệu.

## Xem prototype P1-103

```text
pnpm install --frozen-lockfile
pnpm run dev:mock
```

Mở `http://127.0.0.1:4173/`, chọn **Tiện ích** → bật tab hiện tại (mock), rồi chọn Google/AI trong **Cài đặt**. Bôi đen từ/câu trong bài mẫu và bấm **Dịch**. Khu vực kiểm thử cho phép mô phỏng key/lỗi/cache/Quizlet; không nhập credential thật. Dữ liệu chỉ trong bộ nhớ và chỉ có các fixture mẫu.

[Hợp đồng/walkthrough](docs/design/p1-103-contract-review.md) và [bằng chứng triển khai](docs/evidence/P1-103-implementation-review.md) nêu test đã chạy, ảnh và cổng còn thiếu. Host này không phải extension đã cài hoặc dashboard. Dừng trước P1-104 tới khi hợp đồng/mock được duyệt và đủ test bắt buộc.

## Tài liệu dự án

- [Tuyên bố dự án](docs/00-project-charter.md)
- [Yêu cầu sản phẩm](docs/01-product-requirements.md)
- [Hệ thống UX/UI](docs/02-ux-ui-system.md)
- [Kiến trúc](docs/03-system-architecture.md)
- [Mô hình dữ liệu](docs/04-data-model.md)
- [Lộ trình](docs/05-delivery-roadmap.md)
- [Chiến lược kiểm thử](docs/06-testing-strategy.md)
- [Trạng thái](docs/status/STATUS.md)
- [P1-R01 — lập lại phạm vi Phase 1](docs/work-packages/P1-R01-scope-rebaseline.md)
- [Design system Wirefigma](docs/design/reference/WIREFIGMA_DESIGN_SYSTEM.md)

## Nguyên tắc bàn giao

Phạm vi và hành trình được xác nhận trước luồng mô phỏng, hợp đồng, database rồi mới đến code production. Mỗi gói phải có tiêu chí nghiệm thu, kiểm thử và bằng chứng phù hợp; xem [playbook thực thi bằng AI](docs/07-ai-execution-playbook.md). Tài liệu cũ được giữ như lịch sử khi đã đánh dấu thay thế/hoãn.
