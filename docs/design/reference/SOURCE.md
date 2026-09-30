# Nguồn thiết kế Phase 1

- Chủ dự án chỉ định: `C:\SystemDesign`, ngày 2026-09-30.
- Bộ nguồn: Wirefigma, tác giả Tibor Lovas; attribution/link Figma nằm trong bản nguồn.
- [Tài liệu nguồn](WIREFIGMA_DESIGN_SYSTEM.md), [HTML tham chiếu](wirefigma-sample.html).
- Đây là snapshot tham chiếu, không phải mockup EnglishBot được duyệt. HTML là dashboard minh họa component; không đưa dashboard vào Phase 1.
- Không chỉnh sửa các file gốc trong `C:\SystemDesign`. Snapshot được miễn formatter để giữ nội dung/hash; cập nhật nguồn cần ghi lại hash và nguyên nhân.

## SHA-256 tại thời điểm nhập

| File                       | Bản gốc C:\SystemDesign                                          | Snapshot repository                                              |
| -------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| WIREFIGMA_DESIGN_SYSTEM.md | 0132f0597d8d578cbe2164132163dcf98e48c68d748f434ee37d07f3e8e0333e | 1364269a41b67d8e1736302d5d1e0fc95793d4572455c243372e1f19e024c9c0 |
| wirefigma-sample.html      | 0cb8c53b1e37460c65860b1029bdfb635f31e8e1fe29e8f0bb230219283b10f9 | 0cb8c53b1e37460c65860b1029bdfb635f31e8e1fe29e8f0bb230219283b10f9 |

Markdown khác hash vì chuẩn hóa whitespace/newline và đổi hard break hai dấu cách thành hard break bằng dấu backslash để vượt git diff-check; nội dung nguồn được giữ. Các giá trị màu/font/spacing mở rộng trong tài liệu là chuẩn hóa cho code, không được khẳng định Inspect-verified. Palette tối chưa có nguồn được xác minh, không tự tạo trong gói điều chỉnh này.
