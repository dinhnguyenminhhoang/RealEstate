# 📧 Chức Năng: Email System

## 1. Tổng Quan
Hệ thống gửi email tự động sử dụng Gmail SMTP qua nodemailer.

## 2. Cấu Hình (`helpers/sendEmail.js`)
```js
transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: YOUREMAIL, pass: YOURAPPLICATIONPASSWORD }
})
```

## 3. Email Templates (`utils/emailExtension.js`)

### confirmAccountForm(link)
- **Khi nào**: Sau đăng ký
- **Nội dung**: Link xác thực tài khoản

### resetPasswordForm(link)
- **Khi nào**: Khi yêu cầu quên mật khẩu
- **Nội dung**: Link đặt lại mật khẩu

### applicationEmailForm (imported but usage varies)
- **Khi nào**: Khi có đơn ứng tuyển mới
- **Nội dung**: Thông báo cho chủ bài đăng

### replyReportEmailForm (imported in report.service)
- **Khi nào**: Khi admin phản hồi báo cáo
- **Nội dung**: Thông báo kết quả xử lý

## 4. Environment Variables
```
YOUREMAIL=example@gmail.com
YOURAPPLICATIONPASSWORD=xxxx xxxx xxxx xxxx  # Gmail App Password
```
