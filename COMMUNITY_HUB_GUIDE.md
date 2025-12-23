# 📱 Hệ Thống Cộng Đồng UpNest.EDU - Hướng Dẫn Chi Tiết

## 🎯 Tổng Quan

Hệ thống Cộng Đồng (Community Hub) UpNest.EDU là một nền tảng xã hội công nghệ tích hợp đầy đủ tính năng cho sinh viên và giáo viên chia sẻ kiến thức, kết nối và phát triển kỹ năng.

---

## 📂 Cấu Trúc Files

```
src/
├── AppWithCommunity.jsx          # App chính (có Community Tab)
├── components/
│   └── CommunityTab.jsx          # Component Community Tab (chứa tất cả tính năng)
└── ...
```

---

## ✨ Các Tính Năng Chính

### 1. **🔖 Hộp Đăng Bài (Post Composer)**

#### Đặc điểm:
- ✅ Hiển thị tại đầu Bảng tin với avatar người dùng
- ✅ Support Rich Text Input (textarea)
- ✅ AI Kiểm duyệt tự động (Gemini API)
- ✅ Thêm thông tin bối cảnh: Vị trí, Nhạc, Tag bạn bè, Cảm xúc

#### Cách sử dụng:
```javascript
1. Click vào textarea "Chia sẻ giải pháp công nghệ hôm nay..."
2. Nhập nội dung bài viết
3. Tùy chọn (Optional):
   - 📍 MapPin: Thêm vị trí
   - 🎵 Music: Thêm bài hát đang nghe
   - @AtSign: Tag bạn bè
   - 😊 Smile: Chọn emoji nhanh
4. Click "✨ ĐĂNG BÀI"
5. AI kiểm duyệt → Bài viết hiển thị ngay lập tức (nếu SAFE)
```

#### Mã nguồn chính:
```javascript
const handleCreatePost = async () => {
  const result = await callGemini(`Analyze: "${newPostContent}"...`);
  if (result.includes("UNSAFE")) {
    setModerationError("✨ AI phát hiện nội dung không phù hợp...");
    return;
  }
  // Tạo bài viết mới
  setPosts([newPost, ...posts]);
};
```

---

### 2. **💾 Lưu Bài Viết (Bookmark)**

#### Đặc điểm:
- ✅ Nút Bookmark tại mỗi bài viết (icon bookmark)
- ✅ Bấm 1 lần để lưu, 2 lần để gỡ bỏ
- ✅ Bài viết lưu xuất hiện tại tab "🔖 Đã lưu"
- ✅ Hiệu ứng visual: Button chuyển sang màu amber + filled icon

#### Cách sử dụng:
```
1. Bấm nút Bookmark (icon dấu sách) bên phải bài viết
2. Button chuyển sang màu vàng (amber) = đã lưu
3. Vào tab "🔖 Đã lưu" để xem toàn bộ bài viết đã lưu
4. Bấm "GỠ BỎ" trong tab Đã lưu để xóa
```

#### Trạng thái Visual:
```javascript
// Chưa lưu
className: 'bg-white border border-slate-100 text-slate-400'

// Đã lưu
className: 'bg-amber-500 text-white shadow-lg shadow-amber-200'
```

---

### 3. **👁️ Ẩn Bài Viết (Hide Post)**

#### Đặc điểm:
- ✅ Nút Menu 3 chấm trên mỗi bài viết
- ✅ Ẩn ngay lập tức khỏi dòng thời gian
- ✅ Bài viết không xuất hiện trong bất kỳ tab nào
- ✅ Có thể ẩn nhiều bài viết cùng lúc

#### Cách sử dụng:
```
1. Bấm nút 3 chấm (⋯) góc trên phải bài viết
2. Chọn "Ẩn bài viết" từ menu dropdown
3. Bài viết biến mất khỏi feed ngay lập tức
4. Thông báo xác nhận: "✨ Bài viết đã bị ẩn khỏi dòng thời gian"
```

#### Mã logic:
```javascript
const handleHidePost = (postId) => {
  setHiddenPostIds(prev => [...prev, postId]);
  // Sau đó posts được filter ra khỏi hidden list
};
```

---

### 4. **🔍 Tìm Kiếm Thời Gian Thực (Real-time Search)**

#### Đặc điểm:
- ✅ Thanh tìm kiếm trên Header
- ✅ Tìm kiếm theo nội dung bài viết (content)
- ✅ Tìm kiếm theo tên tác giả (author)
- ✅ Cập nhật kết quả khi gõ (không cần bấm Enter)
- ✅ Hoạt động trên tất cả tab

#### Cách sử dụng:
```
1. Click vào ô tìm kiếm Header: "Tìm kiếm công nghệ, bài viết..."
2. Gõ từ khóa:
   - Tên bạn: "Lê Minh", "Hoàng An"
   - Chủ đề: "AI", "Kubernetes", "Python", "Automation"
   - Nội dung: Bất kỳ từ nào trong bài viết
3. Kết quả cập nhật tức thì
4. Xóa hết text = hiển thị tất cả bài viết
```

#### Mã filter:
```javascript
const filteredPosts = useMemo(() => {
  return posts
    .filter(p => !hiddenPostIds.includes(p.id))
    .filter(p => 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
}, [posts, searchQuery, hiddenPostIds]);
```

---

### 5. **📤 Chia Sẻ Bài Viết (Share)**

#### Đặc điểm:
- ✅ Nút Share bên phải mỗi bài viết
- ✅ Nhân bản bài viết về tường cá nhân
- ✅ Đánh dấu "Chia sẻ từ [Tác giả gốc]"
- ✅ Hình ảnh, metadata được giữ nguyên
- ✅ Tạo bài viết mới với ngày giờ "Vừa xong"

#### Cách sử dụng:
```
1. Bấm nút Share (icon mũi tên chia sẻ) bên phải bài viết
2. Bài viết được nhân bản lên tường của bạn
3. Tiêu đề: "(Chia sẻ từ Lê Minh): [nội dung gốc]"
4. Thông báo: "✨ Đã chia sẻ bài viết lên tường của bạn!"
```

#### Mã logic:
```javascript
const handleShare = (postId) => {
  const original = posts.find(p => p.id === postId);
  const shared = {
    ...original,
    id: Date.now(),
    author: "Nguyễn Thị Thùy Nhung",
    content: `(Chia sẻ từ ${original.author}): "${original.content}"`,
    likes: 0,
    comments: []
  };
  setPosts([shared, ...posts]);
};
```

---

### 6. **💬 Bình Luận Nhiều Cấp (Nested Comments)**

#### Đặc điểm:
- ✅ Bình luận level 1 trực tiếp trên bài viết
- ✅ Reply to Reply: Trả lời từng bình luận cụ thể
- ✅ Danh sách replies có thể mở rộng/thu gọn
- ✅ Giao diện phân cấp rõ ràng (visual nesting)
- ✅ Input "Tham gia thảo luận..." tạo comment level 1
- ✅ Button "Trả lời" tạo input inline cho reply

#### Cách sử dụng:
```
COMMENT LEVEL 1:
1. Cuộn đến phần bình luận (dưới hình ảnh)
2. Click vào input "Tham gia thảo luận chuyên môn..."
3. Gõ bình luận, bấm Enter
4. Bình luận hiển thị ngay lập tức

REPLY TO COMMENT:
1. Bấm nút "Trả lời" dưới bình luận
2. Input inline xuất hiện
3. Gõ phản hồi, bấm Enter
4. Reply hiển thị dưới comment gốc (indented)

XEM REPLIES:
1. Nếu bình luận có nhiều replies, sẽ thấy "▶ Xem 2 phản hồi"
2. Bấm để mở rộng/thu gọn
```

#### Cấu trúc dữ liệu:
```javascript
{
  id: 101,
  user: "Hoàng An",
  text: "Comment level 1",
  replies: [
    {
      id: 102,
      user: "Lê Minh",
      text: "Reply to comment 101"
    }
  ]
}
```

#### Component:
```javascript
const CommentThread = ({ postId, comment, level = 0 }) => {
  // Render comment + input reply (nếu replyingTo === comment.id)
  // Render list replies (nếu expand)
  // Recursive gọi CommentThread cho replies
};
```

---

### 7. **🚩 Báo Cáo Vi Phạm (Report Abuse)**

#### Đặc điểm:
- ✅ Nút "Báo cáo vi phạm" trong menu 3 chấm
- ✅ Feedback tức thì cho người dùng
- ✅ Ghi lại tác giả và nội dung
- ✅ Thông báo moderator 24h xử lý

#### Cách sử dụng:
```
1. Bấm nút 3 chấm (⋯) bài viết
2. Chọn "Báo cáo vi phạm"
3. Nhận thông báo: 
   "✨ Cảm ơn! Chúng tôi đã nhận báo cáo về bài viết của [Tác giả].
    Đội ngũ moderator sẽ xem xét trong 24h."
4. Dữ liệu lưu vào hệ thống
```

---

### 8. **🤖 AI Kiểm Duyệt (AI Moderation)**

#### Đặc điểm:
- ✅ Tích hợp Gemini API 2.5 Flash
- ✅ Kiểm tra tự động khi đăng bài
- ✅ Phát hiện: bạo lực, gore, nội dung 18+, thù hận
- ✅ Response tức thì (SAFE/UNSAFE)
- ✅ Hiển thị thông báo rõ ràng

#### Cách hoạt động:
```
1. User gõ nội dung → Bấm "✨ ĐĂNG BÀI"
2. System gọi Gemini API: 
   "Analyze: '[content]'. Respond UNSAFE if [criteria], SAFE otherwise"
3. Gemini phân tích → Return SAFE hoặc UNSAFE
4. Nếu SAFE: Tạo post, thông báo "✨ Bài đăng được duyệt an toàn!"
5. Nếu UNSAFE: Chặn post, thông báo lỗi
```

#### Cấu hình API:
```javascript
const apiKey = "";  // Cần config API key của Gemini
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const callGemini = async (prompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    { /* config */ }
  );
  // Process response...
};
```

---

## 🎨 Giao Diện UI/UX

### Glassmorphism Style
```
✅ Rounded corners: [2.5rem] - [3rem]
✅ Backdrop blur: backdrop-blur-xl
✅ Semi-transparent: bg-white/95, bg-slate-50/30
✅ Subtle shadows: shadow-xl
✅ Glass effect: border border-white
```

### Màu sắc chủ đạo
```
Primary: indigo-600, indigo-700 (Gradient)
Secondary: amber-500 (Bookmark)
Neutral: slate-*
Accent: emerald (location), amber (music), indigo (tags)
```

### Typography
```
Headings: font-black, italic, uppercase, tracking-tighter
Body: font-bold, italic, text-xs/sm
```

### Responsive
```
Sidebar: w-72 (mở) → w-24 (đóng)
Header: h-24
Max-width: max-w-2xl (feed), max-w-4xl (community)
Grid: grid-cols-1 md:grid-cols-2 (friends section)
```

---

## 📑 Tab Navigation

### Feed (📰 Bảng tin)
- Hộp đăng bài + danh sách bài viết
- Tính năng gốc

### Community (👥 Cộng đồng) ⭐ NEW
- Subtab: Bảng tin, Đã lưu, Kết nối bạn bè
- Đầy đủ tính năng lồng ghép

### Chat (💬 Tin nhắn)
- Danh sách cuộc trò chuyện
- Chat window với tính năng video/phone

### Friends (👥 Bạn bè)
- Danh sách bạn bè (old version)

### Saved (🔖 Đã lưu)
- Bài viết đã lưu (old version)

---

## 🔧 Cấu hình & Tùy chỉnh

### 1. Thêm API Key Gemini
```javascript
// src/components/CommunityTab.jsx, dòng ~11
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

### 2. Thay đổi Avatar Người Dùng
```javascript
// Thay URL này với URL ảnh của bạn
const myAvatar = "https://lh3.googleusercontent.com/d/1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC";
```

### 3. Thêm Bài Viết Mẫu
```javascript
const [posts, setPosts] = useState([
  {
    id: 1,
    author: "Tên tác giả",
    avatar: "URL ảnh đại diện",
    content: "Nội dung bài viết...",
    image: "URL hình ảnh",
    // ... fields khác
  }
]);
```

### 4. Tùy chỉnh Quick Emojis
```javascript
const quickEmojis = ['🤖', '💻', '🚀', '🔥', '💡', '⚡', '✨', '🎯'];
// Thêm/xóa emoji theo ý thích
```

---

## 📊 Data Flow

```
User Input
    ↓
State Update (useState)
    ↓
Validation/AI Check
    ↓
Add to Posts Array
    ↓
Re-render with filteredPosts
    ↓
Display in UI
```

---

## 🎯 Testing Checklist

- [x] Đăng bài thành công
- [x] AI kiểm duyệt hoạt động
- [x] Lưu/gỡ bỏ bookmark
- [x] Ẩn bài viết
- [x] Tìm kiếm thời gian thực
- [x] Chia sẻ bài viết
- [x] Bình luận level 1
- [x] Reply to comment
- [x] Báo cáo vi phạm
- [x] Like/Unlike bài viết
- [x] Tab navigation mượt mà
- [x] Responsive mobile

---

## 🚀 Triển Khai

### Dev Mode
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
# Deploy build/ folder
```

### Env Variables
```
.env.local:
VITE_GEMINI_API_KEY=your_key_here
```

---

## 📞 Hỗ Trợ & Troubleshooting

### Lỗi API Gemini
- Kiểm tra API key có hợp lệ không
- Check rate limit (1000 req/min)
- Kiểm tra network connection

### Bài viết không hiển thị
- Kiểm tra localStorage
- Xóa cache browser
- Check console.log() cho errors

### UI bị vỡ
- Cập nhật Tailwind CSS
- Kiểm tra lucide-react icons import
- Xóa node_modules, reinstall

---

## 📝 Ghi chú Phát Triển

**Version:** 1.0.0 Community Hub
**Last Updated:** Dec 23, 2025
**Framework:** React 18+, Tailwind CSS
**Icons:** lucide-react
**API:** Gemini 2.5 Flash

---

**✨ Enjoy building amazing educational communities!**
