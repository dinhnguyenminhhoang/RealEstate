# 📋 Tổng Quan Dự Án - RealEstate

## 1. Mô Tả Dự Án

Đây là một **ứng dụng web bất động sản (RealEstate)** fullstack, cho phép người dùng đăng tin mua bán / cho thuê bất động sản, tìm kiếm, lọc bài đăng, và quản trị hệ thống.

## 2. Tech Stack

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18.3.1 | UI Framework |
| Vite | 6.2.0 | Build tool |
| React Router DOM | 7.5.0 | Routing |
| Ant Design (antd) | 5.24.7 | UI Component Library |
| TailwindCSS | 4.1.3 | Utility CSS Framework |
| Axios | 1.8.4 | HTTP Client |
| React Hook Form + Zod | 7.56.1 / 3.24.2 | Form validation |
| Recharts | 2.15.3 | Biểu đồ thống kê |
| React Quill | 2.0.0 | Rich text editor |
| js-cookie | 3.0.5 | Cookie management |
| jwt-decode | 4.0.0 | JWT decode |
| lucide-react | 0.511.0 | Icon library |
| xlsx | 0.18.5 | Export Excel |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js + Express | 4.21.2 | REST API Server |
| MongoDB + Mongoose | 8.9.2 | Database |
| JWT (jsonwebtoken) | 9.0.2 | Authentication |
| bcrypt | 5.1.1 | Password hashing |
| multer | 1.4.5 | File upload |
| nodemailer | 6.9.16 | Gửi email |
| helmet | 8.0.0 | Security headers |
| compression | 1.7.5 | Response compression |
| morgan | 1.10.0 | HTTP request logger |
| openai | 4.86.2 | AI integration |

## 3. Kiến Trúc Tổng Quan

```
RealEstate/
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── pages/          # 7 nhóm trang (Admin, Auth, Home, NewsDetail, PropertyDetail, PropertyListing, User)
│       ├── components/     # 6 component tái sử dụng
│       ├── layouts/        # 3 layout (Root, User, Admin)
│       ├── services/       # 9 API service files
│       ├── context/        # AuthContext (global state)
│       ├── hooks/          # 2 custom hooks
│       ├── config/         # Axios instance
│       └── utils/          # Utility functions, enums
│
└── server/                 # Express.js REST API
    └── src/
        ├── controller/     # 9 controllers
        ├── services/       # 9 business logic services
        ├── models/         # 7 Mongoose models
        ├── routers/        # 11 route files
        ├── auth/           # JWT authentication middleware
        ├── core/           # Response wrappers (Success/Error)
        ├── helpers/        # Async handler, Email sender
        ├── dbs/            # MongoDB connection (Singleton)
        └── utils/          # Utility functions, pagination, email templates
```

## 4. Vai Trò Người Dùng

| Vai trò | Quyền hạn |
|---|---|
| **Guest** (chưa đăng nhập) | Xem danh sách bất động sản, xem chi tiết, xem tin tức, tìm kiếm/lọc |
| **USER** | Đăng bài, quản lý bài đăng, lưu yêu thích, báo cáo bài đăng, cập nhật profile, gửi đơn ứng tuyển |
| **ADMIN** | Quản lý người dùng, quản lý danh mục, duyệt/xóa bài đăng, quản lý tin tức, xem báo cáo, xem dashboard thống kê |

## 5. Các Chức Năng Chính

1. **Xác thực (Authentication)**: Đăng ký, Đăng nhập, Quên mật khẩu, Reset mật khẩu, Xác thực email
2. **Quản lý bài đăng (Post)**: CRUD bài đăng bất động sản (bán/cho thuê)
3. **Tìm kiếm & Lọc**: Theo loại, khu vực, giá, diện tích, danh mục
4. **Quản lý người dùng (User)**: CRUD profile, admin quản lý tài khoản
5. **Danh mục (Category)**: Admin CRUD danh mục bất động sản
6. **Tin tức (News)**: Admin CRUD tin tức bất động sản
7. **Báo cáo (Report)**: User báo cáo bài đăng vi phạm, Admin xử lý
8. **Yêu thích (Favorite)**: User lưu/xóa bài đăng yêu thích
9. **Đơn ứng tuyển (Application)**: User gửi đơn liên hệ cho bài đăng
10. **Upload hình ảnh**: Upload multiple files lên server
11. **Dashboard thống kê (Summary)**: Thống kê tổng quan, theo người dùng, bài đăng, tin tức, báo cáo
12. **Chat**: Component chat (có file nhưng chưa tích hợp đầy đủ)

## 6. API Base URL

- Frontend gọi API qua biến môi trường: `VITE_SERVER_BASE_URL`
- Server prefix: `/v1/api/`
- Authentication: JWT Bearer Token qua header `Authorization` + `x-client-id`

## 7. Database Models

| Model | Collection | Mô tả |
|---|---|---|
| User | Users | Người dùng hệ thống |
| Post | Posts | Bài đăng bất động sản |
| Category | Categories | Danh mục bất động sản |
| News | Newss | Tin tức |
| Report | Reports | Báo cáo vi phạm |
| Application | Applications | Đơn ứng tuyển/liên hệ |
| Keytoken | Keys | JWT key storage |
