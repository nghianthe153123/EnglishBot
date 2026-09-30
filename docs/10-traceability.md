# Ma trận truy vết yêu cầu

Đường truy vết hiện hành của P1-R01 dùng requirement ID cho baseline mới. ID cũ được giữ trong lịch sử package P1-001..007, không gán lại sang yêu cầu mới. Thay đổi chỉ được tính đạt khi package tương ứng có test/bằng chứng.

## Baseline mới — P1-R01

| Yêu cầu                                                                                             | Gói chính              | Test/bằng chứng bắt buộc                                                               |
| --------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| P1-TR-01: selection chỉ hiện action local, không mạng trước click                                   | P1-101, P1-105, P1-109 | Unit/interaction và assertion network trên browser                                     |
| P1-TR-02: Google Translation API chính thức hoặc AI BYOK                                            | P1-103, P1-104, P1-105 | Contract request/result, adapter fake, test credential/bảo mật                         |
| P1-TR-03: popup cạnh pointer, clamp viewport, close/focus/keyboard                                  | P1-101, P1-105, P1-109 | Component/browser và bằng chứng visual/keyboard                                        |
| P1-TR-04: phrase/sentence chỉ dịch, không Add                                                       | P1-103, P1-105, P1-109 | Assertion contract và E2E                                                              |
| P1-TR-05: lỗi key/quota/network/provider có recovery, không fallback ngầm                           | P1-103, P1-105         | Test contract lỗi/adapter                                                              |
| P1-WD-01: word có POS/definition/example, chỉ persist sau validation                                | P1-104, P1-106         | Domain/DB validation, persistence qua restart                                          |
| P1-WD-02: cache/reuse theo language/provider/sense, provenance/version; Add tách riêng              | P1-103, P1-104, P1-106 | Cache hit không gọi provider, collision/isolation                                      |
| P1-WD-03: Add idempotent vào queue của user; không Add text                                         | P1-106, P1-107         | Double click/đồng thời và test âm tính phrase                                          |
| P1-QZ-01: N đếm từ Added duy nhất/hợp lệ/chưa batch                                                 | P1-107                 | N unset/invalid/configured, N−1/N/N+1, đổi N khi queue có dữ liệu, Add trùng/đồng thời |
| P1-QZ-02: text import ổn định term TAB definition, mỗi card một dòng; validate delimiter            | P1-107                 | Fixture unicode/newline/delimiter/property                                             |
| P1-QZ-03: tự tạo set đúng tài khoản; thành công cần bằng chứng set                                  | P1-102, P1-108, P1-109 | Báo cáo khả thi và live integration có nhãn/test account, URL/ID                       |
| P1-QZ-04: retry/đối soát tránh trùng; unavailable/unknown rõ                                        | P1-102, P1-108         | Timeout sau create, dừng retry tự động, reconcile/idempotency                          |
| P1-UI-01: Wirefigma chỉ dùng cho popup/options/queue cần thiết                                      | P1-101, P1-109         | Review nguồn/checksum và visual 320/360/420                                            |
| P1-SEC-01: selection tối thiểu; không crawl trang/cookie/session                                    | P1-101, P1-105, P1-109 | Test âm permission/trang hạn chế/quyền riêng tư                                        |
| P1-SEC-02: BYOK đi qua backend, không lưu key ở client; auth/secret theo ADR                        | P1-103, P1-104, P1-109 | Review threat, redaction log, quét client bundle/storage                               |
| P1-SEC-03: mô tả permission trước khi content-script phát hiện; activeTab không được cấp do bôi đen | P1-101, P1-105, P1-109 | Browser test cài mới/chưa cấp/cấp/thu hồi/trang hạn chế                                |

Yêu cầu xuyên suốt: test LLM trong CI dùng fixture xác định; test Google/AI/Quizlet thật có nhãn riêng, test account và bằng chứng đã che thông tin nhạy cảm. Không lưu secret trong Git hoặc CI mặc định.

## Quyết định đã chốt và hành vi kiểm thử

- Khi chọn Google, phrase/sentence chỉ gọi Google Translation, không cần AI key; khi chọn AI, phrase/sentence được dịch qua AI provider đã chọn và không Add/enrich thành từ.
- Google word dùng AI BYOK để bổ sung POS/example; thiếu key thì chờ cấu hình/credential, không bịa nội dung.
- Cache đầy đủ không gọi lại provider.
- N do user cấu hình, không có default; unset/invalid thì runtime không tạo batch.
- P1-102 khảo sát kênh Quizlet chính thức trước; nếu không dùng được, được khảo sát browser automation trong browser Quizlet đã đăng nhập. Việc khảo sát không chứng minh PoC hoặc production đã được duyệt.

## Bao phủ các gate

P1-101 có [hồ sơ UX review](design/p1-101-owner-review.md), [checklist AC/UAT](design/p1-101-review-checklist.md) và [bằng chứng](evidence/P1-101-design-review.md). Mapping thiết kế không phải kết quả unit/E2E. D-P1-11 chốt activation; D-P1-14 chốt gate spec P1-101, mock visual/keyboard P1-103, browser quyền/interaction P1-105, E2E/release P1-109. Bộ UX còn chờ owner duyệt; runtime test chưa chạy.

| Gate                 | Phạm vi bao phủ                                                                      |
| -------------------- | ------------------------------------------------------------------------------------ |
| Scope/UX owner gate  | P1-TR-01/03/04, P1-UI-01, P1-SEC-01/03; Wirefigma và hành vi local-only              |
| Mock/contracts gate  | P1-TR-02/04/05, P1-WD-02/03, P1-QZ-02/04                                             |
| DB/BYOK gate         | P1-WD-01/02 và P1-SEC-02; migration rỗng/nâng cấp, cô lập user                       |
| E2E/UAT/release gate | Tất cả ID; Chrome rồi Edge; bằng chứng visual/bảo mật và kết quả Quizlet đã xác minh |

P1-QZ-03/04 không thể đạt bằng copy/export thủ công. Kênh Quizlet còn `CHƯA_CHỐT`; gate phụ thuộc phải chờ khảo sát, bằng chứng và ADR/owner approval. Owner cho phép khảo sát browser automation nếu kênh chính thức không dùng được; việc cho phép khảo sát không đồng nghĩa production đã được duyệt.

## Truy vết lịch sử — giữ nguyên các requirement ID cũ

Các dòng dưới đây để audit; mapping thuộc kế hoạch trước, không phải đường thực thi hiện hành. Hồ sơ package lịch sử giữ trạng thái/bằng chứng ban đầu.

| Nhóm ID lịch sử                  | Mapping package cũ | Xử lý hiện tại                                                                                                      |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| CAP-01..04, CHAT-01..04          | P4/P5A             | Capture, Chat, Q&A hoãn; không thuộc Phase 1 mới                                                                    |
| SEL-01..05                       | P5B                | Baseline cũ bị thay thế; selection mới truy vết qua P1-TR/P1-WD/P1-UI                                               |
| VOC-01..03, LRN-01..04           | P5B/P5C            | Dashboard từ vựng, scheduler, bài học nội bộ hoãn; Add mới thuộc P1-WD-03                                           |
| MCP-01..03                       | P6                 | MCP hoãn                                                                                                            |
| QZ-01..03                        | P5B/P6             | Định nghĩa export/import/direct-sync lịch sử bị thay; yêu cầu tự tạo mới là P1-QZ-01..04                            |
| PRIV-01..03, NFR-01..10, D-101.. | P3–P7              | Giữ decision/trace ID và bằng chứng cũ; áp dụng nguyên tắc bảo mật liên quan cho gói mới theo mapping cụ thể ở trên |
| J1..J5                           | Hành trình P1 cũ   | Giữ nguyên ý nghĩa lịch sử; hành trình mới dùng P1-J1..J4 ở tài liệu sản phẩm                                       |

Truy vết và bằng chứng hoàn tất P0 không đổi. Không dùng ID package P1 cũ cho tính năng mới.
