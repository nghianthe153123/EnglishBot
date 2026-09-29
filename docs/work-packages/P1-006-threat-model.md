# P1-006: Threat model cho hành trình ban đầu

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: security/privacy
- Mức rủi ro: Cao
- Phụ thuộc: P1-001, P1-005
- ID yêu cầu: J1–J5, PRIV-01..03, NFR-01..04, NFR-07, NFR-09, ADR-003, D-201..206, D-503..505

## Mục tiêu

Nhận diện tài sản, actor, trust boundary, threat và kiểm soát/test tương lai cho năm hành trình trước khi Phase 2 biến chúng thành trải nghiệm có thể thao tác.

## Trong phạm vi

- Data classification, assets, actors và trust boundaries.
- Threat cho capture, XSS, IDOR, prompt injection, replay, secret leakage, oversized input và resource abuse.
- MCP account linking/share/revoke/approval/audit.
- Retention, deletion, URL/query redaction và vocabulary context.
- Mapping threat → preventive control → detective control → test phase.

## Ngoài phạm vi

- Penetration test, production control implementation, provider security assessment cuối cùng.

## Hợp đồng và invariant

- Không lưu cookie/session token hoặc server secret ở client.
- Capture/share là hành động rõ ràng, có scope và có thể thu hồi.
- Nội dung trang/model/tool không được coi là instruction đáng tin.
- Tool thay đổi dữ liệu luôn cần phê duyệt.

## Tiêu chí nghiệm thu

- [ ] AC1: Mỗi J1–J5 có asset, actor, trust boundary và abuse case.
- [ ] AC2: Threat có severity, likelihood, owner và phase xử lý.
- [ ] AC3: S1/S2 có preventive/detective control và test dự kiến.
- [ ] AC4: UX consent/retention/revoke khớp threat model.
- [ ] AC5: Không có threat cao bị ghi “chấp nhận” nếu chủ dự án chưa duyệt rõ.

## Kế hoạch kiểm thử

- [ ] Threat-model workshop/tabletop.
- [ ] Negative-path walkthrough cho IDOR, injection, XSS, replay và data deletion.
- [ ] Cross-review với P1-002/P1-003/P1-005.
- [ ] Docs-check, secret scan và CI đạt.

## Ghi chú triển khai

- Deliverable: `docs/security/phase-1-threat-model.md`.
- Review cấp Cao, cần chủ dự án duyệt.

## Rủi ro và rollback

- Rủi ro: threat list chung chung, không ánh xạ tới flow/test.
- Rollback: không cho cổng C đạt; giữ issue mở với owner/phase rõ ràng.
