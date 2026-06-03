# 🛒 Ecommerce Web Application

Dự án web bán hàng đầy đủ sử dụng **React + Node.js + MongoDB**

## 📚 Kiến thức React được áp dụng

### 1. React Hooks
- ✅ `useState` - Quản lý state component
- ✅ `useEffect` - Side effects, API calls
- ✅ `useContext` - Truy cập context
- ✅ `useReducer` - Complex state logic
- ✅ `useMemo` - Optimize tính toán
- ✅ `useCallback` - Optimize functions
- ✅ `useRef` - DOM references
- ✅ Custom Hooks - Tái sử dụng logic

### 2. Context API & State Management
- AuthContext - Quản lý authentication
- CartContext - Quản lý giỏ hàng
- ProductContext - Quản lý sản phẩm
- Reducer pattern cho complex state

### 3. React Router
- Dynamic routing
- Protected routes
- Route parameters
- Nested routes
- Programmatic navigation

### 4. Performance Optimization
- React.memo
- Code splitting với React.lazy
- Suspense
- useMemo & useCallback
- Virtual scrolling cho danh sách lớn

### 5. Advanced Patterns
- Higher Order Components (HOC)
- Compound Components
- Render Props
- Controlled vs Uncontrolled Components

## 🎯 Tính năng chính

### Khách hàng
- ✅ Đăng ký / Đăng nhập
- ✅ Xem danh sách sản phẩm (grid/list view)
- ✅ Tìm kiếm & lọc sản phẩm
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng (thêm, xóa, cập nhật số lượng)
- ✅ Checkout & thanh toán
- ✅ Quản lý đơn hàng
- ✅ Đánh giá & review sản phẩm
- ✅ Wishlist
- ✅ Quản lý profile

### Admin
- ✅ Dashboard với thống kê
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Báo cáo doanh thu

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Context API + useReducer
- Axios
- CSS3 / CSS Modules

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Multer (upload ảnh)

## 📁 Cấu trúc dự án

```
ecommerces/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── product/
│       │   ├── cart/
│       │   └── layout/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       └── App.js
└── README.md
```

## 🚀 Cài đặt

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Cart
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:id
- DELETE /api/cart/:id

### Orders
- GET /api/orders
- POST /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status (Admin)

### Categories
- GET /api/categories
- POST /api/categories (Admin)
- PUT /api/categories/:id (Admin)
- DELETE /api/categories/:id (Admin)

## 🎓 Điểm học tập quan trọng

1. **Component Lifecycle**: Hiểu rõ khi nào component mount, update, unmount
2. **State vs Props**: Khi nào dùng state, khi nào dùng props
3. **Lifting State Up**: Chia sẻ state giữa components
4. **Composition vs Inheritance**: React ưu tiên composition
5. **Error Boundaries**: Xử lý lỗi React
6. **Portal**: Render component ngoài DOM hierarchy
7. **Refs**: Truy cập DOM trực tiếp khi cần
8. **Memoization**: Tối ưu performance

## 📖 Tài liệu tham khảo
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)

## 👨‍💻 Phù hợp cho
- Ứng viên React Junior/Middle
- Portfolio dự án
- Phỏng vấn technical
- Học tập React nâng cao
# ecommerces
