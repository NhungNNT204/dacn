# 🚀 Hướng Dẫn Tích Hợp Community Hub vào Dự Án

## ⚡ Quick Start (3 Bước)

### Step 1: Copy Files
```bash
# Sao chép 2 file vào project:
1. CommunityTab.jsx          → src/components/CommunityTab.jsx
2. AppWithCommunity.jsx      → src/App.jsx (hoặc thay thế App.jsx)
```

### Step 2: Cài Đặt Dependencies
```bash
# Các dependencies cần thiết đã có sẵn trong project:
npm install react
npm install lucide-react        # Icons
npm install tailwindcss         # Styling (nếu chưa có)
```

### Step 3: Cấu Hình API
```javascript
// Tìm dòng này trong CommunityTab.jsx (dòng ~11):
const apiKey = "";

// Thay bằng API key của bạn từ Google Cloud Console:
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

---

## 📁 File Structure

```
src/
├── App.jsx                          ← Chính (hoặc AppWithCommunity.jsx)
├── components/
│   ├── CommunityTab.jsx             ← Component mới (tất cả tính năng)
│   ├── ChatList.jsx                 (hiện có)
│   ├── StudentFeed.jsx              (hiện có)
│   └── ...
├── pages/
├── context/
└── routes/
```

---

## 🔌 Integration Options

### Option A: Thay thế App.jsx toàn bộ (Recommended)
```bash
# Backup cũ
cp src/App.jsx src/App.backup.jsx

# Sao chép file mới
cp AppWithCommunity.jsx src/App.jsx

# Start dev server
npm run dev
```

### Option B: Thêm vào Routing (Nếu có React Router)
```javascript
// routes/AppRoutes.jsx
import CommunityTab from '../components/CommunityTab';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/community" element={<CommunityTab />} />
      {/* Routes khác */}
    </Routes>
  );
}
```

### Option C: Tích hợp vào StudentLayout (StudentShell)
```javascript
// pages/student/StudentLayout.jsx (hoặc StudentShell.jsx)
import CommunityTab from '../../components/CommunityTab';

export default function StudentLayout() {
  const [activeTab, setActiveTab] = useState('feed');
  
  return (
    <div className="layout">
      {/* Sidebar */}
      <nav>
        <button onClick={() => setActiveTab('community')}>Cộng đồng</button>
      </nav>
      
      {/* Main content */}
      <main>
        {activeTab === 'community' && <CommunityTab />}
        {/* Other tabs */}
      </main>
    </div>
  );
}
```

---

## 🎯 Features Mapping

### Tính Năng → Component Location

| Tính Năng | File | Lines | Status |
|-----------|------|-------|--------|
| Đăng bài | CommunityTab.jsx | 85-145 | ✅ |
| Lưu bookmark | CommunityTab.jsx | 169-173 | ✅ |
| Ẩn bài viết | CommunityTab.jsx | 175-180 | ✅ |
| Tìm kiếm | CommunityTab.jsx | 40-45, 290-297 | ✅ |
| Chia sẻ | CommunityTab.jsx | 182-198 | ✅ |
| Bình luận đa cấp | CommunityTab.jsx | 200-250 | ✅ |
| Báo cáo vi phạm | CommunityTab.jsx | 158-164 | ✅ |
| AI Kiểm duyệt | CommunityTab.jsx | 60-77 | ✅ |

---

## 🔐 API Configuration

### Gemini API Setup

```javascript
// 1. Tạo API Key
// Visit: https://aistudio.google.com/app/apikey

// 2. Lấy API Key từ Google Cloud Console
// https://console.cloud.google.com/

// 3. Paste vào CommunityTab.jsx
const apiKey = "AIzaSyD..."; // Thay bằng key thực của bạn
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
```

### Environment Variables (Best Practice)
```bash
# .env.local
VITE_GEMINI_API_KEY=your_api_key_here

# CommunityTab.jsx
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## 🎨 Customization

### Avatar
```javascript
// CommunityTab.jsx, line ~26
const myAvatar = "https://your-avatar-url.jpg";
```

### Colors
```javascript
// Tailwind classes:
Primary: from-indigo-600 to-indigo-800
Secondary: amber-500
Neutral: slate-*
Accent: emerald, amber

// Thay đổi trong className properties
className="bg-gradient-to-r from-purple-600 to-purple-800" // Custom gradient
```

### Mock Data
```javascript
// CommunityTab.jsx, line ~31-100
const [posts, setPosts] = useState([
  {
    id: 1,
    author: "Tên tác giả",
    avatar: "URL ảnh",
    content: "Nội dung bài viết",
    image: "URL hình ảnh",
    // Thêm/sửa posts ở đây
  }
]);
```

---

## ✅ Validation Checklist

### Trước khi Deploy
- [ ] API key được cấu hình
- [ ] Avatar URL hợp lệ
- [ ] Mock data được load thành công
- [ ] No console errors
- [ ] Tất cả tính năng hoạt động trên dev
- [ ] Responsive test (mobile/tablet/desktop)
- [ ] Tab navigation smooth
- [ ] AI moderation response < 3s

### Performance Check
```bash
# Build size
npm run build
# Check output/dist size < 500KB

# Performance test
npm run dev
# DevTools → Performance → Record
```

---

## 🐛 Common Issues & Solutions

### Issue 1: API Key Not Working
```
Error: 401 Unauthorized

Giải pháp:
1. Kiểm tra API key trong .env.local
2. Ensure API key đúng từ Google Cloud
3. Kiểm tra Gemini API đã enabled trên GCP
4. Retry request
```

### Issue 2: Tailwind Styles Not Applied
```
Problem: UI không có style, toàn plain text

Giải pháp:
1. npm install tailwindcss
2. Kiểm tra tailwind.config.js
3. Kiểm tra CSS import trong main.jsx
4. Rebuild: npm run dev
```

### Issue 3: lucide-react Icons Not Showing
```
Error: Cannot find module lucide-react

Giải pháp:
1. npm install lucide-react
2. Kiểm tra import statements
3. Kiểm tra icon names đúng
4. npm install --save
```

### Issue 4: State Not Updating
```
Problem: Bài viết không xuất hiện sau đăng

Giải pháp:
1. Check browser console cho errors
2. Inspect Redux/Context state (nếu dùng)
3. Verify setState calls
4. Check filter logic
```

---

## 🔄 Migration Path (Nếu từ codebase cũ)

### From Old Feed to Community Hub

```javascript
// Old (AppWithoutCommunity.jsx)
{activeTab === 'feed' && <div>/* old feed code */</div>}

// New (AppWithCommunity.jsx)
{activeTab === 'community' && <CommunityTab />}
{activeTab === 'feed' && <div>/* old feed code */</div>}
```

### Breaking Changes: KHÔNG CÓ
- Tất cả state được tách biệt
- Không ảnh hưởng đến existing code
- Fully backward compatible

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints (sẵn config)
sm:   640px
md:   768px
lg:  1024px
xl:  1280px
2xl: 1536px

// Component responsive
max-w-2xl   // 42rem (main feed)
max-w-4xl   // 56rem (community)
w-72 → w-24 // Sidebar toggle

// Sidbar di mobile
// lg: ẩn header content
// md: grid layout thay grid-cols-2
```

---

## 🎓 Learning Resources

### Tech Stack
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **lucide-react**: https://lucide.dev
- **Gemini API**: https://ai.google.dev

### Code Structure
```
Component Structure:
CommunityTab (Parent)
  ├── Tab Navigation
  ├── Feed SubTab
  │   ├── Post Composer
  │   └── Posts List
  │       └── CommentThread (Recursive)
  ├── Saved SubTab
  └── Friends SubTab
```

---

## 📊 Monitoring & Analytics

### Performance Metrics
```javascript
// DevTools Console
console.log('Posts count:', posts.length);
console.log('Hidden posts:', hiddenPostIds.length);
console.log('Saved posts:', savedPosts.length);
console.log('Search results:', filteredPosts.length);
```

### Error Tracking
```javascript
// Thêm vào callGemini()
.catch(error => {
  console.error('Gemini API Error:', error);
  // Send to error tracking service
  // e.g., Sentry, LogRocket
});
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
# Set VITE_GEMINI_API_KEY in Environment Variables
```

### GitHub Pages
```bash
npm run build
# Push build/ to gh-pages branch
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

---

## 📞 Support & Feedback

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@upnest.edu
- **Docs**: Full guide in COMMUNITY_HUB_GUIDE.md

---

**Version:** 1.0.0
**Last Updated:** Dec 23, 2025
**Status:** Production Ready ✅
