# 📐 Kiến Trúc: Frontend State & Utilities

## 1. State Management
- **Global**: AuthContext (React Context API)
- **Local**: useState trong mỗi component
- **KHÔNG** sử dụng Redux/Zustand

## 2. Custom Hooks

### useAuthForm (`hooks/useAuthForm.js`)
- `handleSignIn(values)` → Gọi `login()` từ AuthContext
- `handleSignUp(values)` → Gọi `signupApi()`
- Return: `{ loading, handleSignIn, handleSignUp }`

### useNotification (`hooks/useNotification.js`)
- Wrapper cho `antd notification`
- Auto-extract error message từ `error.response.data.message`
- Placement: `bottomRight`, maxCount: 3

## 3. Utility Functions (`utils/index.js`)

| Function | Mô tả |
|---|---|
| `BASEIMAGE` | Base URL cho ảnh server |
| `fetchProvinces(setOptions)` | Lấy tỉnh/huyện/xã từ open API |
| `fetchCity(setOptions)` | Lấy danh sách tỉnh/thành |
| `formatCurrencyVND(amount)` | Format tiền tệ VNĐ (Intl) |
| `formatDateTime(date)` | Format ngày giờ tiếng Việt |
| `capitalizeFirstLetter(str)` | Viết hoa chữ cái đầu |
| `formatTimeAgo(isoDate)` | "X phút/giờ/ngày trước" |
| `formatMoneyVND(amount)` | "X tỷ/triệu/nghìn" |
| `stripHtmlAndLimitLength(html, max)` | Strip HTML, cắt text |

### formatAddress (`utils/formatAddress.js`)
```js
formatAddress({ street, ward, district, city }) → "street, ward, district, city"
```

## 4. Enums (`utils/enum.js`)
- `priceRanges`: Khoảng giá (0-1, 1-3, 3-5, 5-10, 10-20, 20-50 tỷ)
- `areaRanges`: Khoảng diện tích (0-30, 30-50, 50-80, 80-100, 100-150, 150+ m²)
- `tagOptions`: 20 tag BĐS (Căn hộ, Nhà phố, Biệt thự, ...)

## 5. Axios Config (`config/instance.js`)
- baseURL: `VITE_SERVER_BASE_URL`
- Auto-attach auth headers
- Auto-unwrap response data
