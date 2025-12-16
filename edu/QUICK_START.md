# 🚀 QUICK START - Chạy Project Ngay

## ⚡ Cách Nhanh Nhất: Dùng Maven Wrapper

Project có **Maven Wrapper**, bạn có thể chạy ngay mà không cần cài Maven!

### Bước 1: Build Project

```powershell
cd edu
.\mvnw.cmd clean compile -DskipTests
```

**Lưu ý**: Lần đầu chạy có thể mất vài phút để download Maven wrapper.

### Bước 2: Chạy Ứng Dụng

```powershell
.\mvnw.cmd spring-boot:run -DskipTests
```

Hoặc dùng script:
```powershell
.\run.bat
```

## 🔧 Nếu Maven Wrapper Không Hoạt Động

### Option 1: Cài Đặt Maven

1. **Download Maven**:
   - Link: https://maven.apache.org/download.cgi
   - Chọn: `apache-maven-3.9.6-bin.zip` (hoặc version mới nhất)

2. **Giải nén và thêm vào PATH**:
   ```powershell
   # Giải nén vào: C:\Program Files\Apache\maven
   # Thêm vào PATH:
   $env:Path += ";C:\Program Files\Apache\maven\bin"
   ```

3. **Kiểm tra**:
   ```powershell
   mvn -version
   ```

4. **Build lại**:
   ```powershell
   mvn clean compile -DskipTests
   ```

### Option 2: Dùng IDE (IntelliJ IDEA / Eclipse)

1. Mở project trong IDE
2. IDE sẽ tự động detect Maven và download dependencies
3. Chạy `EduApplication.java` trực tiếp từ IDE

## 📋 Checklist

- [ ] Java 21+ đã cài đặt (`java -version`)
- [ ] Maven đã cài hoặc dùng mvnw.cmd
- [ ] SQL Server đã chạy và database đã tạo
- [ ] Đã cấu hình `application.yml` với thông tin database

## 🎯 Test Nhanh

Sau khi ứng dụng chạy, mở browser:
```
http://localhost:8080/api/v1/courses
```

Nếu thấy response (có thể là `[]`), nghĩa là đã chạy thành công!

---

**Nếu gặp lỗi, xem file `FIX_FINAL.md` hoặc `INSTALL_MAVEN.md`**
