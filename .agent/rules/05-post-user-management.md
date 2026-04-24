# 📋 Chức Năng: Quản Lý Bài Đăng Của User

## 1. Tổng Quan
User có thể xem danh sách, chỉnh sửa, xóa bài đăng của mình.

## 2. Frontend

### 2.1 Pages
- **Danh sách**: `pages/User/ManagePost/ManagePost.jsx` → Route `/user/manage-post`
- **Chỉnh sửa**: `pages/User/CreateOrUpdatePost/CreateOrUpdatePost.jsx` → Route `/user/action-post`

### 2.2 Services (`services/postService.js`)
| Function | HTTP | Endpoint | Mô tả |
|---|---|---|---|
| `userGetAllPostAPi()` | GET | `/user-post` | Lấy tất cả bài đăng của user |
| `userGetYourDetailPost(id)` | GET | `/user-post/:id` | Xem chi tiết bài đăng |
| `userUpdatePostApi(formData, id)` | PUT | `/user-post/:id` | Cập nhật bài đăng |
| `userDeletePostApi(id)` | DELETE | `/user-post/:id` | Xóa bài đăng |

## 3. Backend

### 3.1 Routes (`routers/post.js`) - Tất cả cần `authentication` middleware
| Method | Path | Handler |
|---|---|---|
| GET | `/user-post` | `getAllPostByUser` |
| GET | `/user-post/:id` | `userGetYourPost` |
| PUT | `/user-post/:id` | `userUpdateYourPost` |
| DELETE | `/user-post/:id` | `userDeleteYourPost` |

### 3.2 Service (`services/post.service.js`)

**getAllPostByUser(query, user)**
- Filter: `{ isDelete: "active", author: user.userId }`
- Populate: `["category"]`
- Sử dụng `paginate()` utility

**userGetYourPost(user, id)**
- Tìm post theo `{ _id: id, author: user.userId }`
- Throw NotFoundError nếu không tìm thấy

**userUpdateYourPost(payload, user, id)**
- Verify ownership: `{ _id: id, author: user.userId }`
- `findOneAndUpdate` với `{ new: true }`

**userDeleteYourPost(user, id)**
- Verify ownership
- `findByIdAndDelete` (hard delete - lưu ý: code có bug, truyền `isDelete: "inActive"` nhưng dùng `findByIdAndDelete`)
