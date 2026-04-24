# 📂 Chức Năng: Quản Lý Danh Mục (Category)

## 1. Tổng Quan
Admin CRUD danh mục bất động sản (Căn hộ, Nhà phố, Biệt thự, v.v.)

## 2. Frontend

### 2.1 Page
- **File**: `pages/Admin/ManageCategory/ManageCategory.jsx`
- **Route**: `/admin/categories`

### 2.2 Form Component
- **File**: `components/FormManage/CategoryForm/CategoryForm.jsx`

### 2.3 Services (`services/categoryService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `getAllCategoryApi({ page, limit, filters })` | GET | `/category` |
| `createCategoryApi(formData)` | POST | `/category` |
| `admiEditCategoryApi(formData, id)` | PUT | `/category/:id` |
| `deleteCategoryApi(id)` | DELETE | `/category/:id` |

## 3. Backend

### 3.1 Routes (`routers/category.js`)
| Method | Path | Auth | Handler |
|---|---|---|---|
| GET | `/category` | Public | `getAllCategories` |
| POST | `/category` | Public* | `createNewCategory` |
| PUT | `/category/:id` | Public* | `updateCategory` |
| DELETE | `/category/:id` | Public* | `deleteCategory` |

> ⚠️ **Lưu ý**: Routes POST/PUT/DELETE category hiện KHÔNG có `adminAuthentication` middleware! Đây có thể là lỗi bảo mật.

### 3.2 Model (`models/category.model.js`)
```
name: String (required, unique, max 100)
description: String
status: "active" | "inActive"
posts: [ObjectId ref Post]
Collection: "Categories"
```

### 3.3 Service (`services/category.service.js`)
- **createNewCategory(data)**: `Category.create(data)`
- **getAllCategories**: Filter `{ status: "active" }`, paginate
- **deleteCategory(id)**: Soft delete → `status: "inActive"`
- **updateCategory(id, payload)**: `findOneAndUpdate`
