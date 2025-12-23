# Hướng dẫn Sync dữ liệu từ roadmap.sh

## Tổng quan

Hệ thống UpNest đã tích hợp tính năng tự động kéo dữ liệu từ [roadmap.sh](https://roadmap.sh/) để xây dựng lộ trình học tập cá nhân cho từng sinh viên.

## Các tính năng

### 1. Tự động Parse HTML từ roadmap.sh
- Service `RoadmapDataSyncService` tự động fetch và parse HTML từ roadmap.sh
- Parse structure: Groups → Milestones → Topics
- Lưu vào database (CareerTrack và RoadmapStep entities)

### 2. Fallback Data
- Nếu không thể fetch từ web, hệ thống sẽ dùng structured data có sẵn
- Đảm bảo tính năng luôn hoạt động

### 3. API Endpoints

#### Sync tất cả roadmaps
```http
POST /api/v1/learning/roadmap-sync/all
Authorization: Bearer {token}
```

#### Sync một roadmap cụ thể
```http
POST /api/v1/learning/roadmap-sync/{roadmapKey}
Authorization: Bearer {token}
```

Ví dụ:
```http
POST /api/v1/learning/roadmap-sync/frontend
POST /api/v1/learning/roadmap-sync/backend
POST /api/v1/learning/roadmap-sync/devops
```

#### Sync từ Professional Roadmap Controller
```http
POST /api/v1/learning/professional-roadmap/sync/{roadmapKey}
Authorization: Bearer {token}
```

### 4. Các Roadmap được hỗ trợ

Hiện tại hỗ trợ hơn 30 roadmaps:
- **Frontend**: frontend, react, vue, angular, javascript, typescript
- **Backend**: backend, java, python, nodejs, golang, rust
- **DevOps**: devops, docker, kubernetes, aws, azure
- **Database**: sql, postgresql, mongodb
- **Others**: fullstack, android, qa, blockchain, cyber-security, ml-engineer, data-engineer, system-design, api-design, git

## Cách sử dụng

### Bước 1: Sync dữ liệu từ roadmap.sh

#### Option A: Sử dụng API (Khuyến nghị)
```bash
# Sync tất cả roadmaps
curl -X POST http://localhost:8080/api/v1/learning/roadmap-sync/all \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sync một roadmap cụ thể
curl -X POST http://localhost:8080/api/v1/learning/roadmap-sync/frontend \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Option B: Từ Frontend
Thêm button sync vào trang admin hoặc roadmap page:

```javascript
const handleSyncRoadmap = async (roadmapKey) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(
      `http://localhost:8080/api/v1/learning/roadmap-sync/${roadmapKey}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    if (data.success) {
      alert(`Đã sync thành công: ${data.stepsCount} steps`);
      // Reload roadmap data
      window.location.reload();
    }
  } catch (error) {
    console.error('Error syncing roadmap:', error);
    alert('Lỗi khi sync dữ liệu từ roadmap.sh');
  }
};
```

### Bước 2: Xem dữ liệu đã sync

Sau khi sync, dữ liệu sẽ được lưu vào database:
- `CareerTrack`: Thông tin về track (tên, mô tả, icon, màu)
- `RoadmapStep`: Các bước học tập (title, description, difficulty, reward XP)

### Bước 3: Sử dụng trong Frontend

Frontend sẽ tự động lấy dữ liệu từ database khi user truy cập trang lộ trình:

```javascript
// GET /api/v1/learning/professional-roadmap/{roadmapKey}
// Service sẽ tự động lấy từ database, fallback về mock data nếu chưa có
```

## Cấu trúc dữ liệu

### CareerTrack Entity
```java
- id: Long
- code: String (e.g., "frontend", "backend")
- name: String (e.g., "Frontend Developer")
- description: String
- icon: String (e.g., "PenTool", "Code2")
- color: String (e.g., "rose", "indigo")
```

### RoadmapStep Entity
```java
- id: Long
- careerTrack: CareerTrack
- orderIndex: Integer
- title: String (e.g., "Internet & HTML")
- description: String (comma-separated topics)
- durationWeeks: Integer
- difficulty: DifficultyLevel (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- rewardXp: Integer
- icon: String
```

## Lưu ý

1. **Rate Limiting**: roadmap.sh có thể chặn requests nếu gọi quá nhiều. Hãy sync từng roadmap một hoặc đợi giữa các lần sync.

2. **HTML Structure Changes**: Nếu roadmap.sh thay đổi cấu trúc HTML, có thể cần update parsing logic trong `RoadmapDataSyncService.parseRoadmapHTML()`.

3. **Fallback Data**: Hệ thống luôn có fallback data để đảm bảo tính năng hoạt động ngay cả khi không fetch được từ web.

4. **Database**: Sync sẽ xóa và tạo lại các steps cũ để đảm bảo dữ liệu luôn mới nhất.

## Troubleshooting

### Lỗi: "Failed to fetch roadmap from..."
- **Nguyên nhân**: Không thể kết nối đến roadmap.sh
- **Giải pháp**: Hệ thống sẽ tự động dùng fallback data

### Lỗi: "No sections parsed from HTML"
- **Nguyên nhân**: Cấu trúc HTML của roadmap.sh đã thay đổi
- **Giải pháp**: Update parsing logic trong `parseRoadmapHTML()` method

### Lỗi: "Roadmap not found in database"
- **Nguyên nhân**: Chưa sync roadmap này
- **Giải pháp**: Gọi API sync trước khi sử dụng

## Tương lai

- [ ] Scheduled sync job (tự động sync định kỳ)
- [ ] Cache mechanism để giảm số lần fetch
- [ ] Support thêm nhiều roadmap sources
- [ ] Admin panel để quản lý sync
- [ ] Webhook từ roadmap.sh để sync real-time

