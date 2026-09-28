# Quy trình thực thi bằng AI

## Mục đích

Quy trình này chuyển roadmap thành các task coding nhỏ, có thể review bằng AI. Mục trong roadmap không tự nó là prompt triển khai. Mọi thay đổi code bắt đầu từ một gói công việc được tạo dựa trên tài liệu đã phê duyệt.

## Nguồn sự thật

Khi tài liệu mâu thuẫn, dùng thứ tự ưu tiên:

1. Quyết định rõ ràng của chủ sản phẩm được ghi trong ADR đã chấp nhận.
2. Yêu cầu bảo mật và quyền riêng tư.
3. Yêu cầu sản phẩm đã chấp nhận và bảng truy vết.
4. Kiến trúc hệ thống và invariant dữ liệu.
5. Kế hoạch phase và gói công việc đang hoạt động.
6. Mock fixture và ví dụ.
7. Code hiện có.

Agent không được âm thầm chọn giữa các nguồn mâu thuẫn. Phải ghi nhận xung đột và yêu cầu quyết định.

## Trạng thái gói công việc

```text
NHÁP -> SẴN_SÀNG -> ĐANG_LÀM -> ĐANG_REVIEW -> ĐÃ_XÁC_MINH -> HOÀN_TẤT
                         |               |
                         v               v
                       BỊ_CHẶN <---- CẦN_CHỈNH_SỬA
```

Chỉ gói `SẴN_SÀNG` mới được bắt đầu. Chỉ chủ sản phẩm hoặc người review được chỉ định mới chuyển gói sang `HOÀN_TẤT`.

## Nội dung bắt buộc của gói công việc

- ID ổn định và tiêu đề.
- Phase và module sở hữu.
- Động lực và giá trị người dùng.
- Phạm vi chính xác và phần ngoài phạm vi rõ ràng.
- Dependency và hợp đồng bị tác động.
- Tiêu chí nghiệm thu kèm ID yêu cầu.
- Kiểm thử tự động/thủ công/bảo mật bắt buộc.
- File hoặc module dự kiến, không áp đặt quá mức cách triển khai.
- Hành vi triển khai dần/cờ tính năng.
- Phần bằng chứng và báo cáo hoàn thành.

Dùng `docs/templates/work-package.md`.

## Vòng lặp triển khai của AI

### 1. Chuẩn bị

- Xác nhận gói ở trạng thái `SẴN_SÀNG`.
- Đọc `AGENTS.md`, trạng thái, gói công việc và các phần được liên kết về yêu cầu, kiến trúc, dữ liệu, bảo mật, kiểm thử.
- Kiểm tra code và test hiện có trước khi đề xuất thay đổi.
- Nhắc lại giả định và xác định tác động tới hợp đồng/schema.

### 2. Lập kế hoạch

- Tạo kế hoạch triển khai ngắn ánh xạ tới tiêu chí nghiệm thu.
- Xác định test trước khi viết code production.
- Nêu rõ nhu cầu ADR hoặc migration.
- Chia nhỏ nếu gói bao trùm hơn một mối quan tâm có thể phát hành độc lập.

### 3. Triển khai

- Thực hiện thay đổi nhất quán nhỏ nhất.
- Giữ đúng ranh giới module.
- Thêm test cùng với hành vi.
- Dùng fake tại ranh giới provider bên ngoài.
- Tránh abstraction suy đoán và code cho phase tương lai.

### 4. Xác minh

- Chạy bộ test hẹp trước, sau đó tới cổng module và repository.
- Chạy kiểm tra migration/hợp đồng/kiến trúc khi có tác động.
- Thực hiện kiểm tra visual/thủ công khi bắt buộc.
- So sánh kết quả từng dòng với tiêu chí nghiệm thu.

### 5. Báo cáo

- Điền bằng chứng test và báo cáo hoàn thành.
- Liệt kê giới hạn và trường hợp hoãn.
- Chỉ cập nhật truy vết khi có bằng chứng.
- Chuyển sang `ĐANG_REVIEW`; không tự phê duyệt quyết định sản phẩm.

## Gói ngữ cảnh cho mỗi phiên coding bằng AI

Giữ prompt có giới hạn. Cung cấp:

```text
Repository: EnglishBot
Phase đang hoạt động: <phase>
Gói công việc: <đường dẫn và ID>
Mục tiêu: <một câu>
Trong phạm vi: <gạch đầu dòng>
Ngoài phạm vi: <gạch đầu dòng>
Tiêu chí nghiệm thu: <ID và nội dung>
Test bắt buộc: <lệnh/loại>
Quyết định liên quan: <liên kết ADR>
Hợp đồng/schema liên quan: <liên kết>
Đầu ra khi hoàn tất: file thay đổi, kết quả test, rủi ro, giới hạn
```

Không dán toàn bộ roadmap vào mọi prompt coding. Liên kết file có thẩm quyền và chỉ đưa đoạn liên quan tới task.

## Giới hạn kích thước thay đổi

Chia công việc khi một gói có thể:

- Thay đổi nhiều hơn một domain aggregate và một UI flow cùng lúc.
- Đồng thời thêm database migration, tích hợp bên ngoài và tính năng UI lớn.
- Yêu cầu nhiều hơn một dependency bên ngoài mới.
- Có hơn khoảng 8–12 tiêu chí nghiệm thu độc lập.
- Tạo diff quá lớn để người review hiểu trong một phiên tập trung.

Diff lớn do AI tạo là tín hiệu rủi ro, không phải bằng chứng tiến độ.

## Quy tắc thực thi song song

Được phép song song:

- UI component độc lập dùng hợp đồng mock đã khóa.
- Chuẩn bị tài liệu và test fixture không sửa cùng source file.
- Module riêng có public interface đã duyệt.

Chỉ được tuần tự:

- Schema và repository của cùng aggregate.
- Sinh hợp đồng API và consumer của hợp đồng chưa ổn định.
- Design token và UI component dùng chung đang được task UI khác sử dụng.
- Hạ tầng xác thực/bảo mật.
- Chuỗi migration.

Tối đa hai gói hoạt động trừ khi kế hoạch phase tăng giới hạn rõ ràng.

## Kiểm soát lỗi đặc thù AI

- Xác minh mọi API thư viện theo dependency đã khóa; không bịa method.
- Không “sửa” test bằng cách làm yếu assertion dự kiến nếu chưa được duyệt.
- Không xóa test lỗi để build xanh.
- Không tạo hành vi bảo mật placeholder trên đường production.
- Không tuyên bố đã chạy lệnh/test nếu không ghi lại kết quả.
- Migration, regex, kiểm tra phân quyền và code đồng thời do model tạo thuộc vùng review cao.
- Dùng clock, ID và provider fake xác định trong test.
- Thêm regression test cho mọi lỗi được chấp nhận.

## Cấp độ review

| Cấp      | Ví dụ                                                           | Review bắt buộc                                   |
| -------- | --------------------------------------------------------------- | ------------------------------------------------- |
| Chuẩn    | Nội dung UI, hàm thuần cô lập                                   | Test + code review thường                         |
| Nâng cao | Hợp đồng API, interface module, logic retrieval/prompt          | Review chủ dự án/senior + integration test        |
| Cao      | Auth, phân quyền, secret, migration, xóa dữ liệu, hành động MCP | Threat review + test âm + chủ dự án duyệt rõ ràng |

## Kết thúc phase

Cuối mỗi phase:

1. Chạy cổng phase trong `docs/06-testing-strategy.md`.
2. Đối soát yêu cầu, gói công việc và bằng chứng test.
3. Ghi nhận phần chưa hoàn tất và lý do.
4. Cập nhật rủi ro, quyết định và `docs/status/STATUS.md`.
5. Chỉ tạo gói `SẴN_SÀNG` của phase tiếp theo sau khi được phê duyệt.
