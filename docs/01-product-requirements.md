# Yêu cầu sản phẩm — Phase 1

## Trạng thái

Đây là baseline Phase 1 theo P1-R01 ngày 2026-09-30, thay thế phạm vi P1-001 trước đó cho công việc hiện hành. Các quyết định chưa có câu trả lời được ghi `CHƯA_CHỐT`; tài liệu không tự suy ra phương án.

## Hành trình người dùng

### P1-J1 — Dịch một từ

Người dùng chọn một từ trên trang đã cấp quyền. Extension hiện action local mà chưa gửi mạng. Khi người dùng bấm **Dịch**, popup nhỏ mở ngay cạnh con trỏ ở trạng thái đang tải và gửi selection tối thiểu. Nếu chọn Google, Google Cloud Translation API dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ; giao diện nêu rõ cả hai provider trong luồng từ và chỉ enrichment thiếu mới cần AI key. Nếu chọn AI, AI dịch selection. Cụm/câu luôn dùng provider người dùng chọn; trong Google mode không cần AI enrichment. Nếu cache có đủ dữ liệu rich word thì tái sử dụng mà không gọi provider. Dữ liệu mới hợp lệ được lưu DB; Add vẫn là hành động riêng.

### P1-J2 — Dịch cụm hoặc câu

Người dùng chọn cụm/câu, thấy action local và chủ động bấm **Dịch**. Popup chỉ hiển thị bản dịch nghĩa. Không lưu như rich word entry và không có Add.

### P1-J3 — Add, batch và Quizlet

Người dùng bấm **Add** trên một từ hợp lệ. Từ được thêm idempotent vào queue riêng của người dùng, tách biệt với việc translation result đã lưu DB. Người dùng tự cấu hình N, không có giá trị mặc định. Nếu chưa cấu hình, UI yêu cầu thiết lập và không tạo batch. Khi đủ N từ duy nhất, hợp lệ, đã Add và chưa gán batch, hệ thống tạo text import dạng `term<TAB>definition`, một card mỗi dòng, validate delimiter rồi tự tạo set trong đúng tài khoản Quizlet. Set chỉ được báo thành công khi có bằng chứng; timeout/unknown phải reconcile hoặc retry mà không tạo trùng.

### P1-J4 — Provider, key và quyền

Người dùng cấu hình chọn Google API hoặc AI BYOK và cấp quyền extension cần thiết. Mô tả quyền phải xuất hiện trước khi content script cần phát hiện selection. Bôi đen tự nó không kích hoạt `activeTab` hay request mạng. BYOK đi qua backend; key không nằm trong client storage/log. Lỗi key/quota/network/provider có recovery rõ và không tự chuyển provider.

## Yêu cầu chức năng

| ID        | Yêu cầu                                                                                                                                                                                                                                                                                                                                         | Trạng thái                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| P1-TR-01  | Selection chỉ tạo action local; không gọi mạng trước click người dùng.                                                                                                                                                                                                                                                                          | CHẤP_NHẬN                 |
| P1-TR-02  | Hỗ trợ Google Cloud Translation API hoặc AI BYOK cho mọi selection. Với từ khi chọn Google, Google dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ; key chỉ cần nếu enrichment thiếu cache. Với cụm/câu, provider được chọn dịch trực tiếp; Google mode không cần AI enrichment. Cache đầy đủ được tái sử dụng mà không gọi provider; UI minh bạch. | CHẤP_NHẬN                 |
| P1-TR-03  | Popup mở cạnh con trỏ, clamp viewport, hỗ trợ đóng, focus và bàn phím.                                                                                                                                                                                                                                                                          | CHẤP_NHẬN                 |
| P1-TR-04  | Cụm/câu chỉ hiển thị bản dịch nghĩa, không Add.                                                                                                                                                                                                                                                                                                 | CHẤP_NHẬN                 |
| P1-TR-05  | Lỗi key, quota, network và provider có recovery; không fallback ngầm.                                                                                                                                                                                                                                                                           | CHẤP_NHẬN                 |
| P1-WD-01  | Từ đơn có POS/nghĩa/ví dụ; validate trước khi persist DB.                                                                                                                                                                                                                                                                                       | CHẤP_NHẬN                 |
| P1-WD-02  | Cache/reuse phân biệt ngôn ngữ, provider, sense; lưu provenance/version; translation result lưu DB không đồng nghĩa đã Add.                                                                                                                                                                                                                     | CHẤP_NHẬN                 |
| P1-WD-03  | Add idempotent vào queue người dùng; không Add text.                                                                                                                                                                                                                                                                                            | CHẤP_NHẬN                 |
| P1-QZ-01  | Người dùng cấu hình N, không có mặc định. N đếm từ hợp lệ, duy nhất, đã Add, chưa gán batch. Khi chưa cấu hình N, yêu cầu cấu hình và không tạo batch.                                                                                                                                                                                          | CHẤP_NHẬN                 |
| P1-QZ-02  | Tạo text import ổn định `term<TAB>definition`, một card mỗi dòng; validate delimiter.                                                                                                                                                                                                                                                           | CHẤP_NHẬN                 |
| P1-QZ-03  | Tự tạo set Quizlet đúng tài khoản; chỉ xác nhận thành công khi có bằng chứng set.                                                                                                                                                                                                                                                               | CHẤP_NHẬN, phụ thuộc kênh |
| P1-QZ-04  | Retry/reconciliation chống trùng; trạng thái unavailable/unknown được nêu rõ.                                                                                                                                                                                                                                                                   | CHẤP_NHẬN                 |
| P1-UI-01  | Dùng Wirefigma cho popup/options/queue nhỏ, theo [reference](design/reference/WIREFIGMA_DESIGN_SYSTEM.md).                                                                                                                                                                                                                                      | CHẤP_NHẬN                 |
| P1-SEC-01 | Gửi selection tối thiểu; không crawl trang/cookie/session.                                                                                                                                                                                                                                                                                      | CHẤP_NHẬN                 |
| P1-SEC-02 | BYOK đi qua backend, key không lưu trong client; auth/secret chi tiết theo ADR.                                                                                                                                                                                                                                                                 | CHẤP_NHẬN                 |
| P1-SEC-03 | Mô tả quyền trước khi content script detect; không ngụ ý `activeTab` tự kích hoạt khi select.                                                                                                                                                                                                                                                   | CHẤP_NHẬN                 |

### Điều kiện đạt Quizlet

Mục tiêu tự tạo set là yêu cầu sản phẩm bắt buộc. Feasibility proof cho kênh production chưa có. Owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu kênh chính thức không dùng được; đây là quyền khảo sát, không phải bằng chứng PoC đạt. Đánh giá ranh giới bảo mật, điều khoản/kỹ thuật và quyết định triển khai trước gói production. Cho đến khi kênh được chứng minh, P1-QZ-03 có điều kiện kỹ thuật và Phase 1 chưa thể tuyên bố đạt đầy đủ. Export thủ công không thay AC hiện tại.

## Ngoài phạm vi Phase 1

Capture/crawl trang, Chat/Q&A/citation, dashboard, MCP server, TTS, word family, lesson/scheduler/mastery nội bộ, import Quizlet từ file, direct sync không được hỗ trợ, và bất kỳ provider fallback không được người dùng chọn.

## Phi chức năng liên quan

- TLS cho lưu lượng ngoài local; xác thực/phân quyền và validate cho mọi ghi DB.
- Provider adapter có timeout/retry xác định; lỗi thân thiện, không lộ key/stack trace.
- Selection là dữ liệu không tin cậy; giới hạn payload ở phần cần dịch.
- Migration tiến về phía trước và có kiểm thử trước khi production.
- Queue, cache và retry gắn với chủ thể người dùng và idempotency.

## Quyết định đang chờ

- Kênh Quizlet production vẫn cần feasibility proof; owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu kênh chính thức không khả dụng.
- AI provider/model cụ thể, auth, schema và versioning — chưa khóa, cần spike/ADR tương ứng.

Lịch sử yêu cầu cũ CAP/CHAT/SEL/VOC/LRN/MCP/QZ được giữ ở P1-001 và các tài liệu lưu trữ; không phải backlog đang mở của Phase 1 này.
