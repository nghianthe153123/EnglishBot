# P1-107: Ngưỡng N, batch snapshot và text import

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: vocabulary queue/batch/export
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-106 được duyệt
- ID yêu cầu: P1-WD-03, P1-QZ-01, P1-QZ-02, P1-QZ-04

## Mục tiêu

Khi hàng đợi có N từ hợp lệ đã Add và chưa gán batch, tạo snapshot bất biến và text import an toàn với trạng thái gửi/đối soát rõ.

## Bối cảnh

N do user cấu hình, không có giá trị mặc định. Nếu chưa cấu hình thì runtime không tạo batch. QZ01 chỉ đếm từ duy nhất, hợp lệ, đã Add, chưa batch; không đếm lookup hay Add trùng. Text import thủ công chỉ là đầu vào P1-108, không đạt yêu cầu tự tạo Quizlet.

## Trong phạm vi

- Ngưỡng cấu hình theo user; kiểm tra N−1/N/N+1 và nhiều batch.
- Khi N chưa cấu hình hoặc không hợp lệ, batch không tự tạo và UI báo trạng thái cần cấu hình.
- Snapshot bất biến, thành viên/định danh idempotency, ownership theo user.
- `term<TAB>definition`, mỗi thẻ một dòng; validate delimiter, newline, unicode, giá trị rỗng/quá dài.
- Trạng thái chưa gửi/đã gửi/unknown/hủy/xóa; retry không tạo trùng.

## Ngoài phạm vi

- Tự chọn N; tự tạo set Quizlet (P1-108); retry tự động khi outcome chưa rõ.

## Hợp đồng và invariant

- Chỉ tính từ duy nhất, hợp lệ, đã Add, chưa batch.
- Nội dung snapshot không đổi khi từ nguồn được sửa.
- Outcome unknown phải dừng retry tự động, chờ đối soát.

## Tiêu chí nghiệm thu

- [ ] AC1: N là cấu hình của user, không có mặc định; N chưa cấu hình runtime không tạo batch và test xác minh trạng thái đó.
- [ ] AC2: Test N−1/N/N+1, nhiều batch và đổi N khi queue có dữ liệu chứng minh membership đúng, không đếm trùng hoặc làm thay đổi snapshot đã tạo.
- [ ] AC3: Add đồng thời/trùng và retry không tạo batch item trùng.
- [ ] AC4: Snapshot bất biến serialize TAB/newline/unicode an toàn, từ chối delimiter mơ hồ.
- [ ] AC5: Chuyển trạng thái cancel/delete/unsent/unknown rõ và cô lập user.
- [ ] AC6: Không tự gửi lại khi outcome tạo set chưa rõ; bắt buộc đối soát.

## Kế hoạch kiểm thử

### Tự động

- [ ] Test biên/property/concurrency; fixture serialization; state-machine/idempotency.

### Thủ công/trực quan/model thật

- [ ] Kiểm tra N chưa cấu hình, N không hợp lệ và N đã cấu hình; owner review UX cấu hình. Gói này không gọi Quizlet live.

### Lệnh bắt buộc

```text
./mvnw --batch-mode --no-transfer-progress verify
pnpm run test
```

## Ghi chú triển khai

- Dự kiến: service batch/queue, serializer và trạng thái UI hàng đợi sau khảo sát repo.
- Cờ tính năng: có thể bật threshold cho test cohort sau khi dependencies được duyệt; phát hành chung chờ P1-109. Không tạo batch cho tới khi user cấu hình N. Bản xem trước thủ công không tính là hoàn tất feature.

## Rủi ro và rollback

- Rủi ro: thẻ trùng/sai định dạng hoặc tính nhầm ngưỡng.
- Rollback: tắt batching; giữ snapshot bất biến để đối soát; tránh tự xóa không thể phục hồi.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ quyết định/implementation.
- Bằng chứng thủ công: chờ kiểm thử cấu hình N do user nhập và xác nhận định dạng import; không chờ owner chọn giá trị N mặc định.
- Báo cáo/ảnh: cần trạng thái batch và mẫu output đã loại thông tin nhạy cảm.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: cô lập user và vòng đời dữ liệu bất biến.
- Database migration: có thể cần bảng state/snapshot; chưa thiết kế.
- Giới hạn đã biết: runtime cần xử lý N unset/invalid; cấu hình user không có default.
- Gói tiếp theo: P1-108 sau phê duyệt/kênh khả thi.
