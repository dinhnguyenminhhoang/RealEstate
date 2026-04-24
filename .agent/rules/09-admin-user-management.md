# 👥 Chức Năng: Admin Quản Lý Người Dùng

## 1. Tổng Quan
Admin có thể xem danh sách, tạo mới, chỉnh sửa và xóa (vô hiệu hóa) người dùng.

## 2. Frontend

### 2.1 Page
- **File**: `pages/Admin/ManageUser/ManageUser.jsx`
- **Route**: `/admin/users`
- **Layout**: AdminLayout

### 2.2 Form Component
- **File**: `components/FormManage/UserForm/UserForm.jsx`
- Form tạo/chỉnh sửa user

### 2.3 Services (`services/userService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `getAllUserApi({ page, limit, filters })` | GET | `/user` |
| `createNewUserApi(formData)` | POST | `/user` |
| `adminUpdateUserApi(userId, formData)` | PUT | `/user/:userId` |
| `deleteUserApi(userId)` | DELETE | `/user/:userId` |

## 3. Backend

### 3.1 Routes (`routers/user.js`) - Cần `adminAuthentication`
| Method | Path | Handler |
|---|---|---|
| GET | `/user` | `getAllUser` |
| POST | `/user` | `createUser` |
| PUT | `/user/:userId` | `updateUser` |
| DELETE | `/user/:userId` | `deleteUser` |

### 3.2 Service (`services/user.service.js`)

**getAllUser({ limit, page, filters, options })**
- Default filter: `{ status: "active" }`
- Projection: `email, userName, roles, phone, status, createdAt`
- Sử dụng `paginate()` utility

**createUser({ userName, email, phone, password, roles, address })**
- Check email trùng → Hash password → Create user

**updateUser(userId, payload)**
- `findByIdAndUpdate(userId, payload)`

**deleteUser(userId)**
- Soft delete: Set `status: "inActive"`
