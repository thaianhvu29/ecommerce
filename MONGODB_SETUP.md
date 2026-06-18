# 🍃 Hướng dẫn cài đặt MongoDB Atlas (Cloud Database)

## Tại sao nên dùng MongoDB Atlas?
✅ Miễn phí 512MB
✅ Không cần cài đặt gì
✅ Tự động backup
✅ Bảo mật cao
✅ Dễ setup (5 phút)

---

## Bước 1: Tạo tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký bằng:
   - Email
   - Hoặc Google account
   - Hoặc GitHub account

---

## Bước 2: Tạo Organization & Project

1. Sau khi đăng nhập, tạo Organization (hoặc dùng default)
2. Tạo Project mới:
   - Click **New Project**
   - Đặt tên: `Ecommerce`
   - Click **Create Project**

---

## Bước 3: Tạo Database Cluster

1. Click **Build a Database**
2. Chọn **FREE** tier (M0 Sandbox)
   - 512 MB Storage
   - Shared RAM
   - No Credit Card Required
3. Chọn Provider: **AWS** (hoặc GCP, Azure)
4. Chọn Region gần nhất:
   - Singapore (ap-southeast-1)
   - Hoặc Tokyo (ap-northeast-1)
5. Cluster Name: `Cluster0` (default)
6. Click **Create**

⏳ Đợi 1-3 phút để cluster được tạo

---

## Bước 4: Tạo Database User

1. Trong tab **Security** → **Database Access**
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `ecommerceUser` (hoặc tên bạn muốn)
5. Password: Tạo password mạnh (VD: `EcomPass2024!`)
   - **⚠️ LƯU PASSWORD NÀY LẠI!**
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

---

## Bước 5: Whitelist IP Address

1. Trong tab **Security** → **Network Access**
2. Click **Add IP Address**
3. Có 2 cách:
   
   **Cách 1 - Cho phép tất cả (Development):**
   - Click **Allow Access from Anywhere**
   - IP: `0.0.0.0/0`
   - ⚠️ Chỉ dùng cho development/testing
   
   **Cách 2 - IP cụ thể (Production):**
   - Click **Add Current IP Address**
   - Thêm IP máy của bạn

4. Click **Confirm**

---

## Bước 6: Lấy Connection String

1. Quay lại **Clusters** → Click **Connect**
2. Chọn **Connect your application**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy Connection String:

```
mongodb+srv://ecommerceUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **⚠️ QUAN TRỌNG:**
   - Thay `<password>` bằng password thật (từ bước 4)
   - Thêm database name: `/ecommerce` sau `.net`

**Connection String cuối cùng:**
```
mongodb+srv://ecommerceUser:EcomPass2024!@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## Bước 7: Cấu hình Backend

Mở file `backend/.env` và cập nhật:

```env
PORT=5000
MONGODB_URI=mongodb+srv://ecommerceUser:EcomPass2024!@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=ecommerce_secret_key_2024_change_this_in_production
NODE_ENV=development
```

**⚠️ Chú ý:**
- Thay URL bằng URL thực tế của bạn
- Nếu password có ký tự đặc biệt, cần encode:
  - `@` → `%40`
  - `#` → `%23`
  - `!` → `%21`

---

## Bước 8: Test kết nối

```bash
cd backend
node test-connection.js
```

**Kết quả mong đợi:**
```
🔄 Đang kết nối MongoDB...
✅ Kết nối MongoDB thành công!
📦 Database: ecommerce
```

---

## Bước 9: Chạy Backend

```bash
npm run dev
```

**Kết quả mong đợi:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

---

## 🎉 Xem Database trong MongoDB Compass

### Cách 1: MongoDB Atlas UI
1. Vào Clusters → Click **Browse Collections**
2. Xem data trực tiếp trên web

### Cách 2: MongoDB Compass (App)
1. Tải MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Paste connection string vào
3. Connect và xem data

---

## 🔒 Security Best Practices

### Development:
✅ Allow IP `0.0.0.0/0`
✅ Dùng .env file (không commit)
✅ Password phức tạp

### Production:
✅ Whitelist chỉ IP server
✅ Dùng environment variables
✅ Enable 2FA cho MongoDB Atlas
✅ Định kỳ rotate credentials
✅ Backup tự động

---

## 📊 Quản lý Database

### Xem Collections
Sau khi chạy app, bạn sẽ thấy các collections:
- users
- products
- categories
- carts
- orders
- reviews

### Xóa tất cả data (Reset)
```javascript
// Trong MongoDB Atlas UI → Collections → Drop Collection
// Hoặc dùng code:
db.users.deleteMany({})
db.products.deleteMany({})
// ... etc
```

---

## ❓ FAQ

**Q: Miễn phí vĩnh viễn không?**
A: Free tier (M0) miễn phí vĩnh viễn với 512MB storage.

**Q: Nếu hết 512MB thì sao?**
A: Upgrade lên paid tier hoặc tạo cluster mới.

**Q: Có thể tạo nhiều cluster free không?**
A: Có, nhưng chỉ 1 cluster free/project.

**Q: Atlas có chậm không?**
A: Rất nhanh nếu chọn region gần.

**Q: Có cần credit card không?**
A: KHÔNG! Free tier không cần thẻ.

---

## 🆘 Support

Nếu gặp vấn đề:
1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Docs: https://docs.atlas.mongodb.com/
3. Community: https://www.mongodb.com/community/forums/

---

**✅ Sau khi hoàn thành, bạn đã có:**
- ✅ MongoDB database (cloud)
- ✅ User với quyền truy cập
- ✅ Connection string
- ✅ IP whitelist
- ✅ Backend kết nối thành công
