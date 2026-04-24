# 🔄 Chức Năng: Quên Mật Khẩu & Reset Mật Khẩu

## 1. Tổng Quan
Cho phép người dùng khôi phục mật khẩu qua email. Route FE đang bị comment out trong App.jsx.

## 2. Frontend
- **Service**: `authService.js` → `forgotPasswordApi({ email })` → `POST /forgot-password`
- **Service**: `authService.js` → `resetPasswordApi({ password })` → `POST /reset-password`
- **Page**: `ConfirmAccoount.jsx` → Route `/confirm-account/:token`

## 3. Backend

### Forgot Password
- **Router**: `POST /forgot-password` (không cần auth)
- **Service**: `AccessService.forgotPassword({ email })`
  1. Tìm user → Tạo JWT type "resetPassword" → Lưu KeyToken → Gửi email reset link

### Reset Password
- **Router**: `POST /reset-password` (cần authentication middleware)
- **Service**: `AccessService.resetPassword(payload, user, keyStore)`
  1. Hash password mới → Update user → Xóa KeyToken

### Confirm Account
- **Router**: `POST /confirm-account` (cần authentication middleware)
- **Service**: `AccessService.confirmAccount(user, keyStore)`
  1. Set `verification: true` → Xóa KeyToken

## 4. Email
- **Template**: `emailExtension.js` → `resetPasswordForm(link)`, `confirmAccountForm(link)`
- **Sender**: `sendEmail.js` → Gmail SMTP qua nodemailer
