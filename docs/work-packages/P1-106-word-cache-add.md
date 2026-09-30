# P1-106: Enrichment từ, cache/reuse và Add

- Trạng thái: NHÁP
- Phase: 1
- Module/bề mặt sở hữu: domain từ vựng/persistence/extension
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-104, P1-105; chưa bắt đầu cho tới khi dependency được duyệt
- ID yêu cầu: P1-WD-01, P1-WD-02, P1-WD-03, P1-TR-04, P1-QZ-01

## Mục tiêu

Persist POS/definition/example đã validate cho từ, dùng lại cache chính xác và chỉ đưa từ vào hàng đợi qua thao tác Add idempotent rõ ràng.

## Bối cảnh

Google Translation không trả POS/example. Theo owner, khi chọn Google, phrase/sentence không gọi AI; với word, gọi AI BYOK để bổ sung POS/example. Khi chọn AI, phrase/sentence dịch qua provider đó nhưng không được Add/enrich thành từ. Không bịa dữ liệu hoặc gọi AI ngầm. Giữ nguồn, ngữ cảnh/lưu trữ ví dụ theo hợp đồng đã duyệt. N do user cấu hình, không có giá trị mặc định; nếu chưa cấu hình thì không tạo batch.

## Trong phạm vi

- Enrichment đã validate cùng provenance/version; khóa cache theo language/provider/sense.
- Persist trước khi reuse; nhiều sense/provider/language không ghi đè sai.
- Trạng thái Add tách khỏi lookup/cache; queue theo user và chống trùng.
- Báo lỗi rõ khi enrichment không khả dụng; không tự điền dữ liệu âm thầm.

## Ngoài phạm vi

- Tự chọn model AI cụ thể hoặc mở rộng sang dictionary/word form ngoài quyết định đã duyệt.
- Add phrase/sentence, threshold batching, tạo Quizlet.

## Hợp đồng và invariant

- Chỉ persist dữ liệu từ đã validate; Add chỉ áp dụng cho single word hợp lệ.
- Cache hit không gọi provider; lookup không tự Add.
- POS/example không hợp lệ hoặc unavailable phải thể hiện rõ; không tự bịa.

## Tiêu chí nghiệm thu

- [ ] AC1: Khi chọn Google, phrase/sentence không gọi AI; khi chọn AI, phrase/sentence dịch qua provider đó; Google word dùng AI BYOK bổ sung POS/example theo hợp đồng được owner duyệt.
- [ ] AC2: POS/definition/example và provenance/version được validate, persist và còn sau restart.
- [ ] AC3: Cache hit chỉ dùng đúng language/provider/sense, không gọi provider; sense khác không ghi đè.
- [ ] AC4: Lookup/cache tách khỏi Add; từ chối Add phrase/sentence.
- [ ] AC5: Add lặp/đồng thời/retry idempotent và cô lập theo user.
- [ ] AC6: Cache đầy đủ không gọi provider; Google word thiếu BYOK key thì báo chờ cấu hình/credential, không bịa dữ liệu hoặc gọi provider ngầm; không rò secret/dữ liệu.

## Kế hoạch kiểm thử

### Tự động

- [ ] Domain/property và repository test cho validation, collision, provenance, restart/reuse, isolation, idempotency.
- [ ] Fake provider xác nhận cache hit không gọi provider; Google mode không gọi AI ngầm.

### Thủ công/trực quan/model thật

- [ ] Khi chọn Google, phrase/sentence không cần AI key; Google word thiếu key thể hiện chờ enrichment; cache đầy đủ không gọi provider. Test live có nhãn riêng, fixture CI xác định.

### Lệnh bắt buộc

```text
./mvnw --batch-mode --no-transfer-progress verify
pnpm run test
```

## Ghi chú triển khai

- Dự kiến: domain/repository từ vựng và trạng thái Add extension sau khảo sát repo.
- Cờ tính năng: có thể bật enrichment/Add cho test cohort sau khi dependencies được duyệt; phát hành chung sau P1-109.

## Rủi ro và rollback

- Rủi ro: enrichment không hỗ trợ làm thẻ thiếu dữ liệu; sai cache identity làm hỏng dữ liệu sense/user.
- Rollback: tắt enrichment/Add; giữ cache dịch hợp lệ; chỉ migration tương thích xuôi.

## Bằng chứng

- Build/commit: chưa thực hiện.
- Kết quả test tự động: chờ quyết định/implementation.
- Bằng chứng thủ công: chờ test provider có nhãn.
- Báo cáo/ảnh: cần liên kết quyết định và bằng chứng test.

## Báo cáo hoàn thành

- File đã thay đổi: chưa ghi.
- Kết quả tiêu chí nghiệm thu: chưa đánh giá.
- Tác động bảo mật/quyền riêng tư: vocabulary theo user, provenance provider và validation dữ liệu.
- Database migration: có thể có; theo chính sách P1-104.
- Giới hạn đã biết: model cụ thể/credential flow phụ thuộc ADR; nếu chưa có key thì Google word chưa hoàn tất enrichment.
- Gói tiếp theo: P1-107 sau khi enrichment/Add được duyệt.
