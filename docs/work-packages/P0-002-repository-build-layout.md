# P0-002: Khóa repository và build layout

- Trạng thái: ĐANG_REVIEW
- Phase: 0
- Phạm vi sở hữu: toàn repository
- Mức rủi ro: Nâng cao
- Phụ thuộc: P0-001
- ID quyết định: D-001, D-002, D-003, D-004, D-009, D-301, D-302

## Mục tiêu

Tạo monorepo skeleton có thể build và kiểm thử, đủ để Phase 1 xây UI mock nhưng chưa chứa logic sản phẩm.

## Trong phạm vi

- Khởi tạo Git.
- Cấu trúc `apps`, `backend`, `packages`, `docs`.
- Maven multi-module skeleton.
- `pnpm` workspace skeleton.
- Ghim/ghi runtime và package manager.
- `.gitignore`, `.editorconfig`, UTF-8.
- ADR repository/build layout.

## Ngoài phạm vi

- UI sản phẩm, schema nghiệp vụ, OpenAI, MCP, Quizlet hoặc auth.
- Dependency “để dùng sau”.

## Tiêu chí nghiệm thu

- [x] Checkout sạch có hướng dẫn setup rõ ràng.
- [ ] Backend skeleton compile/test thành công trên Java 21 (đang chờ CI đầu tiên).
- [x] Frontend workspace install/type-check/lint/test/build thành công.
- [x] Không có secret hoặc file local nhạy cảm được track.
- [x] Layout khớp ADR đã duyệt.
- [x] Diff không chứa logic tính năng.

## Test bắt buộc

- Build/test Maven từ lệnh chuẩn.
- Install có lockfile và quality gate của `pnpm`.
- Kiểm tra `.gitignore` và secret scan cơ bản.
- Kiểm tra liên kết tài liệu.

## Rollback

Rollback bằng commit đảo ngược có kiểm soát; không dùng lệnh phá hủy worktree.

## Báo cáo thực thi

- Repository: Git monorepo trên nhánh `main`, remote là repository do chủ dự án chỉ định.
- Backend: Maven Wrapper 3.9.11, Java 21, Spring Boot 4.1.1; module `application` và `platform`.
- Frontend: Node 24.16.0, pnpm 11.7.0; hai app React và ba package dùng chung ở mức skeleton.
- Test local: `pnpm run quality` đạt với 16 test; Maven Wrapper tự khởi động đúng phiên bản.
- Backend Java 21: giao cho job CI `Backend Java 21` xác minh từ checkout sạch.
- Migration database: không.
- Tác động bảo mật: không có secret; `.env` đã được xác minh là bị ignore.
- Giới hạn: chưa có logic tính năng, database, API hoặc tích hợp ngoài đúng theo phạm vi.
