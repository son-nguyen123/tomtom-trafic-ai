# 🔧 Hướng dẫn Tích hợp Firebase - Từng Bước

## 🎯 Các bước thực hiện

### 🟢 STEP 1: Copy Firebase Config

#### 1.1 Mở Firebase Console
- Truy cập: https://console.firebase.google.com/
- Chọn project: `tomtom-traffic-ai`
- Vào **Project Settings** (biểu tượng ⚙️)
- Click tab **Your apps**

#### 1.2 Copy config từ Web App
- Nếu chưa có web app, click "Add app" → "Web"
- Tìm đoạn `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tomtom-traffic-ai.firebaseapp.com",
  projectId: "tomtom-traffic-ai",
  storageBucket: "tomtom-traffic-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
  measurementId: "G-ABC123DEF"
};
```

💾 **Lưu vào Notepad tạm thời**

---

### 🟢 STEP 2: Cài Firebase vào Project Frontend

Mở **PowerShell** trong thư mục project:

```bash
cd c:\Project\tomtom-trafic-ai\frontend

npm install firebase
```

⏳ Chờ cài đặt (~2-3 phút)

**Output khi hoàn tất:**
```
added 123 packages, and audited 234 packages
```

---

### 🟢 STEP 3: Tạo File Cấu hình Firebase

Tạo file: `frontend/src/firebase.js`

Nội dung:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ Thay YOUR_API_KEY bằng API key từ step 1
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tomtom-traffic-ai.firebaseapp.com",
  projectId: "tomtom-traffic-ai",
  storageBucket: "tomtom-traffic-ai.appspot.com",
  messagingSenderId: "134196708136",
  appId: "1:134196708136:web:3474563d78e454407e861d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**Thay thế:**
- `YOUR_API_KEY` → Copy từ Step 1
- Các giá trị khác → Sao chép từ Firebase Console

---

### 🟢 STEP 4: Test Ghi Dữ Liệu Firestore

#### 4.1 Dùng App-Test.tsx (cách dễ nhất)

**Sao chép file test đã tạo sẵn:**

```bash
cd frontend
cp src/App-Test.tsx src/App.tsx
```

Hoặc nếu bạn muốn giữ App.tsx cũ:
```bash
# Chỉ copy nội dung và paste vào App.tsx
```

#### 4.2 Chạy Frontend

```bash
cd frontend
npm start
```

**Output:**
```
Compiled successfully!
You can now view tomtom-traffic-frontend in the browser.
  Local: http://localhost:3000
```

Trình duyệt sẽ tự mở, nếu không:
- Truy cập: http://localhost:3000

---

### 🟢 STEP 5: Test Button Firebase

Trong ứng dụng, bạn sẽ thấy:

```
🧪 Test Firebase
┌─────────────────┐
│ Add Test Data   │  ← Click nút này
└─────────────────┘
```

**Làm theo:**

1. **Click nút "Add Test Data"**
   - Nút sẽ show "Đang gửi..."

2. **Chờ kết quả**
   - ✅ Thành công: `✅ Thành công! Document ID: abc123...`
   - ❌ Lỗi: `❌ Lỗi: [mô tả lỗi]`

---

### 🟢 STEP 6: Kiểm tra Firestore Database

#### 6.1 Mở Firestore Console

1. Vào: https://console.firebase.google.com/
2. Chọn project: `tomtom-traffic-ai`
3. Click **Firestore Database** (bên trái)

#### 6.2 Kiểm tra Collection

Bạn sẽ thấy cấu trúc:

```
Firestore Database
├─ traffic-data (collection)
│  ├─ autoID123 (document)
│  │  ├─ location: "Da Nang City Center"
│  │  ├─ speed: 40
│  │  ├─ freeFlowSpeed: 60
│  │  ├─ congestionLevel: 30
│  │  ├─ incidentCount: 1
│  │  ├─ timestamp: Jan 30, 2026, 2:45:30 PM
│  │  ├─ hour: 14
│  │  └─ dayOfWeek: 3
```

✅ **Nếu thấy dữ liệu → Firebase đã hoạt động!**

---

## 🚨 Troubleshooting

### ❌ Lỗi: "Firebase is not defined"

**Nguyên nhân:** Chưa import firebase.js

**Cách khắc phục:**
- Thêm vào đầu App.tsx:
```typescript
import { db } from './firebase';
```

---

### ❌ Lỗi: "firebaseConfig is invalid"

**Nguyên nhân:** Config sai, API key chưa đúng

**Cách khắc phục:**
1. Vào Firebase Console
2. Copy lại config đầy đủ
3. Check kỹ lưỡng từng field

---

### ❌ Lỗi: "Missing or insufficient permissions"

**Nguyên nhân:** Firestore Security Rules chặn

**Cách khắc phục:**
1. Vào **Firestore Database** → **Rules**
2. Cập nhật:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31);
    }
  }
}
```
3. Click **Publish**

---

### ❌ Lỗi: "Module not found: firebase"

**Nguyên nhân:** Chưa cài firebase package

**Cách khắc phục:**
```bash
cd frontend
npm install firebase
```

---

### ❌ Ứng dụng không kết nối được Firebase

**Kiểm tra:**
1. Mở **Browser DevTools** (F12)
2. Tab **Console** → Tìm lỗi
3. Tab **Network** → Kiểm tra firestore requests

---

## ✅ Kiểm tra Hoàn tất

- [ ] Firebase cài đặt thành công? (`npm install firebase`)
- [ ] File `src/firebase.js` được tạo?
- [ ] Config có API key đúng?
- [ ] App.tsx import firebase.js?
- [ ] Frontend chạy tại :3000?
- [ ] Nút "Add Test Data" hoạt động?
- [ ] Data xuất hiện trong Firestore Console?

---

## 🎉 Bước Tiếp Theo

Sau khi Firebase hoạt động, bạn có thể:

### ✅ 1. Đọc dữ liệu từ Firestore
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';

const q = query(collection(db, 'traffic-data'), 
  where('location', '==', 'Da Nang'));
const snapshot = await getDocs(q);
```

### ✅ 2. Lắng nghe thay đổi Real-time
```javascript
import { onSnapshot } from 'firebase/firestore';

onSnapshot(collection(db, 'traffic-data'), (snapshot) => {
  snapshot.docs.forEach(doc => {
    console.log(doc.data());
  });
});
```

### ✅ 3. Kết nối Backend
- Backend (Node.js) sẽ ghi dữ liệu vào Firestore
- Frontend đọc dữ liệu từ Firestore
- Hiển thị trên bản đồ & chart

### ✅ 4. Thêm Authentication
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
```

### ✅ 5. Deploy
- Frontend: Vercel, Netlify
- Backend: Heroku, AWS

---

## 📞 Cần Hỗ Trợ?

- Lỗi Firebase? → Xem **Troubleshooting** phía trên
- Cấu hình sai? → Double-check API key
- Vẫn có lỗi? → Check browser console (F12)

---

**🎯 Lúc này bạn đã sẵn sàng cho bước tiếp theo!**
