# Prompt điều phối — Lane A: sản phẩm và UX

## Cấu hình phiên

- Model: `gpt-6-luna`; reasoning effort: `low`.
- Repository: `D:\EnglishBot`.
- Gói duy nhất: `docs/work-packages/P1-R01-scope-rebaseline.md`.
- Vai trò: biên tập đường cơ sở sản phẩm/UX; root chịu trách nhiệm kiến trúc, khả thi, review và tích hợp.

## Thứ tự đọc

Đọc `AGENTS.md`, `C:\Users\tuannghia\.codex\RTK.md`, README, STATUS, playbook rồi P1-R01. Đọc đầy đủ các file thuộc quyền sửa bên dưới và `C:\SystemDesign\WIREFIGMA_DESIGN_SYSTEM.md`. Không cần khảo sát code ứng dụng. Mọi shell command phải có prefix `rtk`; dùng `apply_patch` để sửa file.

## Quyền sửa độc quyền

1. `README.md`
2. `docs/00-project-charter.md`
3. `docs/01-product-requirements.md`
4. `docs/02-ux-ui-system.md`
5. `docs/product/phase-1-scope-and-journeys.md`
6. `docs/design/phase-1-information-architecture.md`
7. `docs/design/phase-1-extension-wireframes.md`
8. `docs/design/phase-1-design-foundations.md`
9. `docs/design/phase-1-dashboard-and-integrations.md`

Không sửa file lane B/root, STATUS, AGENTS, ADR hoặc asset. Không commit/push. Các file nguồn Wirefigma do root đưa vào `docs/design/reference/`; liên kết tương đối có thể chờ root tạo.

## Yêu cầu chủ dự án — phải giữ đúng

### Cập nhật sau câu trả lời trong cùng phiên (có hiệu lực cao hơn giả định lúc giao việc)

Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ; Google dịch cụm/câu không cần AI; AI mode vẫn dịch mọi selection bằng AI. Cache từ đầy đủ reuse không gọi lại provider. N do người dùng cấu hình, KHÔNG mặc định; chưa cấu hình thì yêu cầu thiết lập và không tạo batch. Owner cho phép khảo sát tự động thao tác Quizlet trong trình duyệt đã đăng nhập nếu kênh chính thức chưa dùng được; spike phải chứng minh trước production (ADR-008). Ba lựa chọn không còn là câu hỏi mở. Root đã gửi cập nhật này tới lane A và nhận bản sửa.

Phase 1 gồm: extension dịch selection qua Google API hoặc AI bằng API key; bôi đen hiện hành động local, bấm Dịch mới mở popup nhỏ cạnh con trỏ; một từ có từ loại, nghĩa và câu ví dụ; lưu ba trường trong DB để dùng lần sau; nút Add riêng cho từ; đủ N từ đã Add thì tự tạo text import và tự import/tạo bộ thẻ Quizlet trên tài khoản người dùng. Cụm/câu chỉ dịch nghĩa. Không có Chat, capture toàn trang, dashboard, MCP server, TTS, word family, lesson/scheduler/mastery nội bộ trong Phase 1. Bài học trong phạm vi này là bộ thẻ trên Quizlet.

Chủ dự án yêu cầu dùng design system từ `C:\SystemDesign` và xóa mockup EnglishBot cũ. Không tạo mockup mới trong phiên này. Không sao chép dashboard mẫu Wirefigma thành yêu cầu sản phẩm: chỉ dùng token/component/behavior phù hợp cho popup, options và hàng đợi nhỏ.

Không tự đặt N=10/20, không tự chọn AI vendor/model. Google Translation chỉ trả dịch/lang/model/glossary, không POS/example; enrichment dùng AI BYOK theo lựa chọn owner ở trên và UI phải thể hiện rõ. Quizlet có import web và connector Claude, chưa chứng minh dùng được từ EnglishBot; khảo sát UI automation đã được phép. Mục tiêu tự tạo vẫn bắt buộc; export thủ công không đạt AC.

## ID yêu cầu thống nhất giữa các lane

- P1-TR-01: action selection local, không gọi mạng trước click.
- P1-TR-02: Google Cloud Translation API chính thức hoặc AI BYOK.
- P1-TR-03: popup cạnh con trỏ, clamp viewport, đóng/focus/keyboard.
- P1-TR-04: cụm/câu chỉ bản dịch, không Add.
- P1-TR-05: lỗi key/quota/network/provider và recovery; không fallback provider ngầm.
- P1-WD-01: từ có POS/nghĩa/ví dụ; persist DB sau validate.
- P1-WD-02: cache/reuse đúng ngôn ngữ/provider/sense, có provenance/version; phân biệt chưa Add.
- P1-WD-03: Add idempotent vào hàng đợi của người dùng; không Add text.
- P1-QZ-01: N đếm từ hợp lệ, duy nhất, đã Add, chưa gán batch.
- P1-QZ-02: text import ổn định term TAB definition, mỗi card một dòng; validate delimiter.
- P1-QZ-03: tự tạo bộ thẻ Quizlet đúng tài khoản; chỉ thành công khi có bằng chứng set.
- P1-QZ-04: retry/reconciliation không tạo trùng, trạng thái unavailable/unknown rõ.
- P1-UI-01: dùng Wirefigma, chỉ popup/options/hàng đợi cần thiết.
- P1-SEC-01: tối thiểu selection; không crawl trang/cookie/session.
- P1-SEC-02: BYOK đi qua backend, không lưu key trong client; chi tiết auth/secret qua ADR.
- P1-SEC-03: mô tả cấp quyền trước khi content script detect; `activeTab` không tự kích hoạt do bôi đen.

## Cách sửa

- Nội dung chính của README/charter/PRD/UX/product/design phải phục vụ Phase 1 mới, không thêm banner rồi giữ toàn bộ kế hoạch cũ làm yêu cầu đang hoạt động.
- Các phạm vi cũ ghi ngắn trong mục lịch sử/hoãn, có ngày bị thay thế; không xóa lịch sử P0 hoàn tất hoặc giả vờ P1 mới hoàn tất.
- Đổi hành trình đang hoạt động sang P1-J1 dịch từ, P1-J2 dịch cụm/câu, P1-J3 Add→batch→Quizlet, P1-J4 cấu hình provider/key/quyền. Không tái dùng J1..J5 cho ý nghĩa khác.
- Wireframe chỉ mô tả action và popup gần pointer, options, trạng thái queue/batch; bỏ baseline ba tab sidepanel. Phân biệt translation result lưu DB với Add queue.
- Trong foundation dẫn `reference/WIREFIGMA_DESIGN_SYSTEM.md` và sample; bỏ hướng Trang sách/Sổ tay khỏi baseline. Token lấy nguồn Wirefigma; dark mode chưa có token được xác minh thì không tự chế palette.
- File dashboard/integrations chỉ ghi bị thay thế/hoãn, route không thuộc Phase 1; không coi nó là dependency mở gói mới.
- Ghi các ranh giới kỹ thuật chưa khóa với liên kết decision register hiện hành.

## Kiểm tra/báo cáo

Kiểm tra file sửa không còn câu mệnh lệnh triển khai Chat/MCP/dashboard trong Phase 1, không có thông số N tự đặt hoặc key thật. Không chạy format toàn repository trong lúc lane khác đang sửa. Gửi root: file đã sửa, điểm mơ hồ/xung đột, mapping requirement/UX, giới hạn. Root chạy checks cuối và xử lý quyết định.
