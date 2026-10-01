# Test cases — Module Quy Trình

| ID | Thao tác | Kết quả mong đợi |
| --- | --- | --- |
| TC-PROCESS-001 | Mở `/quy-trinh-may-dong-phuc-doanh-nghiep` | Trang Quy trình hiển thị thành công. |
| TC-PROCESS-002 | Kiểm tra phần quy trình | Hiển thị đủ 5 bước 01–05. |
| TC-PROCESS-003 | Chọn “Nhận báo giá miễn phí” ở trang Quy trình | Điều hướng đến `/bao-gia-dong-phuc-cong-ty`. |
| TC-PROCESS-004 | Mở `/bao-gia-dong-phuc-cong-ty` | Form hiển thị đủ các trường yêu cầu. |
| TC-PROCESS-005 | Gửi form trống | Hiển thị lỗi cho họ tên, số điện thoại và số lượng. |
| TC-PROCESS-006 | Nhập số điện thoại sai định dạng | Hiển thị lỗi số điện thoại cần có 10–11 chữ số. |
| TC-PROCESS-007 | Nhập email sai định dạng | Hiển thị lỗi email. |
| TC-PROCESS-008 | Gửi form hợp lệ | Chỉ hiển thị thành công khi `/api/quotes` trả `success: true`; lỗi API được hiển thị thay vì giả lập thành công. |
| TC-PROCESS-009 | Mở `/cach-thiet-ke-logo-ao-dong-phuc` | Hiển thị 6 nguyên tắc và CTA tư vấn. |
| TC-PROCESS-010 | Mở `/xu-huong-dong-phuc-2026` | Hiển thị 8 xu hướng và CTA tư vấn đồng phục. |
| TC-PROCESS-011 | Mở bất kỳ route module nào | Navigation “Quy Trình” được active và các CTA điều hướng đúng route Báo giá. |
| TC-PROCESS-012 | Kiểm tra 390×844 và 375×667 | Không có horizontal overflow; card/form chuyển một cột; CTA không tràn. |
| TC-PROCESS-013 | Kiểm tra 768×1024 | Layout tablet cân đối, nội dung vẫn đọc được. |
| TC-PROCESS-014 | Kiểm tra 1366×768 và 1920×1080 | Grid desktop và sticky mục lục/form hoạt động đúng. |
| TC-PROCESS-015 | Kiểm tra hình ảnh | Mọi nguồn ảnh dùng asset sẵn có trong `/public/images`, không có ảnh hỏng. |
