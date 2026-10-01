# P1-103 — Bằng chứng triển khai và bàn giao review

- Ngày: 2026-10-01. Gói duy nhất [P1-103](../work-packages/P1-103-mock-contracts.md).
- Bản mock đã chạy; **chưa hoàn tất gói**: owner chưa duyệt hợp đồng/mock và zoom Chrome thật 125%/200% chưa xác minh. Không mở P1-104, không cập nhật STATUS trước cổng.
- Planner/reviewer: GPT 6.1 (`gpt-6.1-sol`), effort high. Hai lane contracts/fixture và component UI: GPT 6 luna (`gpt-6-luna`), effort medium. Root điều phối/tích hợp/QA; metadata model/effort root không xác minh được, không suy diễn.
- Nhật ký và prompt/file ownership: [kế hoạch điều phối](../ai-prompts/P1-103-orchestration.md). Ba vòng tổng cộng, không mở vòng 4 hoặc hạ tiêu chí.

## Đầu ra

- `apps/extension`: host review React, bài mẫu, phát hiện selection DOM local, Dịch tường minh, popup không modal, quản lý tiện ích, Options và queue. Không manifest/content-script hoặc quyền extension thật.
- `packages/api-contracts`: union/validator request/result, POS, provenance dịch/enrichment, classification, normalization, N và import serializer. Chỉ bản nháp, không API production đã duyệt.
- `packages/mock-fixtures`: fixture xác định và fake backend bộ nhớ. Cache/persist tách Add; idempotency, dedupe cùng từ/nghĩa xuyên provider, snapshot N và text import bất biến; unknown không retry mù.
- Build/test metadata: public workspace exports, lockfile chỉ thay link nội bộ; wrapper Vite có version/bin guard, loại output/cache khỏi discovery lint/test. Không dependency ngoài mới.
- Tài liệu: ADR-009, ba quyết định owner D-P1-16…18, [hợp đồng và walkthrough](../design/p1-103-contract-review.md), kế hoạch/review log và bằng chứng này.
- Hai file thay đổi sẵn bởi người dùng `AGENTS.md` và `docs/07-ai-execution-playbook.md` được giữ nguyên, không đưa vào commit P1-103.

## Cổng đã chạy

| Lệnh/kiểm tra                                                                 | Kết quả                                                                                                                                                               |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                              | Đạt ở workspace và checkout sạch.                                                                                                                                     |
| `pnpm run quality`                                                            | Format, lint, typecheck, **173 test / 7 file**, build đạt. Không tính test lặp từ dist/.cache.                                                                        |
| Checkout sạch từ Git index, không node_modules/dist; frozen install + quality | Lần đầu tái hiện lỗi CLI Vite không được expose; sau wrapper, đầy đủ các cổng và 173 test đạt. Bản sao nằm trong `.cache/p1-103-clean-final`, không đưa lên Git.      |
| `node scripts/run-mock-vite.mjs --check`                                      | Resolve Vite 8.3.1 đã khóa qua metadata Vitest; không dựa vào CLI global/stale.                                                                                       |
| Smoke dev từ checkout sạch bằng wrapper, port 4175                            | Vite ready, sau đó đã dừng phiên smoke. Preview static review chạy port 4174.                                                                                         |
| `pnpm run docs:check`, `pnpm run secrets:scan`, diff whitespace check         | Root báo docs-check81 Markdown, secrets scan179 files và cached whitespace PASS; reviewer docs-check81 và working diff-check PASS. Secret scan gồm file mới đã stage. |
| Browser QA trên build static, không chạy build/HMR đồng thời                  | Chrome **154.0.8037.59**, bộ assertion tự động đạt; [JSON](P1-103/browser-results.json) giữ bounds, computed style và giới hạn.                                       |

QA script: [p1-103-browser-qa.mjs](../../scripts/p1-103-browser-qa.mjs). Runtime Playwright được cung cấp sẵn, không thêm npm dependency hoặc tải browser:

```text
ENGLISHBOT_QA_NODE_MODULES=<thư mục node_modules của runtime có Playwright>
ENGLISHBOT_QA_URL=http://127.0.0.1:4174
ENGLISHBOT_QA_CHROME=<đường dẫn Chrome nếu không dùng vị trí Windows chuẩn>
node scripts/p1-103-browser-qa.mjs
```

Đây là biến môi trường cần đặt trong shell, không phải lệnh chung cho mọi hệ điều hành. Node và Chrome cần có sẵn. Chạy preview build cố định; dev HMR có thể reset mock khi source/shared dist thay đổi, không coi đó là test stale response nghiệp vụ.

## Kết quả theo tiêu chí nghiệm thu

| AC  | Bằng chứng / trạng thái                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC1 | Validator hợp lệ/không hợp lệ và secret-field rejection; Google word/phrase, AI word/phrase, cache đầy đủ, key missing/invalid, quota, timeout/network, malformed, persist/Add failures. Unit và fake boundary test đạt; review senior vòng 3 xác nhận riêng. |
| AC2 | Phrase không có POS/example/Add; word thiếu trường/sai POS/persisted=false bị từ chối; không tin client kind. HTML provider-like được render inert text, không executable markup.                                                                             |
| AC3 | Lookup không Add; cache không cần key cho call mới; provenance enrichment riêng và version; Google/AI cache riêng nhưng Add không đếm trùng cùng từ/nghĩa. Mock owner cố định, không chứng minh auth/multi-owner.                                             |
| AC4 | Reject delimiter/control injection, TAB/LF export, N không default; save N/duplicate Add không batch; next new Add batch; snapshots giữ N/identity/item order; unsent/unavailable/unknown/verified-mock và account/set giả rõ.                                |
| AC5 | **CHỜ_OWNER**: [hợp đồng nháp](../design/p1-103-contract-review.md). Các quyết định production `CHƯA_CHỐT`, không tự mở DB.                                                                                                                                   |
| AC6 | **CHƯA_QUA_CỔNG**: viewport/layout/keyboard/focus/contrast/reflow đã chạy; zoom trình duyệt thật 125%/200% và owner duyệt mock còn thiếu. Không đổi thành miễn test hoặc đẩy test zoom sang phase khác.                                                       |

## UI runtime theo UAT-101-09…17

- Viewport 320/360/420 CSS px: popup rộng 304/320/320. Word, phrase, Options trên nền trang sáng/tối; popup luôn sáng. Sáu ca phrase dài/nhiều dòng Google không có AI key.
- 24 ca selection DOM tại 4 góc + 4 mép, ở ba viewport; ghi tọa độ selection/popup trong JSON. Ca tọa độ mép dùng DOM fixture đặt tại mép để tái lập, không phải thử quyền content-script trên trang ngoài.
- Resize từ 420×640 xuống 320×360: body cuộn, Add vẫn truy cập được, không cuộn ngang và không dịch lại. **Không gọi resize này là browser zoom.**
- Một dialog không modal; focus close, Tab thoát không trap, Escape trả focus về control hợp lệ; outside click giữ focus target. Close/selection mới khi đang tải không chạy/gán phản hồi cũ. Pointer và keyboard selection dùng tọa độ hiện tại, không tái dùng pointer cũ.
- Vòng focus 3px + offset 3px không bị cắt. Computed contrast: body/CTA 17.38:1, muted 6.72:1, focus 5.74:1; nút host trên nền tối cũng được assert contrast. `prefers-reduced-motion` vẫn có trạng thái bằng chữ.
- Labels/describedby native radio/N được kiểm tra từ source và browser rendering; không coi đây là audit screen-reader toàn diện. Quyền Chrome/interaction ngoài host thuộc P1-105, E2E release thuộc P1-109.

Ảnh: [popup word/focus](P1-103/screenshots/focus-420-light-page.png), [word trên nền tối](P1-103/screenshots/word-360-dark-page.png), [Options](P1-103/screenshots/options-320-light-page.png), [phrase dài](P1-103/screenshots/long-phrase-320-light-page.png), [queue unknown](P1-103/screenshots/queue-420-quizlet-unknown.png). Các viewport/nền còn lại trong [thư mục ảnh](P1-103/screenshots). Root xem ảnh thật, không chỉ bounds số học.

## Regression và review

Vòng 1: test phát hiện dialog lồng, lint lỗi. Vòng 2: type/fixture/source/fake/UI đã sửa; test mới tái hiện duplicate Add xuyên provider và lookup punctuation, focus-ring bị cắt. [Bằng chứng focus trước sửa](P1-103/screenshots/focus-before-fix.png) và [browser vòng 2](P1-103/round-2-browser-failure.json).

Vòng 3: sửa spacing header không tắt focus/overflow assertion; clean build tái hiện thiếu CLI rồi wrapper sửa; kiểm tra ảnh phát hiện nút nền tối bị trắng-trên-trắng, thêm regression contrast rồi sửa foreground control. Assertion và gate vẫn giữ. Kết luận senior cuối ở kế hoạch; chưa đủ cổng owner/zoom thì không đánh dấu hoàn thành.

Reviewer GPT 6.1/high đã đọc staged source và latest unstaged QA, xem trực tiếp ảnh focus/light, word/dark, long phrase320/dark, Options320 và queue unknown420. Thực chạy lại test173/7 files, lint và diff-check đạt; artifact primary/clean-final có cùng tên hash. Latest browser JSON PASS46 checks/0 external/0 page errors. Không phát hiện blocker AC1–4 trong scope mock nháp. AC5 chờ owner và AC6 chưa qua cổng zoom thật/owner mock; WP giữ CẦN_CHỈNH_SỬA sau vòng3 theo playbook, **dừng tự triển khai, không vòng4**. Đây là thiếu kiểm thử/phê duyệt, không phải tuyên bố lỗi code còn biết hoặc gói đã hoàn tất.

## Bảo mật, dữ liệu và giới hạn

- Không credential thật, browser storage/cookie extraction, network provider hoặc external write; browser QA ghi **0 external request, 0 page error**. Dữ liệu chỉ bài mẫu/fixture bộ nhớ; reload mất cache/queue là chủ ý của mock, không phải DB production.
- Không migration, backend/auth/provider/Quizlet thật; Maven/backend chưa chạy trong gói vì không đổi code Java. Không dùng prototype để nhận BYOK hoặc chạy trên tài khoản thật.
- Validator loại field secret; render text an toàn. Kiểm thử live model/provider/quota/restart/ownership và failure reconciliation cần gói production tương ứng.
- Cần walkthrough Chrome zoom thật 125% và 200%: ghi browser/version, mức zoom xác minh từ UI browser, viewport CSS, screenshot, close/Add/Options/queue không bị mất. Owner hoặc người test được chỉ định cung cấp/xác nhận bằng chứng; chưa có bằng chứng thì AC6 vẫn thiếu.
- Đề xuất chưa duyệt: phân biệt `verified-mock` với verified production và chạy UI QA trên build static cố định để tránh artifact HMR gây kết luận sai. Không tự thêm rule vào AGENTS.
