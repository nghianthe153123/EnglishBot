# Lộ trình bàn giao

## Cơ sở và giả định

Đường cơ sở Phase 1 được thay thế theo P1-R01 ngày 2026-09-30. Toàn bộ prototype, hợp đồng, database, triển khai tính năng, kiểm thử và UAT cho luồng dịch selection → từ vựng → Quizlet nằm trong Phase 1. Không còn trì hoãn dịch sang Phase 5B hoặc database sang Phase 3 cũ.

Ước lượng thực thi tuần tự là **16–27 ngày làm việc** (P1-101..109), gồm implementation, kiểm thử và review owner. Đây là ước lượng, không phải cam kết lịch. Năng lực giả định là một người owner/reviewer tập trung cùng hỗ trợ coding bằng AI; thời gian sinh code của AI không thay thế review. Năng lực thực tế chưa được chốt. Không gán ngày lịch giả. Chỉ một gói được thực thi tại một thời điểm; tài liệu/test độc lập chỉ có thể chạy song song sau khi hợp đồng liên quan được duyệt. P1-102 có thể chạy sớm để phát hiện blocker Quizlet.

## Roadmap Phase 1 mới

| Thứ tự | Gói    | Ước lượng ngày công | Kết quả và cổng                                                   |
| -----: | ------ | ------------------: | ----------------------------------------------------------------- |
|      1 | P1-101 |                 1–2 | Chốt phạm vi/UX theo Wirefigma; owner duyệt trước mock/hợp đồng   |
|     2* | P1-102 |                 1–3 | Spike kênh Quizlet; có thể chạy sớm, không tự triển khai tích hợp |
|      3 | P1-103 |                 2–3 | Prototype mock và hợp đồng request/result/state được review       |
|      4 | P1-104 |                 2–3 | DB/migration và BYOK/auth theo quyết định được duyệt              |
|      5 | P1-105 |                 3–4 | Selection, action popup và adapter dịch                           |
|      6 | P1-106 |                 2–3 | Enrichment từ qua AI BYOK, cache/reuse và Add                     |
|      7 | P1-107 |                 1–2 | Ngưỡng N do user cấu hình, snapshot batch và text import ổn định  |
|      8 | P1-108 |                 2–4 | Tự tạo bộ Quizlet bằng kênh đã xác minh; chờ P1-102 và phê duyệt  |
|      9 | P1-109 |                 2–3 | E2E, bảo mật, UAT, cổng phát hành                                 |

\* P1-102 chạy sớm/chen song song với chuẩn bị tài liệu nếu không chạm file/hợp đồng đang thay đổi. Tổng tuần tự là dự toán 16–27 ngày công; thời gian chờ owner/bên ngoài không tính vào ngày công. Nếu Quizlet không có kênh được owner chấp nhận, P1-108 bị chặn và Phase 1 chưa đạt đầy đủ. Export/copy thủ công không thay thế tiêu chí tự tạo bộ thẻ.

### Phân bổ ngày công dự kiến

Các khoảng dưới đây là ước lượng chuẩn bị/triển khai hoặc khảo sát và kiểm thử/review cho từng gói; không phải cam kết lịch. Tổng mỗi dòng khớp ước lượng trong bảng roadmap. Ngày công không gồm thời gian chờ quyết định owner, cấp quyền hay phản hồi bên ngoài.

| Gói              | Chuẩn bị/triển khai hoặc khảo sát | Kiểm thử + owner review | Tổng ngày công dự kiến |
| ---------------- | --------------------------------: | ----------------------: | ---------------------: |
| P1-101           |                             0.5–1 |                   0.5–1 |                    1–2 |
| P1-102           |            0.5–2 (khảo sát/probe) |                   0.5–1 |                    1–3 |
| P1-103           |                               1–2 |                       1 |                    2–3 |
| P1-104           |                               1–2 |                       1 |                    2–3 |
| P1-105           |                               2–3 |                       1 |                    3–4 |
| P1-106           |                               1–2 |                       1 |                    2–3 |
| P1-107           |                             0.5–1 |                   0.5–1 |                    1–2 |
| P1-108           |                               1–3 |                       1 |                    2–4 |
| P1-109           |                             0.5–1 |                   1.5–2 |                    2–3 |
| **Tổng tuần tự** |                          **8–17** |                **8–10** |              **16–27** |

### Chuỗi dependency

```text
P1-101 → P1-103 → P1-104 → P1-105 → P1-106 → P1-107 → P1-108 → P1-109
   └──────────────→ P1-102 spike sớm ────────────────────┘
```

Chi tiết dependency và trạng thái mỗi gói nằm trong [WBS](09-work-breakdown.md) và [work packages](work-packages/P1-101-scope-wirefigma-ux.md).

## Phạm vi Phase 1

Trong phạm vi: Google Cloud Translation hoặc AI BYOK; selection chỉ hiện local action cho tới click Dịch; popup nhỏ cạnh pointer. Khi chọn Google, phrase/sentence chỉ gọi Google Translation, không gọi AI; khi chọn AI, phrase/sentence được dịch qua AI provider đã chọn nhưng không có Add/enrichment từ. Với word trong Google mode, AI BYOK bổ sung POS/example; cache đầy đủ không gọi lại provider; Add riêng. N do user cấu hình, không có giá trị mặc định; khi chưa cấu hình thì không tạo batch. Khi đạt ngưỡng N hợp lệ/chưa batch, tạo text import và tự tạo Quizlet.

Ngoài phạm vi: quét/capture toàn trang, Chat/Q&A/citation, dashboard, MCP server, TTS, word family, scheduler/mastery, bài học nội bộ. Không triển khai trực tiếp Quizlet trước khi P1-102 xác minh channel và quyết định tích hợp được phê duyệt. P1-109 không được đánh dấu đạt đầy đủ khi luồng tự tạo còn thiếu.

## Phase sau và lịch sử

Các phase 2–7, roadmap 26 tuần và gói cũ P2/P3/P4/P5/P6/P7 là kế hoạch lịch sử bị thay thế cho đường thực thi mới ngày 2026-09-30. Chúng được giữ để truy nguyên, không phải backlog đã sẵn sàng hay lịch mở rộng được duyệt. Không lên lịch thực thi Chat/capture, dashboard, MCP, learning nội bộ hoặc TTS trong Phase 1 mới. Mọi roadmap mở rộng cần một quyết định/phạm vi mới của owner.

P0 và bằng chứng P1-001 cũ được bảo toàn như lịch sử. Các gói P1-001..P1-007 được đánh dấu thay thế trong file riêng; ID không tái sử dụng. P1-001 từng được xác nhận hoàn tất trên baseline cũ, nhưng điều đó không chứng minh tính năng Phase 1 mới đã hoàn thành.

## Cổng Phase 1 mới

- Các yêu cầu P1-TR/P1-WD/P1-QZ/P1-UI/P1-SEC được map tới gói và bằng chứng trong [traceability](10-traceability.md).
- N do user cấu hình, không có mặc định; chưa cấu hình hoặc cấu hình không hợp lệ thì không tạo batch.
- Enrichment đã chốt: Google phrase/sentence không gọi AI; Google word gọi AI BYOK để bổ sung POS/example; cache đầy đủ không gọi provider.
- Kênh Quizlet còn `CHƯA_CHỐT`: P1-102 khảo sát kênh chính thức trước, nếu không dùng được thì được phép khảo sát browser automation trong browser đã đăng nhập. Cần PoC/bằng chứng và ADR/owner approval trước code production. Chỉ đạt khi có bằng chứng set URL/ID; không khẳng định Learn lesson riêng.
- Gate gồm test xác định bằng fake provider, migration, security/privacy, E2E Chrome rồi Edge, visual/a11y theo viewport và owner UAT.
- P1-109 chỉ qua khi mọi tiêu chí Phase 1 bắt buộc đạt hoặc blocker owner được giải quyết bằng quyết định rõ; export thủ công không phải thay thế.

Chỉ cập nhật trạng thái tổng thể sau khi gate đạt và owner duyệt. Hiện tài liệu này không đánh dấu bất kỳ tính năng mới nào hoàn tất.
