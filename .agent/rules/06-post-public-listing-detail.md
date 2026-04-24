# 🔍 Chức Năng: Xem & Tìm Kiếm Bài Đăng (Public)

## 1. Tổng Quan
Người dùng (kể cả guest) có thể duyệt danh sách, tìm kiếm, lọc và xem chi tiết bài đăng BĐS.

## 2. Frontend

### 2.1 Pages
- **Trang chủ**: `pages/Home/Home.jsx` → Route `/`
- **Danh sách lọc**: `pages/PropertyListing/PropertyListing.jsx` → Route `/property-list/:type`
- **Chi tiết**: `pages/PropertyDetail/PropertyDetail.jsx` → Route `/property-detail/:name/:id`

### 2.2 Component
- **PostCard**: `components/PostCard/PostCard.jsx` - Card hiển thị bài đăng

### 2.3 Services (`services/postService.js`)
| Function | HTTP | Endpoint | Mô tả |
|---|---|---|---|
| `getAllPostAPi({ page, limit, filters })` | GET | `/post` | Lấy danh sách (có phân trang, lọc) |
| `getPostDetailAPi(id)` | GET | `/post/:id` | Xem chi tiết (kèm userId nếu đã đăng nhập) |
| `getPostOutstandingAPi()` | GET | `/post-outstanding` | Lấy bài nổi bật (top views) |
| `updateViewApi(id)` | PUT | `/post/:id/view` | Tăng lượt xem |

### 2.4 Trang Chủ (Home.jsx)
- **Tabs**: "Nhà đất bán" (SELL) / "Nhà đất cho thuê" (RENT)
- **Bộ lọc**: Loại nhà đất (category), Tỉnh/Thành phố (Cascader 3 cấp), Diện tích
- **Sections**: BĐS nổi bật, BĐS dành cho bạn, Danh sách BĐS, Tin tức BĐS
- **API tỉnh thành**: `https://provinces.open-api.vn/api/?depth=3`

### 2.5 Trang Danh Sách (PropertyListing.jsx)
- Filter: type (RENT/SELL), category, address, price range, area range, sort
- Phân trang
- Query params từ URL

### 2.6 Trang Chi Tiết (PropertyDetail.jsx)
- Hiển thị đầy đủ thông tin bài đăng
- Gallery hình ảnh
- Thông tin tác giả
- Nút yêu thích, báo cáo
- Gửi đơn ứng tuyển (Application)
- Tăng view count khi truy cập

## 3. Backend

### 3.1 Routes (`routers/post.js`) - Public (không cần auth)
| Method | Path | Handler |
|---|---|---|
| GET | `/post` | `getAllPost` |
| GET | `/post/:id` | `getPostDetail` |
| GET | `/post-outstanding` | `getPostOutstanding` |
| PUT | `/post/:id/view` | `updatePostView` |

### 3.2 Service

**getAllPost({ page, limit, filters, sort, ...query })**
- Base filter: `{ isDelete: "active", verification: true }`
- Hỗ trợ filter: `type`, `address` (regex), `area` (range), `price` (range VNĐ)
- Sort: `key-asc` hoặc `key-desc`
- Populate: author (userName, email, phone, address)

**getPostDetail({ id, userId })**
- Filter: `{ _id: id, isDelete: "active" }`
- Populate: author + category
- Nếu có userId → check favorite status (`isFavorite`)

**getPostOutstanding({ limit = 8 })**
- Sort by views DESC
- Populate: author + category

**updatePostView(id)**
- `$inc: { views: 1 }`
