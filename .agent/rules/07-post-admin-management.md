# 🛡️ Chức Năng: Admin Quản Lý Bài Đăng

## 1. Tổng Quan
Admin có thể duyệt, hủy duyệt và xóa bài đăng BĐS.

## 2. Frontend

### 2.1 Page
- **File**: `pages/Admin/ManagePost/ManagePost.jsx`
- **Route**: `/admin/posts`
- **Layout**: AdminLayout (cần admin authentication)

### 2.2 Services (`services/postService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `confirmPostApi(id)` | PUT | `/confirm-post/:id` |
| `unPublishPostApi(id)` | PUT | `/unPublish-post/:id` |
| `deletePostApi(id)` | DELETE | `/post/:id` |

## 3. Backend

### 3.1 Routes (`routers/post.js`) - Cần `adminAuthentication`
| Method | Path | Handler |
|---|---|---|
| PUT | `/confirm-post/:id` | `confirmPost` |
| PUT | `/unPublish-post/:id` | `unPublishPost` |
| DELETE | `/post/:id` | `deletePost` |

### 3.2 Admin Authentication Middleware
- **File**: `auth/authUtils.js` → `adminAuthentication`
- Giống `authentication` nhưng thêm check: `decodeUser.role.includes("ADMIN")`
- Throw `NotFoundError("Not found")` nếu không phải admin

### 3.3 Service

**confirmPost(id)**: Toggle `verification` (true ↔ false)
**unPublishPost(id)**: Set `verification: false`
**deletePost(id)**: Soft delete → Set `isDelete: "inActive"`
