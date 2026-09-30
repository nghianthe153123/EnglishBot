# P1-101 — Hồ sơ UX để chủ dự án duyệt

- Khởi tạo: 2026-09-30; trạng thái: ĐÃ_DUYỆT_UX — chủ dự án phê duyệt ngày 2026-10-01 (D-P1-15). Đây là baseline đặc tả cho P1-103, không phải mockup được duyệt.
- Đã chốt riêng: **bật trên tab hiện tại, có tùy chọn ghi nhớ quyền từng website** (D-P1-11, trả lời owner trong phiên này).
- Không tạo code production hoặc mockup mới. Bộ này là thiết kế hành vi bằng chữ, sơ đồ và thông số Wirefigma, phục vụ duyệt trước gói mock/contracts.

## 1. Luồng đã được duyệt

```text
Icon EnglishBot
  ├─ giải thích quyền → [Bật trên tab này]
  │                       └─ tùy chọn ghi nhớ website, không bật sẵn
  ├─ queue nhỏ: số từ hợp lệ đã Add / N hoặc “Cần cấu hình N”
  └─ [Options]: provider, trạng thái key, N, quyền website

Trang đã bật
  bôi đen → [Dịch] local (chưa gửi selection)
                 └─ bấm một lần → popup gần con trỏ, loading
                      ├─ từ: term + từ loại + nghĩa + ví dụ
                      │       ├─ persist/reuse hợp lệ → [Add] riêng
                      │       └─ thiếu dữ liệu/key hoặc lưu lỗi → chưa bật Add
                      ├─ cụm/câu: chỉ bản dịch, không Add
                      └─ lỗi: chỉ rõ nguyên nhân, retry cùng provider hoặc Options
```

Popup không modal: không backdrop/trap focus; Escape/nút đóng/click ngoài đóng. Selection mới đóng lượt cũ và hiện Dịch local cho lượt mới; phản hồi cũ không ghi đè hoặc mở lại popup. Đóng không rollback request đã gửi/DB hoặc Add/batch đã chủ động thực hiện.

## 2. Những gì nhìn thấy ở popup

| Tình huống                   | Nội dung và thao tác                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Từ, Google                   | Nghĩa từ Google; POS/ví dụ do AI BYOK bổ sung, ghi rõ hai nguồn. Chỉ Add sau dữ liệu hợp lệ và lưu DB được xác nhận |
| Từ, AI                       | AI cung cấp nghĩa/POS/ví dụ; không chọn model cụ thể trong P1-101                                                   |
| Word cache đủ                | Dùng lại; không gọi provider, kể cả thiếu key cho request mới. Trạng thái cache khác với Đã Add                     |
| Google từ thiếu AI key/cache | Báo cần cấu hình để bổ sung; không bịa POS/ví dụ, Add chưa bật                                                      |
| Cụm/câu, Google              | Chỉ nghĩa từ Google, không AI/key AI/POS/ví dụ/Add                                                                  |
| Cụm/câu, AI                  | Chỉ nghĩa từ AI; cần key cho request mới, không biến thành thẻ từ                                                   |
| Persist fail/unknown         | Không nói đã lưu; Add chưa bật, có hướng phục hồi/đối soát                                                          |
| Add pending/added/unknown    | Nút/trạng thái thay thế nhau; không double submit hoặc báo đã thêm khi outcome chưa rõ                              |

## 3. Bố trí Wirefigma đã được duyệt ở mức đặc tả

- Popup ưu tiên rộng 320 CSS px, biên và khoảng neo 8 px; ở viewport 320/360/420 rộng lần lượt 304/320/320. Không cố định chiều cao; body cuộn khi dài, control vẫn tiếp cận được.
- Màu sáng đục từ Wirefigma, chữ neutral tối, radius 8 cho popup/4 cho control; không thêm dark palette, gradient, shadow lớn hoặc style mockup cũ.
- Chữ ba cấp 16/24, 14/20, 12/16. Một CTA dark mỗi vùng; đóng/recovery phụ outline/ghost. Add là thao tác chính của vùng kết quả từ, không nút tự dịch lại.
- Control mặc định 40 px; focus accent **đục**, viền control chức năng stroke.dark. Sample HTML có focus alpha 0.28 và viền nhạt không đạt ngưỡng contrast số học khi dùng như tín hiệu duy nhất; không copy nguyên các chi tiết này.
- Options cần chọn provider rõ ràng, không tự chọn mặc định; key chỉ nhập/thay một lần gửi backend, sau đó hiển thị trạng thái chứ không echo lại secret. N rỗng, không placeholder số hoặc default.

Các lựa chọn UX này được owner duyệt ngày 2026-10-01; con số hình học là thông số layout EnglishBot, không phải số đo Inspect hoặc screenshot UI.

## 4. Queue và Quizlet

Add vẫn được phép khi N chưa cấu hình; queue giữ từ và nhắc thiết lập N, không tạo batch. Khi N hợp lệ và đủ từ chưa thuộc batch, luồng sẽ tự tạo import text và set theo yêu cầu đã chốt. Tài liệu này không tự đặt min/max N hoặc quy tắc đổi N khi đã có queue.

Quizlet ở trạng thái chờ khảo sát/chấp nhận kênh: không giả đã liên kết tài khoản. `Đang tạo`, `Đang đối soát`, `Không khả dụng`, `Chưa rõ`, `Đã xác minh` là trạng thái thiết kế cho implementation sau; chỉ xác minh với evidence set và đúng account. Unknown không có action tạo lại mù quáng. Export thủ công không thay mục tiêu tự tạo set.

## 5. Bằng chứng và điểm cần giải quyết ở gate

[Báo cáo kiểm tra](../evidence/P1-101-design-review.md) phân biệt rõ:

- Đã kiểm tra: nguồn/hash, đối chiếu đặc tả, tính tương phản token, 432 tổ hợp clamp số học, kiểm tra tài liệu/formatter/secret/diff theo kết quả ghi trong báo cáo.
- Chưa kiểm tra: UI/browser thật, screenshot 320/360/420, zoom, keyboard/focus, grant/revoke/restricted trên runtime. Owner đã phê duyệt đặc tả; chưa walkthrough UI chạy thật.

Gói ban đầu cấm mockup/code nhưng yêu cầu visual review viewport. Owner đã giải quyết xung đột ngày 2026-09-30 bằng **phân tầng gate D-P1-14**: P1-101 duyệt spec/số học; review ảnh/keyboard trên mock ở P1-103; quyền và interaction thật ở P1-105; browser E2E/release ở P1-109. Test vẫn bắt buộc, chưa chạy không tính là đạt. Không dùng screenshot dashboard mẫu làm chứng cứ EnglishBot. Gói phụ thuộc đã nhận trách nhiệm test cụ thể; đây không phải mở thực thi các gói đó.

## 6. Biên bản phê duyệt

1. **ĐÃ_DUYỆT** bộ UX: luồng, bố trí popup, close/focus, Options/queue và state catalog. Nguồn: chủ dự án trả lời “ok tôi duyệt phần tiếp theo là thực thi P1-103 đúng ko” ngày 2026-10-01. Ghi nhận phê duyệt đặc tả, không suy ra đã test UI hoặc đã yêu cầu triển khai P1-103 ngay.
2. Phân tầng gate ở mục 5: **ĐÃ_DUYỆT** ngày 2026-09-30. Không cần hỏi lại. Câu trả lời này không đồng nghĩa duyệt toàn bộ UX ở mục 1.

Từ ghép/nháy/gạch nối, sense/ngữ cảnh ví dụ/cache key, model/auth/BYOK lifecycle, contract/schema và Quizlet channel vẫn để đúng gói sau, không cần mở rộng P1-101 để tự quyết.

## 7. Tài liệu chi tiết và phân công

- [Wireframe và state catalog](phase-1-extension-wireframes.md): agent `gpt-6-luna` effort `low`, root review và sửa race/cache consistency.
- [Token/component](phase-1-design-foundations.md), [checklist 17 tình huống](p1-101-review-checklist.md): agent `gpt-6-luna` effort `low`, root kiểm tra contrast và mapping.
- [Quyền, geometry và focus](p1-101-permissions-and-layout.md): root thực hiện phần phức tạp và xác minh tài liệu chính thức.
- [Kế hoạch/prompt điều phối](../ai-prompts/P1-101-orchestration.md), [gói công việc](../work-packages/P1-101-scope-wirefigma-ux.md).

Đề xuất quy tắc cho lần sau: tách bằng chứng **đặc tả / số học / UI runtime** trong mọi gói UI và ghi chủ thể/gói chịu trách nhiệm cho test chưa chạy; tránh coi token hoặc test plan là bằng chứng giao diện đã đạt. Đây là đề xuất chờ owner, chưa tự thêm vào AGENTS/playbook.
