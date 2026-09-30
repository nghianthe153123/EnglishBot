# Wirefigma Design System — Bản trích xuất triển khai

> Nguồn chính: [Wirefigma FREE trên Figma](https://www.figma.com/design/ex8zUj5SVaQVr1Jz5ovQ7V/Wirefigma-FREE-%257C-Wireframe-Design-System-for-Figma--Community-?node-id=1355-2839)\
> Tác giả: Tibor Lovas · Ngày khảo sát: 30/09/2026\
> HTML tham chiếu: [`wirefigma-sample.html`](./wirefigma-sample.html)

## 1. Mục tiêu và nguyên tắc

Wirefigma là một design system dành cho wireframe độ trung thực cao. Hệ thống ưu tiên cấu trúc, luồng tác vụ và khả năng thay đổi thương hiệu nhanh hơn trang trí. Các component dùng Auto Layout, variant và color style để một wireframe có thể được nâng cấp thành giao diện production mà không phải xây lại cấu trúc.

Ngôn ngữ thị giác có bốn đặc điểm:

1. **Đơn sắc có chủ đích:** trắng, các mức neutral lạnh và tím đen tạo phân cấp; vàng nhạt là màu ghi chú.
2. **Hình học rõ:** stroke mảnh, góc 4 px cho control, góc lớn hơn cho container và `999 px` cho phần tử tròn.
3. **Phân cấp bằng độ đậm và khoảng trắng:** tiêu đề đậm; nội dung thường; khoảng cách đi theo thang token cố định.
4. **Component trước trang:** màn hình được ghép từ component có state và variant, tránh vẽ các control rời rạc.

## 2. Phạm vi và mức độ tin cậy

Các giá trị dưới đây được chia làm hai nhóm:

- **Đã quan sát trực tiếp:** tên foundation, tên component, semantic color, thang spacing `2–20`, thang radius, cấp typography và cách component được dùng.
- **Chuẩn hoá để triển khai:** mã hex, font stack, phần mở rộng spacing trên 20 px và kích thước control. Figma ở chế độ xem công khai không mở Inspect nên các giá trị này được lấy theo màu hiển thị và chuẩn hoá thành token code nhất quán. Khi có quyền Inspect, thay giá trị primitive; không đổi semantic token hay API component.

## 3. Kiến trúc thư viện

```text
Wirefigma
├── Foundations
│   ├── Color
│   ├── Text
│   ├── Space
│   ├── Size
│   ├── Radius
│   ├── Stroke
│   └── Symbol
├── Tools
└── Components
```

### Quy tắc đặt tên

- Primitive: `neutral.900`, `space.m`, `radius.s`.
- Semantic: `text.default`, `background.tint`, `stroke.disabled`.
- Component: `button.primary.background`, `input.border.focus`.
- Variant dùng cặp `property=value`, ví dụ `type=outline`, `size=m`, `disabled=true`.

## 4. Color

### 4.1 Primitive palette

| Token | Giá trị triển khai | Vai trò |
|---|---:|---|
| `neutral.900` | `#211238` | Chữ, icon, nền tối, CTA chính |
| `neutral.600` | `#5F596A` | Nội dung phụ |
| `neutral.300` | `#ACA8B7` | Disabled và border |
| `neutral.100` | `#F2F0F5` | Nền tint |
| `white` | `#FFFFFF` | Surface và nội dung trên nền tối |
| `yellow` | `#FFF2A8` | Ghi chú/sticky note |
| `accent` | `#8D20F5` | Focus, nhấn tương tác và nhãn PRO trong tài liệu |

`accent` là token bổ sung cho bản code. Bộ free chủ yếu dùng neutral; accent giúp focus state đủ rõ mà vẫn giữ phong cách gốc.

### 4.2 Semantic palette

| Nhóm | Token | Primitive |
|---|---|---|
| Background | `background.default` | `white` |
|  | `background.tint` | `neutral.100` |
|  | `background.disabled` | `#E7E4EC` |
|  | `background.dark` | `neutral.900` |
| Text | `text.default` | `neutral.900` |
|  | `text.muted` | `neutral.600` |
|  | `text.disabled` | `neutral.300` |
|  | `text.on-dark` | `white` |
| Icon | `icon.default` | `neutral.900` |
|  | `icon.disabled` | `neutral.300` |
|  | `icon.on-dark` | `white` |
| Stroke | `stroke.light` | `#DCD8E2` |
|  | `stroke.default` | `neutral.300` |
|  | `stroke.disabled` | `#C8C4D0` |
|  | `stroke.dark` | `neutral.900` |

### Quy tắc sử dụng

- Dùng dark fill cho một hành động chính trong mỗi vùng; hành động còn lại dùng outline hoặc ghost.
- Disabled phải thay đổi đồng thời nền, chữ và con trỏ; không chỉ giảm opacity.
- Focus dùng vòng `accent` 3 px bên ngoài control, không làm thay đổi kích thước layout.
- Không dùng màu làm tín hiệu duy nhất; notification, validation và trạng thái chọn cần thêm icon hoặc nội dung chữ.

## 5. Typography

Figma tổ chức typography thành `Text 1` đến `Text 5`, với Bold/Regular và một style Underlined. Bản code dùng font stack không phụ thuộc mạng:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
```

| Style | CSS đề xuất | Công dụng quan sát được |
|---|---|---|
| `Text 1 Bold` | `28/36`, `700` | Tiêu đề dialog |
| `Text 2 Bold` | `22/30`, `700` | Tiêu đề card |
| `Text 3 Bold` | `16/24`, `700` | Label lớn: accordion, toggle, button |
| `Text 3 Regular` | `16/24`, `400` | Nội dung control cỡ lớn |
| `Text 4 Bold` | `14/20`, `700` | Label mặc định: checkbox, radio, button |
| `Text 4 Regular` | `14/20`, `400` | Nội dung input/select mặc định |
| `Text 5 Bold` | `12/16`, `700` | Label nhỏ, metadata |
| `Text 5 Regular` | `12/16`, `400` | Helper text, caption |
| `Text 5 Underlined` | `12/16`, `400`, underline | Link |

Không dùng nhiều hơn ba cấp chữ trên cùng một màn hình. Heading dùng Bold; đoạn văn và dữ liệu dùng Regular; label control dùng Bold.

## 6. Spacing, size, radius và stroke

### 6.1 Spacing

| Token | px | Dùng cho |
|---|---:|---|
| `space.2xs` | 2 | Optical adjustment |
| `space.xs` | 4 | Khoảng icon–label nhỏ |
| `space.s` | 6 | Nội bộ control compact |
| `space.m` | 8 | Gap mặc định |
| `space.l` | 12 | Padding control |
| `space.xl` | 16 | Padding card nhỏ |
| `space.2xl` | 20 | Khoảng giữa nhóm liên quan |
| `space.3xl` | 24 | Padding card mặc định |
| `space.4xl` | 32 | Khoảng giữa section |
| `space.5xl` | 40 | Khoảng lớn |
| `space.6xl` | 48 | Khoảng layout |

Các mức `2–20` đọc trực tiếp từ frame Space; `24–48` là phần mở rộng code giữ cùng nhịp.

### 6.2 Radius

| Token | px | Dùng cho |
|---|---:|---|
| `radius.s` | 4 | Button, input, tag |
| `radius.m` | 8 | Card compact, menu |
| `radius.l` | 24 | Panel/card nổi bật |
| `radius.xl` | 40 | Container trang trí |
| `radius.full` | 999 | Avatar, icon button, toggle thumb |

### 6.3 Size

- Control compact: `32 px`.
- Control mặc định: `40 px`.
- Control large: `48 px`.
- Icon: `12 / 16 / 20 / 24 px` tương ứng `XS / S / M / L`.
- Touch target tối thiểu: `40 × 40 px`; ưu tiên `44 × 44 px` trên mobile.

### 6.4 Stroke và elevation

- Stroke mặc định: `1 px solid`.
- Stroke nhấn/focus nội bộ: `2 px`.
- Wireframe không phụ thuộc shadow. Khi cần phân lớp, dùng border và đổi surface trước; shadow chỉ dùng nhẹ cho dialog/dropdown.

## 7. Component inventory

| Nhóm | Component | Variant/state chính |
|---|---|---|
| Disclosure | Accordion | expanded, disabled, size |
| Identity | Avatar, Logo | size, inverse |
| Navigation | Breadcrumb, Navigation Top, Navigation Bottom, Pagination, Tabs | active, icon, label, direction |
| Action | Button, Button Group, Button Icon, Button Split, Segmented Control | type, size, disabled, icon leading/trailing, active |
| Form | Checkbox, Radio Button, Toggle, Slider, Rating | on/checked, indeterminate, disabled, label, value |
| Input | Date Picker, Select, Text Input, Text Area | size, focus, disabled, label, text, leading/trailing icon |
| Overlay | Dialog, Dropdown, Tooltip | direction, close, actions, extra items, wrap |
| Data | Card, Table, Tag, Label | orientation, size, padding, zebra, CTA, icon |
| Media | Image, Media, Icon, Loader | custom image, map/player, symbol, size, completion |
| Feedback | Notification | icon, button, close |
| Inline | Link | leading/trailing icon |

Danh mục đầy đủ trong file: Accordion, Avatar, Breadcrumb, Button, Button Group, Button Icon, Button Split, Card, Checkbox, Date Picker, Dialog, Dropdown, Icon, Image, Label, Link, Loader, Logo, Media, Navigation Bottom, Navigation Top, Notification, Pagination, Radio Button, Rating, Segmented Control, Select, Slider, Table, Tabs, Tag, Text Area, Text Input, Toggle và Tooltip.

## 8. Anatomy và trạng thái chung

Mọi interactive component nên có:

1. **Container** — kích thước, fill, stroke và radius.
2. **Content** — label/value theo text token.
3. **Optional slots** — icon leading, icon trailing, helper text hoặc action.
4. **State layer** — hover, focus, pressed, disabled, selected/error nếu phù hợp.

| State | Cách thể hiện |
|---|---|
| Default | `background.default`, `stroke.default`, `text.default` |
| Hover | Nền `background.tint` hoặc dark fill đậm hơn 6–8% |
| Focus | Vòng `accent` 3 px; giữ border gốc |
| Pressed | Dịch `translateY(1px)` hoặc tăng độ tương phản |
| Disabled | Nền/chữ/stroke disabled; bỏ tương tác |
| Selected | Dark fill + text/icon on-dark |

## 9. Layout và responsive

- Desktop dùng shell hai cột: sidebar `240–280 px`, vùng nội dung linh hoạt.
- Nội dung chính tối đa `1280 px`; padding trang `24–32 px`.
- Card grid dùng `repeat(auto-fit, minmax(220px, 1fr))`.
- Dưới `900 px`, sidebar trở thành drawer; card grid giảm cột.
- Dưới `640 px`, control chiếm toàn chiều rộng, action xếp dọc và bảng cho phép cuộn ngang.
- Auto Layout trong Figma tương ứng Flexbox; dùng CSS Grid cho các cụm card/bảng có nhiều cột.

## 10. Accessibility

- Text body và label đạt WCAG AA trên surface tương ứng.
- Focus ring luôn nhìn thấy khi dùng bàn phím.
- Label thật phải liên kết với input bằng `for/id`; placeholder không thay label.
- Icon-only button cần `aria-label` và tooltip.
- Modal dùng `role="dialog"`, `aria-modal="true"`, giữ focus trong modal và trả focus về trigger khi đóng.
- Toggle/segmented control phải công bố trạng thái bằng `aria-pressed`, `aria-checked` hoặc native input.
- Animation tôn trọng `prefers-reduced-motion`.

## 11. CSS token contract

```css
:root {
  --wf-neutral-900: #211238;
  --wf-neutral-600: #5f596a;
  --wf-neutral-300: #aca8b7;
  --wf-neutral-100: #f2f0f5;
  --wf-white: #fff;
  --wf-yellow: #fff2a8;
  --wf-accent: #8d20f5;

  --wf-bg: var(--wf-white);
  --wf-bg-tint: var(--wf-neutral-100);
  --wf-text: var(--wf-neutral-900);
  --wf-text-muted: var(--wf-neutral-600);
  --wf-stroke: var(--wf-neutral-300);

  --wf-space-2xs: 2px;
  --wf-space-xs: 4px;
  --wf-space-s: 6px;
  --wf-space-m: 8px;
  --wf-space-l: 12px;
  --wf-space-xl: 16px;
  --wf-space-2xl: 20px;
  --wf-space-3xl: 24px;
  --wf-space-4xl: 32px;

  --wf-radius-s: 4px;
  --wf-radius-m: 8px;
  --wf-radius-l: 24px;
  --wf-radius-xl: 40px;
  --wf-radius-full: 999px;
}
```

## 12. Quy tắc triển khai

- Component nhận variant qua `data-*` hoặc class có nghĩa; không sao chép giá trị màu trực tiếp.
- HTML ưu tiên semantic element và native control.
- Tạo component mới bằng cách ghép token và primitive hiện có; chỉ thêm token khi có ít nhất hai nơi sử dụng.
- Test bốn trạng thái tối thiểu: default, hover, keyboard focus và disabled.
- Khi đổi thương hiệu, chỉ đổi primitive color/font; giữ spacing, anatomy, state và semantic mapping.

## 13. Nguồn tham khảo

- [Wirefigma FREE — Figma Community file](https://www.figma.com/design/ex8zUj5SVaQVr1Jz5ovQ7V/Wirefigma-FREE-%257C-Wireframe-Design-System-for-Figma--Community-?node-id=1355-2839)
- [Danh mục component và variant Wirefigma](https://figma-resource.com/wirefigma-free-wireframe-kit-2/)
- [Giới thiệu Wirefigma của tác giả Tibor Lovas](https://www.tiborlovas.com/)
