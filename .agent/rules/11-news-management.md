# 📰 Chức Năng: Quản Lý Tin Tức (News)

## 1. Tổng Quan
Admin CRUD tin tức BĐS. Guest có thể xem danh sách và chi tiết tin tức.

## 2. Frontend

### 2.1 Pages
- **Admin quản lý**: `pages/Admin/ManageNews/ManageNews.jsx` → Route `/admin/news`
- **Xem chi tiết**: `pages/NewsDetail/NewsDetails.jsx` → Route `/news/:id`
- **Trang chủ**: Section tin tức trong `Home.jsx`

### 2.2 Form Component
- **File**: `components/FormManage/NewsForm/NewsForm.jsx`

### 2.3 Services (`services/newsService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `getAllNewsApi({ page, limit, filters })` | GET | `/news` |
| `getNewsDetailApi(id)` | GET | `/news/:id` |
| `createNewsApi(formData)` | POST | `/news` |
| `admiEditNewsApi(formData, id)` | PUT | `/news/:id` |
| `deleteNewsApi(id)` | DELETE | `/news/:id` |

## 3. Backend

### 3.1 Routes (`routers/news.js`)
| Method | Path | Auth | Handler |
|---|---|---|---|
| GET | `/news` | Public | `getAllNews` |
| GET | `/news/:id` | Public | `getNewsDetail` |
| POST | `/news` | Admin | `createNewNews` |
| PUT | `/news/:id` | Admin | `updateNews` |
| DELETE | `/news/:id` | Admin | `deleteNews` |

### 3.2 Model (`models/news.model.js`)
```
title: String
content: String (HTML rich text)
thumb: String (image path)
tags: [String]
isDelete: "active" | "inActive"
Collection: "Newss"
```

### 3.3 Service (`services/news.service.js`)
- **createNewNews(data)**: `News.create(data)`
- **getAllNews**: Filter `{ isDelete: "active" }`, paginate
- **getNewsDetail(id)**: `News.findById(id)`
- **deleteNews(id)**: Soft delete → `isDelete: "inActive"`
- **updateNews(id, payload)**: `findOneAndUpdate`
