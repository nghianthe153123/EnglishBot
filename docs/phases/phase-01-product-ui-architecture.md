# Phase 1 — Phạm vi sản phẩm, hướng UI và kiến trúc hệ thống

- Trạng thái: CHỜ_DUYỆT_KẾ_HOẠCH_THỰC_THI
- Thời lượng: 3 tuần, 15 ngày làm việc
- Ngân sách: 60–90 giờ tập trung của chủ dự án
- Tỷ lệ kiểm thử/review dự kiến: 25–30%
- Code tính năng sản phẩm: không
- Gói công việc: P1-001 đến P1-007

## 1. Mục tiêu

Phase 1 chuyển đường cơ sở sản phẩm thành một bộ thiết kế có thể dùng trực tiếp để xây ứng dụng mô phỏng ở Phase 2. Kết thúc phase, phạm vi MVP, hành trình người dùng, cấu trúc thông tin, wireframe, trạng thái UI, ranh giới runtime, threat model và danh mục hợp đồng phải nhất quán và được chủ dự án duyệt.

Phase 1 trả lời bốn câu hỏi trước khi viết UI thực tế:

1. EnglishBot phục vụ ai, giải quyết hành trình nào và phần nào không thuộc beta?
2. Người dùng thấy gì và làm gì trên extension, selection popup, dashboard, MCP và Quizlet?
3. Thành phần hệ thống nào chịu trách nhiệm cho từng hành động, dữ liệu và lỗi?
4. Phase 2 phải mô phỏng những trạng thái nào để kiểm chứng thiết kế trước khi khóa API/database?

## 2. Điều kiện đầu vào

- [x] Phase 0 đã hoàn tất và CI đạt.
- [x] PRD, UX baseline, kiến trúc, bảo mật, roadmap và decision register tồn tại.
- [x] D-101 đến D-112 đã được chấp nhận làm hướng ban đầu.
- [x] P1-001 đến P1-007 có ID ổn định trong WBS.
- [ ] Kế hoạch thực thi Phase 1 này được chủ dự án duyệt.

## 3. Kết quả bắt buộc

1. Persona chính, bối cảnh sử dụng và năm hành trình J1–J5 được xác thực.
2. Phạm vi MVP/beta và ưu tiên Bắt buộc/Nên có/Có thể được đối soát, không còn mâu thuẫn.
3. Information architecture và thuật ngữ chung cho extension/dashboard được khóa.
4. Wireframe độ chi tiết thấp bao phủ extension, selection popup, dashboard và luồng tích hợp.
5. Catalog trạng thái UI bao phủ trạng thái bình thường, trống, tải, lỗi, offline, hết hạn và bị từ chối quyền.
6. Semantic design token, breakpoint mục tiêu và chuẩn accessibility được định nghĩa đủ cho Phase 2.
7. System context, runtime/container, ranh giới module, luồng dữ liệu, failure mode và observability được chốt.
8. Threat model cho J1–J5, đặc biệt capture, nội dung không đáng tin, MCP và retention, được review.
9. Danh mục operation HTTP/SSE và MCP tool ở mức nháp được ánh xạ từ hành động UI.
10. Backlog/kịch bản mock Phase 2 có đầu vào rõ ràng và không yêu cầu AI tự suy đoán sản phẩm.

## 4. Ngoài phạm vi

- Không xây component React, Storybook hoặc ứng dụng mô phỏng chạy được; đó là Phase 2.
- Không viết controller/service production hoặc gọi OpenAI thật.
- Không tạo OpenAPI hoàn chỉnh, generated client hoặc hợp đồng ổn định; đó là Phase 3.
- Không thiết kế schema vật lý, migration, index hoặc repository.
- Không chọn provider auth/hosting cuối cùng nếu spike chưa hoàn tất.
- Không triển khai MCP server hoặc đồng bộ trực tiếp Quizlet.
- Không tạo visual high-fidelity cuối cùng; Phase 1 ưu tiên luồng, trạng thái và khả năng kiểm chứng.

## 5. Quyết định phải xác thực hoặc khóa

| Nhóm           | Nội dung cần khóa                                                           | Nguồn hiện tại               |
| -------------- | --------------------------------------------------------------------------- | ---------------------------- |
| Sản phẩm       | MVP, persona, J1–J5, ưu tiên và non-goal                                    | D-101, PRD                   |
| Extension      | Ba tab `Chat`, `Từ vựng`, `Bài học`; consent capture; citation              | D-102, D-110 đến D-112       |
| Dashboard      | Route beta, hierarchy, điều hướng và empty state                            | D-103                        |
| Hình ảnh       | Gọn, học thuật, dễ đọc; light/dark theo hệ thống                            | D-104                        |
| Nội dung       | UI tiếng Việt, nội dung học song ngữ, thuật ngữ thống nhất                  | D-105                        |
| Accessibility  | WCAG 2.2 AA khi khả thi; keyboard/focus/reduced motion                      | D-106, NFR-08                |
| Thiết lập học  | Giọng Anh-Mỹ/Anh-Anh và onboarding CEFR                                     | D-107, D-108                 |
| Trình duyệt    | Chrome trước, Edge kiểm tra tương thích                                     | D-109                        |
| Quyền riêng tư | `activeTab`, consent rõ ràng, retention mặc định 24 giờ, không lưu HTML thô | ADR-003, D-201, D-202        |
| Kiến trúc      | Modular monolith, OpenAPI, REST + SSE, MCP Streamable HTTP                  | ADR-001, D-305, D-306, D-501 |

Quyết định đã chấp nhận không tự động bị thay đổi. Nếu walkthrough tìm thấy mâu thuẫn, gói liên quan phải tạo đề xuất ADR/decision update và dừng phần phụ thuộc cho tới khi chủ dự án duyệt.

## 6. Sản phẩm tài liệu dự kiến

Các work package sẽ tạo hoặc hoàn thiện các tài liệu sau:

```text
docs/product/phase-1-scope-and-journeys.md
docs/design/phase-1-information-architecture.md
docs/design/phase-1-extension-wireframes.md
docs/design/phase-1-dashboard-and-integrations.md
docs/design/phase-1-design-foundations.md
docs/architecture/phase-1-runtime-design.md
docs/security/phase-1-threat-model.md
docs/contracts/phase-1-operation-inventory.md
docs/evidence/phase-1-review-evidence.md
docs/phases/phase-01-closeout.md
```

Không tạo file deliverable rỗng trước khi work package tương ứng bắt đầu.

## 7. Kế hoạch theo tuần và ngày

### Tuần 1 — Khóa sản phẩm và hành trình

Mục tiêu: hoàn tất P1-001 và cổng duyệt A.

| Ngày | Trọng tâm                                                    | Đầu ra                                            | Giờ dự kiến |
| ---- | ------------------------------------------------------------ | ------------------------------------------------- | ----------: |
| 1    | Kickoff, đối soát PRD/decision, xác định persona và bối cảnh | Ma trận nguồn sự thật, giả định, câu hỏi review   |         4–6 |
| 2    | Walkthrough J1 và J2                                         | Luồng capture/Q&A và selection có success/failure |         4–6 |
| 3    | Walkthrough J3, J4 và J5                                     | Luồng học, MCP/ChatGPT và Quizlet export          |         4–6 |
| 4    | Rà ưu tiên, non-goal, consent, retention và thuật ngữ        | Phạm vi beta cùng policy UX                       |         4–6 |
| 5    | Review phản biện và cổng A                                   | P1-001 được duyệt hoặc danh sách chỉnh sửa        |         4–6 |

### Tuần 2 — Khóa hướng UI

Mục tiêu: hoàn tất P1-002, P1-003, P1-004 và cổng duyệt B. Chỉ tối đa hai gói hoạt động đồng thời; P1-004 bắt đầu sau khi cấu trúc của P1-002/P1-003 ổn định.

| Ngày | Trọng tâm                                            | Đầu ra                                           | Giờ dự kiến |
| ---- | ---------------------------------------------------- | ------------------------------------------------ | ----------: |
| 6    | Information architecture và navigation model         | Sitemap, hierarchy, thuật ngữ                    |         4–6 |
| 7    | Extension side panel và catalog trạng thái           | Wireframe J1, trạng thái quyền/capture/chat      |         4–6 |
| 8    | Selection popup và responsive constraints            | Wireframe J2, edge cases viewport/zoom/dark page |         4–6 |
| 9    | Dashboard, MCP share và Quizlet export               | Wireframe J3–J5 và confirmation/error flow       |         4–6 |
| 10   | Design foundation, accessibility walkthrough, cổng B | Token semantic, focus order, viewport matrix     |         4–6 |

### Tuần 3 — Khóa system design

Mục tiêu: hoàn tất P1-005, P1-006, P1-007 và cổng kết thúc Phase 1.

| Ngày | Trọng tâm                                              | Đầu ra                                | Giờ dự kiến |
| ---- | ------------------------------------------------------ | ------------------------------------- | ----------: |
| 11   | System context, runtime/container và module ownership  | Sơ đồ và dependency rules             |         4–6 |
| 12   | Sequence J1–J5, failure mode, retention, observability | Luồng dữ liệu và catalog lỗi          |         4–6 |
| 13   | Threat modeling và privacy review                      | Threat/control/test matrix            |         4–6 |
| 14   | Danh mục HTTP/SSE/MCP và UI-action mapping             | Contract inventory nháp               |         4–6 |
| 15   | Review chéo, traceability, closeout và dự phòng        | Evidence, quyết định, backlog Phase 2 |         4–8 |

## 8. Worktime theo gói

| ID                | Gói công việc                            |   Giờ | Review/test | Phụ thuộc              |
| ----------------- | ---------------------------------------- | ----: | ----------: | ---------------------- |
| P1-001            | Persona, hành trình và ưu tiên tính năng | 10–14 |         3–4 | Phase 0                |
| P1-002            | IA, extension và selection popup         | 10–13 |         3–4 | P1-001                 |
| P1-003            | Dashboard và luồng tích hợp              | 10–14 |         3–4 | P1-001                 |
| P1-004            | Design foundation và accessibility       |   6–9 |         2–3 | P1-002, P1-003         |
| P1-005            | Runtime/module/system design             |  9–14 |         3–5 | P1-001                 |
| P1-006            | Threat model ban đầu                     |  7–10 |         3–4 | P1-001, P1-005         |
| P1-007            | Danh mục OpenAPI/SSE/MCP nháp            |  8–12 |         3–4 | P1-002, P1-003, P1-005 |
| Closeout/dự phòng | Review chéo, sửa lỗi, bằng chứng         |   4–8 |         4–8 | P1-001..P1-007         |

Tổng: 64–94 giờ. Mục tiêu vận hành là 60–90 giờ; phần vượt chỉ dùng khi vòng review phát hiện mâu thuẫn có tác động lớn.

## 9. Gói công việc

| ID     | Tên                                               | Trạng thái khi trình duyệt | Bằng chứng chính                  |
| ------ | ------------------------------------------------- | -------------------------- | --------------------------------- |
| P1-001 | Xác thực persona, hành trình và ưu tiên tính năng | NHÁP                       | Scope/journey matrix đã duyệt     |
| P1-002 | Thiết kế IA, extension và selection popup         | NHÁP                       | Wireframe + state matrix          |
| P1-003 | Thiết kế dashboard và luồng tích hợp              | NHÁP                       | Wireframe + integration flow      |
| P1-004 | Định nghĩa design foundation và accessibility     | NHÁP                       | Token/viewport/a11y specification |
| P1-005 | Khóa runtime, module và data flow                 | NHÁP                       | System design + ADR nếu cần       |
| P1-006 | Threat model cho hành trình ban đầu               | NHÁP                       | Threat/control/test matrix        |
| P1-007 | Soạn danh mục HTTP/SSE và MCP tool                | NHÁP                       | Contract inventory + UI mapping   |

File chi tiết:

- [`P1-001`](../work-packages/P1-001-product-scope-journeys.md)
- [`P1-002`](../work-packages/P1-002-extension-information-architecture.md)
- [`P1-003`](../work-packages/P1-003-dashboard-integration-flows.md)
- [`P1-004`](../work-packages/P1-004-design-accessibility-foundations.md)
- [`P1-005`](../work-packages/P1-005-runtime-module-design.md)
- [`P1-006`](../work-packages/P1-006-threat-model.md)
- [`P1-007`](../work-packages/P1-007-contract-inventory.md)

## 10. Kế hoạch kiểm thử và review

### Kiểm tra tự động

- `pnpm run format`, `pnpm run lint`, `pnpm run test` và `pnpm run build` tiếp tục đạt dù Phase 1 chủ yếu thay đổi tài liệu.
- `pnpm run docs:check` xác minh heading và liên kết Markdown.
- `pnpm run secrets:scan` và `pnpm audit --audit-level=high` tiếp tục đạt.
- CI backend/frontend/docs-security phải xanh trên mọi commit Phase 1.

### Review sản phẩm

- Walkthrough J1–J5 theo ba nhánh: thành công, thất bại có thể phục hồi, thất bại không hỗ trợ.
- Mỗi yêu cầu Bắt buộc có ít nhất một hành trình hoặc trạng thái UI chứng minh.
- Mỗi yêu cầu Nên có/Có thể được giữ, hoãn hoặc loại khỏi beta bằng quyết định rõ ràng.
- Không có màn hình hoặc chức năng mới thiếu ID yêu cầu/quyết định.

### Review UX/UI

- Kiểm tra extension ở chiều rộng tham chiếu 320, 360 và 420 px.
- Kiểm tra dashboard ở viewport tham chiếu 390, 1024 và 1440 px.
- Walkthrough chỉ dùng bàn phím cho điều hướng chính, popup, dialog và form.
- Review focus order, focus visible, label, heading hierarchy, error recovery, contrast intent và reduced motion.
- Kiểm tra copy consent/retention không ngụ ý thu thập ngầm hoặc quyền truy cập vĩnh viễn.
- Mỗi wireframe có state ID và mock scenario ID dự kiến cho Phase 2.

### Review kiến trúc và hợp đồng

- Mỗi hành động UI ánh xạ tới local behavior, command, query, SSE event hoặc MCP tool dự kiến.
- Mỗi dữ liệu đi qua trust boundary có owner, phân loại, retention và failure behavior.
- Dependency module không tạo vòng và không để domain phụ thuộc SDK/provider.
- Mỗi operation ghi auth/scope, idempotency khi cần, lỗi RFC 7807 và observability tối thiểu.
- MCP tool ghi rõ read/write, approval, scope, TTL và audit.

### Review bảo mật

- Threat model bao phủ spoofing, tampering, disclosure, privilege escalation và resource abuse cho J1–J5.
- Có test/control dự kiến cho IDOR, XSS, prompt injection, replay, secret leakage và oversized input.
- `activeTab`, consent, revoke, retention 24 giờ và không lưu cookie/session token được thể hiện trong UX và system design.

### Bằng chứng bắt buộc

- Checklist walkthrough có người review, ngày và kết quả.
- Ảnh hoặc link artifact wireframe cho từng flow/state được duyệt.
- Ma trận requirement → journey → screen/state → command/query → test tương lai.
- Biên bản quyết định hoặc ADR cho mọi thay đổi baseline.
- Báo cáo closeout nêu rõ phần hoàn tất, hoãn, giới hạn và đầu vào Phase 2.

## 11. Ba cổng duyệt

### Cổng A — Phạm vi sản phẩm

- Persona và J1–J5 được duyệt.
- MVP/non-goal và ưu tiên được duyệt.
- Consent, retention và thuật ngữ cốt lõi không mâu thuẫn.
- Chỉ khi đạt mới chuyển P1-002/P1-003/P1-005 sang `SẴN_SÀNG`.

### Cổng B — Hướng UI

- IA, navigation, extension, popup và dashboard wireframe được duyệt.
- State catalog và failure recovery đầy đủ.
- Accessibility foundation được duyệt.
- Chỉ khi đạt mới khóa P1-007 và chuẩn bị backlog UI Phase 2.

### Cổng C — System design và kết thúc phase

- Runtime/module/data flow và threat model được duyệt.
- Danh mục HTTP/SSE/MCP khớp hành động UI.
- Traceability và mock scenario backlog đầy đủ.
- Không còn xung đột S1/S2 hoặc quyết định bắt buộc chưa chốt.

## 12. Cổng kết thúc Phase 1

- [ ] P1-001 đến P1-007 ở trạng thái `HOÀN_TẤT`.
- [ ] D-101 đến D-112 được xác thực bằng artifact và các cổng UI trong decision register được đánh dấu.
- [ ] J1–J5 có walkthrough và trạng thái lỗi/phục hồi.
- [ ] IA, thuật ngữ, navigation và wireframe được chủ dự án duyệt.
- [ ] Design foundation và accessibility target được duyệt.
- [ ] System design, module ownership, data flow, failure mode và observability được duyệt.
- [ ] Threat model và privacy review đạt.
- [ ] UI-action/contract inventory đầy đủ cho Phase 2/3.
- [ ] CI và kiểm tra tài liệu/bảo mật đạt.
- [ ] Báo cáo closeout Phase 1 được duyệt.
- [ ] P2-001/P2-002 chỉ được soạn ở trạng thái `NHÁP`; chưa tự động bắt đầu Phase 2.

## 13. Rủi ro và kiểm soát

| Rủi ro                               | Kiểm soát                                                                |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Wireframe đẹp nhưng thiếu trạng thái | Bắt buộc state matrix và scenario ID cho từng màn hình                   |
| Scope creep sang Phase 2             | Cấm component/code UI; chỉ artifact thiết kế và contract inventory       |
| Kiến trúc suy đoán quá mức           | Chỉ mô tả thành phần cần cho J1–J5 và yêu cầu đã chấp nhận               |
| AI tự quyết thay chủ sản phẩm        | Mọi cổng A/B/C cần chủ dự án duyệt; xung đột tạo decision record         |
| MCP/Quizlet làm chậm critical path   | Chỉ thiết kế flow/contract; không phụ thuộc direct Quizlet sync          |
| Bỏ sót quyền riêng tư trong UX       | Review consent/retention/revoke cùng threat model, không review tách rời |
| Contract khóa quá sớm                | P1 chỉ tạo inventory nháp; OpenAPI ổn định ở Phase 3 sau mock UI         |
| Artifact không truy vết được         | Dùng ID journey/screen/state/action/threat nhất quán trong mọi tài liệu  |

## 14. Điều kiện bắt đầu thực thi

Sau khi đọc tài liệu này, chủ dự án xác nhận: **“Duyệt Phase 1, bắt đầu P1-001.”**

Xác nhận đó sẽ:

1. Chuyển Phase 1 sang `ĐANG_THỰC_HIỆN`.
2. Chuyển P1-001 từ `NHÁP` sang `SẴN_SÀNG`.
3. Cho phép tạo các artifact sản phẩm/UX của P1-001.
4. Không cho phép tự động bắt đầu P1-002 đến P1-007 trước khi dependency và cổng tương ứng đạt.
5. Không cho phép viết code tính năng hoặc schema production.
