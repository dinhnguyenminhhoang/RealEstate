# 🔑 Chức Năng: Đăng Nhập (Sign In)

## 1. Tổng Quan
Cho phép người dùng đã có tài khoản đăng nhập vào hệ thống. Trả về JWT token và thông tin user.

## 2. Flow Chi Tiết

```
[User] → Nhập email/password → [Frontend] → POST /v1/api/login → [Backend]
→ Tìm user theo email → Kiểm tra status → So sánh password (bcrypt)
→ Tạo JWT token → Lưu KeyToken → Trả về { user, tokens }
→ [Frontend] → Lưu token + userId vào Cookie → Set user state → Redirect
```

## 3. Frontend

### 3.1 Page Component
- **File**: `frontend/src/pages/Auth/SignIn/SignIn.jsx`
- **Route**: `/signin`
- **UI**: Form đăng nhập sử dụng Ant Design

### 3.2 Service Layer
- **File**: `frontend/src/services/authService.js`
- **Function**: `signinApi(formData)`
- **Endpoint**: `POST /login`
- **Payload**:
```json
{
  "email": "string",
  "password": "string"
}
```

### 3.3 Context (State Management)
- **File**: `frontend/src/context/AuthContext.jsx`
- **Function**: `login(email, password)`
- **Logic chi tiết**:
  1. Gọi `signinApi({ email, password })`
  2. Nếu `response.status === 200`:
     - Lưu `tokens.accessToken` vào Cookie key `"token"`
     - Lưu `user._id` vào Cookie key `"userId"`
     - Set `user` state
     - Hiển thị notification thành công
     - Decode JWT để lấy `role` → return role
  3. Nếu lỗi → hiển thị notification lỗi

### 3.4 Hook
- **File**: `frontend/src/hooks/useAuthForm.js`
- **Function**: `handleSignIn(values)`
- Gọi `login()` từ AuthContext

### 3.5 Token Management
- **File**: `frontend/src/context/AuthContext.jsx`
- `isTokenExpired(token)`: Decode JWT, check `exp * 1000 < Date.now()`
- `getTokenAndUserId()`: Lấy token + userId từ Cookie
- `checkToken()`: Validate token còn hạn
- `checkRole(accessToken)`: Decode JWT lấy role

### 3.6 Axios Interceptor
- **File**: `frontend/src/config/instance.js`
- Request interceptor: Tự động gắn `Authorization: Bearer {token}` + `x-client-id: {userId}` vào header
- Response interceptor: Trả `response.data` (unwrap)

## 4. Backend

### 4.1 Router
- **File**: `server/src/routers/access.js`
- **Route**: `POST /login`
- **Middleware**: Không cần authentication
- **Handler**: `asynchandler(accessController.login)`

### 4.2 Controller
- **File**: `server/src/controller/access.controller.js`
- **Method**: `login(req, res, next)`
- **Response**: `SuccessResponse` (status 200)

### 4.3 Service
- **File**: `server/src/services/access.service.js`
- **Method**: `AccessService.login({ email, password })`
- **Logic chi tiết**:
  1. `findByEmail({ email })` → tìm user (select: email, password, status, roles, userName, phone)
  2. Kiểm tra `foundUser` tồn tại → throw `NotFoundError` nếu không tìm thấy
  3. Kiểm tra `status !== "active"` → throw `badRequestError("Tài khoản bị khóa")`
  4. `bcrypt.compare(password, foundUser.password)` → throw `AuthFailureError` nếu sai
  5. Tạo random key 64 bytes
  6. Tạo JWT: `{ userId, email, userName, phone, role: roles }`, expiry: 5 days
  7. `KeyTokenService.createKeyToken({ userId, key })` → upsert
  8. Return `{ user: { _id, userName, email, phone }, tokens: { accessToken } }`

### 4.4 Repository
- **File**: `server/src/models/repo/user.repo.js`
- **Function**: `findByEmail({ email, seclect })`
- Select mặc định: `email, password, status, roles, userName, phone`

### 4.5 KeyToken Service
- **File**: `server/src/services/keyToken.service.js`
- `createKeyToken({ userId, key })`: Upsert key vào collection Keys
- `findByUserId(userId)`: Tìm key theo userId
- `removeKeyById(id)`: Xóa key

## 5. Authentication Middleware
- **File**: `server/src/auth/authUtils.js`
- **Headers cần thiết**:
  - `x-client-id`: userId
  - `Authorization`: `Bearer {accessToken}`
- **Logic**:
  1. Lấy `userId` từ header `x-client-id`
  2. Tìm `keyStore` theo `userId`
  3. Verify JWT bằng `keyStore.key`
  4. Check `userId` trong token == header
  5. Set `req.user = decodeUser`, `req.keyStore = keyStore`

## 6. Auto Login (Frontend)
- **File**: `frontend/src/context/AuthContext.jsx`
- **Function**: `validateAndFetchUser()`
- Chạy trong `useEffect` khi app mount:
  1. Lấy token + userId từ Cookie
  2. Kiểm tra token hết hạn → logout nếu expired
  3. Gọi `getUserProfileAPi()` để lấy user info
  4. Set user state

## 7. Error Cases
| Lỗi | Status Code | Message |
|---|---|---|
| User không tồn tại | 404 | "user not registered" |
| Tài khoản bị khóa | 400 | "Tài khoản bị khóa" |
| Sai mật khẩu | 401 | "Authentication Error" |

## 8. Response Format
```json
// Success (200)
{
  "status": 200,
  "data": {
    "user": {
      "_id": "...",
      "userName": "...",
      "email": "...",
      "phone": "..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```
