# 💡 Community Hub - Implementation Examples & Code Snippets

## 📚 Bộ Sưu Tập Mã Code

---

## 1️⃣ POST COMPOSER (Hộp Đăng Bài)

### Complete Implementation
```javascript
const [newPostContent, setNewPostContent] = useState("");
const [selectedMusic, setSelectedMusic] = useState(null);
const [location, setLocation] = useState("");
const [taggedFriends, setTaggedFriends] = useState([]);
const [isPosting, setIsPosting] = useState(false);
const [moderationError, setModerationError] = useState("");

const handleCreatePost = async () => {
  if (!newPostContent.trim() || isPosting) return;
  setIsPosting(true);
  setModerationError("");

  // AI Moderation
  const result = await callGemini(
    `Analyze: "${newPostContent}". Respond "UNSAFE" if it has violence, gore, or 18+. Respond "SAFE" otherwise. 1 word only.`
  );

  if (result.toUpperCase().includes("UNSAFE")) {
    setModerationError("✨ AI phát hiện nội dung không phù hợp với tiêu chuẩn cộng đồng.");
    setIsPosting(false);
    return;
  }

  // Create post
  const newPost = {
    id: Date.now(),
    author: "Nguyễn Thị Thùy Nhung",
    avatar: myAvatar,
    content: newPostContent,
    likes: 0,
    isLiked: false,
    isSaved: false,
    music: selectedMusic,
    location: location,
    tags: taggedFriends,
    time: "Vừa xong",
    comments: []
  };

  setPosts([newPost, ...posts]);
  setNewPostContent("");
  setSelectedMusic(null);
  setLocation("");
  setTaggedFriends([]);
  setIsPosting(false);
  
  setModerationError("✨ Bài đăng được duyệt an toàn! Đã đăng thành công.");
  setTimeout(() => setModerationError(""), 3000);
};
```

### UI Component
```jsx
<div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white space-y-6">
  <div className="flex gap-5">
    <img src={myAvatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm" />
    <textarea
      value={newPostContent}
      onChange={(e) => setNewPostContent(e.target.value)}
      placeholder="Chia sẻ giải pháp công nghệ hôm nay..."
      className="w-full bg-slate-50 rounded-3xl p-5 focus:ring-4 focus:ring-indigo-100 outline-none h-28 resize-none"
    />
  </div>

  {/* Tags Display */}
  {(location || selectedMusic || taggedFriends.length > 0) && (
    <div className="flex flex-wrap gap-2 px-2">
      {location && (
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg">
          <MapPin className="w-3 h-3 inline" /> {location}
        </span>
      )}
      {selectedMusic && (
        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg">
          <Music className="w-3 h-3 inline" /> {selectedMusic}
        </span>
      )}
      {taggedFriends.map(f => (
        <span key={f} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg">
          <AtSign className="w-3 h-3 inline" /> {f}
        </span>
      ))}
    </div>
  )}

  {/* Error/Success Message */}
  {moderationError && (
    <div className={`p-4 rounded-2xl text-[10px] font-black ${
      moderationError.includes('✨') ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50'
    }`}>
      <ShieldAlert className="w-5 h-5 inline mr-2" />
      {moderationError}
    </div>
  )}

  {/* Toolbar */}
  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
    <div className="flex gap-1">
      <button onClick={() => setLocation("Phòng Lab Hub")} className="p-3 hover:bg-indigo-50 rounded-2xl">
        <MapPin className="w-5 h-5" />
      </button>
      <button onClick={() => setSelectedMusic("Tech Lofi")} className="p-3 hover:bg-indigo-50 rounded-2xl">
        <Music className="w-5 h-5" />
      </button>
      <button onClick={() => setTaggedFriends(["Hoàng An"])} className="p-3 hover:bg-indigo-50 rounded-2xl">
        <AtSign className="w-5 h-5" />
      </button>
    </div>
    <button 
      onClick={handleCreatePost}
      disabled={isPosting}
      className="bg-indigo-600 text-white px-12 py-3 rounded-2xl font-black"
    >
      {isPosting ? 'ANALYZING...' : '✨ ĐĂNG BÀI'}
    </button>
  </div>
</div>
```

---

## 2️⃣ BOOKMARK / SAVE POST

### State Management
```javascript
const [posts, setPosts] = useState([
  {
    id: 1,
    // ... other fields
    isSaved: false  // ← Key field
  }
]);

const handleToggleSave = (postId) => {
  setPosts(posts.map(p => 
    p.id === postId ? { ...p, isSaved: !p.isSaved } : p
  ));
  setModerationError("✨ Đã cập nhật kho lưu trữ!");
  setTimeout(() => setModerationError(""), 2000);
};
```

### Button Component
```jsx
<button
  onClick={() => handleToggleSave(post.id)}
  className={`p-3 rounded-2xl transition-all ${
    post.isSaved 
      ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
      : 'bg-white border border-slate-100 text-slate-400 hover:text-amber-600'
  }`}
>
  <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
</button>
```

### Saved Posts Tab
```javascript
const savedPosts = useMemo(
  () => posts.filter(p => p.isSaved && !hiddenPostIds.includes(p.id)),
  [posts, hiddenPostIds]
);

// Display
{savedPosts.length > 0 ? (
  savedPosts.map(post => (
    <div key={post.id} className="bg-white rounded-[2.5rem] p-8">
      <div className="flex justify-between items-center">
        <h4>{post.author}</h4>
        <button onClick={() => handleToggleSave(post.id)}>GỠ BỎ</button>
      </div>
      <p>"{post.content}"</p>
    </div>
  ))
) : (
  <div className="text-center py-32 text-slate-300">
    KHO LƯU TRỮ ĐANG TRỐNG
  </div>
)}
```

---

## 3️⃣ HIDE POST

### State & Logic
```javascript
const [hiddenPostIds, setHiddenPostIds] = useState([]);

const handleHidePost = (postId) => {
  setHiddenPostIds(prev => [...prev, postId]);
  setModerationError("✨ Bài viết đã bị ẩn khỏi dòng thời gian.");
  setTimeout(() => setModerationError(""), 2000);
};

// Filter posts
const filteredPosts = useMemo(() => {
  return posts.filter(p => !hiddenPostIds.includes(p.id));
}, [posts, hiddenPostIds]);
```

### Menu Button
```jsx
<div className="relative group/menu">
  <button className="p-3 hover:bg-slate-50 rounded-2xl">
    <MoreHorizontal className="w-6 h-6" />
  </button>
  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl hidden group-hover/menu:block z-20">
    <button 
      onClick={() => handleHidePost(post.id)}
      className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-2"
    >
      <EyeOff className="w-4 h-4" /> Ẩn bài viết
    </button>
  </div>
</div>
```

---

## 4️⃣ REAL-TIME SEARCH

### State
```javascript
const [searchQuery, setSearchQuery] = useState("");

const filteredPosts = useMemo(() => {
  return posts
    .filter(p => !hiddenPostIds.includes(p.id))
    .filter(p =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
}, [posts, searchQuery, hiddenPostIds]);
```

### Search Input
```jsx
<div className="relative w-full">
  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
  <input
    type="text"
    placeholder="Tìm kiếm công nghệ, bài viết..."
    className="w-full pl-14 pr-6 py-3.5 bg-slate-100/50 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
```

### Display Results
```jsx
{filteredPosts.map(post => (
  <div key={post.id}>
    {/* Post component */}
  </div>
))}

{filteredPosts.length === 0 && (
  <div className="text-center py-20 text-slate-300">
    Không tìm thấy kết quả cho "{searchQuery}"
  </div>
)}
```

---

## 5️⃣ SHARE POST

### Logic
```javascript
const handleShare = (postId) => {
  const original = posts.find(p => p.id === postId);
  if (!original) return;

  const shared = {
    ...original,
    id: Date.now(),
    author: "Nguyễn Thị Thùy Nhung",
    avatar: myAvatar,
    isShared: true,
    content: `(Chia sẻ từ ${original.author}): "${original.content}"`,
    time: "Vừa xong",
    likes: 0,
    isLiked: false,
    isSaved: false,
    comments: []
  };

  setPosts([shared, ...posts]);
  setModerationError("✨ Đã chia sẻ bài viết lên tường của bạn!");
  setTimeout(() => setModerationError(""), 3000);
};
```

### Button
```jsx
<button
  onClick={() => handleShare(post.id)}
  className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-indigo-600"
>
  <Share2 className="w-5 h-5" />
</button>
```

---

## 6️⃣ NESTED COMMENTS (REPLY TO REPLY)

### Data Structure
```javascript
{
  id: 1,
  author: "Lê Minh",
  comments: [
    {
      id: 101,
      user: "Hoàng An",
      text: "Level 1 comment",
      replies: [
        {
          id: 102,
          user: "Lê Minh",
          text: "Reply to level 1"
        }
      ]
    }
  ]
}
```

### Comment Thread Component
```javascript
const CommentThread = ({ postId, comment, level = 0 }) => {
  const isExpanded = expandedComments[comment.id];
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-indigo-100 pl-6' : ''} space-y-4`}>
      {/* Main Comment */}
      <div className="flex gap-4">
        <img src={comment.avatar} className="w-10 h-10 rounded-2xl" />
        <div className="flex-1">
          <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100">
            <span className="text-[10px] font-black text-indigo-900 uppercase">{comment.user}</span>
            <p className="text-[11px] text-slate-600 italic mt-1">{comment.text}</p>
            <div className="flex gap-3 mt-2 text-[9px] text-slate-400">
              <span>{comment.time}</span>
              <button 
                onClick={() => setReplyingTo(comment.id)}
                className="text-indigo-600 hover:underline"
              >
                Trả lời
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="flex gap-3 ml-16 animate-in">
          <img src={myAvatar} className="w-10 h-10 rounded-2xl" />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Viết phản hồi..."
              autoFocus
              className="flex-1 border border-slate-200 rounded-2xl px-5 py-2.5 text-[11px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAddComment(postId, e.target.value, comment.id);
                  e.target.value = '';
                }
              }}
            />
            <button className="p-2.5 bg-indigo-600 text-white rounded-xl">
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {hasReplies && (
        <div className="space-y-4 ml-4">
          <button
            onClick={() => setExpandedComments(prev => ({
              ...prev,
              [comment.id]: !isExpanded
            }))}
            className="text-[10px] font-black text-indigo-600 uppercase"
          >
            {isExpanded ? '▼ Ẩn' : '▶ Xem'} {comment.replies.length} phản hồi
          </button>
          {isExpanded && comment.replies.map(reply => (
            <CommentThread key={reply.id} postId={postId} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### Add Comment Handler
```javascript
const handleAddComment = (postId, text, parentCommentId = null) => {
  if (!text.trim()) return;

  const newComment = {
    id: Date.now(),
    user: "Nguyễn Thị Thùy Nhung",
    avatar: myAvatar,
    text,
    time: "Vừa xong",
    likes: 0,
    replies: []
  };

  setPosts(posts.map(post => {
    if (post.id === postId) {
      if (!parentCommentId) {
        // Level 1 comment
        return { ...post, comments: [...post.comments, newComment] };
      } else {
        // Reply to existing comment
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === parentCommentId) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            return c;
          })
        };
      }
    }
    return post;
  }));

  setReplyingTo(null);
};
```

---

## 7️⃣ REPORT ABUSE

### Handler
```javascript
const handleReportAbuse = (postId, postAuthor) => {
  setModerationError(
    `✨ Cảm ơn! Chúng tôi đã nhận báo cáo về bài viết của ${postAuthor}. 
     Đội ngũ moderator sẽ xem xét trong 24h.`
  );
  setTimeout(() => setModerationError(""), 4000);
  
  // TODO: Send to backend
  // fetch('/api/reports', { method: 'POST', body: JSON.stringify({ postId, reason: 'abuse' }) })
};
```

### Button
```jsx
<button
  onClick={() => handleReportAbuse(post.id, post.author)}
  className="w-full text-left p-3 hover:bg-red-50 text-red-500 text-xs font-bold"
>
  <Flag className="w-4 h-4 inline" /> Báo cáo vi phạm
</button>
```

---

## 8️⃣ AI MODERATION (GEMINI API)

### API Call
```javascript
const callGemini = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction 
            ? { parts: [{ text: systemInstruction }] } 
            : undefined,
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "SAFE";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "SAFE";
  }
};
```

### Usage in Post Creation
```javascript
const handleCreatePost = async () => {
  if (!newPostContent.trim()) return;
  setIsPosting(true);

  // Check content safety
  const result = await callGemini(
    `Analyze: "${newPostContent}". 
     Respond "UNSAFE" if it has violence, gore, or 18+. 
     Respond "SAFE" otherwise. 
     1 word only.`
  );

  if (result.toUpperCase().includes("UNSAFE")) {
    setModerationError("✨ AI phát hiện nội dung không phù hợp...");
    setIsPosting(false);
    return;
  }

  // Proceed with post creation
  // ...
};
```

---

## 9️⃣ TAB NAVIGATION

### State & Logic
```javascript
const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed', 'saved', 'friends'

const subTabs = [
  { id: 'feed', label: '📰 Bảng tin' },
  { id: 'saved', label: '🔖 Đã lưu' },
  { id: 'friends', label: '👥 Kết nối' }
];
```

### UI Component
```jsx
<div className="flex gap-4 border-b-2 border-slate-100 pb-4">
  {subTabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveSubTab(tab.id)}
      className={`px-6 py-3 font-black text-[11px] uppercase relative ${
        activeSubTab === tab.id
          ? 'text-indigo-700'
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {tab.label}
      {activeSubTab === tab.id && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>
      )}
    </button>
  ))}
</div>

{/* Render based on active tab */}
{activeSubTab === 'feed' && <div>Feed content</div>}
{activeSubTab === 'saved' && <div>Saved content</div>}
{activeSubTab === 'friends' && <div>Friends content</div>}
```

---

## 🔟 SIDEBAR TOGGLE

### State
```javascript
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
```

### Toggle Button
```jsx
<button 
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-indigo-600"
>
  <Menu className="w-5 h-5" />
</button>
```

### Responsive Sidebar
```jsx
<aside className={`
  fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 
  transition-all duration-500 ease-in-out 
  ${isSidebarOpen ? 'w-72' : 'w-24'} 
  flex flex-col shadow-2xl
`}>
  {/* Sidebar content */}
</aside>

<main className={`
  flex-1 flex flex-col transition-all duration-500 
  ${isSidebarOpen ? 'ml-72' : 'ml-24'}
`}>
  {/* Main content */}
</main>
```

---

## 📊 Complete Data Model

```javascript
type Post = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  music?: string;
  location?: string;
  tags: string[];
  time: string;
  isShared?: boolean;
  comments: Comment[];
};

type Comment = {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  replies?: Comment[];
};
```

---

**✨ Ready to use! Copy-paste these snippets into your project.**
