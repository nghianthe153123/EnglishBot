# P0-003: Môi trường, secret và cổng CI

- Trạng thái: HOÀN_TẤT
- Phase: 0
- Phạm vi sở hữu: platform/tooling
- Mức rủi ro: Cao
- Phụ thuộc: P0-002
- ID quyết định: D-303, D-306, D-311, D-314

## Mục tiêu

Thiết lập cổng tự động tối thiểu và quy ước secret để mọi thay đổi sau đó được kiểm tra nhất quán.

## Trong phạm vi

- `.env.example` an toàn.
- Quy tắc secret cho local, CI, staging, production.
- Lệnh chuẩn format, lint, test, build và kiểm tra tài liệu.
- CI tối thiểu cho Java, TypeScript và Markdown.
- Quét dependency/secret cơ bản.
- Ma trận môi trường.

## Ngoài phạm vi

- Credential thật, hạ tầng production cuối cùng, deploy ứng dụng hoặc gọi OpenAI thật.

## Tiêu chí nghiệm thu

- [x] CI chạy từ checkout sạch.
- [x] Job lỗi thật sự trả trạng thái thất bại.
- [x] Không cần secret thật để qua Phase 0.
- [x] Log không in secret.
- [x] Quy tắc biến môi trường được tài liệu hóa.
- [x] Backend, frontend và docs có cổng riêng, dễ truy nguyên lỗi.

## Test bắt buộc

- Chạy pipeline hoặc bản tương đương local.
- Tạo lỗi có kiểm soát để xác minh CI fail, sau đó hoàn tác lỗi.
- Chạy secret scan trên repository và artifact skeleton.
- Xác minh `.env` local không được Git track.

## Báo cáo thực thi

- Workflow: `.github/workflows/ci.yml` với ba job độc lập `backend`, `frontend`, `docs-security`.
- Cấu hình: `.env.example` chỉ chứa giá trị giả; quy tắc đầy đủ tại `docs/12-environments-and-secrets.md`.
- Dependency: lockfile pnpm, `pnpm audit`, Dependabot cho npm/Maven/GitHub Actions.
- Secret: scanner cục bộ chỉ đọc file được track và không in nội dung credential.
- Test âm: fixture link hỏng và private key giả đều làm cổng tương ứng trả finding; hai test xác nhận hành vi này đạt.
- Test local: docs-check đạt 34 file; secret scan đạt 80 file trước khi stage; npm audit không có lỗ hổng đã biết.
- `.env`: `git check-ignore -v .env` xác nhận rule `.gitignore:9` áp dụng.
- Credential thật: không sử dụng.
- Bằng chứng remote: cả ba job đạt tại [GitHub Actions run 36452278392](https://github.com/nghianthe153123/EnglishBot/actions/runs/36452278392), commit `f91dae1`.
