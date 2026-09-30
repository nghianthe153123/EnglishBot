# Chiến lược kiểm thử

## Nguyên tắc

- Kiểm thử theo requirement mới `P1-TR-*`, `P1-WD-*`, `P1-QZ-*`, `P1-UI-*`, `P1-SEC-*`; bảng ánh xạ đầy đủ ở [traceability](10-traceability.md).
- Mỗi gói có test cùng phạm vi code và bằng chứng. Mọi sửa lỗi cần regression test.
- Dùng fake tại ranh giới provider. CI dùng fixture LLM xác định; Google/AI/Quizlet thật chỉ chạy trong test có nhãn riêng trên tài khoản thử nghiệm, không dùng secret trong Git hay CI mặc định.
- Không chạy mạng trước click Dịch. Không fallback provider âm thầm. Cache hit không gọi lại provider.
- Không tính requirement là đạt nếu chỉ có tài liệu test plan; cần kết quả test/bằng chứng ở package và gate.

## Ma trận kiểm thử Phase 1

### Selection, popup và giao diện

- Single word, phrase, sentence; dấu câu, apostrophe, hyphen, multiline, empty selection.
- Selection thay đổi khi request đang chạy; đóng popup; selection mới; near viewport edge; zoom; keyboard/focus; XSS và nội dung không tin cậy.
- Xác nhận bôi đen chỉ có local action, không request/mạng trước click; popup chỉ mở sau click và được clamp trong viewport.
- Kiểm tra kích thước 320/360/420 px; popup/options/queue theo Wirefigma. Kiểm tra bàn phím, focus, contrast và trạng thái lỗi.
- Fresh install, chưa cấp quyền, cấp/thu hồi quyền; restricted page; xác nhận `activeTab`/permission không tự phát hiện selection chỉ do bôi đen.

### Translation và provider

- Hợp đồng request/result Google Translation và AI BYOK; timeout, quota, invalid key, malformed response.
- AI output POS/example sai cấu trúc; không persist dữ liệu không hợp lệ.
- Không fallback ngầm giữa Google và AI; key/model không xuất hiện trong client/log.
- Cache hit trả kết quả cùng ngôn ngữ/provider/sense/provenance mà không gọi provider.
- Google Translation không trả POS/example; kiểm thử phải đảm bảo không tự bịa hoặc gọi AI ngoài luồng đã duyệt.

Theo quyết định owner: khi chọn Google, phrase/sentence không cần AI key; khi chọn AI, phrase/sentence dịch qua AI provider đã chọn. Google word dùng AI BYOK để bổ sung POS/example. Nếu key thiếu, trạng thái enrichment phải chờ cấu hình/credential. Khi cache đầy đủ, không gọi lại provider.

### Database và riêng tư

- POS/nghĩa/ví dụ persist trước và sau restart; nhiều nghĩa/provider/language không ghi đè sai.
- Phân tách user; lookup/cache không tự Add; dữ liệu nhạy cảm và key không ghi plaintext vào log.
- Migration trên DB rỗng và nâng cấp từ phiên bản trước; invariant/index/constraint và rollback an toàn theo migration policy.
- BYOK đi backend theo thiết kế được duyệt; xác minh redaction/logging, key rotation/retention theo ADR.

### Add, ngưỡng và batch

- Add riêng, double click, request đồng thời, duplicate/retry.
- N do user cấu hình, không có giá trị mặc định; nếu unset/invalid thì runtime không tạo batch. Kiểm thử unset, invalid, configured N, N−1/N/N+1, nhiều batch và thay đổi N khi queue đã có dữ liệu.
- N chỉ tính từ hợp lệ, duy nhất, đã Add, chưa gán batch; lookup và duplicate Add không tăng số lượng.
- Snapshot batch immutable; delimiter TAB/newline/unicode; escape/validate nội dung; delete/cancel; trạng thái chưa gửi và outcome unknown.
- Retry/reconcile không tạo duplicate batch hoặc set.

### Quizlet và E2E/UAT

- Đúng account ownership; mất đăng nhập/quyền; account mismatch; channel unavailable.
- Timeout sau thao tác create trả unknown, dừng automatic retry; reconcile trước retry; xác nhận idempotency.
- Nếu cần browser automation: kiểm thử đăng nhập, CAPTCHA, UI thay đổi, mất tab, service worker suspension và timeout/unknown sau submit; không retry tự động trước reconcile.
- Chỉ báo thành công khi nhận set URL/ID và bằng chứng phù hợp. Không khẳng định đã tạo Learn lesson riêng.
- E2E: từ → dịch → persist/reuse → Add → ngưỡng → tự tạo set. Phrase → chỉ dịch. Google word enrichment theo quyết định đã chốt.
- Browser restart/service-worker suspension; Chrome rồi Edge; fresh install và permission cases.
- Kiểm thử smoke trực tiếp provider/Quizlet chạy riêng, có nhãn trên tài khoản thử nghiệm và bằng chứng đã che thông tin nhạy cảm.

## Lệnh và cổng

Các lệnh chuẩn hiện có: `pnpm run format`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run docs:check`, `pnpm run secrets:scan`, `pnpm audit --audit-level=high`, `mvnw.cmd --batch-mode --no-transfer-progress verify` (Windows). Chọn lệnh theo thay đổi và cấu hình scaffold; package phải ghi chính xác lệnh thực chạy, phiên bản môi trường, exit/result và artifact. Không coi lệnh chưa chạy là đạt.

P1-109 — cổng phát hành:

1. Unit/component/contract và migration tests đạt; fake provider xác định.
2. Security/privacy negative cases đạt; không secret/key leakage.
3. Browser E2E đạt trên Chrome rồi Edge, gồm quyền, restart/suspension và toàn flow.
4. Bằng chứng trực quan/khả năng tiếp cận ở 320/360/420 px, keyboard/focus/contrast.
5. Owner UAT đạt; kênh Quizlet được xác minh bằng tài khoản thử nghiệm và bằng chứng set.
6. Traceability khớp kết quả; blocker, giới hạn đã biết, rollback/cờ và báo cáo package hoàn tất.

N và cách enrichment đã được owner quyết định. Kênh Quizlet vẫn `CHƯA_CHỐT`; gate Quizlet phụ thuộc kết quả khảo sát/ADR. Không thay thế tự tạo set bằng export thủ công, bỏ test hay browser automation chưa được duyệt để production.

## Lịch sử testing baseline cũ

Các kiểm thử Q&A/capture, dashboard, MCP, scheduler, TTS, nội dung bài học nội bộ và viewport dashboard thuộc kế hoạch Phase 1–7 cũ bị thay thế ngày 2026-09-30. Giữ bằng chứng/ID lịch sử trong các package cũ; chúng không phải điều kiện phát hành của scope mới. Phase 1 mới không có dashboard baseline.
