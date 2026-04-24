# ⚠️ Chức Năng: Báo Cáo Vi Phạm (Report)

## 1. Tổng Quan
User có thể báo cáo bài đăng vi phạm. Admin xem và xử lý báo cáo.

## 2. Frontend

### 2.1 Pages
- **Admin xem báo cáo**: `pages/Admin/ManagerReport/ManagerReport.jsx` → Route `/admin/reports`

### 2.2 Component
- **Dialog báo cáo**: `components/ReportPostDialog/ReportPostDialog.jsx`
- Hiển thị trong trang chi tiết bài đăng

### 2.3 Services (`services/reportService.js`)
| Function | HTTP | Endpoint |
|---|---|---|
| `createNewReportAPi(formData)` | POST | `/report` |
| `getAllReportApi({ page, limit, filters })` | GET | `/report` |
| `updateStatusReportApi(formData, id)` | PUT | `/report/status/:id` |

## 3. Backend

### 3.1 Routes (`routers/report.js`)
| Method | Path | Auth | Handler |
|---|---|---|---|
| POST | `/report` | User | `createNewReport` |
| GET | `/report` | Admin | `getAllReport` |
| PUT | `/report/status/:reportId` | User* | `updateStatusReport` |

### 3.2 Model (`models/report.model.js`)
```
author: ObjectId ref User
post: ObjectId ref Post
phone: String
reason: String
content: String
status: "pending" | "resolved" | "rejected" (default: "pending")
Collection: "Reports"
```

### 3.3 Service (`services/report.service.js`)

**createNewReport(data, user)**
- Validate: user, post required
- Create: `{ content, post, reason, author: user.userId }`

**getAllReport({ limit, page, filters, sortBy })**
- Support sort: `field-asc` hoặc `field-desc`
- Default sort: `{ createdAt: -1 }`
- Populate: `["author", "post"]`

**updateStatusReport(reportId, { status })**
- Tìm report → cập nhật status → save
