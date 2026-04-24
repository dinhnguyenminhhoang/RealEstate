# 🐛 Known Issues & Security Notes

## 1. Lỗi Bảo Mật

### 1.1 Category Routes thiếu Auth
- **File**: `routers/category.js`
- POST/PUT/DELETE category không có `adminAuthentication`
- Bất kỳ ai cũng có thể tạo/sửa/xóa danh mục

### 1.2 ProtectedRoute không được sử dụng
- `AuthContext.jsx` export `ProtectedRoute` component
- Nhưng `App.jsx` không wrap UserLayout/AdminLayout với ProtectedRoute
- User chưa đăng nhập vẫn truy cập được routes `/user/*` và `/admin/*`

### 1.3 Report update thiếu Admin check
- `PUT /report/status/:reportId` chỉ yêu cầu `authentication`, không phải `adminAuthentication`
- Bất kỳ user nào cũng có thể update status báo cáo

## 2. Lỗi Code

### 2.1 userDeleteYourPost - Bug logic
- **File**: `services/post.service.js`
- Dùng `findByIdAndDelete` (hard delete) nhưng truyền param `{ isDelete: "inActive" }` 
- Nên dùng `findOneAndUpdate` cho soft delete

### 2.2 Dead code trong authUtils.js
```js
const a = []; // Dòng 69-70: Dead code
a.includes;
```

### 2.3 Favorite controller hardcode pagination
- **File**: `controller/user.controller.js` line 47-51
- `limit: 10, page: 1` hardcode, không lấy từ `req.query`

### 2.4 News model duplicate field
- **File**: `models/news.model.js`
- `title` field khai báo 2 lần (dòng 9 và 24)

### 2.5 Application router đường dẫn sai
- `GET /` và `GET /post/:postId` thiếu prefix `/applications`
- Chỉ `POST /applications` và `GET /applications/my-applications` có prefix đúng

## 3. Naming Inconsistencies
| Vấn đề | Vị trí |
|---|---|
| `ConfirmAccoount` (typo) | pages/Auth/ConfirmAccoount/ |
| `application.modal.js` (nên là .model.js) | models/ |
| `singUp` (nên là signUp) | access.service.js |
| `AdminSiderbar` (nên là Sidebar) | layouts/ |
| `seclect` (nên là select) | user.repo.js |
| `CONECTSTRING` (nên là CONNECTSTRING) | .env |
| `hodelUser` (nên là existingUser) | access.service.js |

## 4. Performance Notes
- `fetchProvinces()` gọi external API mỗi lần render Home
- Không có caching cho danh mục/tỉnh thành
- Không có rate limiting trên API
- Không có image optimization/resize khi upload
