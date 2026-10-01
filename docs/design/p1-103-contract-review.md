# P1-103 — Hợp đồng và hướng dẫn review bản mock

- Trạng thái: BẢN_NHÁP, cần owner duyệt hợp đồng và mock riêng. Không mở P1-104 từ review AI.
- Nguồn: [work package](../work-packages/P1-103-mock-contracts.md), [kế hoạch điều phối](../ai-prompts/P1-103-orchestration.md), [contract TypeScript](../../packages/api-contracts/src/index.ts), [fake backend](../../packages/mock-fixtures/src/service.ts).
- Không có HTTP endpoint, xác thực, migration, Google/AI/Quizlet thật. Public interface dưới đây là hợp đồng mô phỏng để review, không phải API production đã triển khai.

## Chạy và xem

```text
pnpm install --frozen-lockfile
pnpm run dev:mock
```

Mở `http://127.0.0.1:4173/`. Chọn **Tiện ích**, đọc giải thích rồi bật trên tab hiện tại. Chọn provider trong **Cài đặt**; provider và N ban đầu đều chưa chọn. Khu vực kiểm thử mock cho phép mô phỏng backend có AI key và lỗi; tuyệt đối không nhập key thật. Bôi đen từ/câu trong bài mẫu hoặc dùng nút selection mẫu để thử bàn phím, sau đó bấm **Dịch**.

UI gồm hành động Dịch, popup, quản lý tiện ích với queue nhỏ và Options. Bài đọc cùng khu vực kiểm thử là host review, không phải dashboard hay UI extension production. Quyền Chrome/ghi nhớ website chỉ minh họa; không lưu và không thay thế kiểm thử P1-105.

## Các quyết định owner đã trả lời ngày 2026-10-01

1. Một mục liền có dấu nháy/gạch nối bên trong vẫn là từ đơn; nhiều mục là cụm/câu.
2. Chỉ gửi selection, không đọc câu xung quanh. Dịch nghĩa thông dụng độc lập và soạn ví dụ mới theo nghĩa trả về; không tuyên bố hiểu nghĩa trong ngữ cảnh trang.
3. Lưu/thay N không tạo batch. Chỉ một lần Add mới thành công kế tiếp kiểm tra queue chưa gán batch. Add trùng, lookup, Add lỗi/unknown không kích hoạt; batch cũ không bị thay đổi.

## Luồng và hợp đồng đọc

| Thao tác   | Dữ liệu                                                                                     | Kết quả và ràng buộc                                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bôi đen    | Selection DOM local và anchor CSS px                                                        | Chỉ hiện Dịch; chưa lookup/cache/provider. Nội dung trang là dữ liệu không đáng tin cậy, render text chứ không HTML.                                                                               |
| Dịch       | `TranslationRequest`: requestId, text, kind, provider, sourceLanguage=en, targetLanguage=vi | Google/AI là lựa chọn tường minh, không fallback. Không URL, toàn trang, surrounding context hoặc credential. Loại selection phải được xác minh tại backend sau này, không tin kind do client gửi. |
| Word ready | kind=word, recordId, term, pos, definition, example, provenance, cacheHit, persisted=true   | Nghĩa/ví dụ/từ loại hợp lệ rồi mới persist/cache. Persist và Add riêng biệt. Không rich output một phần hoặc giả persisted=true khi lưu lỗi.                                                       |
| Cụm/câu    | kind=phrase, definition, provenance                                                         | Chỉ nghĩa. Không recordId/POS/example/persist/Add; validator từ chối các field của word.                                                                                                           |
| Lỗi        | ok=false, code, message                                                                     | Mã ổn định, message không secret/raw provider payload. Không fallback; retry tường minh khi an toàn. Persist/Add unknown cần đối soát, không giả thành công.                                       |
| Add        | recordId đã ready + idempotencyKey                                                          | Fake kiểm tra record có thật trong cache đã lưu. Key không dùng lại cho record khác. Retry cùng command giữ outcome, không tăng count/batch.                                                       |
| Cấu hình N | Số nguyên dương trong giới hạn số nguyên an toàn JavaScript hoặc null                       | Không mặc định. Invalid không thay cấu hình đã lưu. Giới hạn kỹ thuật này không phải chính sách Quizlet hay max sản phẩm đã chốt.                                                                  |

`LookupOutcome` là union thành công/lỗi; UI không suy diễn Add eligibility từ một string nghĩa đơn lẻ. Field lạ, sai kiểu, thiếu POS/example, provenance sai, secret field và word persisted=false bị từ chối tại validation boundary. POS sử dụng enum tiếng Anh để trao đổi; nhãn UI có thể dịch theo review, không đổi mã enum.

## Cache, provenance và Add

Cache mock chỉ tồn tại trong bộ nhớ, giới hạn owner giả cố định; reset trang mất dữ liệu. Khóa cache là normalized term, en/vi, provider, version và senseKey. `independent-common-v1` là namespace fixture, không phải thuật toán chọn nghĩa production.

Cache đầy đủ được tái sử dụng không gọi provider và không cần key cho một lần gọi mới. Cache Google không thay kết quả AI. Google word cần Google meaning + AI POS/example khi chưa có cache; Google phrase chỉ Google, không phụ thuộc key AI. AI word/phrase dùng provider AI đã chọn. Provenance production cần phân biệt nguồn dịch và nguồn enrichment, version/model, không đặt vendor/model thật trong mock.

Add dedupe tách recordId/cache identity. Ràng buộc proposed cho production: owner + normalized term + language pair + sense đã chọn; provider không tự tạo một từ trùng mới cùng nghĩa. Cần owner duyệt khi chốt hợp đồng và thiết kế transaction/uniqueness P1-104; mock không chứng minh phân quyền nhiều người dùng.

## Batch và Quizlet

Snapshot giữ thứ tự các word hợp lệ chưa gán batch. Một card mỗi dòng: `term<TAB>definition`; dòng nối bằng LF. Reject TAB/CR/LF và control characters trong term/definition trước persist/export, không âm thầm cắt/sửa nội dung. Ví dụ không nằm trong text import.

Snapshot ID, command idempotency, items, importText và N tại lúc tạo phải bất biến; lần đổi N sau chỉ ảnh hưởng batch tương lai. Khi còn đủ từ sau một Add mới có thể tạo nhiều batch đủ N, phần dư tiếp tục chờ. Giữ lịch sử snapshot để không claim lại từ đã gán batch.

| Trạng thái mock | UI và hành động                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| unsent          | Text import đã tạo nhưng chưa gửi. Không nói đã tạo Quizlet.                                                                                       |
| unavailable     | Kênh chưa khả dụng; giữ snapshot, không giả thành công hoặc gọi kênh khác.                                                                         |
| unknown         | Chưa biết có tạo set hay chưa; giữ command/snapshot để đối soát, không có nút tạo lại mù.                                                          |
| verified-mock   | ID/URL giả xác định thuộc example.invalid, luôn ghi MOCK. Không liên kết tới tài khoản thật; không chứng minh kênh production hay quyền tài khoản. |

Không có create/retry API Quizlet production trong fake. Thiết kế outcome production/account evidence phụ thuộc kết quả P1-102 và P1-108; chưa chọn API/MCP/UI automation hay coi khảo sát là kênh đã duyệt.

## CHƯA_CHỐT trước production

- Vendor/model, Google project/quota/billing, auth/owner isolation và deployment.
- Vòng đời, mã hóa, thu hồi, rotation và endpoint write-only BYOK. Mock chỉ có boolean cấu hình, không nhận/lưu/trả key.
- HTTP endpoint/OpenAPI version, kích thước payload/rate limit, invalid-key/network retry policy.
- Chính sách version/invalidation/cache/sense khi provider/model đổi; dedupe và đối soát persist/Add/Quizlet unknown.
- Schema/transaction/job bền vững, xóa dữ liệu và giới hạn N theo kênh Quizlet thực tế.

## Owner walkthrough cần duyệt

1. Popup từ: thứ tự term → POS → nghĩa → ví dụ → Add; popup câu chỉ nghĩa. Đóng/focus/bàn phím và layout hẹp.
2. Options: lựa chọn Google/AI rõ ràng, N không mặc định, key chỉ trạng thái giả. Queue không tự Add do lookup.
3. Batch sau Add mới, import an toàn và unknown không tạo lại. Chấp nhận/chỉnh sửa hợp đồng, đặc biệt cache/Add identity và provenance.
4. Review riêng ảnh/mock và hợp đồng. Ghi quyết định vào WP; không dùng câu “duyệt UI” để tự suy ra duyệt DB/secret/kênh Quizlet.

Đề xuất quy tắc dùng chung, chưa tự áp dụng vào AGENTS: tách nhãn và evidence `verified-mock` khỏi `verified` production trong mọi fixture/UI/test, để ảnh mock không bị hiểu thành bằng chứng tích hợp thật.
