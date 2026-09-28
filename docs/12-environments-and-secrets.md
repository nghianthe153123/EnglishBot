# Môi trường, biến cấu hình và secret

## Nguyên tắc

- Repository và CI của Phase 0 phải chạy mà không cần secret thật.
- Chỉ tên biến cùng giá trị giả an toàn được lưu trong `.env.example`.
- Không commit `.env`, token, private key, credential JSON hoặc file certificate chứa khóa riêng.
- Secret phía server không bao giờ được nhúng vào extension, browser storage, source map hoặc log.
- Khi thêm một biến mới, work package phải ghi chủ sở hữu, môi trường dùng, bắt buộc hay tùy chọn và chính sách xoay vòng.

## Ma trận môi trường

| Môi trường | Cấu hình không nhạy cảm              | Secret                                  | Dữ liệu được phép                           | Cổng bắt buộc                         |
| ---------- | ------------------------------------ | --------------------------------------- | ------------------------------------------- | ------------------------------------- |
| Local      | `.env` bị ignore hoặc biến hệ thống  | Secret cá nhân ngoài Git                | Fixture tổng hợp mặc định                   | `pnpm run verify:all`                 |
| CI         | File workflow và biến không nhạy cảm | GitHub Actions secret khi phase sau cần | Fixture tạm thời                            | Ba job backend/frontend/docs-security |
| Staging    | Cấu hình deploy có version           | Kho secret của nền tảng                 | Tài khoản test, không dùng dữ liệu nhạy cảm | CI + smoke/integration theo phase     |
| Production | Cấu hình bất biến theo bản phát hành | Kho secret được mã hóa và audit         | Dữ liệu thật theo retention đã duyệt        | Cổng release Phase 7                  |

## Biến Phase 0

| Biến             | Phạm vi                | Bắt buộc            | Giá trị giả      | Ghi chú                                               |
| ---------------- | ---------------------- | ------------------- | ---------------- | ----------------------------------------------------- |
| `ENGLISHBOT_ENV` | Backend/tooling        | Có                  | `local`          | Chỉ mô tả môi trường; chưa điều khiển logic nghiệp vụ |
| `SERVER_PORT`    | Backend                | Không               | `8080`           | Spring Boot dùng mặc định nếu không đặt               |
| `OPENAI_API_KEY` | Tương lai, server-only | Không trong Phase 0 | `not-configured` | Không được đưa vào client hoặc log                    |

## Quy trình secret

1. Developer sao chép `.env.example` thành `.env` khi một phase thực sự cần cấu hình local.
2. Giá trị thật chỉ được lấy từ kênh quản lý secret được duyệt.
3. CI nhận secret qua kho secret của GitHub; workflow không in giá trị và không truyền sang job không cần thiết.
4. Staging/production dùng kho secret của nền tảng triển khai sau khi provider được chốt.
5. Khi nghi ngờ lộ secret: thu hồi trước, xoay vòng, kiểm tra log/artifact, ghi sự cố và chỉ sau đó cấp lại.

## Kiểm soát tự động

- `node scripts/scan-secrets.mjs` quét file được Git track và một số mẫu credential phổ biến.
- `.gitignore` chặn các tên file local thường gặp.
- Dependabot theo dõi npm, Maven và GitHub Actions hằng tuần.
- CI chạy `pnpm audit --audit-level=high` cho dependency JavaScript.
- Đây là lớp cơ bản của Phase 0, không thay thế secret scanner chuyên dụng hoặc SCA production ở Phase 7.
