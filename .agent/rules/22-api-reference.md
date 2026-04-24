# 🌐 API Reference: Tất Cả Endpoints

## Base URL: `/v1/api`

## 1. Authentication (Public)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/register` | Đăng ký tài khoản |
| POST | `/login` | Đăng nhập |
| POST | `/forgot-password` | Quên mật khẩu |
| POST | `/confirm-account` | Xác thực tài khoản (auth) |
| POST | `/reset-password` | Đặt lại mật khẩu (auth) |

## 2. User Profile (Authentication required)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/profile` | Lấy thông tin profile |
| POST | `/profile` | Cập nhật profile |
| PUT | `/user/save-post/:postId` | Lưu bài yêu thích |
| GET | `/user/favorite-post` | Danh sách yêu thích |

## 3. User Management (Admin only)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/user` | Danh sách users |
| POST | `/user` | Tạo user mới |
| PUT | `/user/:userId` | Cập nhật user |
| DELETE | `/user/:userId` | Xóa user (soft) |

## 4. Post - User (Authentication required)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/user-post` | Tạo bài đăng |
| GET | `/user-post` | Danh sách bài đăng của user |
| GET | `/user-post/:id` | Chi tiết bài đăng |
| PUT | `/user-post/:id` | Cập nhật bài đăng |
| DELETE | `/user-post/:id` | Xóa bài đăng |

## 5. Post - Public
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/post` | Danh sách + filter + phân trang |
| GET | `/post/:id` | Chi tiết bài đăng |
| GET | `/post-outstanding` | Bài nổi bật (top views) |
| PUT | `/post/:id/view` | Tăng lượt xem |

## 6. Post - Admin
| Method | Endpoint | Mô tả |
|---|---|---|
| PUT | `/confirm-post/:id` | Duyệt/hủy duyệt bài |
| PUT | `/unPublish-post/:id` | Hủy xuất bản |
| DELETE | `/post/:id` | Xóa bài (soft) |

## 7. Category
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/category` | Public | Danh sách danh mục |
| POST | `/category` | Public* | Tạo danh mục |
| PUT | `/category/:id` | Public* | Sửa danh mục |
| DELETE | `/category/:id` | Public* | Xóa danh mục |

## 8. News
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/news` | Public | Danh sách tin tức |
| GET | `/news/:id` | Public | Chi tiết tin tức |
| POST | `/news` | Admin | Tạo tin tức |
| PUT | `/news/:id` | Admin | Sửa tin tức |
| DELETE | `/news/:id` | Admin | Xóa tin tức |

## 9. Report
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/report` | User | Tạo báo cáo |
| GET | `/report` | Admin | Danh sách báo cáo |
| PUT | `/report/status/:reportId` | User | Cập nhật trạng thái |

## 10. Application
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/applications` | User | Gửi đơn |
| GET | `/applications/my-applications` | User | Đơn của tôi |
| GET | `/applications/post/:postId` | User | Đơn theo bài đăng |
| GET | `/applications/:id` | User | Chi tiết đơn |
| DELETE | `/applications/:id` | User | Xóa đơn |

## 11. Summary
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/summary/overall` | Public | Tổng quan |
| GET | `/summary/dashboard` | Public | Dashboard |
| GET | `/summary/search` | Public | Tìm kiếm |
| GET | `/summary/users` | User | Thống kê users |
| GET | `/summary/posts` | User | Thống kê posts |
| GET | `/summary/reports` | User | Thống kê reports |
| GET | `/summary/news` | User | Thống kê news |
| GET | `/summary/author/:authorId` | User | Thống kê tác giả |
| GET | `/summary/admin` | User | Admin tổng hợp |

## 12. Upload
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/upload` | User | Upload ảnh (max 10) |
| GET | `/uploads/*` | Public | Serve static files |
