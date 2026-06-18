# 🚀 Hướng dẫn cài đặt & chạy dự án Ecommerce

## Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 5.x
- NPM hoặc Yarn

## 1️⃣ Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
copy .env.example .env

# Chỉnh sửa file .env với thông tin của bạn
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=your_secret_key_here

# Chạy server (development)
npm run dev

# Hoặc chạy production
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 2️⃣ Cài đặt Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
copy .env.example .env

# File .env sẽ có:
# REACT_APP_API_URL=http://localhost:5000/api

# Chạy React app
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 3️⃣ Cài đặt MongoDB

### Windows:
- Tải và cài đặt MongoDB từ: https://www.mongodb.com/try/download/community
- Hoặc sử dụng MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas

### Sử dụng MongoDB Atlas (Cloud - Miễn phí):
1. Đăng ký tài khoản tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string
4. Cập nhật `MONGODB_URI` trong file `.env`

## 4️⃣ Tạo tài khoản Admin

Sau khi server chạy, đăng ký tài khoản mới tại: `http://localhost:3000/register`

Để set role admin, connect vào MongoDB và chạy:

```javascript
// Trong MongoDB Compass hoặc Mongo Shell
use ecommerce;
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

## 5️⃣ Import dữ liệu mẫu (Optional)

Bạn có thể tạo dữ liệu mẫu bằng cách:

1. Đăng nhập với tài khoản admin
2. Vào trang Admin Dashboard
3. Tạo categories và products

## 📁 Cấu trúc dự án

```
ecommerces/
├── backend/              # Node.js + Express API
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, upload, etc.
│   └── server.js        # Entry point
│
├── frontend/            # React Application
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React Context (State)
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Page components
│       ├── services/    # API calls
│       └── App.js       # Main app
│
└── README.md
```

## 🧪 Test API với Thunder Client / Postman

### Register:
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

### Login:
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "123456"
}
```

### Get Products:
```
GET http://localhost:5000/api/products
```

## 🎯 Tính năng chính đã implement

### Frontend (React):
✅ Context API + useReducer
✅ Custom Hooks (useFetch, useDebounce, useToggle, etc.)
✅ React Router v6
✅ Protected Routes
✅ Lazy Loading & Code Splitting
✅ Form Handling & Validation
✅ Search & Filters
✅ Pagination
✅ Shopping Cart
✅ Wishlist
✅ Order Management
✅ User Profile

### Backend (Node.js):
✅ RESTful API
✅ JWT Authentication
✅ MongoDB + Mongoose
✅ File Upload (Multer)
✅ Data Validation
✅ Error Handling
✅ CRUD Operations
✅ Search & Filter
✅ Pagination

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB:
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra `MONGODB_URI` trong file `.env`
- Nếu dùng MongoDB Atlas, kiểm tra IP whitelist

### Lỗi CORS:
- Đảm bảo backend đã cài `cors`
- Kiểm tra `REACT_APP_API_URL` trong frontend

### Port đã được sử dụng:
- Đổi PORT trong file `.env` backend
- Hoặc kill process đang dùng port đó

## 📚 Học thêm

- React: https://react.dev
- Node.js: https://nodejs.org
- MongoDB: https://www.mongodb.com
- Express: https://expressjs.com

## 👥 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Console log trong browser (F12)
2. Terminal log của backend
3. MongoDB connection
4. File .env đã được config đúng chưa
