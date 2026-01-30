# Hướng dẫn chạy ứng dụng

## Bước 1: Cài đặt Backend

```bash
cd backend
npm install
```

## Bước 2: Chạy Backend

```bash
cd backend
npm start
```

Backend sẽ chạy tại: http://localhost:5000

## Bước 3: Mở Frontend

Mở file `frontend/index.html` trong trình duyệt web của bạn.

Hoặc sử dụng một web server đơn giản:

```bash
cd frontend
python3 -m http.server 8080
```

Sau đó mở: http://localhost:8080

## Sử dụng

- Bản đồ sẽ hiển thị thành phố Đà Nẵng
- Traffic flow (luồng giao thông) được hiển thị bằng màu sắc trên đường
- Các sự cố (tai nạn, tắc đường) được đánh dấu bằng icon đỏ
- Click vào icon để xem chi tiết sự cố
- Nhấn "Làm mới dữ liệu" để cập nhật thông tin mới nhất
