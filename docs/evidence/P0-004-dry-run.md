# Bằng chứng dry run P0-004

- Ngày: 2026-09-28
- Môi trường local: Windows 11, Node.js 24.16.0, pnpm 11.7.0
- Phạm vi: cổng liên kết Markdown và cổng secret cơ bản
- Trạng thái: HOÀN_TẤT

## Ánh xạ tiêu chí

| Tiêu chí                 | Cách chứng minh                                       | Kết quả hiện tại |
| ------------------------ | ----------------------------------------------------- | ---------------- |
| Đọc đúng chuỗi tài liệu  | Log phiên làm việc và danh sách file bắt buộc         | Đạt              |
| Kế hoạch ánh xạ tiêu chí | Work package P0-004 và bảng này                       | Đạt              |
| Diff đúng phạm vi        | Review file script/test/docs/tooling, không có domain | Đạt              |
| Test chạy thật           | Các lệnh và kết quả bên dưới                          | Đạt local        |
| Báo cáo rõ trạng thái    | Phân biệt local đạt, CI đang chờ                      | Đạt              |
| Tái chạy checkout sạch   | GitHub Actions                                        | Đạt              |

## Lệnh và kết quả local

```text
pnpm run quality
  format: đạt
  lint: đạt
  type-check: đạt cho 5/5 workspace project
  Vitest: 2 file, 16 test đạt
  build: đạt cho 5/5 workspace project

pnpm run docs:check
  đạt: 34 file Markdown

pnpm run secrets:scan
  đạt: 80 file trước khi stage

pnpm audit --audit-level=high
  đạt: không có lỗ hổng đã biết

mvnw.cmd --version
  đạt: Maven Wrapper tải và chạy Maven 3.9.11

git check-ignore -v .env
  đạt: .gitignore:9:.env
```

## Xác minh đường lỗi

`tooling/quality-gates.test.mjs` tạo fixture tạm thời và chứng minh:

- Link nội bộ thiếu tạo đúng một lỗi.
- Mẫu private key giả tạo đúng một finding.
- Fixture hợp lệ không sinh lỗi giả.
- Fixture chỉ có giá trị `not-configured` không bị nhận diện sai là secret.

Không đưa secret thật hoặc dữ liệu người dùng vào test.

## Bằng chứng remote

- Commit được xác minh: `f91dae1e6ee6d8ab2d85e99e77460773e629089f`.
- Workflow: [GitHub Actions run 36452278392](https://github.com/nghianthe153123/EnglishBot/actions/runs/36452278392).
- `Backend Java 21`: đạt; Maven verify hoàn tất trên Java 21.
- `Frontend Node 24`: đạt; install khóa lockfile, quality gate và npm audit đều thành công.
- `Tài liệu và secret`: đạt; docs-check và secret scan thành công từ checkout sạch.
