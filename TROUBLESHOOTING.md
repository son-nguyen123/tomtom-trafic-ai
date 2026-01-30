# Hướng dẫn khắc phục lỗi / Troubleshooting Guide

## 1. Lỗi 404: NOT_FOUND từ TomTom API

### Triệu chứng (Symptoms)
```
404: NOT_FOUND
Code: NOT_FOUND
ID: hkg1::znrq2-1769793360800-26175005820b
```

### Nguyên nhân (Root Causes)

#### A. Thiếu cấu hình API Key
**Vấn đề:** File `.env` chưa được tạo hoặc không có API key hợp lệ

**Giải pháp:**
```bash
cd backend
cp .env.example .env
```

Sau đó chỉnh sửa file `.env`:
```env
TOMTOM_API_KEY=ugKctsVuAHXAIR1NUGxnkDtaPXwbZ5pV
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080
```

#### B. Backend không chạy
**Vấn đề:** Backend server chưa được khởi động

**Giải pháp:**
```bash
cd backend
npm install
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

Kiểm tra health check: `curl http://localhost:5000/health`

#### C. Tọa độ không hợp lệ
**Vấn đề:** Tọa độ (latitude, longitude) nằm ngoài phạm vi hợp lệ

**Giải pháp:**
- Latitude phải từ -90 đến 90
- Longitude phải từ -180 đến 180
- Đối với Đà Nẵng: `lat=16.0544, lon=108.2022`

#### D. TomTom API endpoint không tồn tại
**Vấn đề:** Đường dẫn API không đúng hoặc phương thức HTTP sai

**Kiểm tra các endpoint hợp lệ:**
- `GET /api/traffic/flow?lat={lat}&lon={lon}&zoom={zoom}`
- `GET /api/traffic/incidents?bbox={bbox}&maxIncidents={max}`
- `GET /api/traffic/route?origin={origin}&destination={destination}`

## 2. Lỗi CORS (Cross-Origin Resource Sharing)

### Triệu chứng
```
Access to fetch at 'http://localhost:5000/api/...' from origin '...' 
has been blocked by CORS policy
```

### Giải pháp
Thêm origin của bạn vào file `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080,http://your-domain.com
```

## 3. Lỗi "Cannot find module"

### Triệu chứng
```
Error: Cannot find module 'express'
```

### Giải pháp
```bash
cd backend
rm -rf node_modules
rm package-lock.json
npm install
```

## 4. Lỗi kết nối TomTom API (401/403)

### Triệu chứng
```
TomTom API authentication failed. Please check your API key.
```

### Giải pháp
1. Kiểm tra API key trong file `.env`
2. Đảm bảo API key hợp lệ (xem trong README.md)
3. Kiểm tra giới hạn sử dụng API (rate limit)

## 5. Frontend không hiển thị bản đồ

### Triệu chứng
- Bản đồ không load
- Console hiển thị lỗi TomTom SDK

### Giải pháp A: Sử dụng index-simple.html
```bash
# Mở file này nếu không cần bản đồ tương tác
cd frontend
# Mở index-simple.html trong browser
```

### Giải pháp B: Kiểm tra kết nối CDN
```bash
# Mở cdn-test.html để test CDN
cd /
# Mở cdn-test.html trong browser
```

## 6. Dữ liệu không tải được

### Kiểm tra theo thứ tự:

#### Bước 1: Kiểm tra backend
```bash
curl http://localhost:5000/health
```
Kết quả mong đợi:
```json
{
  "status": "OK",
  "message": "TomTom Traffic AI Backend is running",
  "timestamp": "2024-..."
}
```

#### Bước 2: Test API trực tiếp
```bash
# Test traffic flow
curl "http://localhost:5000/api/traffic/flow?lat=16.0544&lon=108.2022&zoom=10"

# Test incidents
curl "http://localhost:5000/api/traffic/incidents?bbox=107.9,15.9,108.3,16.2&maxIncidents=10"
```

#### Bước 3: Kiểm tra logs
```bash
cd backend
npm run dev
# Xem console logs để tìm lỗi
```

## 7. Port 5000 đã bị chiếm dụng

### Triệu chứng
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Giải pháp A: Thay đổi port
Chỉnh sửa `.env`:
```env
PORT=5001
```

Và cập nhật frontend:
```javascript
const API_URL = 'http://localhost:5001/api';
```

### Giải pháp B: Kill process đang dùng port 5000
```bash
# Trên Linux/Mac
lsof -ti:5000 | xargs kill -9

# Trên Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

## 8. Checklist tổng hợp

Trước khi báo lỗi, hãy kiểm tra:

- [ ] Backend đã cài đặt dependencies (`npm install`)
- [ ] File `.env` đã tồn tại và có API key
- [ ] Backend đang chạy (`npm start` hoặc `npm run dev`)
- [ ] Port 5000 không bị chiếm dụng
- [ ] Health check thành công (`curl http://localhost:5000/health`)
- [ ] Có kết nối internet (để gọi TomTom API)
- [ ] Tọa độ hợp lệ (lat: -90 đến 90, lon: -180 đến 180)
- [ ] CORS được cấu hình đúng trong `.env`

## 9. Liên hệ hỗ trợ

Nếu vẫn gặp lỗi sau khi thử các bước trên:

1. Thu thập thông tin:
   - Nội dung lỗi chính xác
   - Console logs từ backend
   - Browser console logs
   - Các bước đã thử

2. Kiểm tra Issues trên GitHub

3. Tạo issue mới với đầy đủ thông tin

## 10. Tài liệu tham khảo

- [TomTom API Documentation](https://developer.tomtom.com/traffic-api/documentation)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)
