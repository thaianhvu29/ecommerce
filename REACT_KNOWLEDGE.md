# 📚 Kiến thức React được áp dụng trong dự án

Dự án này được thiết kế để showcase các kiến thức React quan trọng mà nhà tuyển dụng thường tìm kiếm.

## 1. React Hooks 🎣

### useState
**File:** Hầu hết các components
**Mục đích:** Quản lý local state
```javascript
const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### useEffect
**File:** `Home.js`, `Products.js`, `ProductDetail.js`, `Orders.js`
**Mục đích:** Side effects, API calls, subscriptions
```javascript
useEffect(() => {
  fetchProducts();
}, [filters]); // Dependency array - chạy khi filters thay đổi
```

### useContext
**File:** `AuthContext.js`, `CartContext.js`
**Mục đích:** Truy cập context values
```javascript
const { user, isAuthenticated } = useAuth();
```

### useReducer
**File:** `AuthContext.js`, `CartContext.js`
**Mục đích:** Quản lý complex state logic
```javascript
const [state, dispatch] = useReducer(authReducer, initialState);
dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
```

### useMemo
**File:** `ProductCard.js`, `Products.js`
**Mục đích:** Optimize performance - memoize expensive calculations
```javascript
const displayPrice = useMemo(() => {
  return product.price.toLocaleString('vi-VN');
}, [product.price]);
```

### useCallback
**File:** `Home.js`, `Products.js`
**Mục đích:** Memoize functions để tránh re-create
```javascript
const handleAddToCart = useCallback(async (product) => {
  // logic
}, [isAuthenticated]);
```

### Custom Hooks
**Files:** `hooks/useFetch.js`, `hooks/useDebounce.js`, `hooks/useToggle.js`, `hooks/useLocalStorage.js`
**Mục đích:** Tái sử dụng logic giữa components

## 2. Context API 🌐

### AuthContext
**File:** `context/AuthContext.js`
**Kiến thức:**
- Context Provider pattern
- useReducer cho complex state
- Custom hook (useAuth)
- Authentication state management

### CartContext  
**File:** `context/CartContext.js`
**Kiến thức:**
- Shopping cart state
- CRUD operations trong context
- Derived state (cartItemsCount)

## 3. React Router 🛣️

**File:** `App.js`
**Kiến thức:**
- BrowserRouter
- Routes & Route
- Dynamic routes (`:id`)
- Protected Routes (HOC pattern)
- useNavigate hook
- useParams hook
- Link component

```javascript
<Route path="/products/:id" element={<ProductDetail />} />
<Route path="/cart" element={
  <PrivateRoute>
    <Cart />
  </PrivateRoute>
} />
```

## 4. Performance Optimization ⚡

### React.memo
**File:** `ProductCard.js`, `Header.js`
**Mục đích:** Prevent unnecessary re-renders
```javascript
export default React.memo(ProductCard);
```

### React.lazy & Suspense
**File:** `App.js`
**Mục đích:** Code splitting, lazy loading
```javascript
const Home = lazy(() => import('./pages/Home'));

<Suspense fallback={<Loading />}>
  <Routes>...</Routes>
</Suspense>
```

### useCallback & useMemo
Đã đề cập ở trên - tránh re-create functions và re-calculate values

## 5. Component Patterns 🎨

### Higher Order Component (HOC)
**File:** `PrivateRoute.js`
**Mục đích:** Wrap components để add functionality
```javascript
const PrivateRoute = ({ children, adminOnly }) => {
  // Logic kiểm tra authentication
  return children;
};
```

### Compound Components
**File:** Form components
**Mục đích:** Components làm việc cùng nhau

### Controlled Components
**File:** `Login.js`, `Register.js`, `Profile.js`, `Checkout.js`
**Mục đích:** Form handling với React state
```javascript
<input 
  value={formData.email}
  onChange={handleChange}
/>
```

## 6. State Management Patterns 📊

### Lifting State Up
Chia sẻ state giữa sibling components bằng cách đưa lên parent

### Props Drilling Solution
Dùng Context API thay vì pass props qua nhiều layers

### Reducer Pattern
Complex state logic với useReducer
```javascript
const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD': return { ...state, items: [...state.items, action.payload] };
    default: return state;
  }
};
```

## 7. Side Effects & Data Fetching 🔄

### API Integration
**File:** `services/api.js`
**Kiến thức:**
- Axios interceptors
- Request/Response handling
- Error handling
- Token management

### Async Operations
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
    }
  };
  fetchData();
}, []);
```

## 8. Advanced Concepts 🚀

### Error Boundaries
Có thể thêm để catch React errors

### Portal
Có thể dùng cho modals, tooltips

### Refs (useRef)
Có thể dùng cho DOM manipulation, focus management

### Custom Events
Có thể implement pub/sub pattern

## 9. Form Handling 📝

**Files:** `Login.js`, `Register.js`, `Checkout.js`, `Profile.js`

**Kiến thức:**
- Controlled components
- Form validation
- Multi-step forms (có thể extend)
- Submit handling
- Error display

## 10. List & Keys 📋

**Files:** `Products.js`, `Cart.js`, `Orders.js`

**Kiến thức:**
```javascript
{products.map(product => (
  <ProductCard key={product._id} product={product} />
))}
```

## 11. Conditional Rendering 🔀

**Ví dụ:**
```javascript
{loading ? <Loading /> : <ProductList />}
{user ? <UserMenu /> : <LoginButton />}
{cart.items.length === 0 && <EmptyCart />}
```

## 12. Event Handling 🎯

**Kiến thức:**
- onClick, onChange, onSubmit
- Synthetic Events
- Event.preventDefault()
- Event.stopPropagation()
```javascript
const handleSubmit = (e) => {
  e.preventDefault(); // Prevent page reload
  // Submit logic
};
```

## 📝 Câu hỏi phỏng vấn thường gặp

### 1. Sự khác biệt giữa useState và useReducer?
- useState: Simple state
- useReducer: Complex state với nhiều sub-values hoặc logic phức tạp

### 2. Khi nào dùng useCallback vs useMemo?
- useCallback: Memoize functions
- useMemo: Memoize computed values

### 3. Context API vs Redux?
- Context: Built-in, đủ cho app vừa/nhỏ
- Redux: Powerful, devtools, middleware cho app lớn

### 4. Tại sao cần dependency array trong useEffect?
- Kiểm soát khi nào effect chạy
- [] = chỉ chạy 1 lần (mount)
- [deps] = chạy khi deps thay đổi
- No array = chạy mỗi render

### 5. React.memo hoạt động như thế nào?
Shallow comparison props, chỉ re-render khi props thay đổi

### 6. Lazy loading là gì?
Code splitting để load components khi cần, giảm bundle size

### 7. Controlled vs Uncontrolled components?
- Controlled: React state control value
- Uncontrolled: DOM control value (ref)

## 🎓 Điểm mạnh của dự án này

✅ Real-world application (Ecommerce)
✅ Modern React (Hooks, Context API)
✅ Performance optimization
✅ Clean code structure
✅ Reusable components
✅ Custom hooks
✅ Proper state management
✅ API integration
✅ Authentication flow
✅ Protected routes
✅ Form handling & validation
✅ Responsive design ready

## 📖 Tài liệu tham khảo

- [React Official Docs](https://react.dev)
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com)
- [React Patterns](https://reactpatterns.com)

---

**Lưu ý:** Dự án này cover hầu hết kiến thức React cần thiết cho vị trí Junior-Middle React Developer. Có thể mở rộng thêm với Redux, TypeScript, Testing, hoặc Next.js tùy yêu cầu.
