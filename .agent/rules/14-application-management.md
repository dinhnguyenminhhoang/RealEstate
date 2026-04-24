# 📨 Chức Năng: Đơn Ứng Tuyển / Liên Hệ (Application)

## 1. Tổng Quan
User gửi đơn liên hệ cho bài đăng BĐS. Chủ bài đăng xem đơn nhận được.

## 2. Frontend

### 2.1 Page
- **File**: `pages/User/CustomerApplication/CustomerApplication.jsx`
- **Route**: `/user/customer-application`

### 2.2 Services (`services/applicationService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `createApplicationApi(formData)` | POST | `/applications` |
| `getAllApplicationsApi({ page, limit, filters, sortBy })` | GET | `/applications` |
| `getApplicationsByPostApi(postId, { page, limit })` | GET | `/applications/post/:postId` |
| `getMyApplicationsApi({ page, limit })` | GET | `/applications/my-applications` |
| `getApplicationByIdApi(id)` | GET | `/applications/:id` |
| `deleteApplicationApi(id)` | DELETE | `/applications/:id` |

## 3. Backend

### 3.1 Routes (`routers/application.js`) - Tất cả cần `authentication`
| Method | Path | Handler |
|---|---|---|
| POST | `/applications` | `createNewApplication` |
| GET | `/applications/my-applications` | `getApplicationsByAuthor` |
| GET | `/` | `getAllApplications` |
| GET | `/post/:postId` | `getApplicationsByPost` |
| GET | `/:applicationId` | `getApplicationById` |
| DELETE | `/:applicationId` | `deleteApplication` |

### 3.2 Model (`models/application.modal.js`)
```
name: String (required, max 100)
phone: String (required)
email: String (required)
content: String (required)
post: ObjectId ref Post
author: ObjectId ref User
Collection: "Applications"
```

### 3.3 Service (`services/application.service.js`)

**createNewApplication(data, user)**
- Create: `{ name: fullName, phone, email, content, post, author: user.userId }`

**getAllApplications({ limit, page, filters, sortBy })**
- Support sort
- Populate: `["author", "post"]`

**getApplicationsByPost(postId, { limit, page })**
- Filter: `{ post: postId }`
- Populate: `["author"]`

**getApplicationsByAuthor(authorId, { limit, page })**
- Filter: `{ author: authorId }`
- Populate: `["post"]`

**deleteApplication(id)**: Hard delete
