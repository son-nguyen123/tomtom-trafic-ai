# Hướng dẫn Cấu hình Firebase

## 📋 Yêu cầu
- Tài khoản Google
- Quyền truy cập Firebase Console

## 🚀 Các bước cấu hình

### 1️⃣ Tạo Firebase Project

**B1: Truy cập Firebase Console**
- Mở: https://console.firebase.google.com/
- Đăng nhập bằng Google Account

**B2: Tạo Project mới**
- Click "Add project" → "Create a project"
- Nhập tên: `tomtom-traffic-ai`
- Bỏ chọn "Enable Google Analytics" (optional)
- Click "Create project" → Chờ hoàn tất (~2 phút)

### 2️⃣ Cấu hình Firestore Database

**B1: Tạo Firestore Database**
- Vào **Build** → **Firestore Database**
- Click "Create database"
- Chọn location: `asia-southeast1` (Singapore)
- Chọn "Start in test mode"
- Click "Create"

**B2: Tạo Collections**

Tạo 3 collections sau:

#### a) Collection: `predictions`
```
Mục đích: Lưu trữ kết quả dự đoán
Cấu trúc tài liệu:
{
  location: string          // Vị trí
  congestionProbability: number  // Xác suất kẹt xe (0-100)
  severity: string          // 'low' | 'medium' | 'high' | 'critical'
  recommendations: array    // Danh sách khuyến nghị
  timestamp: timestamp      // Thời gian dự đoán
  hour: number             // Giờ (0-23)
  dayOfWeek: number        // Ngày (0-6)
}
```

#### b) Collection: `traffic-data`
```
Mục đích: Lưu trữ dữ liệu giao thông thực tế
Cấu trúc tài liệu:
{
  location: string          // Vị trí
  speed: number            // Tốc độ hiện tại (km/h)
  freeFlowSpeed: number    // Tốc độ bình thường (km/h)
  congestionLevel: number  // Mức độ kẹt (0-100)
  incidentCount: number    // Số sự cố
  timestamp: timestamp     // Thời gian
  hour: number            // Giờ
  dayOfWeek: number       // Ngày
}
```

#### c) Collection: `user-locations`
```
Mục đích: Lưu trữ vị trí của người dùng
Cấu trúc tài liệu:
{
  userId: string           // ID người dùng
  latitude: number         // Vĩ độ
  longitude: number        // Kinh độ
  lastUpdate: timestamp    // Cập nhật lần cuối
}
```

### 3️⃣ Cấu hình Firebase Authentication (Optional)

**B1: Enable Authentication**
- Vào **Build** → **Authentication**
- Click "Get started"
- Chọn "Email/Password"
- Enable nó

### 4️⃣ Cấu hình Security Rules

**Firestore Rules:**

Vào **Firestore Database** → **Rules**, thay đổi bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép read/write mọi collection (TEST MODE - sử dụng tạm thời)
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31);
    }
    
    // Hoặc cấu hình cụ thể cho từng collection:
    
    // Predictions - chỉ cho phép read, backend sẽ write
    match /predictions/{doc=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Traffic data - chỉ cho phép read
    match /traffic-data/{doc=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User locations - user chỉ có thể read/write của chính mình
    match /user-locations/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 5️⃣ Lấy Firebase Config cho Frontend

**B1: Tạo Web App**
- Vào **Project Settings** (biểu tượng ⚙️)
- Click "Your apps"
- Click "Add app" → Chọn "Web"
- Điền app name: `tomtom-traffic-web`
- Copy firebase config

**B2: Cập nhật file .env (frontend)**

```bash
cd frontend
```

Thêm vào `.env`:

```env
REACT_APP_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=tomtom-traffic-ai.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tomtom-traffic-ai
REACT_APP_FIREBASE_STORAGE_BUCKET=tomtom-traffic-ai.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 6️⃣ Cấu hình Service Account cho Backend

**B1: Tạo Service Account**
- Vào **Project Settings** → **Service Accounts**
- Click "Generate New Private Key"
- Một file JSON sẽ được download

**B2: Lưu file vào Backend**

```bash
# Copy file firebase-key.json vào:
cp ~/Downloads/tomtom-traffic-ai-xxxxx.json backend/firebase-key.json
```

**B3: Cập nhật .env (backend)**

```env
FIREBASE_PROJECT_ID=tomtom-traffic-ai
FIREBASE_KEY_PATH=./firebase-key.json
FIREBASE_DATABASE_URL=https://tomtom-traffic-ai.firebaseio.com
```

## 🧪 Kiểm tra Kết nối

### Test Firebase Connection

**Backend:**
```bash
cd backend
npm run dev
# Log: "Firebase initialized successfully"
```

**Frontend:**
```bash
cd frontend
npm start
# Kiểm tra browser console không có lỗi Firebase
```

## 📊 Xem dữ liệu Firestore

1. Vào **Firestore Database**
2. Các collections sẽ tự động tạo khi dữ liệu được insert
3. Xem dữ liệu real-time khi ứng dụng chạy

## 🔑 Quản lý API Keys

### ⚠️ Bảo mật
- **KHÔNG** commit `.env` vào Git
- **KHÔNG** share `firebase-key.json`
- Sử dụng environment variables
- Rotate keys định kỳ

### Xem danh sách Keys
- Vào **Project Settings** → **Service Accounts**
- Có thể delete keys cũ không dùng

## 🆘 Troubleshooting

### Lỗi: "Missing or insufficient permissions"
→ Check Firestore Security Rules

### Lỗi: "Invalid Firebase config"
→ Check biến .env có chính xác không

### Lỗi: "ENOENT: firebase-key.json not found"
→ Copy file service account vào đúng vị trí

### Firestore quota exceeded
→ Nâng cấp plan hoặc xóa dữ liệu test

## 📈 Nâng cấp Firebase Plan

**So sánh Plans:**

| Feature | Spark (Free) | Blaze (Pay-as-you-go) |
|---------|-------------|---------------------|
| Firestore storage | 1GB | Unlimited |
| Daily writes | 20,000 | Unlimited |
| Real-time | ✅ | ✅ |
| Authentication | ✅ | ✅ |

Để upgrade:
- Firebase Console → **Upgrade**
- Chọn **Blaze plan**
- Thêm payment method

## 📚 Tài liệu tham khảo

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/rules)

---

**Hoàn tất! Bây giờ bạn đã sẵn sàng chạy ứng dụng. 🎉**
