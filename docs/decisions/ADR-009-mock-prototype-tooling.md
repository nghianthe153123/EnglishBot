# ADR-009 — Tooling giới hạn cho prototype P1-103

- Trạng thái: Đề xuất kỹ thuật bổ sung ADR-005 trong phạm vi mock P1-103; không khóa tooling production.
- Ngày: 2026-10-01.
- Liên quan: [ADR-002](ADR-002-mock-first-contract-first.md), [ADR-005](ADR-005-repository-build-layout.md), [P1-103](../work-packages/P1-103-mock-contracts.md).

## Bối cảnh

Scaffold React/TypeScript chưa có trang chạy để review popup/Options/queue. Owner đã yêu cầu thực thi P1-103 và UX đã duyệt; cần một host local cho fixture, screenshot, keyboard và zoom. `pnpm-lock.yaml` đã khóa Vite 8.3.1 qua Vitest 5.0.2. Không cần thêm framework/plugin hoặc dependency ngoài workspace để chạy mock.

## Phương án áp dụng thử trong P1-103

- Dùng `apps/extension/index.html` và entry React hiện có làm host review local. Đây là trang mẫu chứa văn bản có thể chọn và UI extension mô phỏng; không phải dashboard, website production hoặc extension Chrome đã cài.
- Dùng Vite 8.3.1 đã có trong lockfile cho dev server và bundle; TypeScript kiểm tra riêng với `--noEmit`. Không thêm React Vite plugin, router, UI library, DOM test library hoặc dependency mạng.
- `packages/api-contracts` và `packages/mock-fixtures` export `dist/index.js` cùng `dist/index.d.ts`. Extension phụ thuộc workspace hai package này; mock-fixtures phụ thuộc workspace api-contracts. Đây là đường dùng các package dùng chung đã có ở ADR-005, không truy cập module backend hoặc repository chéo.
- Root build các shared package trước recursive typecheck và trước dev server, để checkout sạch chưa có `dist` vẫn chạy đúng thứ tự. Build recursive giữ thứ tự dependency workspace.
- Clean checkout kiểm tra trong vòng 3 đã phát hiện `vite` không được expose qua `.bin`, dù CLI đã chạy trên môi trường cũ. Không dùng kết quả môi trường cũ làm bằng chứng reproducibility. Gọi Vite qua wrapper Node `scripts/run-mock-vite.mjs`: resolve `vitest/package.json`, tạo `createRequire` tại package đó để resolve `vite/package.json`, đọc version và `bin.vite`, yêu cầu version 8.3.1 đã khóa, rồi import CLI bằng file URL. Wrapper giữ nguyên argv/cwd để lệnh build/dev/preview dùng CLI chính thức đã cài; không tự tải package hoặc phụ thuộc đường `.pnpm`/`.bin` cũ.
- Lệnh dev dự kiến: build api-contracts/mock-fixtures rồi `node scripts/run-mock-vite.mjs apps/extension --host 127.0.0.1 --port 4173 --strictPort`. Build extension dự kiến: `tsc -p tsconfig.json --noEmit && node ../../scripts/run-mock-vite.mjs build`. Resolve package/version/bin phải được kiểm tra trước khi sửa scripts; clean frozen install/typecheck/test/build và smoke dev/preview phải xác minh sau thay đổi. Lệnh cuối và kết quả thực chạy phải ghi ở bằng chứng gói.

## Hệ quả và giới hạn

Fixture/fake chạy trong bộ nhớ, không network provider/backend/Quizlet, không DB, không credential thật, không browser storage secret. Chỉ mock boundary; consumer và hợp đồng vẫn phải được review. Vite hiện là dependency transitive đã khóa; không coi việc CLI local chạy được là bằng chứng ổn định cho build production. Nếu môi trường checkout sạch không expose CLI, dừng thay đổi dependency và ghi phương án chính xác trước khi mở rộng tooling.

Phương án wrapper được lead GPT 6.1/high review ngày 2026-10-01 trong vòng 3: dùng dependency đã khóa, không thêm Vite direct dependency/framework/plugin hay nâng version. Việc thiếu `.bin` không tự cấp quyền thêm dependency; nếu resolve/package version/bin không đúng thì báo lỗi rõ và ghi blocker, không fallback sang executable hoặc tự tải version khác. Đây là sửa build reproducibility trong cùng vòng 3, không mở vòng 4 hoặc đổi cổng mock/production.

Không thêm manifest/content script/service worker hoặc thử grant quyền thật trong ADR này. P1-105 chịu trách nhiệm interaction/quyền extension thật; P1-104/108 chịu trách nhiệm secret/DB/kênh production. Owner duyệt hợp đồng và mock P1-103 riêng trước P1-104.
