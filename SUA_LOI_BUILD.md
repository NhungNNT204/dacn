# 🔧 HƯỚNG DẪN SỬA LỖI BUILD

## ✅ Đã Sửa

1. **Cập nhật Maven Compiler Plugin**: Từ 3.11.0 → 3.13.0 (tương thích Java 21)
2. **Cập nhật Lombok**: Từ 1.18.30 → 1.18.34
3. **Thêm @Slf4j** vào các controller thiếu
4. **Cải thiện cấu hình compiler** với `release` option

## 🚀 Các Bước Build Lại

### Bước 1: Xóa cache Maven (Quan trọng!)

```bash
cd edu
mvn clean
rm -rf ~/.m2/repository/com/upnest/edu  # Linux/Mac
# Hoặc trên Windows:
# rmdir /s /q %USERPROFILE%\.m2\repository\com\upnest\edu
```

### Bước 2: Build lại project

```bash
# Cách 1: Build đầy đủ
mvn clean install -DskipTests

# Cách 2: Chỉ compile (nhanh hơn)
mvn clean compile

# Cách 3: Sử dụng script có sẵn (Windows)
build-fix.bat
```

### Bước 3: Chạy ứng dụng

```bash
mvn spring-boot:run
```

## 🔍 Nếu Vẫn Còn Lỗi

### Lỗi 1: "ExceptionInInitializerError: TypeTag"

**Nguyên nhân**: Java version không khớp hoặc Maven cache cũ

**Giải pháp**:
```bash
# Kiểm tra Java version
java -version  # Phải >= 21

# Xóa toàn bộ cache Maven
rm -rf ~/.m2/repository  # Linux/Mac
# Hoặc Windows: xóa thư mục %USERPROFILE%\.m2\repository

# Build lại
mvn clean install -U
```

### Lỗi 2: "Cannot find symbol: log"

**Nguyên nhân**: Thiếu annotation @Slf4j

**Giải pháp**: Đã sửa trong code, nếu vẫn lỗi:
- Kiểm tra file có `log.info()` nhưng thiếu `@Slf4j`
- Thêm `import lombok.extern.slf4j.Slf4j;` và `@Slf4j` annotation

### Lỗi 3: "Lombok annotation processing failed"

**Giải pháp**:
```bash
# Xóa target folder
rm -rf target  # Linux/Mac
# Hoặc Windows: rmdir /s /q target

# Build lại
mvn clean install
```

## 📋 Checklist

- [ ] Java version >= 21
- [ ] Maven version >= 3.8
- [ ] Đã xóa Maven cache
- [ ] Đã chạy `mvn clean`
- [ ] Đã build thành công với `mvn install`
- [ ] Ứng dụng chạy được với `mvn spring-boot:run`

## 💡 Lưu Ý

1. **Lần đầu build có thể mất 5-10 phút** (download dependencies)
2. **Nếu dùng IDE**: Refresh Maven project sau khi sửa pom.xml
3. **Nếu vẫn lỗi**: Chạy với `-X` để xem log chi tiết:
   ```bash
   mvn clean install -X
   ```

## 🎯 Test Nhanh

Sau khi build thành công, test endpoint:

```bash
curl http://localhost:8080/api/v1/courses
```

Nếu thấy response (có thể là empty array `[]`), nghĩa là đã chạy thành công!

---

**Nếu vẫn gặp lỗi, gửi log đầy đủ để được hỗ trợ thêm.**
