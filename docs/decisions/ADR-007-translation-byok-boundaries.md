# ADR-007 — Ranh giới dịch hai provider và BYOK

- Trạng thái: Đề xuất kỹ thuật cho P1-103/104; lựa chọn hai provider và BYOK đã được yêu cầu tại ADR-006.
- Ngày: 2026-09-30

## Thiết kế đề xuất

- Extension React/TypeScript chỉ điều phối selection/action/popup và gọi backend Java/Spring Boot.
- Translation adapter tách Google Cloud Translation API chính thức và AI API. Không dùng endpoint dịch không tài liệu hóa, cookie ChatGPT, hoặc SDK type trong domain.
- Key người dùng được gửi qua UI cấu hình tới backend đã xác thực bằng TLS; chỉ giữ secret reference/masked status phía client. Lưu key mã hóa hoặc session-only ở backend tùy quyết định vòng đời; không lưu plaintext trong browser storage, DB/log/artifact.
- API credential của dự án Google nằm phía server; ai sở hữu project/quota/billing phải được chốt trước live test/deploy.
- Provider endpoint allowlist, model config kiểm tra hợp lệ; không cho selection hoặc AI output điều khiển destination/tool.
- Cụm/câu dịch không lưu bền vững. Từ có POS/nghĩa/ví dụ lưu DB sau validation để reuse; Add riêng và idempotent.
- Phase 1 dùng PostgreSQL + job table bền vững; chưa cần Redis/pgvector/queue service mới.

## Những gì chưa được quyết định bởi ADR này

AI vendor/model, secret manager/encryption mechanism, auth provider, deployment host, permission UX cuối và kênh production tạo Quizlet. Enrichment đã chốt: Google dịch nghĩa + AI BYOK bổ sung POS/ví dụ cho từ; N do người dùng cấu hình, không mặc định. ADR-008 đã chấp nhận khảo sát UI automation Quizlet. Không thêm SDK/dịch vụ/migration production dựa riêng vào bản đề xuất.

## Bằng chứng trước chấp nhận kỹ thuật

P1-103 prototype và contract; P1-104 ownership/key write-only/redaction/migration/restart; fake provider contract/failure; real-provider labeled test theo cấu hình chủ dự án. Google dịch từ phải có AI enrichment được validate hoặc cache đầy đủ; thiếu AI key thì yêu cầu cấu hình, không điền placeholder. Google dịch cụm/câu không phụ thuộc AI key.
