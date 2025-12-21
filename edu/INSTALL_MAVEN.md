# 🔧 HƯỚNG DẪN CÀI ĐẶT MAVEN

## ✅ Giải Pháp Nhanh: Dùng Maven Wrapper (Knhungến nghị)

Project đã có **Maven Wrapper** (`mvnw.cmd`), bạn không cần cài đặt Maven!

### Cách sử dụng:

```powershell
# Build project
.\mvnw.cmd clean compile -DskipTests

# Chạy ứng dụng
.\mvnw.cmd spring-boot:run -DskipTests

# Hoặc dùng script có sẵn
.\build.bat
.\run.bat
```

## 📦 Cài Đặt Maven (Nếu muốn dùng mvn trực tiếp)

### Cách 1: Download và cài đặt thủ công

1. **Download Maven**:
   - Truy cập: https://maven.apache.org/download.cgi
   - Download file `apache-maven-3.9.x-bin.zip`

2. **Giải nén**:
   - Giải nén vào thư mục, ví dụ: `C:\Program Files\Apache\maven`

3. **Thêm vào PATH**:
   ```powershell
   # Mở PowerShell với quyền Administrator
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Apache\maven\bin", "Machine")
   ```

4. **Kiểm tra**:
   ```powershell
   mvn -version
   ```

### Cách 2: Dùng Chocolatey (Nếu đã cài)

```powershell
# Mở PowerShell với quyền Administrator
choco install maven
```

### Cách 3: Dùng Scoop

```powershell
scoop install maven
```

## 🚀 Sau Khi Cài Đặt

Đóng và mở lại PowerShell, sau đó:

```powershell
cd edu
mvn clean compile -DskipTests
```

## 💡 Knhungến Nghị

**Dùng Maven Wrapper** (`mvnw.cmd`) vì:
- ✅ Không cần cài đặt toàn cục
- ✅ Đảm bảo version Maven đúng với project
- ✅ Dễ dàng cho team members
- ✅ Hoạt động ngay lập tức

## 📝 Scripts Có Sẵn

- `build.bat` - Build project (tự động dùng mvnw.cmd hoặc mvn)
- `run.bat` - Chạy ứng dụng (tự động dùng mvnw.cmd hoặc mvn)
