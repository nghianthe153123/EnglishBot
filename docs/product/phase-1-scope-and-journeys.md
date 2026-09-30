# P1-001 — Phạm vi sản phẩm và hành trình

- Trạng thái: HOÀN_TẤT — owner approval và CI/cổng A đạt
- Ngày cập nhật: 2026-09-29
- Phạm vi tài liệu: xác thực persona, beta/MVP, hành trình J1–J5 và scenario đầu vào Phase 2
- Nguồn chuẩn: [PRD](../01-product-requirements.md), [UX/UI](../02-ux-ui-system.md), [decision register](../11-decisions-to-lock.md)

> Tài liệu này cụ thể hóa các quyết định đã được chấp nhận; không thay thế hoặc tự sửa quyết định đó. Mọi phần chưa có bằng chứng người dùng ngoài chủ dự án đều được ghi là giả định để owner review. Điểm mâu thuẫn ảnh hưởng phạm vi được ghi trong mục 9 và chưa được giải quyết thay chủ dự án.

## 1. Tóm tắt sản phẩm

EnglishBot hỗ trợ người học tiếng Anh khi họ đọc nội dung trên web: hiểu một trang đã chủ động chọn để quét, hỏi và nhận câu trả lời có dẫn nguồn; tra cứu/phát âm/lưu phần văn bản được chọn; rồi ôn từ trong các bài học ngắn. Extension là giao diện sử dụng thường ngày chính. Dashboard hỗ trợ quản lý và xem lại. MCP là bề mặt bổ sung do người dùng chủ động liên kết/chia sẻ, không phải cách truy cập tab ngầm.

### Thứ tự giá trị cần bảo vệ

1. Người dùng kiểm soát rõ dữ liệu nào được lấy khỏi tab và khi nào.
2. Câu trả lời về trang phải truy nguyên được về nội dung nguồn; nếu nguồn không hỗ trợ thì nói rõ.
3. Tra từ trong ngữ cảnh phải nhanh, có dịch và phát âm, và chỉ lưu khi người dùng yêu cầu.
4. Từ đã lưu được đưa vào luồng ôn tập có giới hạn; tiến độ không phóng đại mức độ ghi nhớ.
5. Chia sẻ MCP và chuyển dữ liệu Quizlet là các luồng có xác nhận; không giả định đồng bộ nền.

## 2. Persona chính — baseline cần owner review

**Người học tiếng Anh tự định hướng khi đọc web**

- **Bối cảnh:** đang đọc bài viết/tài liệu tiếng Anh trong Chrome; muốn được giải thích mà không phải rời trang. Có thể dùng Edge sau khi baseline Chrome được xác thực.
- **Mục tiêu:** hiểu nội dung hiện tại, xử lý từ/cụm từ khó trong đúng ngữ cảnh, và nhớ lại từ đó qua các lần ôn.
- **Hành vi cần hỗ trợ:** chủ động quét tab; hỏi câu hỏi gắn với trang; chọn từ để tra; quyết định có lưu từ không; quay lại học từ đến hạn.
- **Nhu cầu tin cậy:** nhìn thấy dữ liệu chia sẻ và thời hạn lưu; biết câu trả lời dựa vào đoạn nào; có cách phục hồi khi trang không hỗ trợ, quyền bị từ chối hoặc mạng lỗi.
- **Giới hạn sản phẩm:** không muốn bot tự đọc mọi tab, giữ cookie/session, hoặc biến nội dung web thành chỉ dẫn cho AI.
- **Thiết lập học tập:** tự chọn CEFR và giọng Anh-Mỹ/Anh-Anh; bài đánh giá trình độ tự động chưa thuộc beta (D-107, D-108).

**Cơ sở và giới hạn bằng chứng:** persona này là tổng hợp hành vi trong PRD và yêu cầu của chủ dự án, không phải kết quả nghiên cứu định tính/định lượng với nhóm người dùng độc lập. Không gán tuổi, nghề nghiệp, trình độ đầu vào hay quy mô thị trường khi chưa có dữ liệu. AC1 chỉ có thể được chấp nhận sau owner review; nghiên cứu người dùng ngoài phạm vi P1-001 trừ khi chủ dự án yêu cầu.

## 3. Phạm vi MVP/beta

### Trong hướng MVP đã duyệt (D-101)

- Quét một tab đang hoạt động sau thao tác rõ ràng của người dùng; trích xuất nội dung trang được hỗ trợ.
- Hỏi đáp về bản quét, streaming câu trả lời và citation có thể kiểm chứng; từ chối/diễn đạt giới hạn khi nguồn không hỗ trợ.
- Dịch và phát âm văn bản được chọn; cho phép chọn giọng; lưu từ cùng ngữ cảnh theo hành động rõ ràng.
- Quản lý từ vựng và bài học giới hạn dựa trên các từ đã lưu.
- Xem trước và xuất văn bản tương thích Quizlet; không tuyên bố đã import/publish thành công nếu chưa có xác nhận.
- Chia sẻ dữ liệu với ChatGPT qua MCP khi người dùng chủ động; chỉ trả nội dung được cấp quyền.

### Vai trò bề mặt

| Bề mặt               | Vai trò trong sản phẩm                                            | Giới hạn phạm vi                                                                   |
| -------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Extension side panel | Giao diện sử dụng hằng ngày: Chat, Từ vựng, Bài học (D-102)       | Chrome trước, Edge tương thích (D-109); không tự quét tab nền                      |
| Selection popup      | Hành động tức thời cho lựa chọn: dịch, phát âm, giải thích, lưu   | Hiện cục bộ trước; chỉ gọi mạng sau khi người dùng chọn hành động (D-110)          |
| Dashboard            | Quản lý từ/bài học/nguồn/tích hợp/cài đặt theo D-103              | Route tiến độ riêng đang có bất nhất; chờ owner chốt ở mục 9                       |
| MCP/ChatGPT          | Bề mặt bổ sung: dùng dữ liệu EnglishBot được chia sẻ có kiểm soát | Không truy cập tab vô hình/vĩnh viễn; không thay extension làm giao diện chính     |
| Quizlet              | Nhận/xuất bộ từ qua luồng do người dùng xác nhận                  | Import/export văn bản hoặc file theo phase dự kiến; chưa có direct sync trong beta |

### Ngoài phạm vi beta / hoãn

- PDF, nội dung phụ thuộc OCR/hình ảnh phức tạp (CAP-04, Phase 7+).
- Đồng bộ trực tiếp Quizlet (QZ-03, có điều kiện; cần xác minh khả năng/API và quyết định riêng).
- Tự đánh giá CEFR/onboarding test (D-108; người dùng tự chọn trình độ).
- Đọc mọi tab tự động, lưu cookie/session, hoặc chia sẻ dữ liệu ChatGPT mà không có thao tác người dùng (CAP-01, PRIV-03, D-110 và UX baseline).
- Khẳng định mastery không có bằng chứng; tiến độ chỉ phản ánh dữ liệu ôn tập quan sát được (LRN-04).
- Direct Quizlet integration không nằm trên critical path; nhập file người dùng cung cấp và tạo MCP lesson có kế hoạch riêng ở Phase 6 (QZ-02, MCP-03).

**Lưu ý phân biệt:** “MVP” mô tả năng lực sản phẩm mục tiêu, không có nghĩa tất cả được triển khai trong Phase 1 hoặc bản mô phỏng Phase 2. Lộ trình PRD hiện đặt các module lần lượt ở Phase 4–7; P1-001 không thay đổi lịch đó.

## 4. Hành trình người dùng

### J1 — Hiểu tab đang hoạt động

- **Điểm vào:** người dùng đang đọc trang tiếng Anh và mở extension side panel.
- **Điều kiện trước:** extension được cài; tab cho phép đọc nội dung; người dùng xem được thông báo/phạm vi capture. Consent/action rõ ràng cần trước khi gửi nội dung ra khỏi trình duyệt.
- **Luồng thành công:** chọn “Quét tab này” → thấy trạng thái đang quét → xem tiêu đề/trạng thái bản quét → đặt câu hỏi → nhận câu trả lời stream kèm citation → chọn citation để cuộn/làm nổi đoạn nguồn nếu anchor còn hợp lệ.
- **Lỗi có thể phục hồi:** quyền chưa cấp, ngoại tuyến, timeout, quota hoặc trang đổi/hết hạn → thông báo nguyên nhân ở mức hữu ích và hành động tiếp theo (cấp quyền/thử lại/quét lại/mở thiết lập); không gửi câu trả lời chưa có căn cứ như thể chắc chắn.
- **Không hỗ trợ:** trang bị hạn chế, rỗng, không trích xuất được hoặc câu hỏi không được bản quét hỗ trợ → giải thích giới hạn, giữ nguyên dữ liệu hiện có, cho phép thử trang khác/câu hỏi hẹp hơn.
- **Điểm kết thúc:** người dùng có câu trả lời truy nguồn được hoặc biết vì sao chưa thể trả lời; bản capture tuân retention đã duyệt (D-201, D-202, D-204).
- **Yêu cầu liên quan:** CAP-01/02/03, CHAT-01/02/03/04, PRIV-01/02/03.

### J2 — Học văn bản được chọn

- **Điểm vào:** người dùng chọn từ/cụm/câu trên trang.
- **Điều kiện trước:** content script được phép trên trang; lựa chọn còn hợp lệ; nội dung lựa chọn nằm trong giới hạn hỗ trợ.
- **Luồng thành công:** popup hiện ngay → người dùng chọn dịch/phát âm/giải thích/lưu → kết quả dùng câu xung quanh khi có → chọn lưu ghi nhận từ chuẩn hóa, ngữ cảnh nguồn và lần gặp → phản hồi xác nhận lưu.
- **Lỗi có thể phục hồi:** không lấy được lựa chọn, mạng/provider lỗi, không có audio → popup không che khuất nội dung; có thể thử lại, sao chép văn bản hoặc đổi giọng khi khả dụng; không tạo mục từ trùng ngoài quy tắc dedupe đã duyệt.
- **Không hỗ trợ:** selection quá dài/không phải văn bản hoặc trang chặn script → nêu giới hạn, không giả vờ đã xử lý/lưu.
- **Điểm kết thúc:** người dùng đã tra cứu mà không lưu, hoặc thấy từ được lưu trong vocabulary; ngữ cảnh từ lưu có thể tồn tại lâu hơn capture theo D-205.
- **Yêu cầu liên quan:** SEL-01..04, VOC-01/02/03, PRIV-03.

### J3 — Hoàn thành bài học hằng ngày

- **Điểm vào:** người dùng mở tab Bài học của extension hoặc khu vực học tập dashboard.
- **Điều kiện trước:** có vocabulary/terms đến hạn; nếu thư viện rỗng, hệ thống phải có empty state và gợi ý lưu từ, không tạo bài học giả.
- **Luồng thành công:** xem số từ mới/đến hạn → bắt đầu bài học số lượng giới hạn → trả lời → thấy tổng kết, từ khó và tiến độ có căn cứ → learning engine cập nhật lịch ôn theo kết quả.
- **Lỗi có thể phục hồi:** không tải được lesson hoặc phiên bị gián đoạn → bảo toàn tiến độ đã ghi nhận an toàn; cho tiếp tục/tải lại theo contract sau này; không tính câu chưa trả lời là đã biết.
- **Không hỗ trợ:** chưa có từ hoặc không có mục hợp lệ đến hạn → giải thích trạng thái và lối đi tới lưu từ/đợi kỳ ôn; không suy diễn năng lực.
- **Điểm kết thúc:** phiên bài học được ghi nhận; trạng thái tiếp theo và ngày ôn được giải thích vừa đủ, không gọi là “mastered” khi thiếu bằng chứng.
- **Yêu cầu liên quan:** VOC-01/02, LRN-01/02/03/04.

### J4 — Dùng dữ liệu được chia sẻ trong ChatGPT qua MCP

- **Điểm vào:** người dùng chủ động khởi tạo liên kết/chia sẻ từ EnglishBot hoặc cấu hình MCP client.
- **Điều kiện trước:** tài khoản EnglishBot xác thực; client liên kết; người dùng thấy rõ phạm vi capture được chia sẻ và thời hạn; quyền có thể thu hồi.
- **Luồng thành công:** người dùng chọn capture để chia sẻ → EnglishBot cấp quyền/tham chiếu ngắn hạn → ChatGPT gọi tool được phép để tìm/đọc dữ liệu → phản hồi chỉ chứa kết quả trong phạm vi cấp quyền → lần truy cập nhạy cảm được audit.
- **Lỗi có thể phục hồi:** chưa liên kết, token hết hạn, capture hết retention, client lỗi → nêu bước liên kết lại/chia sẻ lại; không mở rộng quyền ngầm.
- **Không hỗ trợ:** yêu cầu tìm dữ liệu chưa chia sẻ hoặc hành động ngoài phạm vi → từ chối theo scope; yêu cầu nhạy cảm cần xác nhận riêng nếu chính sách đòi hỏi.
- **Điểm kết thúc:** dữ liệu đã được dùng trong giới hạn cấp quyền hoặc người dùng thu hồi; không cấp truy cập “tab hiện tại” vô hình/vĩnh viễn.
- **Yêu cầu liên quan:** MCP-01/02/03, PRIV-01/03.
- **Phân kỳ:** luồng MCP là Phase 6; MCP-03 (liệt kê từ đến hạn/chưa thuộc và tạo lesson) không phải điều kiện MVP ban đầu trừ khi có quyết định phạm vi cập nhật.

### J5 — Chuyển bộ từ với Quizlet

- **Điểm vào:** người dùng chọn các mục vocabulary để xuất hoặc mở khu tích hợp.
- **Điều kiện trước:** các mục có term/definition đủ điều kiện; người dùng có thể chỉnh/xác nhận trước khi tạo export.
- **Luồng thành công (beta baseline):** chọn subset → xem trước term/definition → xử lý mục thiếu/trùng → tạo văn bản tương thích Quizlet → sao chép/mở import Quizlet → EnglishBot ghi nhận batch export, không khẳng định Quizlet đã import.
- **Lỗi có thể phục hồi:** định nghĩa rỗng, delimiter/encoding không hợp lệ, clipboard bị chặn → chỉ rõ mục cần sửa và cho tải/sao chép lại sau preview.
- **Không hỗ trợ:** yêu cầu sync account Quizlet tự động hoặc API không khả dụng → giải thích hiện chỉ có export/import theo thao tác người dùng; không giả lập trạng thái đồng bộ.
- **Điểm kết thúc:** nội dung export được tạo hoặc bị hủy trước khi gửi; import từ file người dùng cung cấp thuộc QZ-02/Phase 6, direct sync thuộc QZ-03/Phase 7+ có điều kiện.
- **Yêu cầu liên quan:** QZ-01/02/03, VOC-03.

## 5. Ma trận yêu cầu và phân kỳ

| Nhóm         | Trạng thái phạm vi theo baseline | Hành trình | Phase PRD | Ghi chú                                                              |
| ------------ | -------------------------------- | ---------- | --------- | -------------------------------------------------------------------- |
| CAP-01/02    | Giữ — Bắt buộc                   | J1         | 4/5A      | Capture chủ động; extraction không đồng nghĩa mọi website đều hỗ trợ |
| CAP-03       | Giữ — Nên có                     | J1         | 5A        | Thay đổi/hết mới; không chặn v1 nếu cần cắt scope theo cổng          |
| CAP-04       | Hoãn                             | J1         | 7+        | PDF/hình/OCR                                                         |
| CHAT-01..04  | Giữ — Bắt buộc                   | J1         | 4/5A      | Gồm streaming, citation và câu trả lời không được nguồn hỗ trợ       |
| SEL-01..04   | Giữ — Bắt buộc                   | J2         | 5B        | Dịch/phát âm/lưu với context                                         |
| VOC-01/02    | Giữ — Bắt buộc                   | J2/J3      | 5B/5C     | Trạng thái học tập và dedupe                                         |
| VOC-03       | Giữ — Nên có                     | J2/J5      | 5C        | Sửa tay nghĩa/trạng thái/metadata                                    |
| LRN-01/02/04 | Giữ — Bắt buộc                   | J3         | 5C        | Lịch xác định, lesson giới hạn, tiến độ có căn cứ                    |
| LRN-03       | Giữ — Nên có                     | J3         | 5C        | Nhiều dạng bài tập; có thể thu hẹp theo review learning              |
| MCP-01/02    | Giữ — Bắt buộc cho module MCP    | J4         | 6         | Không phải blocker để dựng core extension trước Phase 6              |
| MCP-03       | Giữ — Nên có, phân kỳ riêng      | J4         | 6         | Scope cần thiết kế ở P1; chưa nằm trong beta core theo D-101         |
| QZ-01        | Giữ — Bắt buộc                   | J5         | 5B/6      | Export văn bản; không khẳng định import thành công                   |
| QZ-02        | Giữ — Nên có, phân kỳ riêng      | J5         | 6         | Import file do người dùng cung cấp                                   |
| QZ-03        | Có điều kiện/hoãn                | J5         | 7+        | Chỉ xem xét sau xác minh khả năng/API và quyết định mới              |
| PRIV-01..03  | Giữ — Bắt buộc                   | J1/J2/J4   | Tất cả    | Retention, domain denylist, không lưu cookie/session                 |

Không có requirement nào bị loại khỏi đường cơ sở PRD ở P1-001. “Hoãn” nghĩa là giữ trong backlog nhưng không triển khai ở beta/module hiện tại. Thay đổi trạng thái PRD chỉ thực hiện sau owner duyệt và cập nhật decision/traceability.

## 6. Invariant trải nghiệm và dữ liệu

- Capture: chỉ sau thao tác rõ ràng; retention mặc định 24 giờ, lựa chọn không lưu/7 ngày theo D-201; không lưu HTML thô mặc định (D-202).
- Hội thoại: retention theo capture trừ khi có nhu cầu đã chứng minh (D-204).
- Vocabulary: ngữ cảnh chỉ được giữ dài hơn capture khi người dùng chủ động lưu từ (D-205).
- Citation: dẫn về nguồn/anchor; nếu không còn định vị được thì vẫn nhận diện nguồn và nói rõ giới hạn (D-111).
- Không có căn cứ: từ chối hoặc chỉ ra không tìm thấy trong nội dung đã quét; không gọi web search trừ khi người dùng yêu cầu (D-112).
- Quyền: nội dung trang là dữ liệu không đáng tin cậy; không biến thành system/tool instruction; không lưu cookie/session (PRIV-03).
- Locale học tập: UI tiếng Việt mặc định, nội dung học song ngữ (D-105); người học tự chọn CEFR/giọng (D-107/108).
- Browser: Chrome-first, Edge-compatible (D-109); chưa nêu phiên bản tối thiểu trong P1-001.

## 7. Kịch bản mock cần đưa vào Phase 2

| ID     | Hành trình | Trạng thái/kịch bản                                | Kỳ vọng quan sát được                                                    |
| ------ | ---------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| SCN-01 | J1         | Bài viết dài, capture thành công, hỏi một chi tiết | Câu trả lời có citation; chọn citation đưa người dùng về đoạn nguồn      |
| SCN-02 | J1         | Câu hỏi không có căn cứ trong capture              | Nói rõ không tìm thấy; không bịa và không tự web-search                  |
| SCN-03 | J1         | Quyền bị từ chối/trang không hỗ trợ                | Capture không gửi; có hướng dẫn phục hồi phù hợp                         |
| SCN-04 | J1         | Trang đổi sau capture/nguồn hết hạn                | Trạng thái stale/expired rõ; cho quét lại nếu có thể                     |
| SCN-05 | J2         | Từ đơn đa nghĩa được chọn trong câu                | Thẻ có nghĩa theo ngữ cảnh, POS, ví dụ AI mới, word family, nghe/lưu     |
| SCN-06 | J2         | Popup sát mép viewport/selection nhiều dòng        | Popup không tràn vùng hiển thị; thao tác không làm mất selection bất ngờ |
| SCN-07 | J2         | Lưu từ đã gặp trước đó                             | Hợp nhất theo quy tắc; không tạo mục trùng không giải thích              |
| SCN-08 | J3         | Thư viện từ rỗng                                   | Empty state hữu ích; không sinh lesson giả                               |
| SCN-09 | J3         | Lesson có từ đến hạn và một câu trả lời sai        | Tổng kết/lịch ôn phản ánh đáp án; không tuyên bố mastery quá mức         |
| SCN-10 | J4         | MCP chưa liên kết hoặc quyền chia sẻ đã hết hạn    | Không trả dữ liệu; chỉ dẫn liên kết/chia sẻ lại                          |
| SCN-11 | J4         | Truy vấn MCP ngoài capture được cấp quyền          | Từ chối truy cập ngoài phạm vi; không rò dữ liệu khác                    |
| SCN-12 | J5         | Export có mục trùng/thiếu definition               | Preview cho phép phát hiện/sửa; export không tuyên bố đã import          |
| SCN-13 | J5         | Người dùng yêu cầu direct Quizlet sync             | UI thể hiện chưa hỗ trợ beta; không hiện trạng thái giả                  |
| SCN-14 | J1/J2      | Offline hoặc provider timeout                      | Lỗi có thể hiểu và cách thử lại; không mất nội dung đã lưu an toàn       |
| SCN-15 | J2         | Chọn cụm từ hoặc cả câu                            | Chỉ có bản dịch; không hiện phát âm, giải thích, ví dụ, word family/lưu  |

## 8. Từ vựng sản phẩm dùng nhất quán

| Thuật ngữ          | Cách dùng trong UI/tài liệu                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Bản quét (capture) | Bản văn bản trang đã được người dùng yêu cầu thu thập; “capture” chỉ dùng khi nói về kỹ thuật |
| Quét tab           | Hành động chủ động lấy nội dung tab hiện tại; không hàm ý giám sát liên tục                   |
| Nguồn / citation   | Trang/đoạn làm căn cứ cho câu trả lời; citation có thể định vị về anchor nếu còn hợp lệ       |
| Từ đã lưu          | Mục vocabulary người dùng chủ động giữ để học; khác với từ chỉ xuất hiện trong nội dung trang |
| Đến hạn            | Mục có lịch ôn cần thực hiện; không đồng nghĩa người dùng đã quên                             |
| Chưa thuộc         | Chỉ dùng khi có trạng thái/bằng chứng học tập xác định; không suy từ một lần trả lời          |
| Chia sẻ MCP        | Quyền truy cập được người dùng cấp cho MCP client trên dữ liệu chọn; có phạm vi và hạn dùng   |
| Xuất Quizlet       | Tạo dữ liệu để người dùng đưa vào Quizlet; không đồng nghĩa import/sync đã thành công         |

## 9. Điểm cần chủ dự án xác nhận

### RESOLVED-P1-001-01 — Vị trí tiến độ dashboard

- **Mâu thuẫn:** D-103 đã chấp nhận sáu mục dashboard: Hôm nay, Từ vựng, Bài học, Nguồn, Tích hợp, Cài đặt. Tài liệu UX/UI lại thêm `/progress` như route riêng; phần IA cũng có “Tiến độ”.
- **Tác động:** ảnh hưởng sitemap, navigation, wireframe P1-002/P1-003 và ranh giới Hôm nay/Bài học; không nên để AI tự thêm route vào bản mock.
- **Quyết định của chủ dự án:** đưa tiến độ vào Hôm nay/Bài học, không thêm route riêng; giữ nguyên sáu mục D-103.
- **Trạng thái:** ĐÃ_CHỐT — xác nhận trong phiên ngày 2026-09-29.
- **Hành động tài liệu:** bảng route và IA UX được cập nhật; số liệu tiến độ chỉ xuất hiện trong ngữ cảnh Hôm nay/Bài học.

### Giả định được giữ nguyên, không phải quyết định mới

- D-101 là mục tiêu MVP sản phẩm, còn phase dự kiến trong PRD quyết định thứ tự xây dựng.
- ChatGPT/MCP là kênh bổ sung dùng dữ liệu được người dùng chủ động chia sẻ; không dùng phiên ChatGPT/browser để âm thầm đọc tab.
- MVP Quizlet là export có preview; import file và MCP tạo lesson vẫn ở Phase 6; direct sync chưa được duyệt.

## 10. Cổng P1-001

- [x] Tạo baseline persona có ghi nguồn và giới hạn bằng chứng.
- [x] Walkthrough nháp J1–J5 đủ entry, điều kiện trước, thành công, lỗi/phục hồi, không hỗ trợ, điểm kết thúc.
- [x] Ma trận requirement → phạm vi/hành trình/phase.
- [x] Nêu rõ bề mặt extension/dashboard/MCP/Quizlet và non-goal beta.
- [x] Ghi invariant consent, retention, quyền riêng tư và thuật ngữ.
- [x] Tạo backlog SCN cho Phase 2.
- [x] Owner duyệt persona/baseline và phạm vi P1-001 trong phiên ngày 2026-09-29.
- [x] Owner giải quyết RESOLVED-P1-001-01.
- [x] Owner xác nhận persona, journeys/non-goals và invariant còn lại theo lựa chọn “Duyệt P1-001 trước”.
- [x] Walkthrough trên tài liệu J1–J5 theo ba nhánh; rà soát scope/privacy.
- [ ] Cập nhật nguồn chuẩn (PRD/UX/decision register) nếu owner phê duyệt thay đổi.

### Bằng chứng review P1-001 — 2026-09-29

- Chủ dự án chọn quy trình “Duyệt P1-001 trước, rồi làm wireframe và mockup theo đúng phase”. Ghi nhận là duyệt baseline P1-001; không phải phê duyệt ngoại lệ hay high-fidelity design trong P1-001.
- Walkthrough J1–J5 đối chiếu từng mục entry, điều kiện trước, success, recovery, unsupported và exit với requirement map ở mục 5.
- `pnpm.cmd run format`: đạt.
- `pnpm.cmd run docs:check`: đạt — 45 file Markdown.
- `pnpm.cmd run secrets:scan`: đạt — 91 file.
- CI GitHub run `36569876283` trên commit `abc5d36`: hoàn tất, success.

P1-001 đã đạt cổng A. P1-002 được mở để tiếp tục IA/wireframe; high-fidelity visual vẫn để sau P1-002/P1-003 và cổng design foundation P1-004.
