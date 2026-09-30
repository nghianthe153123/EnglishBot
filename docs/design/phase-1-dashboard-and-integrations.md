# P1-003 — Dashboard và luồng tích hợp

- Trạng thái: BẢN_NHÁP — sẵn sàng owner review cấu trúc và luồng
- Cập nhật: 2026-09-30
- Work package: [P1-003](../work-packages/P1-003-dashboard-integration-flows.md)
- Mức fidelity: IA, wireframe cấu trúc và hành vi; chưa phải high-fidelity visual hoặc code UI
- Cơ sở: D-103..D-107, D-501..D-507; J3–J5; VOC-01..03, LRN-01..04, MCP-01..03, QZ-01..03, NFR-08..09

> Tài liệu này chốt để review mục đích route, hierarchy, trạng thái và hành động. Không khóa màu, typography, token hoặc component; P1-004 xử lý design foundation và accessibility.

## 1. Phạm vi điều hướng và xung đột `/progress`

P1-003 bản đầu liệt kê bảy route, gồm `/progress`. Danh sách đó mâu thuẫn với D-103 và quyết định owner `RESOLVED-P1-001-01`: dashboard beta có sáu mục và tiến độ tổng quan thuộc `/today`, còn lịch sử ôn cùng bằng chứng thuộc `/lessons`. Để không làm sống lại route đã bị loại, wireframe này chỉ dùng sáu route dưới đây; phạm vi P1-003 đã được hiệu chỉnh tương ứng. Không có màn hình, tab hoặc entry point riêng cho `/progress`.

```text
Dashboard EnglishBot
├── /today         Tổng quan hôm nay, từ đến hạn và tiến độ tổng quan
├── /vocabulary    Thư viện từ, tìm/lọc/sửa/xuất
├── /lessons       Bài học, lịch sử ôn và bằng chứng tiến độ
├── /sources       Bản thu thập, nguồn và vòng đời dữ liệu
├── /integrations  Chia sẻ MCP và xuất/import Quizlet
└── /settings      Tài khoản, tùy chọn học và quyền riêng tư
```

Navigation chính là sidebar trên desktop và menu điều hướng có thể mở trên viewport hẹp. Tên trang hiện tại được nêu bằng văn bản/accessibility state, không chỉ bằng màu. Route đổi không tự tạo bài học, chia sẻ capture, xuất dữ liệu hoặc kết nối tài khoản.

## 2. Mục đích, entry point và hành động theo route

| Route           | Mục đích / entry point                   | Nội dung chính                                                                                                        | Hành động chính                                                                    | Empty state                                                                                     |
| --------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/today`        | Trang vào dashboard; liên kết “Hôm nay”  | Việc học hôm nay, số từ đến hạn/mới, tóm tắt hoạt động gần đây và tiến độ tổng quan có căn cứ                         | Bắt đầu bài học nếu có mục; nếu không, xem từ vựng hoặc nguồn                      | Chưa có từ học: giải thích cách lưu từ từ extension; không tạo lesson giả                       |
| `/vocabulary`   | Navigation; CTA từ Today/Lessons         | Danh sách thư viện, nghĩa, trạng thái VOC-01, nguồn/lần gặp khi có; lọc candidate/learning/reviewing/mastered/ignored | Tìm/lọc; mở sửa nghĩa/trạng thái/metadata; chọn tập con để xuất                    | Chưa có từ: hướng dẫn lưu từ, không gợi rằng capture tự động tạo bản ghi                        |
| `/lessons`      | Navigation; CTA bắt đầu từ Today         | Bài học hiện tại/khả dụng, lịch sử ôn và bằng chứng tiến độ                                                           | Bắt đầu hoặc tiếp tục bài; mở lần ôn để xem kết quả                                | Chưa đến hạn: nêu lần ôn tiếp theo nếu biết; không tuyên bố đã thành thạo                       |
| `/sources`      | Navigation; liên kết từ mục từ/capture   | Danh sách capture, domain/tên rút gọn, thời điểm, freshness/retention và liên kết đến từ đã lưu                       | Mở chi tiết; xóa capture sau xác nhận                                              | Chưa có nguồn: giải thích nguồn xuất hiện khi người dùng chủ động capture/lưu                   |
| `/integrations` | Navigation; entry từ share/export action | Khối MCP account + share grants; khối Quizlet export batch/import                                                     | Chia sẻ capture rõ ràng; chuẩn bị export; chọn file/text để import                 | Chưa liên kết/chưa chia sẻ: chỉ dẫn bắt đầu và giới hạn quyền; không hàm ý truy cập thường trực |
| `/settings`     | Navigation; menu tài khoản               | Tùy chọn học, giọng đọc, ngôn ngữ, quyền riêng tư/retention, domain bị từ chối                                        | Lưu một thay đổi có xác nhận/trạng thái rõ; quản lý dữ liệu theo thiết kế đã duyệt | Dùng mặc định đã công bố; giải thích nơi bật/tắt từng tùy chọn                                  |

Lọc theo trạng thái trên Vocabulary là bộ lọc thư viện, không phải nhận định về năng lực. Mọi số liệu Today phải truy nguyên được đến event hoặc bản ghi hiện có; không hiển thị mastery như kết luận nếu bằng chứng chưa đủ (LRN-04).

## 3. Wireframe J3 — bài học hàng ngày và bằng chứng tiến độ

### DB-TODAY-01 — Có mục đến hạn

```text
┌─────────────────────────────────────────────────────────────────────┐
│ EnglishBot     Hôm nay     Từ vựng  Bài học  Nguồn  Tích hợp  Cài đặt│
├─────────────────────────────────────────────────────────────────────┤
│ HÔM NAY                                                             │
│                                                                     │
│ 8 mục đến hạn · 3 từ mới                                            │
│ [Bắt đầu bài học]                                                   │
│                                                                     │
│ Tiến độ gần đây                                                     │
│ 12 lượt ôn trong 7 ngày · xem từ các lần ôn đã ghi nhận             │
│ [Xem lịch sử và bằng chứng → Bài học]                                │
│                                                                     │
│ Tiếp tục học                                                        │
│ 3 mục gần đây                                      [Mở thư viện →]   │
└─────────────────────────────────────────────────────────────────────┘
```

CTA bắt đầu tạo một bài học giới hạn từ mục đến hạn theo LRN-02. Số liệu tiến độ có khoảng thời gian và nguồn đọc dễ hiểu; phần “gần đây” không đồng nghĩa với mastery. CTA lịch sử đi tới `/lessons`, không route riêng.

### DB-LESSONS-01 — Đang làm bài học

```text
┌─────────────────────────────────────────────────────────────────────┐
│ BÀI HỌC                                      3 / 8 mục               │
│                                                                     │
│ durable                                                             │
│ Chọn nghĩa phù hợp trong ngữ cảnh đã học                            │
│ [A ...]  [B ...]  [C ...]                                           │
│                                                                     │
│ [Bỏ qua mục]                                   [Kiểm tra đáp án]     │
└─────────────────────────────────────────────────────────────────────┘
```

Khi trả lời, phản hồi cho biết đúng/sai và cơ sở/ý nghĩa ngắn nếu có. Không tiết lộ đáp án trước khi chọn. Nút thoát cảnh báo mất phần chưa nộp nếu hành vi thực tế có nguy cơ đó; không tự giả định kết quả được lưu.

### DB-LESSONS-02 — Tổng kết

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Bài học đã hoàn tất                                                 │
│ 8 mục đã trả lời · 6 chính xác · 2 cần ôn lại                       │
│                                                                     │
│ Lần ôn này ghi nhận câu trả lời và thời gian phản hồi.               │
│ Đây là bằng chứng của lượt này, không phải tuyên bố mastery.         │
│                                                                     │
│ [Xem các mục cần ôn]                         [Về Hôm nay]           │
└─────────────────────────────────────────────────────────────────────┘
```

Lịch sử trong `/lessons` cho phép mở một lần ôn và xem ngày, tập mục, câu trả lời/kết quả đã ghi nhận. Không vẽ biểu đồ hoặc phần trăm mastery giả nếu chưa có định nghĩa và dữ liệu tương ứng.

## 4. Wireframe J4 — chia sẻ capture với ChatGPT/MCP

### DB-MCP-01 — Chưa kết nối / chưa cấp share

```text
┌─────────────────────────────────────────────────────────────────────┐
│ TÍCH HỢP                                                            │
│ MCP · ChatGPT                                                       │
│                                                                     │
│ Tài khoản: Chưa liên kết                                            │
│ ChatGPT chỉ dùng dữ liệu khi bạn chủ động cấp quyền.                │
│                                                                     │
│ [Liên kết tài khoản]                                                │
│                                                                     │
│ Bản thu thập đang hoạt động                                         │
│ Chưa chọn bản thu thập                                              │
│ [Chọn nguồn để chia sẻ]                                             │
└─────────────────────────────────────────────────────────────────────┘
```

Nút liên kết bắt đầu luồng authorization do provider được chọn ở giai đoạn sau; wireframe không khóa OAuth provider cụ thể. Không hiển thị token/secret. Việc liên kết account không tự chia sẻ capture.

### DB-MCP-02 — Xác nhận share theo scope

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Chia sẻ với MCP                                                     │
│ Nguồn: “The science of learning” · example.com                      │
│ Dữ liệu: nội dung capture này và kết quả tìm kiếm trong capture      │
│ Thời hạn: 30 phút kể từ lúc cấp quyền                               │
│ Account EnglishBot: learner@example…                                │
│                                                                     │
│ Tool đọc được: tìm trong capture được chọn                          │
│ Tool thay đổi dữ liệu: sẽ hỏi bạn phê duyệt riêng                    │
│                                                                     │
│ [Hủy]                                     [Cho phép trong 30 phút]   │
└─────────────────────────────────────────────────────────────────────┘
```

Trước khi xác nhận, scope nêu capture cụ thể và loại thao tác được phép. Không mặc định chia sẻ toàn bộ account, tab hiện tại hoặc các capture khác. Read-only tool chỉ chạy trong scope đã cấp (D-504). Mọi tool tạo/thay đổi dữ liệu cần một phê duyệt rõ ràng riêng, kèm mô tả tác động trước khi thực hiện (D-505).

### DB-MCP-03 — Đang chia sẻ / đã thu hồi

```text
┌─────────────────────────────────────────────────────────────────────┐
│ MCP · ĐANG CHIA SẺ                                                  │
│ Nguồn: “The science of learning” · example.com                      │
│ Được chia sẻ lúc: 10:15 · Hết hạn lúc: 10:45                        │
│ Account: learner@example…                                           │
│ Truy cập MCP gần nhất: 10:22 · tìm trong capture                    │
│                                                                     │
│ Chia sẻ này chỉ áp dụng cho capture nêu trên.                        │
│ [Thu hồi quyền truy cập ngay]                                       │
└─────────────────────────────────────────────────────────────────────┘
```

Last access chỉ hiển thị khi có metadata hợp lệ; nếu chưa có, ghi “Chưa ghi nhận lượt truy cập”. Thu hồi là hành động ngay lập tức, có phản hồi trạng thái và làm share grant mất hiệu lực. Sau revoke hoặc hết hạn, panel xác nhận đã ngừng chia sẻ và cho phép người dùng tạo một grant mới chủ động. Không hiển thị grant như còn hoạt động khi trạng thái chưa xác minh được.

## 5. Wireframe J5 — xuất Quizlet và import do người dùng cung cấp

### DB-QUIZLET-01 — Chọn từ và preview

```text
┌─────────────────────────────────────────────────────────────────────┐
│ TÍCH HỢP                                                            │
│ Quizlet · Xuất văn bản tương thích                                  │
│ Chọn mục từ trong thư viện                                          │
│ [Tìm từ…] [Trạng thái ▾] [Chọn hiển thị]                            │
│                                                                     │
│ ☑ durable          bền vững                                          │
│ ☑ retrieve         gợi nhớ                                           │
│ ☐ desirable        đáng mong muốn                                    │
│                                                                     │
│ 2 mục đã chọn                                  [Xem trước]          │
└─────────────────────────────────────────────────────────────────────┘
```

Preview cho thấy chính xác hai mặt và định dạng phân tách trước khi tạo nội dung. Bản ghi thiếu term/definition được đánh dấu invalid, có đường sửa hoặc bỏ khỏi batch; duplicate được chỉ rõ và cho phép loại/chấp nhận có chủ ý. Không gộp âm thầm bản ghi trùng.

### DB-QUIZLET-02 — Văn bản tạo xong

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Xem trước export · 2 mục                                            │
│ durable<TAB>bền vững                                                │
│ retrieve<TAB>gợi nhớ                                                 │
│ [Sao chép văn bản]          [Mở hướng dẫn import Quizlet]            │
│                                                                     │
│ Đã tạo nội dung và ghi nhận batch. Chưa xác nhận nội dung đã         │
│ được nhập hoặc xuất bản trên Quizlet.                                │
└─────────────────────────────────────────────────────────────────────┘
```

Mở Quizlet chỉ điều hướng người dùng tới luồng import bên ngoài nếu URL/hành vi hỗ trợ; không truyền dữ liệu ngầm. Chỉ sau khi người dùng tự hoàn tất bên Quizlet mới có thể ghi nhận họ đã xử lý xong, và copy phải phân biệt lời xác nhận người dùng với xác nhận từ provider. Beta không có direct sync (D-506/QZ-03).

### DB-QUIZLET-03 — Import file/text do người dùng chủ động cung cấp

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Nhập từ Quizlet                                                     │
│ Chọn file export hoặc dán nội dung bạn cung cấp                     │
│ [Chọn file]     hoặc     [Dán văn bản…]                             │
│                                                                     │
│ Preview parse: 14 mục hợp lệ · 2 lỗi · 3 mục có thể trùng            │
│ [Xem chi tiết lỗi và mục trùng]                                     │
│                                                                     │
│ Chỉ thêm mục đã được bạn xác nhận.                                  │
│ [Hủy]                                   [Xác nhận nhập 14 mục]       │
└─────────────────────────────────────────────────────────────────────┘
```

Import chỉ nhận file/text người dùng chủ động cung cấp (D-507). Parse trước, cho xem invalid/duplicate và preview kết quả; không ghi mục nào cho tới khi xác nhận. Nếu file không hỗ trợ/quá lớn/đọc lỗi, giữ nguyên dữ liệu nhập khi an toàn và cho đổi file hoặc dán text. Không tự đăng nhập hay đọc dữ liệu Quizlet.

## 6. Catalog trạng thái và ID

ID ổn định để dùng sau này làm mock fixture; các ID không hàm ý API/schema đã khóa.

| State ID      | Route/bề mặt    | Trạng thái                            | Hành động và kết quả mong đợi                                          |
| ------------- | --------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| DB-TODAY-01   | `/today`        | Có mục đến hạn                        | Bắt đầu lesson giới hạn → DB-LESSONS-01                                |
| DB-TODAY-02   | `/today`        | Chưa có mục đến hạn                   | Sang Vocabulary/Sources; không lesson giả                              |
| DB-TODAY-03   | `/today`        | Tóm tắt tiến độ có dữ liệu            | Xem lịch sử → `/lessons`; ghi rõ khoảng thời gian                      |
| DB-TODAY-04   | `/today`        | Dữ liệu tiến độ chưa đủ               | Nêu chưa có đủ lượt ôn; không 0% mastery                               |
| DB-TODAY-05   | `/today`        | Đang tải / offline / lỗi              | Retry đúng phần truy vấn; giữ route và thông báo không lộ chi tiết thô |
| DB-VOC-01     | `/vocabulary`   | Thư viện có từ                        | Tìm/lọc/chọn; sửa metadata qua form có trạng thái                      |
| DB-VOC-02     | `/vocabulary`   | Thư viện rỗng                         | Hướng dẫn lưu từ; CTA tới Sources/extension tùy điểm vào               |
| DB-VOC-03     | `/vocabulary`   | Không có kết quả filter               | Xóa filter hoặc đổi truy vấn; không nhầm với thư viện rỗng             |
| DB-VOC-04     | `/vocabulary`   | Lưu sửa lỗi / xung đột                | Giữ bản nháp, chỉ rõ field lỗi, thử lưu lại                            |
| DB-LESSONS-01 | `/lessons`      | Lesson đang làm                       | Trả lời/bỏ qua; tiến độ chỉ phản ánh mục hiện tại                      |
| DB-LESSONS-02 | `/lessons`      | Tổng kết xong                         | Mở mục cần ôn hoặc quay Today; nêu bằng chứng của lượt                 |
| DB-LESSONS-03 | `/lessons`      | Lịch sử rỗng                          | Empty state nêu chưa có lượt ôn                                        |
| DB-LESSONS-04 | `/lessons`      | Gửi đáp án timeout/offline            | Báo chưa xác nhận, retry không nhân đôi đáp án                         |
| DB-SOURCES-01 | `/sources`      | Có capture                            | Mở chi tiết/từ đã lưu từ nguồn này; xóa sau xác nhận                   |
| DB-SOURCES-02 | `/sources`      | Không có capture                      | Hướng dẫn capture chủ động                                             |
| DB-SOURCES-03 | `/sources`      | Capture stale/expired                 | Báo không thể dùng capture; về trang nguồn nếu cần capture lại         |
| DB-SOURCES-04 | `/sources`      | Xóa đang xử lý/lỗi                    | Hiển thị trạng thái; lỗi cho retry hoặc hỗ trợ, không giả đã xóa       |
| DB-MCP-01     | `/integrations` | MCP chưa kết nối/chưa share           | Link account hoặc chọn capture; link không tự share                    |
| DB-MCP-02     | `/integrations` | Review scope trước share              | Hủy hoặc cấp share 30 phút theo capture cụ thể                         |
| DB-MCP-03     | `/integrations` | Share hoạt động                       | Xem account/scope/expiry/last access, revoke ngay                      |
| DB-MCP-04     | `/integrations` | Share hết hạn/đã revoke               | Báo không còn quyền; có thể bắt đầu grant mới                          |
| DB-MCP-05     | `/integrations` | Kết nối lỗi/authorization bị từ chối  | Giải thích trạng thái, retry liên kết; không hiện secret               |
| DB-MCP-06     | `/integrations` | Share/revoke chưa xác nhận bởi server | Trạng thái “đang xác minh”; không tuyên bố đã share/revoke             |
| DB-MCP-07     | MCP approval    | Tool muốn thay đổi dữ liệu            | Hiện tác động và xin phê duyệt rõ; từ chối/hủy không chạy tool         |
| DB-QZ-01      | `/integrations` | Chọn subset và preview                | Chỉnh lựa chọn; tiếp tục khi valid hoặc xử lý invalid/duplicate        |
| DB-QZ-02      | `/integrations` | Export batch đã tạo                   | Copy hoặc tự mở hướng dẫn import; nói rõ chưa xác nhận nhập            |
| DB-QZ-03      | `/integrations` | Import file/text                      | Parse preview; xác nhận trước khi ghi                                  |
| DB-QZ-04      | `/integrations` | Import/export invalid/duplicate       | Sửa/bỏ dòng, copy lỗi; không thêm âm thầm                              |
| DB-QZ-05      | `/integrations` | Clipboard/file/parse lỗi              | Giữ dữ liệu khi an toàn, cho retry hoặc thao tác thủ công              |
| DB-SET-01     | `/settings`     | Đọc/cập nhật tùy chọn                 | Nêu trạng thái lưu; giữ giá trị nếu update lỗi                         |
| DB-SET-02     | `/settings`     | Đọc/cập nhật lỗi/offline              | Nêu phục hồi; không giả đã áp dụng tùy chọn                            |

## 7. Ma trận route → state → action

| Route                   | State ID chính    | Hành động                                                              | Chuyển trạng thái/route                              |
| ----------------------- | ----------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| `/today`                | DB-TODAY-01..05   | Bắt đầu lesson; xem lịch sử; mở từ vựng/nguồn                          | DB-LESSONS-01; `/lessons`; `/vocabulary`; `/sources` |
| `/vocabulary`           | DB-VOC-01..04     | Tìm/lọc; sửa; chọn mục export                                          | DB-VOC-01/03/04; DB-QZ-01 trên `/integrations`       |
| `/lessons`              | DB-LESSONS-01..04 | Trả lời; bỏ qua; retry; xem mục cần ôn                                 | DB-LESSONS-01 → 02; lỗi → 04; `/vocabulary`          |
| `/sources`              | DB-SOURCES-01..04 | Mở chi tiết; xóa có xác nhận; điều hướng Integrations để share         | DB-SOURCES-01/04; DB-MCP-02                          |
| `/integrations` MCP     | DB-MCP-01..07     | Link; chọn scope; share; đọc trạng thái; revoke; phê duyệt side effect | DB-MCP-01 → 02 → 03 → 04; side effect → 07           |
| `/integrations` Quizlet | DB-QZ-01..05      | Chọn; preview; sửa lỗi; copy; import chủ động                          | DB-QZ-01 → 02; DB-QZ-03 → xác nhận/04/05             |
| `/settings`             | DB-SET-01..02     | Đổi tùy chọn/quyền riêng tư                                            | DB-SET-01 hoặc lỗi DB-SET-02                         |

## 8. Failure và recovery walkthrough J3–J5

| Journey | Lỗi/nhánh                                          | Thông báo và phục hồi                                                                                                 |
| ------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| J3      | Không có mục đến hạn                               | `/today` nêu rõ không có bài học cần làm; link thư viện và ngày ôn kế tiếp nếu biết                                   |
| J3      | API lesson timeout/offline                         | Bảo toàn câu trả lời chưa gửi nếu an toàn; retry cùng action/idempotency; nếu chưa biết kết quả thì nói đang xác minh |
| J3      | Không đủ bằng chứng tiến độ                        | Ẩn kết luận mastery và metric gây hiểu nhầm; vẫn cho xem các event đã ghi nhận                                        |
| J4      | Account chưa liên kết / user từ chối               | Không tạo grant; giải thích có thể liên kết lại; không giữ credential do browser client                               |
| J4      | Share hết hạn                                      | MCP không được dùng grant cũ; giao diện báo hết hạn và cho tạo grant mới chủ động                                     |
| J4      | Revoke timeout                                     | Hiện đang xác minh; không báo đã thu hồi nếu chưa có xác nhận; cho tải lại trạng thái/retry revoke                    |
| J4      | MCP gọi scope ngoài grant hoặc capture hết hạn/xóa | Từ chối truy cập; không mở rộng scope ngầm; giải thích cần chọn capture còn hợp lệ                                    |
| J4      | Tool yêu cầu side effect                           | Dừng trước thực thi, mô tả thay đổi và hỏi phê duyệt rõ; hủy thì không gọi tool                                       |
| J5      | Term/definition trống hoặc format sai              | Ghim lỗi theo mục; sửa hoặc bỏ mục khỏi preview                                                                       |
| J5      | Duplicate                                          | Hiện các mục trùng và lựa chọn cụ thể; không ghi thêm đến khi người dùng xác nhận                                     |
| J5      | Clipboard bị chặn                                  | Giữ text chọn được để copy thủ công; thông báo không sao chép tự động được                                            |
| J5      | Parse file import lỗi                              | Không ghi mục một phần; hiển thị lỗi dòng và cho chọn file khác/dán text                                              |
| J5      | Người dùng rời Quizlet hoặc không xác nhận         | Batch vẫn là “đã tạo”; không tuyên bố đã nhập/publish                                                                 |

Retry chỉ áp dụng action chưa được xác nhận hoàn tất; không tạo lesson, export batch hay import trùng do thao tác lặp nếu có thể xác định request trước.

## 9. Responsive review ở 390 / 1024 / 1440 px

| Viewport | Bố cục                                                                                                          | Kiểm tra bắt buộc ở wireframe                                                                                                                         |
| -------: | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
|   390 px | Một cột; sidebar thành menu điều hướng mở/đóng; CTA nằm trong luồng nội dung                                    | Bảng từ chuyển thành dòng có term/definition rõ; MCP scope và expiry không bị cắt; dialog dùng gần đủ chiều rộng, nội dung cuộn dọc; không cuộn ngang |
|  1024 px | Sidebar gọn cố định + main content một cột; bảng rộng tùy nội dung                                              | Giữ thứ tự heading, cột không ép mất hành động; approval/revoke còn thấy nhãn và trạng thái; không biến content thành grid trang trí                  |
|  1440 px | Sidebar và main content có giới hạn độ rộng đọc; form/preview có thể chia vùng chính-phụ nếu thứ bậc giữ nguyên | Tránh dòng văn bản quá dài; thông tin quyền/scope luôn gần nút xác nhận; không thêm metric hoặc feature chỉ để lấp khoảng trống                       |

Đã kiểm tra trực quan wireframe tĩnh của route `/integrations` tại cả ba viewport ngày 2026-09-30. Đây là route có scope MCP, CTA cấp quyền và Quizlet cùng xuất hiện, nên được dùng làm trường hợp đại diện để kiểm tra reflow. Các ảnh chỉ chứng minh bố cục wireframe; kiểm tra UI chạy thật thuộc Phase 2.

| Viewport | Bằng chứng wireframe                                                                                            |
| -------: | --------------------------------------------------------------------------------------------------------------- |
|   390 px | [Ảnh 390 px](../evidence/p1-003-integrations-390.png) · [Nguồn SVG](../evidence/p1-003-integrations-390.svg)    |
|  1024 px | [Ảnh 1024 px](../evidence/p1-003-integrations-1024.png) · [Nguồn SVG](../evidence/p1-003-integrations-1024.svg) |
|  1440 px | [Ảnh 1440 px](../evidence/p1-003-integrations-1440.png) · [Nguồn SVG](../evidence/p1-003-integrations-1440.svg) |

## 10. Keyboard, focus và accessibility review

- Navigation là landmark có tên; mục route hiện tại có `aria-current="page"`; skip link đưa focus tới nội dung chính.
- Tab order theo thứ tự đọc: skip link → navigation → heading/main → điều khiển nội dung; không trap focus ngoài dialog.
- Dialog xác nhận scope, revoke, xóa hoặc import giữ focus trong dialog, có tiêu đề/description truy cập được, Escape đóng nếu chưa thực hiện, đóng xong focus về nút mở.
- Các bảng/row action có tên accessible gắn đúng term; sort/filter có nhãn và thông báo kết quả mới.
- Toast/status dùng vùng live phù hợp; lỗi gắn với field, không chỉ màu hoặc icon; focus chuyển tới summary lỗi khi submit thất bại.
- Mọi nút/icon-only có accessible name; trạng thái share/revoke/expiry và import không chỉ biểu diễn bằng màu.
- Khi tải lại, lỗi hoặc thay route, giữ focus tại vùng hợp lý; không đưa focus lên đầu trang một cách bất ngờ.
- Hướng review nhắm WCAG 2.2 AA khi khả thi theo D-106/NFR-08; wireframe này chưa phải đánh giá conformance.

## 11. Privacy và security review

- Dashboard không hiển thị URL query hoặc capture text trong navigation, telemetry hoặc title nếu không cần thiết; tên/domain nguồn được rút gọn.
- Share MCP có opt-in theo từng capture; nêu dữ liệu, account, TTL và trạng thái trước/sau; mặc định 30 phút, có revoke ngay (D-503).
- Đăng nhập/link account tách riêng khỏi cấp share; token chỉ nằm ở server-side secure storage và không render/log vào UI.
- Read-only tools được giới hạn bởi allowlist và grant. Tool side effect yêu cầu approval tường minh từng lần; audit metadata an toàn, tránh capture text thô.
- Khi capture hết hạn hoặc bị xóa, không dùng share reference cũ; UI phản ánh trạng thái xác minh và không hứa revoke thành công trước khi server xác nhận.
- Export chỉ chứa các mục người dùng chọn; preview trước khi copy; không tự gửi ra Quizlet. Import chỉ xử lý file/text người dùng cung cấp và cần xác nhận trước ghi.
- Parse text/file là dữ liệu không tin cậy; escape khi hiển thị; giới hạn/validate định dạng theo hợp đồng sau này; lỗi không lộ stack trace/secret (NFR-09).
- Copy xác nhận trạng thái đúng sự thật: “đã tạo batch” khác “đã nhập/publish”; không dò hoặc đọc session Quizlet.

## 12. Walkthrough và điểm chờ owner review

| Journey | Walkthrough thành công                                                                                              | Failure/unsupported đã mô tả                                           | Trạng thái tài liệu                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| J3      | Today → bài học giới hạn → trả lời → tổng kết → xem bằng chứng ở Lessons                                            | Rỗng, offline/timeout, dữ liệu tiến độ thiếu                           | Sẵn sàng review cấu trúc/copy                            |
| J4      | Chọn capture → review scope → cấp 30 phút → xem last access → revoke                                                | Account từ chối, expired, revoke chưa xác nhận, scope sai, side effect | Sẵn sàng review; provider OAuth cụ thể vẫn ngoài phạm vi |
| J5      | Chọn từ → preview/duplicate validation → copy → người dùng tự import; hoặc upload/paste → preview → xác nhận import | Format invalid, clipboard/file/parse lỗi, không xác nhận từ Quizlet    | Sẵn sàng review; direct sync không thuộc beta            |

Owner review còn cần chốt: nhãn “Hôm nay/Từ vựng/Bài học/Nguồn/Tích hợp/Cài đặt”; mức chi tiết tiến độ ở Today; danh sách metadata hiển thị mặc định trong Vocabulary/Sources; cách diễn đạt scope MCP; định dạng và copy xác nhận import/export. Không có quyết định mới về provider, API, schema, hay direct sync trong tài liệu này.

High-fidelity mockup thuộc bước người dùng muốn tự chốt; P1-003 chỉ bàn giao cấu trúc và tương tác cho review.
