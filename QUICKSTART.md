# Hướng dẫn Chạy Ứng dụng

## 🎬 Start nhanh (Quick Start)

### Yêu cầu
- Node.js 16+ ([Download](https://nodejs.org/))
- npm (đi kèm Node.js)

### Bước 1: Cài đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (mở terminal khác)
cd frontend
npm install
```

### Bước 2: Cấu hình Environment

**Backend - `backend/.env`:**
```env
TOMTOM_API_KEY=ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV
FIREBASE_PROJECT_ID=tomtom-traffic-ai
PORT=5000
NODE_ENV=development
```

**Frontend - `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_TOMTOM_API_KEY=ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV
```

### Bước 3: Chạy Ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Output: Server running on port 5000
# Kiểm tra: http://localhost:5000/health
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Ứng dụng sẽ tự mở tại: http://localhost:3000
```

## 📱 Sử dụng Ứng dụng

### Giao diện chính

```
┌─────────────────────────────────────────────────────────┐
│ 🚗 Dự đoán kẹt xe thời gian thực          ⚠️ Giờ cao điểm │
├──────────────────────┬──────────────────────────────────┤
│                      │  Dự đoán kẹt xe                  │
│   TOMTOM MAP         │  ├─ Vị trí: ...                  │
│                      │  ├─ Mức độ: HIGH                 │
│                      │  └─ Khuyến nghị: ...             │
│                      │                                   │
│                      │  Sự cố giao thông (3)             │
│                      │  ├─ 🚗 Tai nạn...               │
│                      │  └─ 🚦 Tắc đường...             │
│                      │                                   │
│                      │  ⏰ Giờ cao điểm                 │
│                      │  ├─ Sáng: 7:00-9:00             │
│                      │  └─ Chiều: 17:00-20:00          │
└──────────────────────┴──────────────────────────────────┘
```

### Các chức năng chính

1. **Xem bản đồ** - Hiển thị giao thông thời gian thực
2. **Dự đoán** - Phân tích mức độ kẹt xe
3. **Sự cố** - Xem các tai nạn, đoạn đường đóng cửa
4. **Giờ cao điểm** - Biết khi nào là cao điểm

## 🔧 Lệnh Hữu ích

### Backend

```bash
cd backend

# Chạy dev mode (auto-reload)
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Chạy tests
npm test
```

### Frontend

```bash
cd frontend

# Chạy dev mode
npm start

# Build production
npm run build

# Chạy tests
npm test

# Eject configuration (không khuyến cáo)
npm run eject
```

## 📊 API Testing

### Test với curl

```bash
# Health check
curl http://localhost:5000/health

# Lấy giờ cao điểm
curl http://localhost:5000/api/prediction/peak-hours

# Lấy traffic flow
curl "http://localhost:5000/api/traffic/flow?lat=21.0285&lon=105.8542"

# Dự đoán kẹt xe
curl -X POST http://localhost:5000/api/prediction/traffic \
  -H "Content-Type: application/json" \
  -d '{
    "currentData": [{
      "location": "Hanoi",
      "speed": 25,
      "freeFlowSpeed": 50,
      "congestionLevel": 50,
      "incidentCount": 2
    }],
    "historicalData": []
  }'
```

### Sử dụng Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import API collection (create mới hoặc import file)
3. Đặt base URL: `http://localhost:5000/api`
4. Test các endpoints

## 🐛 Debug Mode

### Backend
```bash
# Với logs chi tiết
NODE_ENV=development npm run dev

# Trong code:
console.log('Debug:', data);
```

### Frontend
```bash
# Browser DevTools
- F12 hoặc Ctrl+Shift+I
- Tab Console để xem logs
- Tab Network để xem API calls
```

## 📈 Performance Optimization

### Frontend
```bash
# Build optimized version
npm run build

# Kích thước: ~150KB gzipped
```

### Backend
```bash
# Caching responses
# - Traffic data: 5 phút
# - Predictions: 1 phút
```

## 🚨 Lỗi Phổ Biến

### "port 5000 already in use"
```bash
# Kill process sử dụng port
lsof -i :5000
kill -9 <PID>

# Hoặc thay đổi PORT trong .env
PORT=3001
```

### "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install firebase-admin
```

### "TomTom Map not displaying"
- Check API key trong .env
- Check CORS configuration
- Check browser console cho errors

### "CORS error"
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend CORS đã được cấu hình, check:
- Frontend URL config
- Backend CORS middleware

## 📱 Responsive Testing

```bash
# Chrome DevTools
1. F12 → Click "Toggle device toolbar"
2. Chọn device: iPhone, iPad, Android
3. Test responsive layout
```

## 🔐 Cài đặt Firebase

Xem chi tiết tại: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 📝 Logs & Monitoring

### Backend logs
```
[5000] Server running on port 5000
[5000] Firebase initialized successfully
[GET /health] 200 OK
[POST /api/prediction/traffic] 200 OK
```

### Frontend logs
```
Console: API Call: /api/prediction/traffic
Console: Prediction received: {...}
Console: Saved to Firebase: {id: 'abc123'}
```

## 🛠️ Troubleshooting Checklist

- [ ] Node.js 16+ cài đặt?
- [ ] npm packages cài đặt? (`npm install`)
- [ ] .env files cấu hình đúng?
- [ ] Backend chạy port 5000?
- [ ] Frontend chạy port 3000?
- [ ] TomTom API key chính xác?
- [ ] Firebase keys cấu hình? (optional)
- [ ] Browser console không có lỗi?

## 🎓 Tiếp theo

1. **Thêm tính năng:**
   - Authentication
   - User profiles
   - Saved locations
   - Push notifications

2. **Cải thiện ML Model:**
   - TensorFlow.js
   - Historical data analysis
   - Weather integration

3. **Deploy:**
   - Backend: Heroku, AWS, Google Cloud
   - Frontend: Vercel, Netlify, GitHub Pages

## 📚 Tài liệu tham khảo

- [Node.js Docs](https://nodejs.org/docs/)
- [React Docs](https://react.dev/)
- [TomTom API](https://developer.tomtom.com/)
- [Firebase Docs](https://firebase.google.com/docs)

## 💬 Support

Nếu gặp vấn đề:
1. Kiểm tra lỗi trong console
2. Xem troubleshooting bên trên
3. Check logs backend/frontend
4. Google lỗi code + "npm" hoặc "React"

---

**Happy coding! 🚀**
