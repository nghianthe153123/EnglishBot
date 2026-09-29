# P1-007: Soạn danh mục HTTP/SSE và MCP tool

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: API/MCP contract design
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-002, P1-003, P1-005, cổng B
- ID yêu cầu: J1–J5, D-305, D-306, D-501..505, NFR-03, NFR-07, NFR-09

## Mục tiêu

Ánh xạ mọi hành động UI đã duyệt thành local behavior, HTTP command/query, SSE event hoặc MCP tool nháp để Phase 2 mock đúng và Phase 3 có đầu vào viết hợp đồng chính thức.

## Trong phạm vi

- Inventory operation với purpose, actor, auth/scope, input/output group, idempotency và lỗi.
- SSE lifecycle/event catalog cho chat và job progress.
- MCP tool/resource inventory với read/write, approval, TTL, audit và size limit.
- UI action → operation/event/tool → module owner → mock scenario mapping.
- RFC 7807 error category và user-facing recovery mapping.

## Ngoài phạm vi

- OpenAPI YAML hoàn chỉnh, JSON schema ổn định, generated client, controller hoặc MCP server.
- Database entity/column design.

## Hợp đồng và invariant

- OpenAPI sẽ là nguồn sự thật ở Phase 3; P1 chỉ tạo inventory nháp.
- Mutation retry được phải có idempotency expectation.
- MCP chỉ truy cập capture được share rõ ràng và còn TTL.
- Error response không lộ stack trace/secret/raw sensitive content.

## Tiêu chí nghiệm thu

- [ ] AC1: Mọi action trong wireframe có loại xử lý và owner rõ ràng.
- [ ] AC2: Operation ghi auth/scope, input/output, lỗi, idempotency và observability.
- [ ] AC3: SSE event có lifecycle, terminal/error event và reconnect expectation.
- [ ] AC4: MCP tool ghi read/write, approval, TTL, audit và limit.
- [ ] AC5: Không đưa field/schema suy đoán chưa được UI hoặc requirement yêu cầu.
- [ ] AC6: Inventory đủ để P2 tạo deterministic mock và P3 viết OpenAPI.

## Kế hoạch kiểm thử

- [ ] Coverage matrix UI action → contract item không có lỗ hổng.
- [ ] Negative review cho auth, expiry, duplicate, malformed input và partial stream.
- [ ] Cross-review với runtime design và threat model.
- [ ] Docs-check và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/contracts/phase-1-operation-inventory.md`.
- Chỉ dùng tên operation/tool ổn định sau khi chủ dự án duyệt cổng C.

## Rủi ro và rollback

- Rủi ro: inventory biến thành hợp đồng chi tiết quá sớm hoặc bị UI dẫn dắt bởi schema giả định.
- Rollback: hạ mục chưa đủ bằng chứng về `open question`; không phát sinh code/generated artifact.
