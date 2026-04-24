# 🔒 Kiến Trúc: Authentication & Authorization System

## 1. JWT Token Flow

### Token Creation (`auth/authUtils.js`)
```js
createTokenPair(payload, key) → JWT.sign(payload, key, { expiresIn: "5 days" })
→ { accessToken }
```

### Token Storage
- **Backend**: `KeyToken` model → `{ user: ObjectId, key: String }`
- **Frontend**: Cookie → `token` (accessToken) + `userId`

## 2. Authentication Middleware

### `authentication` (User)
1. Lấy `x-client-id` từ header → userId
2. Tìm `keyStore` trong DB theo userId
3. Lấy `Authorization: Bearer {token}` từ header
4. `JWT.verify(accessToken, keyStore.key)`
5. Check `userId` match
6. Set `req.user = { userId, email, userName, phone, role }`
7. Set `req.keyStore = keyStore`

### `adminAuthentication` (Admin)
- Tương tự `authentication` + thêm: `decodeUser.role.includes("ADMIN")`

## 3. Frontend Auth Flow

### AuthContext (`context/AuthContext.jsx`)
**State**: `user`, `role`, `loading`

**Functions**:
- `login(email, password)` → Call API → Save cookie → Set state
- `logout()` → Remove cookie → Clear state
- `checkToken()` → Validate token expiry
- `checkRole(accessToken)` → Decode JWT → Set role
- `validateAndFetchUser()` → Auto-login on mount

**Provider values**:
```js
{ user, role, loading, login, logout, checkToken, 
  getUserProfile, isAuthenticated, checkRole }
```

### ProtectedRoute
```jsx
// Exists but NOT used in App.jsx
<ProtectedRoute>{children}</ProtectedRoute>
// Redirects to /signin if !isAuthenticated
```

### Axios Interceptor (`config/instance.js`)
- Request: Auto-attach `Authorization` + `x-client-id` headers
- Response: Unwrap `response.data`

## 4. Header Protocol
| Header | Value | Purpose |
|---|---|---|
| `x-client-id` | userId | Identify user |
| `Authorization` | `Bearer {accessToken}` | JWT token |
