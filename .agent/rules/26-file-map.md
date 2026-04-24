# 🗺️ File Map: Toàn Bộ Source Code

## Frontend (`frontend/src/`)

### Core
| File | Mô tả |
|---|---|
| `App.jsx` | Router config, tất cả routes |
| `main.jsx` | Entry point, AuthProvider wrap |
| `App.css` | Global styles |
| `index.css` | Root CSS |

### Config
| File | Mô tả |
|---|---|
| `config/instance.js` | Axios instance + interceptors |

### Context
| File | Mô tả |
|---|---|
| `context/AuthContext.jsx` | Auth state + ProtectedRoute |

### Hooks
| File | Mô tả |
|---|---|
| `hooks/useAuthForm.js` | Sign in/up form logic |
| `hooks/useNotification.js` | Antd notification wrapper |

### Services (API calls)
| File | Mô tả |
|---|---|
| `services/authService.js` | Login, register, forgot/reset password |
| `services/postService.js` | CRUD bài đăng |
| `services/userService.js` | Profile, admin user management, favorites |
| `services/categoryService.js` | CRUD danh mục |
| `services/newsService.js` | CRUD tin tức |
| `services/reportService.js` | Tạo/quản lý báo cáo |
| `services/applicationService.js` | CRUD đơn ứng tuyển |
| `services/summaryService.js` | 9 API thống kê |
| `services/uploadService.js` | Upload ảnh |

### Utils
| File | Mô tả |
|---|---|
| `utils/index.js` | Format money, date, address, provinces API |
| `utils/enum.js` | Price/area ranges, tag options |
| `utils/formatAddress.js` | Format address object → string |

### Pages (19 files)
| File | Route |
|---|---|
| `pages/Auth/SignIn/SignIn.jsx` | `/signin` |
| `pages/Auth/SignUp/SignUp.jsx` | `/signup` |
| `pages/Auth/ConfirmAccoount/ConfirmAccoount.jsx` | `/confirm-account/:token` |
| `pages/Home/Home.jsx` | `/` |
| `pages/PropertyDetail/PropertyDetail.jsx` | `/property-detail/:name/:id` |
| `pages/PropertyListing/PropertyListing.jsx` | `/property-list/:type` |
| `pages/NewsDetail/NewsDetails.jsx` | `/news/:id` |
| `pages/User/Profile/Profile.jsx` | `/profile` |
| `pages/User/Dashboard/Dashboard.jsx` | `/user/dashboard` |
| `pages/User/CreateOrUpdatePost/CreateOrUpdatePost.jsx` | `/user/action-post` |
| `pages/User/ManagePost/ManagePost.jsx` | `/user/manage-post` |
| `pages/User/FavoriteList/FavoriteList.jsx` | `/favorite-list` |
| `pages/User/CustomerApplication/CustomerApplication.jsx` | `/user/customer-application` |
| `pages/Admin/AdminDashboard/AdminDashboard.jsx` | `/admin/dashboard` |
| `pages/Admin/ManageUser/ManageUser.jsx` | `/admin/users` |
| `pages/Admin/ManageCategory/ManageCategory.jsx` | `/admin/categories` |
| `pages/Admin/ManagePost/ManagePost.jsx` | `/admin/posts` |
| `pages/Admin/ManageNews/ManageNews.jsx` | `/admin/news` |
| `pages/Admin/ManagerReport/ManagerReport.jsx` | `/admin/reports` |

### Components (8 files)
| File | Mô tả |
|---|---|
| `components/PostCard/PostCard.jsx` | Card bài đăng |
| `components/CreatePostForm/CreatePostForm.jsx` | Form tạo/sửa bài |
| `components/ReportPostDialog/ReportPostDialog.jsx` | Dialog báo cáo |
| `components/UploadAvatar/UploadAvatar.jsx` | Upload avatar |
| `components/Chat/Chat.jsx` | Chat component |
| `components/FormManage/CategoryForm/CategoryForm.jsx` | Form danh mục |
| `components/FormManage/NewsForm/NewsForm.jsx` | Form tin tức |
| `components/FormManage/UserForm/UserForm.jsx` | Form user |

### Layouts (8 files)
| File | Mô tả |
|---|---|
| `layouts/RootLayout/RootLayout.jsx` | Public layout |
| `layouts/RootLayout/Nav/Nav.jsx` | Public navbar |
| `layouts/RootLayout/Footer/Footer.jsx` | Footer |
| `layouts/UserLayout/UserLayout.jsx` | User layout |
| `layouts/UserLayout/Nav/Nav.jsx` | User navbar |
| `layouts/UserLayout/Sidebar/Sidebar.jsx` | User sidebar |
| `layouts/AdminLayout/AdminLayout.jsx` | Admin layout |
| `layouts/AdminLayout/AdminSiderbar/AdminSiderbar.jsx` | Admin sidebar |

---

## Backend (`server/src/`)

### Core
| File | Mô tả |
|---|---|
| `app.js` | Express setup + middleware |
| `../server.js` | Server entry |

### Auth
| File | Mô tả |
|---|---|
| `auth/authUtils.js` | JWT creation, authentication, adminAuth middleware |

### Controllers (9 files)
| File | Mô tả |
|---|---|
| `controller/access.controller.js` | Auth operations |
| `controller/post.controller.js` | Post operations |
| `controller/user.controller.js` | User operations |
| `controller/category.controller.js` | Category operations |
| `controller/news.controller.js` | News operations |
| `controller/report.controller.js` | Report operations |
| `controller/application.controller.js` | Application operations |
| `controller/summary.controller.js` | Summary/stats operations |
| `controller/upload.controller.js` | File upload |

### Services (9 files)
| File | Mô tả |
|---|---|
| `services/access.service.js` | Auth business logic |
| `services/post.service.js` | Post business logic |
| `services/user.service.js` | User business logic |
| `services/category.service.js` | Category business logic |
| `services/news.service.js` | News business logic |
| `services/report.service.js` | Report business logic |
| `services/application.service.js` | Application business logic |
| `services/summary.service.js` | Statistics aggregation |
| `services/keyToken.service.js` | JWT key management |

### Models (7 + 1 repo)
| File | Mô tả |
|---|---|
| `models/user.model.js` | User schema |
| `models/post.model.js` | Post schema |
| `models/category.model.js` | Category schema |
| `models/news.model.js` | News schema |
| `models/report.model.js` | Report schema |
| `models/application.modal.js` | Application schema |
| `models/keytoken.model.js` | KeyToken schema |
| `models/repo/user.repo.js` | User query helpers |

### Routers (11 files)
| File | Mô tả |
|---|---|
| `routers/index.js` | Router aggregator |
| `routers/access.js` | Auth routes |
| `routers/post.js` | Post routes |
| `routers/user.js` | User routes |
| `routers/category.js` | Category routes |
| `routers/news.js` | News routes |
| `routers/report.js` | Report routes |
| `routers/application.js` | Application routes |
| `routers/summary.js` | Summary routes |
| `routers/upload.js` | Upload routes + multer |
| `routers/review.js` | Review routes (placeholder) |

### Helpers & Utils
| File | Mô tả |
|---|---|
| `helpers/asynchandler.js` | Async error wrapper |
| `helpers/sendEmail.js` | Gmail SMTP sender |
| `dbs/init.mongodb.js` | MongoDB singleton connection |
| `core/error.response.js` | Error response classes |
| `core/success.response.js` | Success response classes |
| `utils/index.js` | Data utilities (lodash, etc) |
| `utils/paginate.js` | Generic pagination |
| `utils/emailExtension.js` | Email HTML templates |
| `utils/httpStatusCode.js` | Status code exports |
| `utils/statusCodes.js` | HTTP status codes |
| `utils/reasonPhrases.js` | HTTP reason phrases |
| `utils/generateTrainingData.js` | AI training data gen |
