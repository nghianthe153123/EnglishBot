# P1-005: Khóa runtime, module và data flow

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: system architecture
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-001, cổng A
- ID yêu cầu: J1–J5, NFR-01..10, ADR-001, ADR-003, ADR-004, D-305, D-306, D-501

## Mục tiêu

Chuyển kiến trúc baseline thành system design đủ cụ thể cho UI mock và contract inventory, không triển khai production hay schema vật lý.

## Trong phạm vi

- System context và runtime/container cho extension, dashboard, backend, data stores và provider.
- Module ownership, public boundary và dependency rule.
- Sequence/data flow J1–J5, trust boundary và retention handoff.
- Failure mode, retry/idempotency expectation, SSE lifecycle và offline behavior.
- Observability fields, deployment assumptions và scale trigger.
- ADR mới/chỉnh sửa nếu walkthrough buộc thay đổi baseline.

## Ngoài phạm vi

- Class design chi tiết, database schema, cloud vendor, auth provider cuối cùng hoặc code backend.

## Hợp đồng và invariant

- Modular monolith, module sở hữu invariant/bảng tương lai và chỉ giao tiếp qua public application interface.
- Domain không phụ thuộc OpenAI/browser/provider SDK.
- REST cho command/query, SSE cho stream, MCP Streamable HTTP cho MCP.
- Nội dung web/MCP là dữ liệu không đáng tin.

## Tiêu chí nghiệm thu

- [ ] AC1: Context/container/module diagram có owner và dependency direction.
- [ ] AC2: J1–J5 có sequence/data flow với trust boundary.
- [ ] AC3: Failure mode và recovery owner được ghi cho network/provider/storage/client.
- [ ] AC4: Retention, deletion, idempotency và observability expectation không mâu thuẫn PRD/security.
- [ ] AC5: Không có dependency cycle hoặc provider type rò vào domain.
- [ ] AC6: Mọi thay đổi baseline có ADR/decision record.

## Kế hoạch kiểm thử

- [ ] Architecture walkthrough theo J1–J5.
- [ ] Dependency-cycle và ownership review thủ công.
- [ ] Failure-mode tabletop cho timeout, duplicate, partial stream, offline và revoke.
- [ ] Traceability từ action UI tới module owner.
- [ ] Docs-check và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/architecture/phase-1-runtime-design.md` và ADR nếu cần.

## Rủi ro và rollback

- Rủi ro: thiết kế quá mức hoặc khóa provider sớm.
- Rollback: giữ ADR nền tảng, chuyển phần suy đoán thành open question có phase xử lý.
