# 👤 Chức Năng: Quản Lý Hồ Sơ Người Dùng (Profile)

## 1. Tổng Quan
User có thể xem và cập nhật thông tin cá nhân, bao gồm avatar.

## 2. Frontend

### 2.1 Page
- **File**: `pages/User/Profile/Profile.jsx`
- **Route**: `/profile`
- **Layout**: UserLayout

### 2.2 Component
- **UploadAvatar**: `components/UploadAvatar/UploadAvatar.jsx` - Upload ảnh đại diện

### 2.3 Services (`services/userService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `getUserProfileAPi()` | GET | `/profile` |
| `updateUserProfileApi(formData)` | POST | `/profile` |

## 3. Backend

### 3.1 Routes (`routers/user.js`) - Cần `authentication`
| Method | Path | Handler |
|---|---|---|
| GET | `/profile` | `getUserInfo` |
| POST | `/profile` | `updateProfile` |

### 3.2 Service (`services/user.service.js`)

**getUserInfo(user)**
- `User.findById(user.userId)` 
- Select: `_id, userName, phone, email, address, avatar, taxCode, invoiceInformation`

**updateProfile(payload, user)**
- `User.findByIdAndUpdate(user.userId, payload, { new: true })`
- Cho phép cập nhật bất kỳ field nào

### 3.3 Model - User Schema
```
userName, email, password, phone, address, avatar, taxCode
status: "active" | "inActive"
verification: Boolean
roles: ["ADMIN" | "PARTNER" | "USER"]
reviews: [ObjectId ref Review]
favorites: [ObjectId ref Post]
invoiceInformation: {
  invoiceName, invoiceEmail, companyName, companyTaxCode, address
}
```
