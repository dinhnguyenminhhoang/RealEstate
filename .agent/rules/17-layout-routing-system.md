# 🏗️ Kiến Trúc: Layout System

## 1. Tổng Quan
3 layout chính phân theo vai trò: Public, User, Admin. Mỗi layout có navigation riêng.

## 2. Layouts

### 2.1 RootLayout (Public)
- **File**: `layouts/RootLayout/RootLayout.jsx`
- **Cấu trúc**: Nav (header) + Outlet (page content) + Footer
- **Components**:
  - `layouts/RootLayout/Nav/Nav.jsx` - Navigation bar chính
  - `layouts/RootLayout/Footer/Footer.jsx` - Footer
- **Routes sử dụng**: `/`, `/property-detail/:name/:id`, `/property-list/:type`, `/news/:id`, `/favorite-list`

### 2.2 UserLayout (Authenticated User)
- **File**: `layouts/UserLayout/UserLayout.jsx`
- **Cấu trúc**: Nav + Sidebar + Outlet
- **Components**:
  - `layouts/UserLayout/Nav/Nav.jsx` - User navigation
  - `layouts/UserLayout/Sidebar/Sidebar.jsx` - Menu sidebar
- **Routes sử dụng**: `/profile`, `/user/dashboard`, `/user/action-post`, `/user/manage-post`, `/user/customer-application`

### 2.3 AdminLayout (Admin Only)
- **File**: `layouts/AdminLayout/AdminLayout.jsx`
- **Cấu trúc**: AdminSidebar + Outlet
- **Components**:
  - `layouts/AdminLayout/AdminSiderbar/AdminSiderbar.jsx` - Admin sidebar menu
- **Routes sử dụng**: `/admin/dashboard`, `/admin/users`, `/admin/categories`, `/admin/posts`, `/admin/news`, `/admin/reports`

## 3. Route Structure (App.jsx)

```
/ (no layout)
├── /signup → SignUp
├── /signin → SignIn
├── /confirm-account/:token → ConfirmAccount
│
├── RootLayout
│   ├── / (index) → Home
│   ├── /property-detail/:name/:id → PropertyDetail
│   ├── /property-list/:type → PropertyListing
│   ├── /news/:id → NewsDetails
│   └── /favorite-list → FavoriteList
│
├── UserLayout
│   ├── /profile → Profile
│   ├── /user/dashboard → Dashboard
│   ├── /user/action-post → CreateOrUpdatePost
│   ├── /user/manage-post → UserManagePost
│   └── /user/customer-application → CustomerApplication
│
└── AdminLayout
    ├── /admin/dashboard → AdminDashboard
    ├── /admin/users → ManagerUser
    ├── /admin/categories → ManageCategory
    ├── /admin/posts → ManagePost
    ├── /admin/news → ManageNews
    └── /admin/reports → ManagerReport
```

> ⚠️ **Lưu ý**: UserLayout và AdminLayout hiện KHÔNG có ProtectedRoute wrapper trong App.jsx. ProtectedRoute component tồn tại trong AuthContext nhưng chưa được sử dụng.
