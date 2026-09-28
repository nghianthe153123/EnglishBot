# ADR-004: Import/export Quizlet trước đồng bộ trực tiếp

- Trạng thái: Chấp nhận
- Ngày: 2026-09-28

## Bối cảnh

Sản phẩm cần khả năng tương tác với Quizlet, nhưng đồng bộ trực tiếp không được phụ thuộc vào endpoint không tài liệu hóa, cookie trình duyệt hoặc UI automation dễ vỡ.

## Quyết định

- Beta hỗ trợ văn bản import/export tương thích Quizlet có preview và xác nhận của người dùng.
- EnglishBot ghi export batch nhưng không khẳng định đã xuất bản nếu chưa có xác nhận.
- Direct sync bị tắt cho đến khi một tích hợp chính thức được hỗ trợ được xác minh và duyệt qua ADR mới.
- Mastery học tập nội bộ do EnglishBot sở hữu thay vì suy ra từ hoạt động Quizlet không khả dụng.

## Hệ quả

- Critical path ổn định và tôn trọng chính sách.
- Người dùng thực hiện một bước import thủ công nhỏ.
- Provider adapter và bảng sync job vẫn sẵn sàng cho tích hợp được duyệt trong tương lai.
