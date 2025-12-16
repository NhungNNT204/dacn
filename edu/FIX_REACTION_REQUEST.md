# 🔧 SỬA LỖI ReactionRequest

## ✅ Đã Kiểm Tra

File `ReactionRequest.java` đã có:
- ✅ Import `lombok.Getter`
- ✅ Import `lombok.Setter`
- ✅ Annotation `@Getter` và `@Setter`

## 🔍 Nguyên Nhân Có Thể

Lỗi "cannot find symbol: class Getter" có thể do:
1. **Lombok annotation processing chưa chạy** - Cần clean và build lại
2. **Lombok dependency chưa được download** - Cần update dependencies
3. **IDE cache** - Cần refresh project

## 🚀 Giải Pháp

### Bước 1: Clean và Build lại

```powershell
cd edu

# Xóa target folder
Remove-Item -Recurse -Force target -ErrorAction SilentlyContinue

# Clean và build lại
mvn clean compile -DskipTests -U
```

### Bước 2: Nếu vẫn lỗi, kiểm tra Lombok dependency

```powershell
# Kiểm tra Lombok đã được download chưa
mvn dependency:tree | findstr lombok
```

### Bước 3: Force update dependencies

```powershell
mvn clean install -DskipTests -U -X
```

### Bước 4: Nếu dùng IDE

1. **IntelliJ IDEA**:
   - File → Invalidate Caches / Restart
   - Maven → Reload Project

2. **Eclipse**:
   - Project → Clean
   - Maven → Update Project

## 📝 File Hiện Tại

File `ReactionRequest.java` đã đúng format:
```java
package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReactionRequest {
    @JsonProperty("reactionType")
    private String reactionType;
}
```

## ✅ Sau Khi Sửa

Build lại:
```powershell
mvn clean compile -DskipTests
```

Nếu thành công, sẽ thấy:
```
[INFO] BUILD SUCCESS
```
