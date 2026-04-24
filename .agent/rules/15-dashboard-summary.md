# 📊 Chức Năng: Dashboard Thống Kê (Summary)

## 1. Tổng Quan
Hệ thống thống kê đa cấp cho Admin và User: tổng quan, theo người dùng, bài đăng, báo cáo, tin tức, tác giả.

## 2. Frontend

### 2.1 Pages
- **Admin Dashboard**: `pages/Admin/AdminDashboard/AdminDashboard.jsx` → `/admin/dashboard`
- **User Dashboard**: `pages/User/Dashboard/Dashboard.jsx` → `/user/dashboard`

### 2.2 Services (`services/summaryService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `getOverallSummaryApi(filters)` | GET | `/summary/overall` |
| `getDashboardSummaryApi(filters)` | GET | `/summary/dashboard` |
| `getSearchSummaryApi(searchParams)` | GET | `/summary/search` |
| `getUserSummaryApi(filters)` | GET | `/summary/users` |
| `getPostSummaryApi(filters)` | GET | `/summary/posts` |
| `getReportSummaryApi(filters)` | GET | `/summary/reports` |
| `getNewsSummaryApi(filters)` | GET | `/summary/news` |
| `getAuthorSummaryApi(authorId)` | GET | `/summary/author/:authorId` |
| `getAdminSummaryApi(filters)` | GET | `/summary/admin` |

## 3. Backend

### 3.1 Routes (`routers/summary.js`)
| Method | Path | Auth |
|---|---|---|
| GET | `/summary/overall` | Public |
| GET | `/summary/dashboard` | Public |
| GET | `/summary/search` | Public |
| GET | `/summary/users` | User |
| GET | `/summary/posts` | User |
| GET | `/summary/reports` | User |
| GET | `/summary/news` | User |
| GET | `/summary/author/:authorId` | User |
| GET | `/summary/admin` | User |

### 3.2 Service (`services/summary.service.js`) - Chi tiết

**getOverallSummary()**: Đếm tổng users/posts/reports/news/categories

**getUserSummary()**: Aggregate users by status, role, verification

**getPostSummary()**: Aggregate posts by type/status, category, price range ($bucket)

**getReportSummary()**: Aggregate reports by status, reason, monthly (12 tháng gần nhất)

**getNewsSummary()**: Aggregate news by status, popular tags, monthly

**getDashboardSummary(timeRange=30)**: 
- Đếm new users/posts/reports trong `timeRange` ngày
- Top 10 viewed posts
- Top 5 categories

**getAuthorSummary(authorId)**:
- Thống kê: totalPosts, totalViews, totalFavorites, avgPrice, rentPosts, sellPosts
- 5 bài đăng gần nhất

**getSearchSummary(searchTerm)**: Đếm kết quả match trong users/posts/news/categories

**getAdminSummary()**: Tổng hợp tất cả (overall + users + posts + reports + news)
