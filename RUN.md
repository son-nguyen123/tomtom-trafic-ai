# Hướng dẫn chạy ứng dụng TomTom Traffic AI - Đà Nẵng

## 📋 Tổng quan

Ứng dụng web hiển thị bản đồ và thông tin giao thông thời gian thực của thành phố Đà Nẵng sử dụng TomTom API.

## 🎯 Tính năng đã triển khai

✅ Bản đồ hiển thị khu vực Đà Nẵng (16.0544°N, 108.2022°E)  
✅ Hiển thị luồng giao thông (traffic flow) với mức độ tắc đường  
✅ Hiển thị các sự cố giao thông (tai nạn, thi công, đóng đường)  
✅ Giao diện tiếng Việt, thân thiện với người dùng  
✅ Responsive design (hoạt động trên mọi thiết bị)  
✅ Backend API với Express.js  

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 16+ ([Tải tại đây](https://nodejs.org/))
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Kết nối internet (để truy cập TomTom API)

### Bước 1: Cài đặt Backend

Mở terminal và chạy:

```bash
cd backend
npm install
```

### Bước 2: Chạy Backend Server

```bash
cd backend
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

Bạn sẽ thấy thông báo:
```
Server running on port 5000
Health check: http://localhost:5000/health
API base URL: http://localhost:5000/api
```

### Bước 3: Mở Frontend

**Cách 1: Mở trực tiếp file HTML**

Mở file `frontend/index-simple.html` trong trình duyệt web.

**Cách 2: Sử dụng HTTP server (khuyến nghị)**

Mở terminal mới và chạy:

```bash
cd frontend
python3 -m http.server 8080
```

Sau đó mở trình duyệt và truy cập: **http://localhost:8080/index-simple.html**

### Bước 4: Sử dụng ứng dụng

1. Bản đồ sẽ hiển thị khu vực Đà Nẵng
2. Nhấn nút **"🔄 Làm mới dữ liệu"** để tải thông tin giao thông
3. Xem thông tin giao thông ở bảng bên phải:
   - Tốc độ hiện tại
   - Mức độ tắc đường (%)
   - Các sự cố giao thông

## 📊 API Endpoints

Backend cung cấp các endpoint sau:

- `GET /health` - Kiểm tra server
- `GET /api/traffic/flow?lat={lat}&lon={lon}&zoom={zoom}` - Lấy dữ liệu luồng giao thông
- `GET /api/traffic/incidents?bbox={bbox}&maxIncidents={max}` - Lấy sự cố giao thông
- `GET /api/traffic/route?origin={origin}&destination={destination}` - Tính toán lộ trình

## 🗺️ Khu vực giám sát

- **Trung tâm:** 16.0544°N, 108.2022°E
- **Các tuyến đường chính:**
  - Cầu Rồng
  - Cầu Trần Thị Lý
  - Đường Nguyễn Văn Linh
  - Đường 2/9
  - Trung tâm thành phố

## 🔧 Cấu trúc dự án

```
tomtom-trafic-ai/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── server.js          # Main server
│   │   ├── routes/
│   │   │   └── traffic.js     # API endpoints
│   │   └── services/
│   │       └── tomtom.js      # TomTom API integration
│   ├── package.json
│   └── .env                   # Cấu hình (API key)
│
├── frontend/                  # Frontend
│   ├── index-simple.html     # Giao diện chính (khuyến nghị)
│   └── index.html            # Giao diện với TomTom SDK
│
└── RUN.md                    # File này
```

## 🐛 Xử lý lỗi

### Backend không chạy

**Lỗi:** `port 5000 already in use`

**Giải pháp:**
```bash
# Tìm process đang dùng port 5000
lsof -i :5000

# Kill process (thay <PID> bằng số thực tế)
kill -9 <PID>
```

### Không load được dữ liệu giao thông

**Nguyên nhân:**
1. Backend chưa chạy
2. Không có kết nối internet
3. TomTom API key không hợp lệ

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:5000/health`
2. Kiểm tra kết nối internet
3. Kiểm tra API key trong `backend/.env`

### Giao diện không hiển thị

**Nguyên nhân:**
- File HTML không được mở đúng cách
- Browser block JavaScript

**Giải pháp:**
- Sử dụng HTTP server (python3 -m http.server)
- Kiểm tra console (F12) để xem lỗi

## 📱 Responsive Design

Ứng dụng hoạt động tốt trên:
- 💻 Desktop (1920px+)
- 📱 Tablet (768-1024px)
- 📱 Mobile (< 768px)

## 🔐 Bảo mật

- API key TomTom cần được cấu hình trong file `backend/.env`
- Để lấy API key miễn phí, truy cập: https://developer.tomtom.com/
- File `.env` không được commit vào git
- CORS được cấu hình cho localhost trong development

## 💡 Ghi chú

- Ứng dụng cần kết nối internet để truy cập TomTom API
- Backend phải chạy trước khi mở frontend
- Dữ liệu giao thông được cập nhật theo thời gian thực từ TomTom

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra backend đang chạy: `curl http://localhost:5000/health`
2. Xem console trình duyệt (F12)
3. Kiểm tra terminal có thông báo lỗi

---

**Chúc bạn sử dụng thành công! 🎉**
