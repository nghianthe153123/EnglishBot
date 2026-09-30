# P1-104: Database, migration, auth và BYOK

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: lưu trữ, định danh và credential provider
- Mức rủi ro: Cao
- Phụ thuộc: P1-103 được owner duyệt; các ADR liên quan
- ID yêu cầu: P1-WD-01, P1-WD-02, P1-SEC-02

## Mục tiêu

Lưu vocabulary/cache/ownership theo hợp đồng đã duyệt và chuyển BYOK an toàn qua backend, không để lộ key trong extension/log.

## Bối cảnh

Theo thứ tự owner, DB thực hiện sau mock/hợp đồng. DB production cần migration chỉ tiến về phía trước và test migration. Không tự suy đoán auth, lưu secret, deployment hay credential provider; chờ quyết định root/owner.

## Trong phạm vi

- Schema/repository cho word/sense/POS/definition/example, language/provider/provenance/version và phân tách ownership/cache/Add theo hợp đồng.
- Migration tiến tới, validation, isolation; vận chuyển/lưu/rotation credential theo ADR được duyệt.
- Xử lý lỗi và redaction/retention credential.

## Ngoài phạm vi

- Chốt cách tạo POS/example, N/Quizlet integration hoặc domain không liên quan.
- Lưu API key plaintext trong browser/client/log.

## Hợp đồng và invariant

- Chỉ persist dữ liệu đã validate; lookup/cache không đồng nghĩa Add.
- Cô lập user; nhiều provider/language/sense không ghi đè sai.
- Migration production chỉ tiến về phía trước, không làm mất dữ liệu.
- BYOK không gửi ngược về client sau khi nhận; log phải redact.

## Tiêu chí nghiệm thu

- [ ] AC1: Owner duyệt schema/auth/credential ADR trước khi triển khai production.
- [ ] AC2: Migration trên DB rỗng và nâng cấp DB hiện hữu đạt; có quy trình khôi phục không cần migration ngược phá hủy dữ liệu.
- [ ] AC3: Test lưu/nạp lại/khởi động lại, phân tách provider/language/sense và cô lập user đạt.
- [ ] AC4: POS/example không hợp lệ bị từ chối; lookup cache không đánh dấu item là Added.
- [ ] AC5: Client bundle/storage và log không có key plaintext; vòng đời secret tuân ADR được duyệt.

## Kế hoạch kiểm thử

### Tự động

- [ ] Test migration rỗng/nâng cấp, repository integration, isolation/negative và redaction log.

### Thủ công/trực quan/model thật

- [ ] Review bảo mật đường credential, rotation/retention key và quyền tối thiểu.

### Lệnh bắt buộc

```text
./mvnw --batch-mode --no-transfer-progress verify
pnpm run test
pnpm run secrets:scan
```

Trên Windows dùng `mvnw.cmd`; chỉ ghi lệnh thực sự đã chạy và kết quả.

## Ghi chú triển khai

- Dự kiến: backend persistence/identity/provider boundary; xác định module/file sau khảo sát repo.
- Cờ tính năng: endpoint BYOK/provider có thể bật cho nhóm thử nghiệm sau review bảo mật; phát hành chung chờ P1-109. Migration phải tiến về phía trước.

## Rủi ro và rollback

- Rủi ro cao: lộ credential hoặc mất dữ liệu do migration.
- Rollback: tắt cờ tính năng, giữ migration tương thích xuôi; khôi phục từ backup theo chính sách đã duyệt, không xóa/migrate ngược dữ liệu production.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chưa chạy.
- Bằng chứng thủ công: chờ review bảo mật.
- Báo cáo/ảnh: cần lưu bằng chứng migration/security.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: cao; cần owner và chuyên gia bảo mật review.
- Database migration: dự kiến có, chưa tạo.
- Giới hạn đã biết: hợp đồng và thiết kế auth/secret chờ duyệt.
- Gói tiếp theo: P1-105 sau khi persistence interface ổn định.
