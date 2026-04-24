# 📝 Chức Năng: Tạo Bài Đăng BĐS (User Create Post)

## 1. Tổng Quan
User đăng nhập có thể tạo bài đăng bất động sản mới (bán hoặc cho thuê).

## 2. Frontend

### 2.1 Page
- **File**: `pages/User/CreateOrUpdatePost/CreateOrUpdatePost.jsx`
- **Route**: `/user/action-post`
- **Layout**: UserLayout (cần authentication)

### 2.2 Component
- **File**: `components/CreatePostForm/CreatePostForm.jsx`
- Form tạo/chỉnh sửa bài đăng với các trường: title, address, category, description (rich text), overview, price, acreage, type (RENT/SELL), images

### 2.3 Service
- **File**: `services/postService.js`
- `userCreatePostAPi(formData)` → `POST /user-post`
- Payload:
```json
{
  "title": "string",
  "address": "string",
  "category": "ObjectId",
  "description": "string (HTML)",
  "overview": "string",
  "price": "number",
  "acreage": "number",
  "type": "RENT | SELL",
  "images": [{ "filename": "string", "path": "string" }]
}
```

## 3. Backend

### 3.1 Router
- **File**: `routers/post.js`
- `POST /user-post` → authentication middleware → `postController.userCreateNewPost`

### 3.2 Controller
- `postController.userCreateNewPost(req, res)` → Lấy userId từ `req.user.userId`

### 3.3 Service
- **File**: `services/post.service.js`
- `PostService.userCreateNewPost(data, userId)`
- Validate: title, address, description, price required
- Create Post document với `author: userId`

### 3.4 Model - Post
- **File**: `models/post.model.js`
- Schema:
  - `title` (String, 3-200 chars, required)
  - `description` (String, required) - nội dung HTML
  - `overview` (String)
  - `type` ("RENT" | "SELL", default: "RENT")
  - `images` ([{ filename, path }])
  - `price` (Number, >= 0, required)
  - `address` (String, required)
  - `acreage` (Number)
  - `category` (ObjectId ref Category)
  - `author` (ObjectId ref User)
  - `status` ("in-stock" | "out-of-stock")
  - `verification` (Boolean, default: false) - admin duyệt
  - `views` (Number, default: 0)
  - `favorites` (Number, default: 0)
  - `isDelete` ("active" | "inActive")
  - `createdAt`, `updatedAt` (timestamps)
