# ❤️ Chức Năng: Danh Sách Yêu Thích (Favorite)

## 1. Tổng Quan
User có thể lưu bài đăng vào danh sách yêu thích và xem lại.

## 2. Frontend

### 2.1 Page
- **File**: `pages/User/FavoriteList/FavoriteList.jsx`
- **Route**: `/favorite-list` (trong RootLayout, không cần UserLayout)

### 2.2 Services (`services/userService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `savePostApi(postId)` | PUT | `/user/save-post/:postId` |
| `userGetAllFavoriteList()` | GET | `/user/favorite-post` |

## 3. Backend

### 3.1 Routes (`routers/user.js`) - Cần `authentication`
| Method | Path | Handler |
|---|---|---|
| PUT | `/user/save-post/:postId` | `userSavePost` |
| GET | `/user/favorite-post` | `userGetAllFavoriteList` |

### 3.2 Service (`services/user.service.js`)

**userSavePost(userId, postId)**
1. Verify post tồn tại
2. Verify user tồn tại
3. Check đã lưu chưa → nếu đã lưu, return true
4. Tăng `favorites` count trên Post (`$inc: { favorites: 1 }`)
5. Thêm postId vào `user.favorites` (`$addToSet`)

**userGetAllFavoriteList({ userId, page, limit, sortBy, sortOrder })**
1. Tìm user → lấy `favorites` array (postId list)
2. Query Post với `{ _id: { $in: favoriteIds }, isDelete: "active" }`
3. Populate: author + category
4. Thêm `isFavorite: true` cho mỗi post
5. Return data + pagination

> ⚠️ **Lưu ý**: Controller hiện hardcode `limit: 10, page: 1`, không lấy từ query params.
