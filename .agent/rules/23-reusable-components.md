# 🧩 Chức Năng: Reusable Components

## 1. PostCard (`components/PostCard/PostCard.jsx`)
- **Props**: `listing` (post object)
- **Hiển thị**: Ảnh, title, giá, diện tích, địa chỉ, loại (RENT/SELL)
- **Sử dụng tại**: Home, PropertyListing, FavoriteList
- **Click**: Navigate tới `/property-detail/:name/:id`

## 2. CreatePostForm (`components/CreatePostForm/CreatePostForm.jsx`)
- **Props**: Post data (khi edit)
- **Fields**: title, type (RENT/SELL), category, address (cascader), price, acreage, description (Quill), overview, images (upload)
- **Sử dụng tại**: CreateOrUpdatePost page

## 3. ReportPostDialog (`components/ReportPostDialog/ReportPostDialog.jsx`)
- **Props**: postId, visible, onClose
- **Fields**: reason, content
- **API**: `createNewReportAPi()`
- **Sử dụng tại**: PropertyDetail page

## 4. UploadAvatar (`components/UploadAvatar/UploadAvatar.jsx`)
- **Props**: currentAvatar, onChange
- **API**: `uploadImageApi()`
- **Sử dụng tại**: Profile page

## 5. Chat (`components/Chat/Chat.jsx`)
- Component chat (có file nhưng integration chưa rõ ràng)

## 6. Form Components (Admin)

### CategoryForm (`components/FormManage/CategoryForm/CategoryForm.jsx`)
- Fields: name, description
- Sử dụng tại: ManageCategory

### NewsForm (`components/FormManage/NewsForm/NewsForm.jsx`)
- Fields: title, content (rich text), thumb (upload), tags
- Sử dụng tại: ManageNews

### UserForm (`components/FormManage/UserForm/UserForm.jsx`)
- Fields: userName, email, phone, password, roles, address
- Sử dụng tại: ManageUser
