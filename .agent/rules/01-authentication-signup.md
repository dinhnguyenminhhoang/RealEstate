# 🔐 Chức Năng: Đăng Ký Tài Khoản (Sign Up)

## 1. Tổng Quan
Cho phép người dùng mới tạo tài khoản trên hệ thống. Sau khi đăng ký, hệ thống gửi email xác thực tài khoản.

## 2. Flow Chi Tiết

```
[User] → Nhập form đăng ký → [Frontend] → POST /v1/api/register → [Backend]
→ Kiểm tra email trùng → Hash password → Tạo User → Tạo KeyToken
→ Tạo JWT (type: confirm) → Gửi email xác thực → Trả về response
```

## 3. Frontend

### 3.1 Page Component
- **File**: `frontend/src/pages/Auth/SignUp/SignUp.jsx`
- **Route**: `/signup`
- **UI**: Form đăng ký sử dụng Ant Design

### 3.2 Service Layer
- **File**: `frontend/src/services/authService.js`
- **Function**: `signupApi(formData)`
- **Endpoint**: `POST /register`
- **Payload**:
```json
{
  "userName": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "address": "string",
  "taxCode": "string"
}
```

### 3.3 Hook
- **File**: `frontend/src/hooks/useAuthForm.js`
- **Function**: `handleSignUp(values)`
- **Logic**:
  1. Gọi `signupApi(values)`
  2. Nếu `response.status === 201` → thông báo thành công
  3. Nếu lỗi → hiển thị thông báo lỗi

### 3.4 Notification
- **File**: `frontend/src/hooks/useNotification.js`
- Sử dụng `antd notification` để hiển thị kết quả

## 4. Backend

### 4.1 Router
- **File**: `server/src/routers/access.js`
- **Route**: `POST /register`
- **Middleware**: Không cần authentication
- **Handler**: `asynchandler(accessController.singUp)`

### 4.2 Controller
- **File**: `server/src/controller/access.controller.js`
- **Method**: `singUp(req, res, next)`
- **Response**: `CREATED` (status 201)

### 4.3 Service
- **File**: `server/src/services/access.service.js`
- **Method**: `AccessService.singUp({ userName, email, phone, password, address, taxCode })`
- **Logic chi tiết**:
  1. Kiểm tra email đã tồn tại → throw `badRequestError` nếu trùng
  2. Hash password bằng `bcrypt` (salt rounds: 10)
  3. Tạo User với `roles: ["USER"]`, `status: "active"`
  4. Tạo random key 64 bytes (hex)
  5. Tạo JWT token pair với payload: `{ userId, email, userName, phone, type: "confirm" }`, expiry: 5 days
  6. Lưu KeyToken vào database
  7. Tạo link xác thực: `{BASE_URL_CLIENT}/confirm-account/{accessToken}`
  8. Gửi email xác thực bằng `nodemailer`

### 4.4 Model
- **File**: `server/src/models/user.model.js`
- **Trường liên quan**:
  - `userName` (String, max 150)
  - `email` (String, unique)
  - `password` (String, required, đã hash)
  - `phone` (String, required)
  - `address` (String, required)
  - `roles` (["USER" | "ADMIN" | "PARTNER"], default: ["USER"])
  - `status` ("active" | "inActive", default: "active")
  - `verification` (Boolean, default: false)
  - `taxCode` (String)

### 4.5 Email Template
- **File**: `server/src/utils/emailExtension.js`
- **Function**: `confirmAccountForm(confirmAccountLink)`
- Tạo HTML email với link xác thực

### 4.6 Email Sender
- **File**: `server/src/helpers/sendEmail.js`
- Sử dụng Gmail SMTP qua `nodemailer`
- Cấu hình: `YOUREMAIL`, `YOURAPPLICATIONPASSWORD` từ `.env`

## 5. Error Cases
| Lỗi | Status Code | Message |
|---|---|---|
| Email đã tồn tại | 400 | "error user already rigisted" |
| Thiếu trường bắt buộc | 400 | Validation error từ Mongoose |
| Gửi email thất bại | 500 | "Gửi email thất bại: ..." |

## 6. Response Format
```json
// Success (201)
{
  "message": "Register OK!",
  "status": 201,
  "data": {
    "data": null
  }
}
```
