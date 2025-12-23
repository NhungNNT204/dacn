import React, { useEffect, useMemo, useState } from "react";
import {
  MessageCircle, ThumbsUp, Share2, MoreHorizontal,
  Send, Image as ImageIcon, Paperclip, Video, UserPlus, UserMinus,
  Flag, Bookmark, EyeOff, Menu, Bell, Search, Users, Settings, LogOut,
  ShieldAlert, Sparkles, SendHorizontal
} from "lucide-react";

// Cấu hình Gemini API (moderation)
const apiKey = "";
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeChat, setActiveChat] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState("image");
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationError, setModerationError] = useState("");
  const [toast, setToast] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hiddenPostIds, setHiddenPostIds] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // --- MOCK DATA ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Lê Minh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
      content: "Kiến trúc hệ thống tự động hóa trong công nghiệp 4.0 thật sự rất thú vị! Mọi người nghĩ sao về việc áp dụng AI vào PLC?",
      mediaUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?w=800",
      mediaType: "image",
      likes: 15,
      isLiked: false,
      isSaved: false,
      isShared: false,
      time: "2 giờ trước",
      comments: [
        {
          id: 101,
          user: "Hoàng An",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
          text: "Bài viết rất hay, mình đang làm đồ án về phần này.",
          time: "1 giờ trước",
          replies: [
            {
              id: 201,
              user: "Lê Minh",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
              text: "Chào An, nếu cần tài liệu cứ nhắn mình nhé!",
              time: "1 giờ trước",
              replies: []
            }
          ]
        }
      ]
    }
  ]);

  const [chats, setChats] = useState([
    { id: 1, name: "Nhóm lớp IT-01", type: "group", lastMsg: "Mai có bài tập về nhà không?", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Group", messages: [{ id: 1, sender: "Hoàng An", text: "Chào cả lớp!", time: "08:00" }] },
    { id: 2, name: "Thầy Duyệt", type: "1-1", lastMsg: "Em nộp bài đúng hạn nhé.", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duyet", messages: [] },
    { id: 3, name: "EduSpace Global", type: "all", lastMsg: "Chào mừng thành viên mới!", online: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Global", messages: [] }
  ]);

  const [friends, setFriends] = useState([
    { id: 10, name: "Nguyễn Văn A", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A" },
    { id: 11, name: "Trần Thị B", status: "offline", isFriend: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=B" },
    { id: 12, name: "Phạm Minh C", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=C" }
  ]);

  // --- UTILITIES ---
  const callGemini = async (prompt, systemInstruction = "", retryCount = 0) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
          })
        }
      );
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      if (retryCount < 3) return callGemini(prompt, systemInstruction, retryCount + 1);
      return "SAFE";
    }
  };

  // --- ACTION HANDLERS ---
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    setIsPosting(true);
    setModerationError("");

    const result = await callGemini(
      `Analyze this post: "${newPostContent}". Respond "UNSAFE" if it contains violence, 18+, or hate speech. Respond "SAFE" otherwise. Only 1 word.`
    );

    if (result.toUpperCase().includes("UNSAFE")) {
      setModerationError("✨ AI phát hiện nội dung có thể vi phạm tiêu chuẩn cộng đồng. Vui lòng điều chỉnh lại.");
      setIsPosting(false);
      return;
    }

    const newPost = {
      id: Date.now(),
      author: "Nguyễn Sinh Viên",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      content: newPostContent,
      mediaUrl: newMediaUrl || "",
      mediaType: newMediaType,
      likes: 0,
      isLiked: false,
      isSaved: false,
      isShared: false,
      time: "Vừa xong",
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    setNewMediaUrl("");
    setIsPosting(false);
    setToast("Đăng bài thành công");
  };

  const handleToggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? Math.max(0, p.likes - 1) : p.likes + 1 }
          : p
      )
    );
  };

  const handleToggleSave = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
    const target = posts.find((p) => p.id === postId);
    if (target) {
      setToast(target.isSaved ? "Đã gỡ khỏi mục đã lưu" : "Đã lưu bài viết");
    }
  };

  const handleHidePost = (postId) => {
    setHiddenPostIds((prev) => [...prev, postId]);
    setToast("Đã ẩn bài viết khỏi dòng thời gian");
  };

  const handleShare = (postId) => {
    const postToShare = posts.find((p) => p.id === postId);
    if (!postToShare) return;
    const sharedPost = {
      ...postToShare,
      id: Date.now(),
      author: "Nguyễn Sinh Viên",
      content: `(Đã chia sẻ bài viết của ${postToShare.author}): ${postToShare.content}`,
      isShared: true,
      likes: 0,
      isLiked: false,
      isSaved: false,
      time: "Vừa xong",
      comments: []
    };
    setPosts((prev) => [sharedPost, ...prev]);
    setToast("Đã chia sẻ bài viết lên trang cá nhân của bạn");
  };

  const addReplyRecursive = (comments, parentId, newComment) => {
    return comments.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies || []), newComment] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyRecursive(c.replies, parentId, newComment) };
      }
      return c;
    });
  };

  const handleAddComment = (postId, text, parentId = null) => {
    if (!text.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "Nguyễn Sinh Viên",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      text,
      time: "Vừa xong",
      replies: []
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (!parentId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return { ...post, comments: addReplyRecursive(post.comments, parentId, newComment) };
      })
    );
    setReplyInputs((prev) => ({ ...prev, [parentId || "root"]: "" }));
  };

  const sendMessage = (text) => {
    if (!text.trim() || !activeChat) return;
    const newMsg = {
      id: Date.now(),
      sender: "Bạn",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChats((prev) =>
      prev.map((c) => (c.id === activeChat.id ? { ...c, messages: [...c.messages, newMsg], lastMsg: text } : c))
    );
    setActiveChat((prev) => ({ ...prev, messages: [...(prev?.messages || []), newMsg] }));
  };

  const handleReport = (type, id) => {
    setToast(`Đã gửi báo cáo vi phạm cho ${type} #${id}. Chúng tôi sẽ xem xét sớm nhất.`);
  };

  // --- SEARCH & FILTERS ---
  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => !hiddenPostIds.includes(p.id))
      .filter(
        (p) =>
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [posts, hiddenPostIds, searchQuery]);

  const savedPosts = useMemo(() => {
    return posts
      .filter((p) => p.isSaved && !hiddenPostIds.includes(p.id))
      .filter(
        (p) =>
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [posts, hiddenPostIds, searchQuery]);

  const filteredFriends = useMemo(() => {
    return friends.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [friends, searchQuery]);

  // --- TOAST HANDLER ---
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // --- RENDER HELPERS ---
  const renderMedia = (post) => {
    if (!post.mediaUrl) return null;
    const isVideo = post.mediaType === "video" || post.mediaUrl.match(/(\.mp4|\.webm)$/i);
    if (isVideo) {
      return (
        <div className="px-4 pb-4">
          <video controls className="w-full h-80 object-cover rounded-[1.5rem] shadow-sm border border-slate-100">
            <source src={post.mediaUrl} />
          </video>
        </div>
      );
    }
    return (
      <div className="px-4 pb-4">
        <img
          src={post.mediaUrl}
          className="w-full h-80 object-cover rounded-[1.5rem] shadow-sm border border-slate-100"
        />
      </div>
    );
  };

  const renderComments = (comments, postId, depth = 0) => {
    return comments.map((c) => (
      <div key={c.id} className="space-y-3" style={{ marginLeft: depth > 0 ? depth * 28 : 0 }}>
        <div className="flex gap-3">
          <img src={c.avatar} className="w-8 h-8 rounded-full border border-slate-200" />
          <div className="bg-white p-3 rounded-2xl border border-slate-100 max-w-sm shadow-sm relative group">
            <span className="text-[10px] font-black text-slate-900 uppercase block mb-1">{c.user}</span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.text}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
              <button onClick={() => handleReport("Comment", c.id)} className="text-red-400 hover:text-red-600">
                <Flag className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {c.replies?.length > 0 && renderComments(c.replies, postId, depth + 1)}

        <div className="ml-12 flex gap-2 pt-1">
          <input
            type="text"
            value={replyInputs[c.id] || ""}
            placeholder="Viết phản hồi..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-1.5 text-[11px] font-medium outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            onChange={(e) => setReplyInputs((prev) => ({ ...prev, [c.id]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment(postId, replyInputs[c.id] || "", c.id);
              }
            }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col shadow-sm`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-700 p-2 rounded-xl text-white shadow-lg shadow-indigo-100 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-black tracking-tighter italic text-indigo-900">EDUSPACE</h1>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {[
            { id: "feed", icon: Users, label: "Bảng tin" },
            { id: "chat", icon: MessageCircle, label: "Tin nhắn" },
            { id: "friends", icon: UserPlus, label: "Bạn bè" },
            { id: "saved", icon: Bookmark, label: "Đã lưu" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl font-bold transition-all ${
                activeTab === item.id
                  ? "bg-indigo-700 text-white shadow-md shadow-indigo-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-indigo-700"
              }`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
            <Settings className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="text-sm">Cài đặt</span>}
          </button>
          <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="text-sm">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all">
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm bài viết, tác giả hoặc bạn bè..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl relative transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-indigo-500 transition-all">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col items-center bg-white/50 scrollbar-hide">
          {/* FEED */}
          {activeTab === "feed" && (
            <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
              {/* Create Post */}
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex gap-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    className="w-12 h-12 rounded-full border border-slate-100 shadow-sm"
                  />
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Bạn đang học được điều gì mới hôm nay?"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none transition-all"
                  />
                </div>
                <div className="flex gap-3 px-1">
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="Thêm URL ảnh/video (tuỳ chọn)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="image">Ảnh</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                {moderationError && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top ${
                      moderationError.includes("vi phạm") ? "text-red-600 bg-red-50" : "text-indigo-600 bg-indigo-50"
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" /> {moderationError}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-top border-slate-100">
                  <div className="flex gap-1">
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={isPosting}
                    className="bg-indigo-700 text-white px-10 py-2.5 rounded-xl font-black hover:bg-indigo-800 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                  >
                    {isPosting ? "KIỂM DUYỆT..." : "ĐĂNG BÀI"}
                  </button>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md animate-in fade-in"
                  >
                    <div className="p-5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50" />
                        <div>
                          <h4 className="font-black text-sm text-slate-900 leading-tight">
                            {post.author}
                            {post.isShared && (
                              <span className="ml-2 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase font-black">
                                Đã chia sẻ
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.time}</span>
                        </div>
                      </div>
                      <div className="relative group">
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 focus:outline-none">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 hidden group-focus-within:block z-20 animate-in zoom-in duration-200">
                          <button
                            onClick={() => handleHidePost(post.id)}
                            className="w-full text-left p-3 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2"
                          >
                            <EyeOff className="w-4 h-4" /> Ẩn bài viết
                          </button>
                          <button
                            onClick={() => handleReport("Post", post.id)}
                            className="w-full text-left p-3 hover:bg-red-50 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 italic"
                          >
                            <Flag className="w-4 h-4" /> Báo cáo vi phạm
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-4">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">{post.content}</p>
                    </div>
                    {renderMedia(post)}

                    <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-2 text-xs font-black transition-all ${
                            post.isLiked ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} /> {post.likes}
                        </button>
                        <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-all">
                          <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0} Bình luận
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleShare(post.id)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleSave(post.id)}
                          className={`p-2.5 rounded-xl transition-all shadow-sm ${
                            post.isSaved ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${post.isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="px-5 pb-5 pt-4 bg-slate-50/50 space-y-4 border-t border-slate-100">
                      {renderComments(post.comments, post.id)}
                      <div className="flex gap-3 pt-2">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                          className="w-8 h-8 rounded-full border border-indigo-100 shadow-sm"
                        />
                        <input
                          type="text"
                          value={replyInputs["root"] || ""}
                          placeholder="Thêm bình luận của bạn..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all"
                          onChange={(e) => setReplyInputs((prev) => ({ ...prev, root: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(post.id, replyInputs["root"] || "");
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-200 w-10 h-10" />
                  </div>
                  <p className="font-black text-slate-400 italic uppercase tracking-widest">Không tìm thấy nội dung phù hợp</p>
                </div>
              )}
            </div>
          )}

          {/* CHAT */}
          {activeTab === "chat" && (
            <div className="w-full max-w-6xl h-[calc(100vh-140px)] flex bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in duration-300">
              <aside className="w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/20">
                <div className="p-6 border-b border-slate-100 bg-white">
                  <h3 className="font-black text-xl italic text-indigo-900 tracking-tight">Trò chuyện</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full p-5 flex items-center gap-4 hover:bg-indigo-50 transition-all border-b border-slate-50 ${
                        activeChat?.id === chat.id ? "bg-indigo-50 border-l-4 border-l-indigo-700" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover border border-slate-100" />
                        {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>}
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="font-black text-sm text-slate-900 truncate">{chat.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate font-medium">{chat.lastMsg || "Bắt đầu trò chuyện ngay"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="flex-1 flex flex-col bg-white">
                {activeChat ? (
                  <>
                    <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                      <div className="flex items-center gap-3">
                        <img src={activeChat.avatar} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{activeChat.name}</h4>
                          <span className="text-[10px] text-emerald-500 font-black uppercase">Trực tuyến</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/10 scrollbar-hide">
                      {activeChat.messages.map((m) => (
                        <div key={m.id} className={`flex flex-col ${m.sender === "Bạn" ? "items-end" : "items-start"} gap-1 animate-in slide-up`}>
                          <div
                            className={`p-3.5 rounded-2xl text-xs font-medium max-w-sm shadow-sm ${
                              m.sender === "Bạn"
                                ? "bg-indigo-700 text-white rounded-tr-none"
                                : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                            }`}
                          >
                            {m.text}
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mx-1">{m.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 border-t border-slate-100 flex items-center gap-4 bg-white">
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        id="chat-input-box"
                        placeholder="Nhập nội dung tin nhắn..."
                        className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            sendMessage(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const inp = document.getElementById("chat-input-box");
                          if (!inp) return;
                          sendMessage(inp.value);
                          inp.value = "";
                        }}
                        className="p-3.5 bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all"
                      >
                        <SendHorizontal className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
                    <MessageCircle className="w-20 h-20 opacity-10 mb-4 animate-bounce" />
                    <p className="font-black italic text-slate-400">CHỌN CUỘC TRÒ CHUYỆN ĐỂ BẮT ĐẦU</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* FRIENDS */}
          {activeTab === "friends" && (
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img src={friend.avatar} className="w-16 h-16 rounded-full border-2 border-indigo-50" />
                      <div
                        className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                          friend.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight italic">{friend.name}</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{friend.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const chat = chats.find((c) => c.name.includes(friend.name.split(" ").pop()));
                        if (chat) {
                          setActiveChat(chat);
                          setActiveTab("chat");
                        }
                      }}
                      className="p-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setFriends((prev) =>
                          prev.map((f) => (f.id === friend.id ? { ...f, isFriend: !f.isFriend } : f))
                        )
                      }
                      className={`p-3 rounded-xl transition-all shadow-sm ${
                        friend.isFriend ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-indigo-700 text-white hover:bg-indigo-800"
                      }`}
                    >
                      {friend.isFriend ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
              {filteredFriends.length === 0 && (
                <div className="col-span-2 text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <p className="font-black text-slate-300 italic uppercase">Không tìm thấy bạn bè phù hợp</p>
                </div>
              )}
            </div>
          )}

          {/* SAVED */}
          {activeTab === "saved" && (
            <div className="w-full max-w-2xl space-y-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                  <Bookmark className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-black text-xl italic text-slate-900 uppercase">Kho lưu trữ của bạn</h3>
              </div>
              {savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in"
                  >
                    <div className="p-5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} className="w-10 h-10 rounded-full border border-slate-50" />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{post.author}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-4">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">{post.content}</p>
                    </div>
                    <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
                      <button
                        onClick={() => handleToggleSave(post.id)}
                        className="text-indigo-600 font-black text-xs flex items-center gap-2 hover:underline"
                      >
                        <Bookmark className="w-4 h-4 fill-current" /> ĐÃ LƯU
                      </button>
                      <button onClick={() => handleShare(post.id)} className="p-2 text-slate-400 hover:text-indigo-600">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                  <Bookmark className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                  <p className="font-black text-slate-300 italic uppercase">Bạn chưa lưu bài viết nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-800 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          {toast}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slide-up 0.4s ease-out forwards; }
      `
        }}
      />
    </div>
  );
};

export default CommunityHub;

