# 🔧 Kiến Trúc: Backend Core Infrastructure

## 1. Server Entry
- **File**: `server/server.js` → Load app, listen on `PORT` (env or 3055)
- **File**: `server/src/app.js` → Express setup

### Express Middleware Stack:
1. `morgan("dev")` - HTTP request logging
2. `helmet({ crossOriginResourcePolicy: false })` - Security headers
3. `compression()` - Response compression
4. `express.json()` - JSON body parser
5. `express.urlencoded({ extended: true })` - URL-encoded parser
6. `cors({ origin: [BASE_URL_CLIENT] })` - CORS
7. MongoDB initialization (singleton)
8. Router mounting: `app.use("/", require("./routers"))`
9. 404 handler
10. Global error handler

## 2. Database (`dbs/init.mongodb.js`)
- Singleton pattern
- Connection string: `process.env.CONECTSTRING`
- Options: `{ maxPoolSize: 50 }`
- Debug mode: enabled

## 3. Response Wrappers (`core/`)

### SuccessResponse
```js
{ message, status: 200, data }
// send(res) → res.status(status).json(this)
```

### CREATED
```js
{ message, status: 201, data, options }
```

### Error Classes
| Class | Default Status | Default Message |
|---|---|---|
| `badRequestError` | 400 | CONFLICT |
| `AuthFailureError` | 401 | UNAUTHORIZED |
| `NotFoundError` | 404 | NOT_FOUND |
| `ForbiddenError` | 403 | FORBIDDEN |
| `conflictRequestError` | 403 | CONFLICT |

## 4. Helpers

### asynchandler (`helpers/asynchandler.js`)
```js
const asynchandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
```

### sendEmail (`helpers/sendEmail.js`)
- Gmail SMTP via nodemailer
- Config: `YOUREMAIL`, `YOURAPPLICATIONPASSWORD`

## 5. Utilities (`utils/`)

### Core Utils (`utils/index.js`)
- `getInfoData({ fill, object })` - Pick fields from object (lodash)
- `getSelectData(select)` - MongoDB select (include)
- `unGetSelectData(select)` - MongoDB select (exclude)
- `removeUndefinedObject(obj)` - Clean null/undefined/empty
- `updateNestedObjectParser(obj)` - Flatten nested objects
- `covertObjectIdMoongoDb(id)` - Convert to ObjectId
- `createChecksum(params)` - HMAC SHA512 (VNPay)
- `sortObject(obj)` - URL encode sorted object

### Paginate (`utils/paginate.js`)
```js
paginate({ model, query, limit, page, projection, options, populate, 
           searchText, searchFields, searchById, filters, sort })
→ { data, meta: { total, limit, page, totalPages } }
```

### Status Codes (`utils/httpStatusCode.js`)
- Export `StatusCodes` và `ReasonPhrases` từ local files

## 6. Environment Variables (`.env`)
```
PORT=3055
CONECTSTRING=mongodb://...
BASE_URL_CLIENT=http://localhost:5173
YOUREMAIL=...
YOURAPPLICATIONPASSWORD=...
VNP_HASHSECRET=...  (VNPay - chưa dùng)
```
