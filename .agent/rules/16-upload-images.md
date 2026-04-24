# 📤 Chức Năng: Upload Hình Ảnh

## 1. Tổng Quan
Upload nhiều file ảnh lên server, lưu vào thư mục `uploads/`, trả về đường dẫn.

## 2. Frontend

### 2.1 Service (`services/uploadService.js`)
```js
uploadImageApi(formData) → POST /upload
Headers: { "Content-Type": "multipart/form-data" }
```

### 2.2 Sử dụng
- Trong form tạo/sửa bài đăng (CreatePostForm)
- Upload avatar (UploadAvatar component)

## 3. Backend

### 3.1 Router (`routers/upload.js`)
- `POST /upload` → `authentication` + `multer.array("file", 10)` → `uploadController.uploadImages`
- Serve static files: `GET /uploads/*` → `express.static(uploadsDir)`

### 3.2 Multer Config
```js
storage: multer.diskStorage({
  destination: "src/uploads/",
  filename: Date.now() + path.extname(file.originalname)
})
upload = multer({ storage })
```
- Max files: 10

### 3.3 Controller (`controller/upload.controller.js`)
```js
uploadImages(req, res) {
  // req.files = array of uploaded files
  return files.map(file => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`
  }))
}
```

### 3.4 Response
```json
{
  "status": 200,
  "data": [
    { "filename": "1234567890.jpg", "path": "/uploads/1234567890.jpg" }
  ]
}
```

### 3.5 Truy cập ảnh
- URL: `{VITE_SERVER_BASE_URL}/uploads/{filename}`
- Frontend sử dụng `BASEIMAGE` constant: `import.meta.env.VITE_SERVER_BASE_URL`
