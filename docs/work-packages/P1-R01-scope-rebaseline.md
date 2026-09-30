# P1-R01 — Thu hẹp và lập lại đường cơ sở Phase 1

- Trạng thái: ĐÃ_XÁC_MINH — cổng điều chỉnh tài liệu đạt; không phải hoàn tất tính năng Phase 1.
- Ngày: 2026-09-30
- Phase: 1
- Phạm vi: chỉ tài liệu/kế hoạch; không triển khai tính năng production.
- Thẩm quyền: yêu cầu chủ dự án ngày 2026-09-30 thay thế phạm vi Phase 1 cũ.
- Điều phối: một gói hoạt động, cho phép hai lane tài liệu song song với quyền sở hữu file tách biệt; root review và tích hợp.

## Mục tiêu và đường cơ sở mới

Phase 1 bàn giao extension dịch selection qua Google Cloud Translation hoặc AI bằng API key của người dùng. Bôi đen chỉ hiện hành động local; bấm Dịch mới mở popup nhỏ cạnh con trỏ và gửi request. Từ đơn có từ loại, nghĩa, câu ví dụ được lưu DB để tái sử dụng; cụm/câu chỉ dịch. Add là hành động riêng đưa từ vào hàng đợi Quizlet. Đủ ngưỡng N thì tự tạo text import và tự tạo bộ thẻ trong Quizlet của người dùng. Không coi text import thủ công là đạt tiêu chí tự tạo Quizlet.

Thiết kế dùng bộ Wirefigma tại `C:\SystemDesign`; đưa bản tham chiếu có nguồn và checksum vào repository. Hủy các mockup EnglishBot cũ. Không tạo mockup mới trong gói điều chỉnh kế hoạch này.

Ngoài Phase 1: quét toàn trang, Chat/Q&A/citation, dashboard học tập, MCP server EnglishBot, scheduler/mastery, bài học nội bộ, TTS/word family. Giữ lịch sử quyết định cũ, đánh dấu bị thay thế/hoãn rõ ràng, không dùng lại ID cũ cho nội dung khác.

## Phân công và file

- Lane A: README, charter, PRD, UX, product journeys, bốn tài liệu design. Prompt: `docs/ai-prompts/P1-R01-A-product-ux.md`.
- Lane B: roadmap, testing strategy, WBS, traceability, phase index/plan, các gói P1-001..007 và P1-101..109. Prompt: `docs/ai-prompts/P1-R01-B-delivery-testing.md`.
- Root: ADR, decision register, architecture, data, security, environment, playbook/AGENTS, feasibility, nguồn Wirefigma, xóa artifact cũ, kiểm tra toàn bộ và status sau cổng tài liệu.

## Các gói thực thi mới trong Phase 1

| ID     | Đầu ra                                                | Ngày công dự kiến |
| ------ | ----------------------------------------------------- | ----------------- |
| P1-101 | Khóa phạm vi nhỏ và UX/token theo Wirefigma           | 1–2               |
| P1-102 | Spike khả năng tự tạo bộ thẻ Quizlet và kênh tích hợp | 1–3               |
| P1-103 | Prototype mock + hợp đồng request/result/state        | 2–3               |
| P1-104 | DB, migration, xác thực và BYOK phía backend          | 2–3               |
| P1-105 | Selection/action/popup và hai adapter dịch            | 3–4               |
| P1-106 | Bổ sung dữ liệu từ, cache DB, nút Add và chống trùng  | 2–3               |
| P1-107 | Ngưỡng batch và text import có thể retry              | 1–2               |
| P1-108 | Tự tạo bộ thẻ Quizlet qua kênh đã kiểm chứng          | 2–4               |
| P1-109 | E2E, kiểm thử lỗi/bảo mật, UAT và bàn giao            | 2–3               |

Tổng tuần tự 16–27 ngày làm việc là ước lượng, không phải cam kết. Spike Quizlet chạy sớm; nếu kênh chưa xác minh được thì P1-108 bị chặn và Phase 1 chưa đạt đầy đủ. Chủ dự án review các cổng; AI thực thi theo gói nhỏ.

## Quyết định đã cập nhật và các cổng kỹ thuật còn lại

- N đã chốt: người dùng cấu hình, không mặc định; chưa cấu hình không tự tạo batch.
- Enrichment đã chốt: Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ. Google dịch cụm/câu không cần AI; cache đầy đủ reuse không gọi provider.
- Kênh tự tạo Quizlet: tài liệu chính thức xác minh import web và connector Claude, chưa xác minh API/connector được phép gọi từ EnglishBot. Owner đã cho phép khảo sát browser automation trong trình duyệt đã đăng nhập; ADR-008/AGENTS đã ghi nhận, production vẫn cần spike chứng minh channel.
- AI provider/model, credential/auth/deployment cụ thể: qua spike/ADR trước gói production liên quan.
- Phát hiện selection trên website cần quyền content script: `activeTab` không tự cấp quyền chỉ vì người dùng bôi đen; phải mô tả luồng kích hoạt/cấp quyền đúng.

## Tiêu chí nghiệm thu cổng tài liệu

- [x] AC1: mọi tài liệu hiện hành dùng cùng phạm vi Phase 1; tài liệu cũ có trạng thái thay thế/hoãn.
- [x] AC2: đủ hai provider, popup sau click, word/text, DB reuse, Add, N và tự tạo Quizlet; không hạ tiêu chí thành export thủ công.
- [x] AC3: phạm vi API Google và khả năng Quizlet có nguồn sơ cấp; chưa xác minh được thì ghi điều kiện thực thi.
- [x] AC4: Wirefigma được lưu làm nguồn tham chiếu có checksum; mockup cũ và evidence visual không còn là baseline.
- [x] AC5: mỗi gói mới có dependency, AC, test, rollout và đầu ra; timeline tính cả testing.
- [x] AC6: prompt sub-agent đầy đủ, phân quyền file, model/effort thấp hơn; root review diff.
- [x] AC7: format, docs-check, secrets scan, diff-check đạt; kết quả ghi trong báo cáo.

## Báo cáo và giới hạn

Kết quả lưu tại `docs/evidence/P1-R01-rebaseline.md`. Cổng này chỉ xác minh tính nhất quán tài liệu, không phê duyệt mockup/schema hoặc khẳng định tính năng đã hoạt động. Không có migration hay feature code trong gói này. Status chỉ đổi sau khi cổng tài liệu đạt.

Cổng tài liệu đã đạt ngày 2026-09-30; root đã review và ghi kết quả lệnh thực chạy trong báo cáo. P1-101..109 chưa có feature được đánh dấu hoàn tất.
