# P1-004 — Nền tảng thiết kế và accessibility

- Trạng thái: BẢN_NHÁP — chờ chủ dự án duyệt tại cổng B
- Cập nhật: 2026-09-30
- Work package: [P1-004](../work-packages/P1-004-design-accessibility-foundations.md)
- Đầu vào: [IA extension](phase-1-information-architecture.md), [wireframe extension](phase-1-extension-wireframes.md), [dashboard và tích hợp](phase-1-dashboard-and-integrations.md)
- Ranh giới: định nghĩa vai trò và tiêu chí kiểm tra; màu, font, kích thước và chi tiết thương hiệu cuối cùng do chủ dự án chốt qua mockup

## 1. Hướng trình bày cần giữ qua mọi bề mặt

EnglishBot là công cụ đọc và học. Thứ bậc đi từ **nội dung đang đọc → hành động cần làm → bằng chứng/trạng thái**. Mỗi màn hình nên có một tiêu đề rõ, một hành động chính theo trạng thái, câu chữ cụ thể và khoảng trắng đủ để đọc. Từ vựng trình bày gần với mục từ trong từ điển; bài học gần với phiếu luyện tập; nguồn và citation gần với ghi chú tham chiếu. Số liệu chỉ xuất hiện khi có nguồn và lý do dùng.

Không dùng gradient tím/xanh, glow, glassmorphism, icon AI trang trí, thẻ KPI chỉ để lấp khoảng trống hoặc lời quảng cáo chung chung. Trạng thái được nói bằng chữ trước khi thêm hình/icon. Các vạch phân cách, nền nhấn và độ nổi chỉ giúp nhận biết thứ bậc, không trở thành đối tượng thu hút chính. Quy tắc này áp dụng cho cả light và dark mode; không khóa palette hay font ở gói này.

## 2. Taxonomy token semantic

Tên token dưới đây là vai trò thiết kế để P2-001 ánh xạ sang giá trị light/dark và CSS token. Chưa phải tên biến hoặc giá trị production cố định. Mỗi cặp foreground/surface phải được kiểm tra tương phản ở đúng trạng thái hiển thị.

| Nhóm         | Vai trò semantic                                                                                                    | Dùng cho                                                  | Ràng buộc                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Nền          | `canvas`, `surface`, `surface-subtle`, `surface-raised`, `overlay`                                                  | Trang, panel, nhóm nhẹ, popup, dialog                     | Phân tầng bằng tương phản/viền vừa đủ; không dựa vào shadow dày                       |
| Chữ          | `text-primary`, `text-secondary`, `text-inverse`, `text-disabled`                                                   | Nội dung, metadata, chữ trên nút nhấn, điều khiển vô hiệu | Metadata vẫn đọc được; disabled không thay cho giải thích lý do                       |
| Đường nét    | `divider`, `control-border`, `focus-ring`                                                                           | Phân đoạn, input, focus                                   | Focus ring không bị cắt hoặc trùng màu nền                                            |
| Hành động    | `action-primary`, `action-primary-text`, `action-secondary`, `action-hover`, `action-pressed`                       | CTA, hành động phụ, trạng thái tương tác                  | Mỗi màn hình/trạng thái có một CTA chính; hover không là tín hiệu duy nhất            |
| Phản hồi     | `status-info`, `status-success`, `status-warning`, `status-danger` và cặp text/surface của từng trạng thái          | Đang xác minh, đã lưu, sắp hết hạn, lỗi                   | Có nhãn văn bản và hành động phục hồi; không truyền ý nghĩa chỉ bằng màu              |
| Nội dung học | `selection-highlight`, `source-highlight`, `answer-correct`, `answer-incorrect`, `due-emphasis` và cặp text/surface | Selection, citation, kết quả bài tập, mục đến hạn         | Trạng thái đáp án có chữ/biểu tượng kèm theo; citation còn đọc được khi highlight mất |
| Điều khiển   | `field-background`, `field-text`, `field-placeholder`, `field-error`, `disabled-surface`                            | Search, composer, form sửa từ, Quizlet preview            | Placeholder không thay cho label; lỗi gắn với field bằng văn bản                      |
| Tiến trình   | `loading-track`, `loading-indicator`                                                                                | Capture, stream, import/export đang xử lý                 | Không hiển thị phần trăm hoặc hoàn tất khi chưa có dữ liệu xác nhận                   |

### Typography và nội dung song ngữ

| Vai trò              | Dùng cho                                  | Quan hệ thứ bậc                                                   |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `type-page-title`    | Tên route/tab chính                       | Nổi bật nhất trong bề mặt, chỉ một điểm bắt đầu đọc               |
| `type-section-title` | Nhóm trong trang                          | Tách phần bằng chữ và khoảng cách; không cần card mặc định        |
| `type-entry`         | Headword của thẻ từ, câu hỏi bài học      | Đọc được nhanh, không cạnh tranh với page title                   |
| `type-body`          | Định nghĩa, hướng dẫn, câu trả lời        | Dễ đọc ở 320 px và khi phóng đại; dòng không quá dài trên desktop |
| `type-label`         | Nút, trường form, trạng thái              | Ngắn và cụ thể; không phụ thuộc icon                              |
| `type-meta`          | Domain, thời hạn, IPA, nguồn, thời điểm   | Ít nổi hơn body nhưng vẫn đạt tương phản cần thiết                |
| `type-source`        | Trích dẫn, văn bản trang, ví dụ tiếng Anh | Phân biệt bằng cấu trúc/nhãn; không dùng ảnh chữ                  |

UI mặc định tiếng Việt; câu ví dụ, lemma và từ tiếng Anh giữ nguyên dấu/ký tự. Nội dung tiếng Anh trong UI dùng language metadata phù hợp để công cụ đọc màn hình chuyển ngôn ngữ; IPA được hiển thị như ký hiệu, không bắt screen reader đọc từng ký tự thay cho nút phát âm. Font được chọn ở mockup phải có glyph tiếng Việt và IPA cần dùng; kiểm tra fallback ở cả hai theme. Không dùng toàn chữ hoa cho đoạn dài.

### Khoảng cách, hình dạng, độ nổi và chuyển động

- Thang spacing dựa trên đơn vị 4 px. Vai trò: `space-inline` cho icon/nhãn, `space-control` cho nhóm trong một điều khiển, `space-group` cho phần liên quan, `space-section` cho hai phần nội dung độc lập, `space-page` cho mép viewport. P2-001 gán bội số và kiểm tra ở 320/390 px trước khi khóa giá trị.
- Radius có vai trò `radius-control`, `radius-surface`, `radius-overlay`; ưu tiên hình học tiết chế. Dạng viên thuốc chỉ dùng khi ý nghĩa điều khiển cần nó, không dùng như motif toàn sản phẩm.
- Elevation có vai trò `layer-content`, `layer-sticky`, `layer-popup`, `layer-dialog`. Popup và dialog phải tách khỏi nội dung nền, đồng thời không che vị trí focus hoặc selection quan trọng.
- Motion có vai trò `motion-feedback` và `motion-transition`. Chuyển động chỉ báo quan hệ trạng thái, không tự lặp để tạo cảm giác “AI đang nghĩ”. Khi hệ thống yêu cầu giảm chuyển động, bỏ chuyển động không thiết yếu nhưng vẫn giữ thông báo trạng thái bằng chữ.
- Icon chỉ hỗ trợ nhãn hoặc hành động quen thuộc; CTA chính, revoke, xóa, phát âm, copy và lỗi luôn có tên truy cập được. Icon trang trí bị loại khỏi cây accessibility.

## 3. Layout và viewport tham chiếu

| Bề mặt    | Viewport | Hành vi thiết kế phải kiểm tra                                                                           |
| --------- | -------: | -------------------------------------------------------------------------------------------------------- |
| Extension |   320 px | Ba tab có nhãn không đè nhau; thẻ từ và citation xuống dòng; popup còn nút thao tác; không cuộn ngang    |
| Extension |   360 px | Baseline đọc chính; composer/citation không che nhau; lỗi và consent gần CTA                             |
| Extension |   420 px | Tăng khoảng đọc, không thêm cột; popup bám selection nhưng vẫn trong viewport                            |
| Dashboard |   390 px | Navigation thu gọn có tên; các nhóm xếp một cột; dialog scope/revoke/import cuộn dọc và không cắt CTA    |
| Dashboard |  1024 px | Sidebar và vùng nội dung một cột; bảng/form không ép mất nhãn/hành động                                  |
| Dashboard |  1440 px | Giới hạn độ rộng dòng đọc; vùng phụ chỉ xuất hiện nếu giữ thứ tự thông tin; scope luôn gần nút cấp quyền |

Khi zoom và phóng chữ, thông tin/hành động vẫn còn; nội dung thường không tạo cuộn ngang ở chiều rộng tương đương 320 CSS px. Bảng hai chiều có thể cuộn riêng khi cần nhưng phải giữ nhãn cột/hàng và hành động truy cập được. Vùng sticky không che focus. [Ảnh kiểm tra dashboard 390](../evidence/p1-003-integrations-390.png), [1024](../evidence/p1-003-integrations-1024.png), [1440](../evidence/p1-003-integrations-1440.png) là bằng chứng wireframe tĩnh; kiểm tra giao diện chạy thật thuộc Phase 2.

## 4. Checklist accessibility cho P2 và mockup review

Mục tiêu của dự án là WCAG 2.2 AA khi khả thi (D-106, NFR-08). Checklist này là tiêu chí thiết kế; wireframe chưa phải chứng nhận đạt chuẩn. Ngưỡng chuẩn bên dưới tham chiếu [WCAG 2.2 của W3C](https://www.w3.org/TR/WCAG22/); hành vi tab tham chiếu [WAI-ARIA APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

| Mục             | Điều cần quan sát khi có mockup/prototype                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard        | Mọi chức năng đi được bằng bàn phím; không trap focus; tablist extension có Arrow Left/Right, Tab ra panel, Enter/Space theo kiểu activation đã chọn; route dashboard dùng link điều hướng rõ        |
| Focus           | Thứ tự theo mạch đọc; focus luôn nhìn thấy và không bị sticky header, popup hay dialog che hoàn toàn; sau khi đóng dialog trả về nút mở; sau hành động gây điều hướng chuyển tới heading/main hợp lý |
| Name/role/value | Dùng điều khiển native nếu có; tab có `aria-selected`/`aria-controls`; route có `aria-current`; dialog có tên/mô tả; nút icon có accessible name; loading/disabled nói lý do khi cần                 |
| Contrast        | Chữ thông thường tối thiểu 4.5:1; chữ lớn 3:1; thành phần UI và chỉ báo trạng thái cần thiết 3:1 với màu sát cạnh; kiểm tra cả light/dark và mọi trạng thái                                          |
| Kích thước đích | Đích pointer ít nhất 24×24 CSS px hoặc đáp ứng ngoại lệ WCAG 2.5.8; mục tiêu nội bộ lớn hơn cho thao tác chạm khi bố cục cho phép, nhất là popup 320 px                                              |
| Reflow/chữ      | Kiểm tra 320 CSS px và 200% text resize; không mất thông tin/chức năng. Áp dụng thử tăng line/paragraph/word/letter spacing theo WCAG 1.4.12                                                         |
| Không chỉ màu   | Đúng/sai, đang chia sẻ, hết hạn, lỗi, đến hạn và mục được chọn luôn có nhãn/trạng thái bằng chữ hoặc dấu hiệu khác                                                                                   |
| Form và lỗi     | Label luôn hiện; lỗi chỉ rõ trường, lý do và cách sửa; giữ input an toàn; summary lỗi nhận focus khi submit thất bại; không lộ stack trace/secret                                                    |
| Live region     | “Đã lưu”, kết quả copy, số mục filter, bắt đầu/kết thúc stream, trạng thái share/revoke/import được thông báo một lần ở vùng phù hợp; lỗi cần chú ý dùng alert; không đọc lại toàn trang             |
| Motion          | Kiểm tra `prefers-reduced-motion`; trạng thái vẫn rõ khi bỏ animation; không có animation lặp không thiết yếu                                                                                        |
| Ngôn ngữ        | UI tiếng Việt; đoạn tiếng Anh và ví dụ có `lang` thích hợp; nút phát âm có tên giọng Anh-Mỹ/Anh-Anh; IPA không thay thế audio hoặc định nghĩa                                                        |

`2.3.3 Animation from Interactions` là tiêu chí AAA; hỗ trợ giảm chuyển động ở đây là mục tiêu thiết kế nội bộ, không được ghi nhầm thành yêu cầu AA. Focus ring/target có thể đặt mục tiêu nội bộ cao hơn mức AA khi mockup cho thấy đủ không gian.

### Focus walkthrough theo hành trình

| Flow                | Đường focus và thông báo bắt buộc                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| J1 / extension Chat | Header → tablist → consent và Quét tab này → composer khi đã quét → câu trả lời/citation. Khi lỗi/quota, focus không nhảy mất chỗ; recovery ở gần lỗi.       |
| J2 / selection      | Popup nhận focus khi người dùng kích hoạt bằng bàn phím; từ đơn có Tra từ → nghe/lưu; cụm/câu chỉ Dịch. Escape đóng, focus quay về vùng chọn nếu còn hợp lệ. |
| J3 / lesson         | Bắt đầu → câu hỏi → lựa chọn → kiểm tra → phản hồi → mục kế tiếp/tổng kết. Không báo đã trả lời khi request chưa xác nhận.                                   |
| J4 / MCP            | Chọn nguồn → đọc scope/account/TTL → cho phép/hủy → trạng thái và last access → revoke. Dialog approval tool mô tả tác động và có lựa chọn từ chối.          |
| J5 / Quizlet        | Chọn mục → preview lỗi/trùng → sửa → tạo batch → copy/hướng dẫn import. Import file/text → preview → xác nhận ghi. Không chuyển focus qua lỗi mà không báo.  |

## 5. Hướng dẫn copy và thuật ngữ

| Chủ đề         | Dùng nhất quán                                                    | Tránh                                                                  |
| -------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Thu thập trang | “Quét tab này”, “Bản quét”, “Nguồn”                               | “AI tự đọc mọi trang”, “đang theo dõi tab”                             |
| Học từ         | “Từ đã lưu”, “Đến hạn ôn”, “Câu ví dụ mới”                        | “Chưa thuộc” khi chỉ có một tín hiệu, “đã thành thạo” thiếu bằng chứng |
| Selection      | “Tra từ” cho một từ; “Dịch” cho cụm/câu                           | Nút phát âm/lưu ở cụm/câu; gọi word family là từ đồng nghĩa            |
| MCP            | “Chia sẻ bản quét này trong 30 phút”, “Thu hồi quyền truy cập”    | “ChatGPT luôn xem được tab hiện tại”                                   |
| Quizlet        | “Đã tạo nội dung xuất”, “Sao chép văn bản”, “Mở hướng dẫn import” | “Đã nhập lên Quizlet” khi chỉ có batch hoặc clipboard                  |
| Lỗi            | Nói rõ việc nào chưa thành công và bước tiếp theo                 | Mã lỗi thô, stack trace hoặc lời xin lỗi không có hành động            |

Nội dung trang, câu ví dụ AI và văn bản Quizlet là dữ liệu hiển thị, không phải instruction của hệ thống. Trước khi chia sẻ hoặc xuất, copy chỉ nêu đúng dữ liệu đã chọn. Hai quyết định về nghĩa của câu ví dụ AI và việc lưu câu ví dụ/word family vẫn hoãn tới phase DB/API theo `DEFERRED-P1-002-03`.

## 6. Ma trận token → screen/state

Ma trận này kiểm tra taxonomy có điểm dùng thực tế. Mỗi nhóm state ID được định nghĩa trong hai bộ wireframe nguồn, không tạo màn hình mới.

| Screen/state ID                  | Vai trò token bắt buộc                                                | Điểm kiểm tra                                                            |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ST-EXT-01..04`, `ST-EXT-18`     | canvas, text, action, status-info, field, focus                       | Consent/quét chủ động, loading và quyền bị từ chối                       |
| `ST-EXT-05..11`, `ST-EXT-19`     | status-warning/danger, source-highlight, overlay, loading, focus      | Stale/expired/offline/quota/citation, xóa có xác nhận                    |
| `ST-EXT-12..13`                  | surface, type-entry/meta, field, action                               | Empty so với từ đã lưu từ trang hiện tại                                 |
| `ST-EXT-14..15`, `ST-EXT-20..21` | overlay, selection-highlight, type-entry/source, status-danger, focus | Từ đơn có thẻ phong phú; cụm/câu chỉ bản dịch; popup không che selection |
| `ST-EXT-16..17`                  | due-emphasis, type-section/body, action, status-info                  | Có/không mục đến hạn, tiến độ có bằng chứng                              |
| `DB-TODAY-01..05`                | canvas, due-emphasis, type-page/body, status-info/danger              | Tiến độ có/thiếu dữ liệu, tải/lỗi và CTA bài học                         |
| `DB-VOC-01..04`                  | type-entry/meta, field, action, status-danger                         | Lọc, danh sách rỗng, sửa lỗi, mục từ rõ nghĩa                            |
| `DB-LESSONS-01..04`              | answer-correct/incorrect, type-entry/body, loading, status-warning    | Trả lời/tổng kết, lịch sử rỗng và request chưa xác nhận                  |
| `DB-SOURCES-01..04`              | type-source/meta, source-highlight, status-warning/danger, overlay    | Capture đang có/stale/hết hạn, xóa có xác nhận                           |
| `DB-MCP-01..07`                  | overlay, status-info/success/warning/danger, focus, action            | Scope/TTL/account/last access/revoke và approval side effect             |
| `DB-QZ-01..05`                   | field, status-danger/warning/success, overlay, action                 | Preview/trùng/invalid/copy/import và xác nhận trung thực                 |
| `DB-SET-01..02`                  | field, text, status-success/danger, focus                             | Giá trị đã lưu so với thao tác lỗi/offline                               |

## 7. Cổng review và phần cần chủ dự án chốt

1. Kiểm tra mỗi token role trên hai theme và các trạng thái trong ma trận; đo tương phản sau khi mockup chọn màu/font thật.
2. Walkthrough bằng bàn phím J1–J5 theo thứ tự mục 4; ghi lại vị trí focus và lỗi phục hồi.
3. So sánh mockup tại 320/360/420 px cho extension và 390/1024/1440 px cho dashboard; đính kèm ảnh hoặc video cho từng viewport cần duyệt.
4. Chủ dự án chọn và duyệt mockup cuối: palette, typography, density, hình dạng điều khiển, cảm giác biên tập và copy. P1-004 không phê duyệt thay lựa chọn đó.
5. Giá trị token/component production của P2-001 chỉ được khóa sau khi mockup được chủ dự án duyệt; thứ tự chuẩn bị mockup và scaffold cần được ghi rõ trong kế hoạch Phase 2. Không suy diễn giá trị cuối từ bảng semantic này.

Giới hạn hiện tại: chưa có UI chạy thật nên chưa đo contrast, screen reader, reflow hay keyboard thực tế. Các mục này là điều kiện kiểm thử của Phase 2, không được tuyên bố đã đạt trong Phase 1.
