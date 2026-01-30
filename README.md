# TomTom Traffic AI - Dự đoán kẹt xe

Ứng dụng web dự đoán tình hình giao thông sử dụng **TomTom API** và **Firebase**.

## 🎯 Tính năng

✅ **Bản đồ tương tác** - Hiển thị tình hình giao thông thời gian thực với TomTom  
✅ **Dự đoán kẹt xe** - Phân tích và dự đoán mức độ kẹt xe dựa vào:
   - Giờ cao điểm (7-9, 11-13, 17-20)
   - Ngày trong tuần
   - Dữ liệu lịch sử
   
✅ **Sự cố giao thông** - Hiển thị các tai nạn, đoạn đường đóng cửa  
✅ **Khuyến nghị** - Đề xuất cải thiện dựa trên mức độ kẹt xe  
✅ **Lưu trữ Firebase** - Các dữ liệu được lưu tự động lên Firestore  

## 📁 Cấu trúc Dự án

```
tomtom-traffic-ai/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── server.ts       # Main server
│   │   ├── services/       # Business logic
│   │   │   ├── tomtom.ts   # TomTom API integration
│   │   │   ├── firebase.ts # Firebase config
│   │   │   └── prediction.ts # ML predictions
│   │   └── routes/         # API endpoints
│   │       ├── traffic.ts
│   │       ├── prediction.ts
│   │       └── firebase.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapComponent.tsx
│   │   │   ├── PredictionPanel.tsx
│   │   │   └── IncidentsPanel.tsx
│   │   ├── services/
│   │   │   ├── api.ts      # API calls
│   │   │   └── firebase.ts # Firebase config
│   │   ├── App.tsx         # Main component
│   │   ├── types.ts        # TypeScript types
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── .env
│
└── ml-model/               # Python ML Models (optional)
```

## 🚀 Hướng dẫn Cài đặt

### 1. **Prerequisites**
- Node.js 16+ và npm
- Python 3.8+ (nếu dùng ML model)
- Tài khoản Firebase
- TomTom API Key: `ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV` (đã cung cấp)

### 2. **Backend Setup**

```bash
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env
```

**Cấu hình file .env:**
```env
TOMTOM_API_KEY=ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
PORT=5000
```

**Kiểm tra cấu hình:**
```bash
npm run check-setup
```

**Chạy Backend:**
```bash
npm run dev
# Server chạy tại: http://localhost:5000
```

### 3. **Frontend Setup**

```bash
cd frontend
npm install
```

**Cấu hình .env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_TOMTOM_API_KEY=ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
# ... các biến Firebase khác
```

**Chạy Frontend:**
```bash
npm start
# App sẽ mở tại: http://localhost:3000
```

## 🔧 Cấu hình Firebase

### Bước 1: Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Điền tên dự án và cấu hình

### Bước 2: Setup Firestore
1. Vào **Firestore Database**
2. Click "Create database" → Chọn "Start in test mode"
3. Tạo collections:
   - `predictions` - Lưu dự đoán
   - `traffic-data` - Lưu dữ liệu giao thông thực tế
   - `user-locations` - Vị trí của người dùng

### Bước 3: Tạo Service Account (cho Backend)
1. Vào **Project Settings** → **Service Accounts**
2. Click "Generate New Private Key"
3. Lưu file JSON vào `backend/firebase-key.json`

### Bước 4: Lấy Firebase Config (cho Frontend)
1. Vào **Project Settings** → **Your apps**
2. Copy config và thêm vào `frontend/.env`

## 📊 API Endpoints

### Traffic Endpoints
- `GET /api/traffic/flow?lat={lat}&lon={lon}&zoom={zoom}` - Lấy traffic flow
- `GET /api/traffic/incidents?bbox={bbox}&maxIncidents={max}` - Lấy sự cố
- `GET /api/traffic/route?origin={origin}&destination={destination}` - Tính route

### Prediction Endpoints
- `POST /api/prediction/traffic` - Dự đoán kẹt xe
- `GET /api/prediction/peak-hours` - Lấy giờ cao điểm

### Firebase Endpoints
- `POST /api/firebase/save-prediction` - Lưu dự đoán
- `GET /api/firebase/predictions/{location}` - Lấy lịch sử dự đoán
- `POST /api/firebase/save-traffic-data` - Lưu dữ liệu giao thông
- `GET /api/firebase/traffic-data/{location}` - Lấy dữ liệu lịch sử

## 🧠 Mô hình Dự đoán

Mô hình dự đoán dựa trên:

1. **Dữ liệu tức thời:**
   - Tốc độ hiện tại vs tốc độ bình thường
   - Số lượng sự cố (tai nạn, đoàn đường)

2. **Dữ liệu lịch sử:**
   - Tốc độ trung bình cùng giờ
   - Mô hình tắc đường theo ngày tuần

3. **Heuristics:**
   - Giờ cao điểm: +20 điểm
   - Mỗi sự cố: +5 điểm
   - Tính toán phần trăm: (freeFlowSpeed - currentSpeed) / freeFlowSpeed * 100

**Mức độ:**
- 0-25: Low (Xanh 🟢)
- 25-50: Medium (Vàng 🟡)
- 50-75: High (Cam 🟠)
- 75-100: Critical (Đỏ 🔴)

## 🔐 Bảo mật

- Lưu API keys trong `.env` (không commit vào git)
- Sử dụng Firebase Security Rules để bảo vệ Firestore
- Validate tất cả input từ client
- CORS được cấu hình cho frontend URL

## 📱 Responsive Design

Ứng dụng hỗ trợ:
- Desktop (1920+)
- Tablet (768-1024)
- Mobile (< 768px)

## 🐛 Troubleshooting

### TomTom Map không load
- Kiểm tra API key trong `.env`
- Kiểm tra CORS headers

### Firebase connection error
- Verify firebase-key.json (backend)
- Check Firebase credentials (frontend)
- Xem Firebase Security Rules

### Backend not responding
- Check port 5000 không bị chiếm dụng
- Restart server: `npm run dev`

### ⚠️ Lỗi 404: NOT_FOUND
Nếu bạn gặp lỗi 404 NOT_FOUND từ TomTom API, vui lòng xem **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** để được hướng dẫn chi tiết.

Các nguyên nhân thường gặp:
- Thiếu file `.env` hoặc API key không đúng
- Backend chưa được khởi động
- Tọa độ không hợp lệ
- API endpoint không tồn tại

## 📈 Các cải tiến trong tương lai

- [ ] ML model nâng cao (TensorFlow.js)
- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] Historical data analytics dashboard
- [ ] Mobile app
- [ ] Push notifications
- [ ] Integration với Google Maps

## 📝 License

MIT License

## 👤 Support

Nếu cần hỗ trợ, liên hệ: [your-email]

---

**Chúc bạn thành công! 🎉**
