# IA Phase 1 — Selection, options và queue

- Trạng thái: phạm vi P1-R01 và cấu trúc UX P1-101 đã được owner duyệt ngày 2026-10-01 tại [hồ sơ review](p1-101-owner-review.md). Không phải hợp đồng API/schema đã khóa.
- Cơ sở: P1-J1…P1-J4, P1-TR-01…05, P1-WD-01…03, P1-QZ-01…04, P1-UI-01, P1-SEC-01…03.
- Thị giác tham chiếu: [Wirefigma Design System](reference/WIREFIGMA_DESIGN_SYSTEM.md) và sample cùng thư mục.

## Mục tiêu

Extension có ba vùng chức năng nhỏ: action trên selection, popup kết quả gần con trỏ, và options/queue. Không có điều hướng sản phẩm kiểu side panel ba tab. Mọi request translation bắt đầu sau click **Dịch**. Translation result trong DB và trạng thái **Add** vào queue là hai khái niệm tách biệt.

## Cây thông tin

```text
Extension
├── Vùng quản lý mở từ icon extension (không phải side panel/dashboard)
│   ├── Bật/tắt trên tab này và giải thích quyền
│   ├── Ghi nhớ website này: tùy chọn, không bật sẵn
│   ├── Queue nhỏ và trạng thái batch
│   └── Mở Options
├── Trên trang đã được cấp quyền
│   └── Selection → action local [Dịch]
│       └── Popup pointer
│           ├── Translation result/loading/error
│           ├── Rich word: term, POS, nghĩa, ví dụ
│           └── Add riêng cho từ → queue
├── Options
│   ├── Provider đã chọn: Google API | AI BYOK
│   ├── Cấu hình cần thiết, trạng thái lưu/lỗi
│   └── Giải thích/cấp quyền content script
└── Queue nhỏ
    ├── Số mục hợp lệ đã Add / N người dùng cấu hình (nếu chưa có: cần cấu hình)
    ├── Batch text import đã tạo
    └── Quizlet: creating / verified / reconciling / unavailable / unknown
```

## Thứ bậc thông tin

| Surface               | Chính                                     | Phụ                                                            |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| Selection action      | Nút **Dịch** và selection hiện tại        | Đóng/bỏ qua; không gọi mạng.                                   |
| Popup word            | Term, POS, nghĩa, ví dụ                   | Nút **Add**, trạng thái lưu/cache, lỗi và retry.               |
| Popup phrase/sentence | Selection và bản dịch nghĩa               | Đóng/retry; không Add, POS, example hay enrichment.            |
| Options               | Provider đang chọn và thiết lập tương ứng | Quyền, trạng thái cấu hình, lỗi/recovery.                      |
| Queue                 | Số từ đã Add hợp lệ và ngưỡng N           | Trạng thái batch/set và hành động retry/reconcile khi phù hợp. |

## Luồng và invariants

- Selection action local không đọc/sends content khác selection và không phát request.
- Sau **Dịch**, popup mở ngay ở loading và request dùng provider người dùng đã chọn. Không tự chuyển provider khi lỗi.
- Cả từ và cụm/câu đều dịch bằng provider đã chọn. Với từ khi chọn Google, Google dịch nghĩa và AI BYOK bổ sung POS/câu ví dụ; UI nêu rõ hai provider và AI key chỉ cần khi enrichment thiếu cache. Cụm/câu khi chọn Google dùng Google, không cần AI enrichment; khi chọn AI thì dùng AI. Cache đầy đủ được tái sử dụng không gọi provider.
- Word result chỉ được cache/reuse sau validate, khóa theo ngôn ngữ/provider/sense với provenance/version.
- Add riêng, idempotent, chỉ nhận rich word hợp lệ; cụm/câu không vào queue.
- Người dùng cấu hình N, không có mặc định. Nếu chưa cấu hình, UI yêu cầu thiết lập và không tạo batch. N đếm các từ duy nhất, hợp lệ, đã Add, chưa gán batch.
- Batch là text `term<TAB>definition`, một card mỗi dòng; kiểm tra delimiter trước gửi.
- Tự tạo Quizlet là tiêu chí; trạng thái thành công đòi evidence set. Production channel cần feasibility proof. Owner cho phép khảo sát browser automation trong browser đã đăng nhập nếu kênh chính thức không dùng được; đây chưa phải bằng chứng PoC. Export thủ công không đạt tiêu chí hiện tại.

## Privacy và quyền

Giải thích quyền content script trước lúc bắt đầu detect selection. Owner đã chọn bật tab hiện tại với tùy chọn ghi nhớ quyền từng website (D-P1-11). `activeTab` không tự được cấp do bôi đen. Chỉ gửi selection tối thiểu sau click. BYOK qua backend; client không lưu secret. Không crawl trang, truy cập cookie/session hoặc tạo MCP share. Cấu trúc vùng quản lý đã được duyệt ở mức UX, không mở dashboard/route mới; [quyền và layout](p1-101-permissions-and-layout.md) sở hữu hành vi chi tiết.

## Những gì không thuộc cây IA hiện hành

Side panel Chat/Từ vựng/Bài học; dashboard routes; MCP integration; library/lesson/mastery; capture/source management. Chúng được ghi trong các tài liệu lịch sử/hoãn, không phải dependency mở gói Phase 1.
