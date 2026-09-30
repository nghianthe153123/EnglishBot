# P1-002: Thiết kế IA, extension và selection popup (lịch sử)

- Trạng thái lịch sử: ĐANG_LÀM theo baseline cũ; chưa có owner gate B.
- Phase: 1 cũ
- Module/bề mặt sở hữu: extension UX
- Mức rủi ro: Nâng cao
- Phụ thuộc: P1-001, gate A cũ
- ID yêu cầu: J1, J2, CAP-01..03, CHAT-01..04, SEL-01..05, D-102, D-110..112, PRIV-01..03, NFR-08..09

## Trạng thái đường cơ sở

Gói giữ ID, trạng thái và quyết định owner lịch sử. Đường cơ sở đã bị P1-R01 thay thế ngày 2026-09-30. Side panel ba tab, capture/chat/citation, TTS, word family, v.v. không thuộc phạm vi hiện hành.

Các quyết định owner lịch sử: `RESOLVED-P1-002-01` (tab Từ vựng cũ chỉ mục trang hiện tại); `RESOLVED-P1-002-02` (single word cũ có ví dụ AI/các dạng từ và multiword dịch); `DEFERRED-P1-002-03` (nguồn ví dụ/lưu trữ chưa chốt). Giữ nguyên ý nghĩa lịch sử, không áp đặt lên yêu cầu mới.

## Trạng thái thay thế

UX hiện hành theo Wirefigma và chỉ popup/options/queue cần thiết thuộc [P1-101](P1-101-scope-wirefigma-ux.md). Luồng browser permission/selection tiếp tục ở P1-105. Không coi mockup cũ là đường cơ sở hoặc bằng chứng.
