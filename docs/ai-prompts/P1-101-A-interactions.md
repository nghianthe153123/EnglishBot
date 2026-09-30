# Prompt A — P1-101: Hành vi và wireframe chữ

Bạn là agent thực thi thường quy `gpt-6-luna`, effort `low`, do root điều phối. Workspace `D:\EnglishBot`. Đọc đầy đủ AGENTS.md, `C:\Users\tuannghia\.codex\RTK.md`; mọi shell command bắt đầu `rtk`, sửa file bằng apply_patch. Đọc theo thứ tự README, docs/status/STATUS.md, docs/07-ai-execution-playbook.md, docs/work-packages/P1-101-scope-wirefigma-ux.md. Sau đó đọc PRD, UX/UI, IA, wireframes, design-foundations và Wirefigma source được gói tham chiếu. Không đọc/sửa code production.

## File duy nhất được sửa

`docs/design/phase-1-extension-wireframes.md`. Không sửa file khác, không commit/push; không gọi agent khác.

## Nhiệm vụ

Chuyển bản khung P1-R01 thành đặc tả UX reviewable P1-101, bằng tiếng Việt. Mọi chi tiết UX mới là ĐỀ_XUẤT_CHỜ_OWNER, không giả duyệt. Giữ ID EXT/SEL/POP/OPT/QUEUE/QZ hiện có, mở rộng khi cần.

1. Sơ đồ selection local → click Dịch một lần → popup loading → result/error → close. Không nút Dịch lần hai. Retry chỉ ở lỗi; result cụm/câu không có Thử lại thường trực.
2. Wireframe chữ rõ Word: term/POS/nghĩa/câu AI soạn/Add riêng/trạng thái persist và queue; Phrase: bản dịch nghĩa, chỉ selection làm nhãn ngữ cảnh, không enrichment/POS/Add/TTS/word family.
3. State catalog đủ loading/cache/partial enrichment/missing key/persist fail/Add pending/added/error/unknown. Add chỉ khi word READY đã validate/persist, không Add phrase; Added không đồng nghĩa DB cached, không auto Add khi lookup.
4. Provider matrix: Google word = Google nghĩa + AI BYOK POS/ví dụ khi thiếu cache; Google phrase = Google không AI key; AI mọi selection = AI; cache word đủ không gọi provider. Không fallback. Nếu thiếu key/cache word, nêu cấu hình và Add disabled; không bịa dữ liệu. Hiển thị rõ provenance, chưa chọn model/auth.
5. Options có provider lựa chọn rõ (không tự đặt mặc định), trạng thái key đã cấu hình/thay key (input một lần gửi backend, không fake stored key), N rỗng với label/hint không default, quyền dẫn sang spec root. Lưu cấu hình không đồng nghĩa dịch; kiểm tra key nếu có phải click riêng, không tự gọi provider khi bôi đen.
6. Queue nhỏ trong vùng quản lý extension, không route/dashboard/sidepanel mới: N unset/invalid/configured; trạng thái batch và tạo set verified/unavailable/unknown. Cho Add khi N chưa có nhưng không batch; UI hướng dẫn cấu hình. Không tự đặt min/max N/rule đổi N; thuộc contract sau. Không nút tự retry create ở unknown. Quizlet production chưa khả dụng, không fake linked account.
7. Selection mới khi request chạy/close/navigation/revoke; snapshot request không bị ghi đè bởi kết quả muộn. Không âm thầm gọi lại khi select. Đưa ca ambiguous hyphen/apostrophe vào quyết định P1-103, không tự thêm UI chọn nghĩa hoặc thuật toán.
8. Ghi keyboard/focus semantic non-modal popup, không aria-modal=true/focus trap, Escape closes; quyết định clamp/permission chi tiết do root sở hữu, trỏ sang `p1-101-permissions-and-layout.md` root sẽ tạo.

## Kiểm tra và báo cáo

Tự kiểm tính nhất quán từng invariant; không claim browser test/screenshot thực hiện. Chạy formatter chỉ file mình và docs:check sau khi root tạo link target nếu cần. Báo output, việc chờ owner, test đã chạy, vấn đề khó root phải xử lý. Không sửa STATUS/ADR/PRD, không mockup mới.
