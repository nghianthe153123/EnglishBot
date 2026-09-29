# Phase 0 — Nền tảng và khóa quy trình

- Trạng thái: HOÀN_TẤT
- Thời lượng: 1 tuần
- Ngân sách: 20–30 giờ tập trung của chủ dự án
- Tỷ lệ kiểm thử/review: tối thiểu 25%
- Code tính năng sản phẩm: không
- Gói công việc: P0-001 đến P0-004

## 1. Mục tiêu

Phase 0 tạo nền móng có thể kiểm chứng để AI bắt đầu làm việc mà không tự chọn kiến trúc, công cụ hoặc phạm vi. Kết thúc phase, một người hoặc AI mới tham gia phải có thể đọc tài liệu, dựng repository sạch, chạy cổng chất lượng và biết chính xác task nào được phép thực hiện tiếp theo.

Phase 0 không tạo tính năng EnglishBot cho người dùng cuối.

## 2. Điều kiện đầu vào

- [x] Chủ dự án đã phê duyệt hướng sản phẩm tổng thể.
- [x] D-001 đến D-010 đã được chấp nhận.
- [x] ADR-001 đến ADR-004 đã được chấp nhận.
- [x] Roadmap, testing strategy, security plan và AI playbook đã tồn tại.
- [x] Kế hoạch thực thi Phase 0 này được chủ dự án duyệt.

## 3. Kết quả bắt buộc

1. Repository Git được khởi tạo với cấu trúc monorepo đã duyệt.
2. Version runtime và package manager được ghim hoặc ghi rõ.
3. Backend Maven multi-module và frontend `pnpm` workspace có skeleton tối thiểu, chưa chứa tính năng sản phẩm.
4. Có lệnh chuẩn để format, lint, test, build và kiểm tra tài liệu.
5. Có môi trường local tối thiểu và quy ước biến môi trường/secret.
6. Có CI tối thiểu chạy được từ trạng thái sạch.
7. Có ADR về repository/build layout và quyết định công cụ cụ thể.
8. Một gói công việc được chạy thử xuyên suốt quy trình AI, có test evidence và review.
9. Có báo cáo đóng Phase 0 và trạng thái Phase 1 rõ ràng.

## 4. Ngoài phạm vi

- Không xây UI EnglishBot.
- Không gọi OpenAI API thật.
- Không thiết kế schema nghiệp vụ V1.
- Không triển khai auth, capture, MCP hoặc Quizlet.
- Không tạo abstraction nghiệp vụ để “dùng sau”.
- Không chọn hạ tầng production cuối cùng.

## 5. Các quyết định đã khóa

| Chủ đề      | Quyết định áp dụng                                              |
| ----------- | --------------------------------------------------------------- |
| Kiến trúc   | Java modular monolith                                           |
| Runtime     | Java 21 LTS hoặc LTS mới hơn sau kiểm tra tương thích           |
| Backend     | Spring Boot, Maven multi-module                                 |
| Frontend    | React + TypeScript, `pnpm` workspace                            |
| Repository  | Monorepo                                                        |
| Quy trình   | Mock-first, contract-first, DB sau mock UI                      |
| UI chính    | Extension side panel; MCP là kênh bổ sung                       |
| Trình duyệt | Chrome trước, Edge kiểm tra tương thích                         |
| Quyền       | `activeTab`, không dùng quyền rộng nếu chưa có lý do được duyệt |
| Quizlet     | Import/export trước, không dùng endpoint không chính thức       |

## 6. Kế hoạch theo ngày

### Ngày 1 — P0-001: khóa đường cơ sở

Thời gian: 2–3 giờ.

- Đối soát tài liệu với quyết định đã phê duyệt.
- Chuyển ADR-001 đến ADR-004 sang `Chấp nhận`.
- Ghi phiên duyệt tổng thể vào decision register.
- Xác minh không còn quyết định Phase 0 ở trạng thái chưa chốt.

Kết quả: đường cơ sở quyết định có thể truy vết.

Trạng thái hiện tại: đã hoàn tất nhờ phê duyệt ngày 2026-09-28.

### Ngày 2 — P0-002: repository và build layout

Thời gian: 5–7 giờ.

- Khởi tạo Git repository.
- Tạo cấu trúc thư mục đã duyệt cho `apps`, `backend`, `packages` và `docs`.
- Tạo Maven parent và module skeleton tối thiểu.
- Tạo `pnpm` workspace và package skeleton tối thiểu.
- Ghim hoặc ghi version Java, Maven, Node và pnpm.
- Thêm `.gitignore`, `.editorconfig` và quy ước encoding UTF-8.
- Ghi ADR repository/build layout.

Không được thêm logic tính năng hoặc dependency chưa cần thiết.

### Ngày 3 — P0-003: môi trường, secret và CI

Thời gian: 5–7 giờ.

- Tạo `.env.example` chỉ chứa tên biến và giá trị giả an toàn.
- Ghi quy tắc secret local/CI/production.
- Tạo lệnh chuẩn format, lint, test, build và docs-check.
- Tạo CI tối thiểu cho backend, frontend và tài liệu.
- Thiết lập dependency/secret scan tối thiểu.
- Ghi ma trận môi trường local, CI, staging, production ở mức nền tảng.

Không yêu cầu OpenAI key thật ở Phase 0.

### Ngày 4 — P0-004: chạy thử quy trình AI

Thời gian: 4–6 giờ.

- Chọn một thay đổi tooling nhỏ, ưu tiên kiểm tra tính toàn vẹn tài liệu.
- Thực hiện đủ trạng thái gói công việc từ `SẴN_SÀNG` đến `ĐANG_REVIEW`.
- Chạy test/lệnh kiểm tra thật và lưu bằng chứng.
- Review diff theo giới hạn phạm vi và `AGENTS.md`.
- Ghi điểm chưa rõ hoặc phần playbook cần điều chỉnh.

Không dùng tính năng sản phẩm làm task thử nghiệm.

### Ngày 5 — Cổng kết thúc và dự phòng

Thời gian: 4–7 giờ.

- Chạy toàn bộ cổng chất lượng từ trạng thái sạch.
- Kiểm tra build có thể tái tạo.
- Kiểm tra không có secret trong repository/artifact.
- Kiểm tra tài liệu và liên kết nội bộ.
- Sửa lỗi Phase 0.
- Tạo báo cáo closeout và đề xuất gói đầu tiên của Phase 1.

## 7. Gói công việc

| ID     | Tên                           | Trạng thái khi trình duyệt | Phụ thuộc      | Sản phẩm                          |
| ------ | ----------------------------- | -------------------------- | -------------- | --------------------------------- |
| P0-001 | Phê duyệt đường cơ sở         | HOÀN_TẤT                   | Không          | Hồ sơ phê duyệt                   |
| P0-002 | Khóa repository/build layout  | HOÀN_TẤT                   | P0-001         | Monorepo skeleton + ADR           |
| P0-003 | Môi trường, secret và cổng CI | HOÀN_TẤT                   | P0-002         | CI/env/tooling baseline           |
| P0-004 | Chạy thử quy trình AI         | HOÀN_TẤT                   | P0-002, P0-003 | Test evidence + cải tiến playbook |

File chi tiết:

- [`P0-001`](../work-packages/P0-001-approve-baseline.md)
- [`P0-002`](../work-packages/P0-002-repository-build-layout.md)
- [`P0-003`](../work-packages/P0-003-environments-secrets-ci.md)
- [`P0-004`](../work-packages/P0-004-ai-workflow-dry-run.md)

## 8. Kế hoạch kiểm thử

### Tài liệu

- Mọi liên kết Markdown nội bộ hợp lệ.
- Không có quyết định Phase 0 mâu thuẫn giữa README, ADR, status và phase plan.
- Work package tuân thủ template bắt buộc.

### Repository/build

- Có thể dựng từ checkout sạch theo đúng README.
- Backend skeleton compile và test được.
- Frontend workspace install, type-check, lint, test và build được.
- Lệnh thất bại trả mã thoát khác 0.
- Cùng một lệnh chạy được local và CI.

### Bảo mật

- Không chứa API key hoặc token thật.
- `.env` local, credential và artifact nhạy cảm bị ignore.
- Secret scanner không phát hiện secret chưa xử lý.
- Log CI không in giá trị secret.

### Quy trình AI

- Một gói công việc có scope, tiêu chí, test và completion report đầy đủ.
- AI không sửa file ngoài phạm vi mà không ghi lý do.
- Test evidence ghi đúng lệnh đã chạy và kết quả thực.

## 9. Cổng kết thúc Phase 0

- [x] P0-001 đến P0-004 ở trạng thái `HOÀN_TẤT`.
- [x] Git repository được khởi tạo và trạng thái sạch sau commit phase.
- [x] ADR repository/build layout được chấp nhận.
- [x] Build skeleton backend/frontend đạt.
- [x] CI tối thiểu đạt.
- [x] Kiểm tra tài liệu đạt.
- [x] Secret scan đạt.
- [x] Có test evidence cho dry run.
- [x] Không có lỗi S1/S2.
- [x] Báo cáo closeout được hoàn tất theo yêu cầu thực thi toàn bộ Phase 0 của chủ dự án.

Nếu một điều kiện không đạt, Phase 1 chưa được bắt đầu.

## 10. Rủi ro và cách kiểm soát

| Rủi ro                        | Cách kiểm soát                                                        |
| ----------------------------- | --------------------------------------------------------------------- |
| Scaffold quá mức              | Chỉ tạo skeleton và lệnh chất lượng, không tạo domain abstraction     |
| AI thêm dependency tùy tiện   | Mọi dependency mới phải nằm trong P0-002 hoặc có ADR                  |
| Toolchain không đồng nhất     | Ghim version hoặc ghi rõ version tối thiểu; CI dùng cùng version      |
| CI xanh giả vì chưa chạy test | Mỗi job phải có kiểm tra có ý nghĩa và fail thử một lần trong dry run |
| Secret bị commit              | `.gitignore`, `.env.example`, secret scan và review artifact          |
| Phase 0 kéo dài               | Giới hạn một tuần; việc không cần cho Phase 1 đưa vào backlog         |

## 11. Điều kiện để bắt đầu thực thi

Sau khi đọc tài liệu này, chủ dự án xác nhận: **“Duyệt Phase 0, bắt đầu P0-002.”**

Xác nhận đó sẽ:

1. Chuyển Phase 0 sang `ĐANG_THỰC_HIỆN`.
2. Chuyển P0-002 từ `NHÁP` sang `SẴN_SÀNG`.
3. Cho phép khởi tạo Git và scaffold repository/build.
4. Không cho phép triển khai tính năng sản phẩm.
