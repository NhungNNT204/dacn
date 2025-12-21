# ⚡ QUICK FIX - Sửa Lỗi Build

## ✅ Đã Sửa

1. **Conflict Bean Name**: Đổi tên `AuthController` trong module user thành `UserAuthController`
2. **Cập nhật Maven Compiler Plugin**: Thêm các JVM args để fix lỗi TypeTag

## 🚀 Cách Chạy

### Cách 1: Chạy trực tiếp (Skip tests)

```bash
cd edu
mvn spring-boot:run -DskipTests
```

### Cách 2: Build và chạy

```bash
cd edu
mvn clean compile -DskipTests
mvn spring-boot:run
```

### Cách 3: Dùng script

```bash
cd edu
run.bat
```

## ⚠️ Nếu Vẫn Lỗi Compile

### Option 1: Dùng Java 17 (Knhungến nghị)

Nếu bạn có Java 17, sửa `pom.xml`:

```xml
<properties>
    <java.version>17</java.version>
    ...
</properties>
```

Sau đó:
```bash
mvn clean install -DskipTests
```

### Option 2: Xóa cache và build lại

```bash
# Xóa target
rm -rf target  # Linux/Mac
rmdir /s /q target  # Windows

# Xóa Maven cache (optional)
rm -rf ~/.m2/repository/com/upnest

# Build lại
mvn clean install -DskipTests
```

### Option 3: Tạm thời comment Lombok

Nếu vẫn lỗi, có thể tạm thời bỏ Lombok annotation processing:

Trong `pom.xml`, comment phần `annotationProcessorPaths`:

```xml
<!-- <annotationProcessorPaths>
    ...
</annotationProcessorPaths> -->
```

## 📝 Lưu Ý

- Lỗi compile chỉ ảnh hưởng đến build, không ảnh hưởng đến runtime nếu đã compile được
- Nếu đã compile thành công trước đó, có thể chạy trực tiếp với `mvn spring-boot:run -DskipTests`
- Java 17 ổn định hơn Java 21 với Spring Boot 3.3.5
