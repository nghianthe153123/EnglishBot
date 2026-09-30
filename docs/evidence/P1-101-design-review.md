# P1-101 — Bằng chứng review thiết kế

- Phiên: 2026-09-30 → 2026-10-01 (Asia/Saigon); người kiểm tra tích hợp: root.
- Phạm vi: tài liệu UX, không feature production, không mockup.
- Trạng thái: review kỹ thuật tài liệu; owner approval và UI runtime vẫn chờ.
- [Gói](../work-packages/P1-101-scope-wirefigma-ux.md), [hồ sơ owner](../design/p1-101-owner-review.md), [checklist](../design/p1-101-review-checklist.md).

## 1. Nguồn và checksum

Root chạy `rtk proxy certutil -hashfile <path> SHA256` với từng đường dẫn dưới đây, cả bốn exit 0; so với [SOURCE](../design/reference/SOURCE.md) đều khớp. Không sửa bản gốc hoặc snapshot.

| Đường dẫn                                        | SHA-256                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| C:/SystemDesign/WIREFIGMA_DESIGN_SYSTEM.md       | 0132f0597d8d578cbe2164132163dcf98e48c68d748f434ee37d07f3e8e0333e |
| docs/design/reference/WIREFIGMA_DESIGN_SYSTEM.md | 1364269a41b67d8e1736302d5d1e0fc95793d4572455c243372e1f19e024c9c0 |
| C:/SystemDesign/wirefigma-sample.html            | 0cb8c53b1e37460c65860b1029bdfb635f31e8e1fe29e8f0bb230219283b10f9 |
| docs/design/reference/wirefigma-sample.html      | 0cb8c53b1e37460c65860b1029bdfb635f31e8e1fe29e8f0bb230219283b10f9 |

MD khác bản gốc do chuẩn hóa đã ghi trong SOURCE; không coi hai hash này phải giống nhau. HTML giống byte với bản gốc nhưng là dashboard minh họa, không visual baseline của EnglishBot.

## 2. Tính tương phản thực hiện bằng JavaScript

Root đã tính trong phiên bằng JavaScript theo relative luminance sRGB: mỗi channel chuẩn hóa về [0,1], tuyến tính hóa `c<=0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`; `L=0.2126R+0.7152G+0.0722B`; ratio `(Lmax+0.05)/(Lmin+0.05)`. Ngưỡng so bằng giá trị chưa làm tròn, bảng hiển thị hai số lẻ.

| Cặp                                | Màu trước / nền          | Ratio | Tiêu chí / kết quả                                                   |
| ---------------------------------- | ------------------------ | ----- | -------------------------------------------------------------------- |
| text.default / trắng               | #211238 / #FFFFFF        | 17.38 | Text 4.5:1 — đạt số học                                              |
| text.muted / trắng                 | #5F596A / #FFFFFF        | 6.72  | Text 4.5:1 — đạt số học                                              |
| text.muted / tint                  | #5F596A / #F2F0F5        | 5.94  | Text 4.5:1 — đạt số học                                              |
| text.on-dark / CTA                 | #FFFFFF / #211238        | 17.38 | Text 4.5:1 — đạt số học                                              |
| accent đục / trắng                 | #8D20F5 / #FFFFFF        | 5.74  | Non-text 3:1 — đạt số học                                            |
| accent đục / tint                  | #8D20F5 / #F2F0F5        | 5.07  | Non-text 3:1 — đạt số học                                            |
| stroke.default / trắng             | #ACA8B7 / #FFFFFF        | 2.32  | Không đạt 3:1 nếu boundary là tín hiệu cần thiết duy nhất            |
| stroke.light / trắng               | #DCD8E2 / #FFFFFF        | 1.40  | Không đạt 3:1 cho boundary chức năng duy nhất; chỉ divider trang trí |
| Focus alpha 0.28 sample trên trắng | Xấp xỉ #DFC1FC / #FFFFFF | 1.59  | Không đạt 3:1 cho focus indicator duy nhất                           |

Sample HTML định nghĩa `--wf-focus: rgba(141,32,245,.28)` trong khi MD hướng dẫn vòng accent; **không sao chép nguyên focus mờ của sample**. Đề xuất dùng semantic accent đục, stroke.dark cho boundary cần nhận biết, giữ source nguyên trạng. Đây là lựa chọn có nguồn, chờ owner duyệt UX, không thêm primitive màu mới.

Đối chiếu [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) cho text và [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) cho non-text. Suy luận lựa chọn palette không phải certification WCAG toàn UI: computed style, focus clipping/obscuring, màu liền kề runtime và trang sáng/tối chưa kiểm tra. Disabled có ngoại lệ nhưng hướng dẫn lỗi/thiếu key không được giấu bằng disabled text.

## 3. Kiểm tra clamp số học

Root thực thi JavaScript cho công thức trong [layout spec](../design/p1-101-permissions-and-layout.md): width min(320,Vw−16), height min(Hcontent,Vh−16), thử dưới/phải, flip nếu không vừa, rồi clamp với biên 8. Mỗi case assert bounds nằm trong viewport và width/height dương.

- Vw: 160, 320, 360, 420 CSS px.
- Vh: 180, 640 CSS px.
- Offset viewport: (0,0), (24,40).
- Neo: x tại 0/Vw÷2/Vw−1; y tại 0/Vh÷2/Vh−1, cộng offset.
- Height nội dung: 80, 360, 1000.
- Tổng `4×2×2×3×3×3 = 432`; **432 đạt, 0 fail**.

| Vw / Vh   | Neo     | Hcontent | Popup x,y,w,h |
| --------- | ------- | -------- | ------------- |
| 160 / 640 | 159,639 | 1000     | 8,8,144,624   |
| 320 / 640 | 319,639 | 1000     | 8,8,304,624   |
| 360 / 640 | 359,639 | 1000     | 31,8,320,624  |
| 420 / 640 | 419,639 | 1000     | 91,8,320,624  |

Đây là kiểm tra mô hình số học, **không** chạy CSS/DOM/browser hoặc chứng minh zoom/keyboard thật. Trường hợp viewport dưới 16 px được spec yêu cầu hoãn hiển thị, không thuộc 432 case. Viewport 160 chỉ stress hình học, không ảnh chụp zoom 400%.

### Hàm đối chiếu để tái lập phép tính

```js
function place(v, anchor, contentHeight) {
  const w = Math.min(320, v.w - 16);
  const h = Math.min(contentHeight, v.h - 16);
  const right = anchor.x + 8;
  const bottom = anchor.y + 8;
  const cx = right + w <= v.x + v.w - 8 ? right : anchor.x - 8 - w;
  const cy = bottom + h <= v.y + v.h - 8 ? bottom : anchor.y - 8 - h;
  return {
    x: Math.min(Math.max(cx, v.x + 8), v.x + v.w - 8 - w),
    y: Math.min(Math.max(cy, v.y + 8), v.y + v.h - 8 - h),
    w,
    h,
  };
}
```

Không thêm hàm này vào extension; implementation sau phải test cùng vector và layout thực. Runtime phải thống nhất tọa độ pointer/visualViewport, không lấy công thức làm lý do bỏ browser test.

## 4. Review tích hợp và chỉnh lỗi tài liệu

Root đọc lại output hai agent, đối chiếu PRD/ADR và sửa trước khi giao owner:

1. Phản hồi cũ/selection mới: đồng bộ hành vi đóng/reset lượt cũ giữa wireframe và layout; không auto request.
2. AI mode thiếu key: cache word đầy đủ vẫn reuse; chỉ thiếu key khi cần gọi AI mới chặn. Không đánh đồng missing key với cache miss.
3. Mã requirement ở checklist: phrase → P1-TR-04, N → P1-QZ-01, Quizlet trạng thái → P1-QZ-03/04; sửa nhầm mapping từ agent.
4. Word/Add: dữ liệu mới validate/persist, cached record sẵn sàng reuse; lookup không Add, timeout chưa xác minh không báo Added.
5. Activation: owner đã chốt A; ghi D-P1-11, không coi cả bộ UX hoặc manifest đã được duyệt theo câu trả lời này.
6. Wirefigma: source/sample khác focus opacity; tính contrast và đề xuất semantic có nguồn thay vì copy sai từ dashboard.

Đây là lỗi/kiểm tra tài liệu, không sửa bug production. Browser permission matrix được review theo nguồn Chrome chính thức đã liên kết, không coi là test runtime.

## 5. Lệnh kiểm tra repository

Root đã chạy sau tích hợp: docs:check đạt 77 Markdown, format toàn repository đạt, git diff --check exit 0; test suite hiện có đạt 2 file/16 test. Test này là tooling scaffold, không chứng minh tính năng Phase 1 đã chạy. Agent B từng gặp 5 link thiếu khi target root chưa tạo; lần kiểm tra tích hợp đã xác nhận hết lỗi. Secrets/staged diff và kiểm tra lại bản cuối được ghi sau lần chạy cuối.

| Lệnh thực chạy (RTK prefix bắt buộc)                                  | Kết quả                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------- |
| `rtk pnpm exec prettier --write <các file thay đổi>`                  | Chỉ format tài liệu task; exit 0                        |
| `rtk pnpm run docs:check`                                             | 77 file Markdown, 0 lỗi; exit 0                         |
| `rtk pnpm run format`                                                 | Toàn bộ file được formatter quản lý đạt; exit 0         |
| `rtk pnpm run test`                                                   | 2 file, 16 test tooling scaffold đạt; exit 0            |
| `rtk pnpm run secrets:scan`                                           | 124 file tracked/staged, không phát hiện secret; exit 0 |
| `rtk proxy git diff --check` và `rtk proxy git diff --cached --check` | Không lỗi whitespace; exit 0                            |

Kiểm tra cuối/ghi Git tiếp tục sang 2026-10-01. Không chạy build feature/migration/provider/Quizlet thật. Lệnh `docs:check` xác minh target file tồn tại và heading; không kiểm chứng mọi anchor Markdown hoặc link internet. Secret scan là kiểm tra tĩnh repository, không phải kiểm tra secret trên browser runtime.

## 6. Test chưa chạy và trách nhiệm

| Hạng mục                                                  | Trạng thái                             | Người/gói chịu trách nhiệm đề xuất                          |
| --------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Owner walkthrough/duyệt UX                                | CHỜ_OWNER                              | Chủ dự án, P1-101                                           |
| Screenshot 320/360/420, keyboard/focus/zoom trên mock     | CHỜ_UI_RUNTIME, chưa có ảnh            | Root/agent UI, P1-103; owner đã duyệt phân tầng D-P1-14     |
| Cài mới/grant/revoke/restricted/action network assertions | CHƯA_CHẠY                              | Agent implementation/reviewer, P1-105 rồi P1-109            |
| Provider/DB/Add/Quizlet E2E thật                          | CHƯA_CHẠY, không thuộc thực thi P1-101 | Các gói P1-104…109                                          |
| Frontend/backend feature unit/build/migration/live model  | KHÔNG_ÁP_DỤNG cho thay đổi tài liệu    | Không đổi production/schema hoặc gọi model/provider/Quizlet |

Không có API key/cookie/selection cá nhân trong artifacts; không external write Quizlet, không migration. Owner đã duyệt phân tầng visual D-P1-14; cổng P1-101 vẫn chờ duyệt bộ UX (AC1), STATUS chưa được cập nhật hoàn tất.

## 7. File thay đổi và phân công

- Điều phối: `docs/ai-prompts/P1-101-orchestration.md`, `P1-101-A-interactions.md`, `P1-101-B-foundations-testing.md`; gói `docs/work-packages/P1-101-scope-wirefigma-ux.md`.
- UX: `docs/02-ux-ui-system.md`, `docs/design/phase-1-information-architecture.md`, `phase-1-extension-wireframes.md`, `phase-1-design-foundations.md`, `p1-101-permissions-and-layout.md`, `p1-101-owner-review.md`, `p1-101-review-checklist.md`.
- Truy vết/kiểm thử: `docs/10-traceability.md`, `docs/11-decisions-to-lock.md`, `docs/06-testing-strategy.md`, `docs/work-packages/P1-103-mock-contracts.md`, `P1-105-selection-translation.md`, `P1-109-e2e-uat-release.md`, báo cáo này.
- Hai agent `gpt-6-luna` effort `low` thực thi đúng lane; root đọc/sửa output, xử lý quyền/contrast/gate và review cuối. Không code production, đổi dependency, migration hoặc STATUS.

Gói 103/105/109 chỉ cập nhật trách nhiệm test theo quyết định owner, vẫn NHÁP; không tự mở thực thi. AC2…6 đủ đặc tả/bằng chứng tài liệu; AC1 chờ owner. Đề xuất quy tắc tái sử dụng ở hồ sơ owner vẫn chưa được duyệt thành AGENTS/playbook.
