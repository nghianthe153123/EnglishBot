# P1-006: Threat model cho hành trình ban đầu (lịch sử)

- Trạng thái lịch sử: NHÁP theo baseline cũ.
- Phase: 1 cũ
- Module/bề mặt sở hữu: security/privacy
- Mức rủi ro: Cao
- Phụ thuộc: P1-001, P1-005 cũ
- ID yêu cầu: PRIV-01..03, NFR-03..04, threat IDs cũ

## Trạng thái đường cơ sở

Giữ ID/trạng thái lịch sử; đường cơ sở bị thay thế ngày 2026-09-30. Mô hình đe dọa cũ cho capture/Chat/MCP không chứng minh rủi ro tính năng mới đã được kiểm soát.

## Trạng thái thay thế

Phạm vi selection/BYOK/database/batch/Quizlet cần review bảo mật/quyền riêng tư trong P1-104..109. Bao gồm kích hoạt permission, selection không đáng tin, cô lập user, che credential, chủ tài khoản, retry/đối soát và trang bị hạn chế. Truy vết hiện hành dùng P1-SEC-*.
