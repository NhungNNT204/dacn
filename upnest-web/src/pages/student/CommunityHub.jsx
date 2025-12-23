import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, ThumbsUp, Share2, MoreHorizontal, 
  Send, Image as ImageIcon, Paperclip, Video, UserPlus, UserMinus, 
  Flag, Bookmark, Trash2, EyeOff, X, Smile, ShieldAlert,
  Users, Globe, Bell, Search, Layout, Phone, Mic, Camera,
  MoreVertical, Reply, Share, Check, Sparkles, Wand2, FileText, Loader2,
  SendHorizontal, Heart, Menu, Settings, LogOut, Music, MapPin, 
  AtSign, Hash, Trophy, Lightbulb, Zap, Command, Download, AlertCircle, Eye
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed'); 
  const [activeChat, setActiveChat] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationStatus, setModerationStatus] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState("");
  
  // Extended post features
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [hiddenPostIds, setHiddenPostIds] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  // User avatar - securely from environment or localStorage
  const myAvatar = "https://lh3.googleusercontent.com/d/1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC";
  const currentUser = "Nguyễn Sinh Viên";

  // --- MOCK DATA WITH EXTENDED FEATURES ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Lê Minh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
      content: "Đang nghiên cứu cách tích hợp AI vào hệ thống SCADA để dự báo bảo trì tự động. Công nghệ này thực sự là tương lai của ngành Tự động hóa! 🤖💻",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      likes: 42,
      isLiked: false,
      isSaved: false,
      isShared: false,
      music: "Synthwave Future",
      location: "Phòng nghiên cứu AI",
      tags: ["Hoàng An"],
      time: "2 giờ trước",
      comments: [
        { 
          id: 101, 
          user: "Hoàng An", 
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
          text: "Rất ấn tượng! Mình nghĩ việc tối ưu hóa latency là quan trọng nhất.", 
          timestamp: "1 giờ trước",
          replies: [
            {
              id: 1011,
              user: "Lê Minh",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
              text: "Đúng rồi, đó là bottleneck chính!",
              timestamp: "30 phút trước"
            }
          ]
        }
      ],
      moderationStatus: "APPROVED"
    },
    {
      id: 2,
      author: "Trần Thế Duyệt",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duyet",
      content: "Kiến trúc Microservices mang lại sự linh hoạt cực lớn cho các hệ thống giáo dục quy mô lớn. Hãy xem bài viết chi tiết tại thư viện số nhé.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      likes: 128,
      isLiked: true,
      isSaved: true,
      isShared: false,
      time: "5 giờ trước",
      comments: [],
      moderationStatus: "APPROVED"
    }
  ]);

  const [savedPosts, setSavedPosts] = useState(new Set());
  
  const [chats, setChats] = useState([
    { id: 1, name: "Nhóm IT-01", type: "group", lastMsg: "Video lab đã lên rồi nhé!", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Group", messages: [] },
    { id: 2, name: "Thầy Duyệt", type: "1-1", lastMsg: "Bài tập của em rất tốt.", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duyet", messages: [] }
  ]);

  const [friends, setFriends] = useState([
    { id: 10, name: "Nguyễn Văn A", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A" },
    { id: 11, name: "Khánh Linh", status: "offline", isFriend: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh" },
    { id: 12, name: "Hoàng An", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An" }
  ]);

  // --- API INTEGRATION ---
  const callContentModeration = async (content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auto-post/analyze-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      return data.status || "SAFE";
    } catch (error) {
      console.error("Moderation error:", error);
      return "SAFE"; // Default to safe on error
    }
  };

  // --- POST OPERATIONS ---
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    setIsPosting(true);
    setModerationStatus("ANALYZING");
    
    try {
      // AI Moderation
      const result = await callContentModeration(newPostContent);
      
      if (result === "UNSAFE") {
        setModerationStatus("BLOCKED");
        setTimeout(() => setModerationStatus(null), 4000);
        setIsPosting(false);
        return;
      }

      const newPost = {
        id: Date.now(),
        author: currentUser,
        avatar: myAvatar,
        content: newPostContent,
        image: selectedImage,
        likes: 0,
        isLiked: false,
        isSaved: false,
        isShared: false,
        music: selectedMusic,
        location: selectedLocation,
        tags: taggedFriends,
        time: "Vừa xong",
        comments: [],
        moderationStatus: "APPROVED"
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setSelectedMusic(null);
      setSelectedLocation("");
      setTaggedFriends([]);
      setSelectedImage(null);
      setModerationStatus("SUCCESS");
      
      setTimeout(() => setModerationStatus(null), 3000);
    } catch (error) {
      console.error("Post creation error:", error);
      setModerationStatus("ERROR");
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = (postId) => {
    setPosts(posts.map(p => p.id === postId ? {...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes-1 : p.likes+1} : p));
  };

  const handleToggleSave = (postId) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
      setModerationStatus(null);
    } else {
      newSaved.add(postId);
      setModerationStatus("SAVED");
      setTimeout(() => setModerationStatus(null), 2000);
    }
    setSavedPosts(newSaved);
  };

  const handleHidePost = (postId) => {
    const newHidden = new Set(hiddenPostIds);
    newHidden.add(postId);
    setHiddenPostIds(newHidden);
    setModerationStatus("HIDDEN");
    setTimeout(() => setModerationStatus(null), 2000);
  };

  const handleSharePost = (postId) => {
    const original = posts.find(p => p.id === postId);
    if (!original) return;
    
    const shared = {
      ...original,
      id: Date.now(),
      author: currentUser,
      avatar: myAvatar,
      isShared: true,
      content: `(Chia sẻ từ ${original.author}): ${original.content}`,
      time: "Vừa xong",
      likes: 0,
      isLiked: false,
      isSaved: false,
      comments: []
    };
    
    setPosts([shared, ...posts]);
    setModerationStatus("SHARED");
    setTimeout(() => setModerationStatus(null), 3000);
  };

  const handleAddComment = (postId, text, parentCommentId = null) => {
    if (!text.trim()) return;
    
    const newComment = { 
      id: Date.now(), 
      user: currentUser, 
      avatar: myAvatar, 
      text, 
      timestamp: "Vừa xong",
      replies: [] 
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (!parentCommentId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return {
          ...post,
          comments: post.comments.map(c =>
            c.id === parentCommentId
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        };
      }
      return post;
    }));
  };

  const handleReportContent = async (postId) => {
    if (!reportReason.trim()) return;
    try {
      // API call to backend
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason })
      });
      if (response.ok) {
        setModerationStatus("REPORTED");
        setShowReportModal(null);
        setReportReason("");
        setTimeout(() => setModerationStatus(null), 3000);
      }
    } catch (error) {
      console.error("Report error:", error);
    }
  };

  const handleSendMessage = (text) => {
    if (!text.trim() || !activeChat) return;
    const newMsg = { id: Date.now(), sender: "Bạn", text, time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) };
    setChats(chats.map(c => c.id === activeChat.id ? { ...c, messages: [...c.messages, newMsg], lastMsg: text } : c));
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
  };

  // --- FILTERED VIEWS ---
  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => !hiddenPostIds.has(p.id))
      .filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
      );
  }, [posts, searchQuery, hiddenPostIds]);

  const savedPostsList = useMemo(() => 
    posts.filter(p => savedPosts.has(p.id) && !hiddenPostIds.has(p.id)), 
    [posts, savedPosts, hiddenPostIds]
  );

  // Report modal component
  const ReportModal = ({ postId, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-white animate-in zoom-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-3 rounded-xl"><Flag className="w-6 h-6 text-red-600"/></div>
          <h3 className="text-lg font-black italic text-slate-900 uppercase">BÁO CÁO VI PHẠM</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          {["Nội dung không phù hợp", "Spam hoặc lạm dụng", "Vi phạm bản quyền", "Gây bạo lực"].map(reason => (
            <label key={reason} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
              <input type="radio" name="report" value={reason} onChange={(e) => setReportReason(e.target.value)} className="w-4 h-4"/>
              <span className="text-xs font-bold text-slate-700">{reason}</span>
            </label>
          ))}
        </div>

        <textarea 
          placeholder="Mô tả chi tiết về vi phạm..."
          className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold border border-slate-200 focus:ring-4 focus:ring-red-50 outline-none resize-none h-24 mb-6"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Hủy</button>
          <button onClick={() => handleReportContent(postId)} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">Gửi báo cáo</button>
        </div>
      </div>
    </div>
  );

  // Status message component
  const StatusNotification = () => {
    if (!moderationStatus) return null;
    const config = {
      ANALYZING: { icon: Loader2, text: "🔍 Phân tích AI...", color: "bg-blue-50 text-blue-700" },
      SUCCESS: { icon: Check, text: "✅ Đăng bài thành công!", color: "bg-emerald-50 text-emerald-700" },
      BLOCKED: { icon: ShieldAlert, text: "⛔ Nội dung không được duyệt", color: "bg-red-50 text-red-700" },
      SAVED: { icon: Bookmark, text: "🔖 Đã lưu bài viết", color: "bg-amber-50 text-amber-700" },
      SHARED: { icon: Share2, text: "✨ Chia sẻ thành công", color: "bg-indigo-50 text-indigo-700" },
      HIDDEN: { icon: EyeOff, text: "👻 Ẩn bài viết", color: "bg-slate-50 text-slate-700" },
      REPORTED: { icon: Flag, text: "📋 Gửi báo cáo thành công", color: "bg-purple-50 text-purple-700" },
      ERROR: { icon: AlertCircle, text: "❌ Lỗi xảy ra", color: "bg-red-50 text-red-700" }
    };
    const { icon: Icon, text, color } = config[moderationStatus];
    return (
      <div className={`fixed bottom-8 right-8 p-4 rounded-2xl ${color} font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl border border-current border-opacity-20 animate-in slide-in-from-bottom z-40`}>
        <Icon className="w-5 h-5 animate-spin" />
        {text}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-r border-white/20 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-24'} flex flex-col shadow-2xl`}>
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-3 rounded-2xl text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-50 animate-pulse">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter italic leading-none text-indigo-900">UPNEST.EDU</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 mt-1">🌐 Community Hub</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
          {[
            { id: 'feed', IconComponent: Globe, label: 'Bảng tin', badge: '✨' },
            { id: 'chat', IconComponent: MessageCircle, label: 'Tin nhắn', badge: '💬' },
            { id: 'friends', IconComponent: Users, label: 'Bạn bè', badge: '👥' },
            { id: 'saved', IconComponent: Bookmark, label: 'Đã lưu', badge: '🔖' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 p-4 rounded-[1.5rem] font-black transition-all group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-300 translate-x-1' 
                  : 'text-slate-400 hover:bg-white/50 hover:text-indigo-600 hover:backdrop-blur-sm'
              }`}
            >
              {activeTab === item.id && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
              <item.IconComponent className={`w-6 h-6 shrink-0 transition-transform relative z-10 ${activeTab === item.id ? 'scale-110 animate-bounce' : 'group-hover:scale-110'}`} />
              {isSidebarOpen && <span className="text-xs uppercase tracking-widest relative z-10">{item.label}</span>}
              {isSidebarOpen && activeTab === item.id && <span className="ml-auto text-lg">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/20 space-y-1">
          <button className="w-full flex items-center gap-5 p-4 rounded-[1.5rem] font-black text-slate-400 hover:bg-white/50 hover:text-indigo-600 transition-all">
            <Settings className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="text-xs uppercase tracking-widest">Cài đặt</span>}
          </button>
          <button className="w-full flex items-center gap-5 p-4 rounded-[1.5rem] font-black text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="text-xs uppercase tracking-widest">Thoát</span>}
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <main className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-24'}`}>
        
        {/* HEADER */}
        <header className="h-24 bg-white/40 backdrop-blur-2xl border-b border-white/30 flex items-center justify-between px-10 sticky top-0 z-30 shadow-lg shadow-indigo-100/20">
          <div className="flex items-center gap-6 flex-1 max-w-3xl">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white/80 shadow-lg transition-all hover:scale-110">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="🔍 Tìm bài viết, người dùng, hashtag..." 
                className="w-full pl-14 pr-6 py-3.5 bg-white/30 backdrop-blur-md border border-white/50 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-200 focus:bg-white/80 outline-none transition-all shadow-inner hover:bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
               <span className="text-[11px] font-black uppercase tracking-tighter text-slate-900 italic">🎓 {currentUser}</span>
               <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50/80 px-3 py-1 rounded-md mt-1 backdrop-blur-sm">⭐ Level 12: Expert</span>
            </div>
            <div className="relative p-3 bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg cursor-pointer hover:bg-white/80 transition-all hover:shadow-xl">
              <Bell className="w-5 h-5 text-slate-600"/>
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-lg"></span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white bg-gradient-to-br from-indigo-100 to-purple-100 shadow-2xl overflow-hidden cursor-pointer hover:scale-110 transition-transform ring-2 ring-indigo-200">
               <img src={myAvatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center bg-transparent scrollbar-hide">
          
          {/* TAB: BẢNG TIN */}
          {activeTab === 'feed' && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">
              
              {/* BOX ĐĂNG BÀI */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border border-white/50 space-y-6 hover:bg-white/80 transition-all ring-1 ring-white/80">
                <div className="flex gap-5">
                  <img src={myAvatar} className="w-14 h-14 rounded-2xl bg-indigo-50 border-3 border-white shadow-lg object-cover ring-2 ring-indigo-100" />
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="💡 Chia sẻ kiến thức công nghệ, giải pháp hay hoặc câu hỏi của bạn..." 
                    className="w-full bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-[2rem] p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-200 focus:bg-white outline-none h-28 resize-none transition-all shadow-inner"
                  />
                </div>

                {/* Featured tags */}
                {(selectedLocation || selectedMusic || taggedFriends.length > 0) && (
                  <div className="flex flex-wrap gap-2 px-2 animate-in slide-in-from-top-2">
                    {selectedLocation && <span className="px-3 py-1.5 bg-emerald-100/60 backdrop-blur-sm text-emerald-700 text-[10px] font-black rounded-lg flex items-center gap-1.5 border border-emerald-200"><MapPin className="w-3 h-3"/> {selectedLocation}</span>}
                    {selectedMusic && <span className="px-3 py-1.5 bg-amber-100/60 backdrop-blur-sm text-amber-700 text-[10px] font-black rounded-lg flex items-center gap-1.5 border border-amber-200"><Music className="w-3 h-3"/> {selectedMusic}</span>}
                    {taggedFriends.map(f => <span key={f} className="px-3 py-1.5 bg-indigo-100/60 backdrop-blur-sm text-indigo-700 text-[10px] font-black rounded-lg flex items-center gap-1.5 border border-indigo-200"><AtSign className="w-3 h-3"/> {f}</span>)}
                  </div>
                )}

                {/* Status notifications */}
                {moderationStatus === "ANALYZING" && <div className="p-4 rounded-2xl text-[10px] font-black flex items-center gap-3 animate-pulse text-blue-600 bg-blue-50 border border-blue-100"><Loader2 className="w-5 h-5 animate-spin"/>{moderationStatus === 'ANALYZING' ? '🤖 AI đang kiểm duyệt...' : ''}</div>}
                {moderationStatus === "BLOCKED" && <div className="p-4 rounded-2xl text-[10px] font-black flex items-center gap-3 text-red-600 bg-red-50 border border-red-100"><ShieldAlert className="w-5 h-5"/>❌ Nội dung không phù hợp</div>}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex gap-1">
                    <button onClick={() => setSelectedLocation("🏢 Phòng Lab Hub")} title="Thêm vị trí" className="p-3 hover:bg-emerald-50 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all border border-slate-200/50 bg-white/30 backdrop-blur-sm"><MapPin className="w-5 h-5"/></button>
                    <button onClick={() => setSelectedMusic("🎵 Tech Lofi Beats")} title="Thêm nhạc" className="p-3 hover:bg-amber-50 rounded-2xl text-slate-400 hover:text-amber-600 transition-all border border-slate-200/50 bg-white/30 backdrop-blur-sm"><Music className="w-5 h-5"/></button>
                    <button onClick={() => setTaggedFriends([...taggedFriends, "Hoàng An"])} title="Tag bạn bè" className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-200/50 bg-white/30 backdrop-blur-sm"><AtSign className="w-5 h-5"/></button>
                    <button title="Emoji" className="p-3 hover:bg-purple-50 rounded-2xl text-slate-400 hover:text-purple-600 transition-all border border-slate-200/50 bg-white/30 backdrop-blur-sm"><Smile className="w-5 h-5"/></button>
                  </div>
                  <button onClick={handleCreatePost} disabled={isPosting || !newPostContent.trim()} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-12 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 shadow-xl shadow-indigo-300/50 transition-all disabled:opacity-50 uppercase tracking-widest text-[11px] border border-white/20">
                    {isPosting ? '🔄 ANALYZING...' : '✈️ ĐĂNG BÀI'}
                  </button>
                </div>
              </div>

              {/* LIST POSTS */}
              {filteredPosts.length > 0 ? filteredPosts.map(post => (
                <div key={post.id} className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden group hover:shadow-3xl hover:bg-white/80 transition-all duration-500 animate-in fade-in ring-1 ring-white/80">
                  <div className="p-8 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-3 border-white shadow-lg ring-2 ring-slate-100">
                        <img src={post.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 leading-tight italic tracking-tighter">{post.author}</h4>
                          {post.moderationStatus === "APPROVED" && <span className="bg-emerald-500 text-white p-1 rounded-full animate-pulse"><Check className="w-3 h-3"/></span>}
                          {post.isShared && <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black">ĐÃ CHIA SẺ</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{post.time}</span>
                          {post.location && <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg"><MapPin className="w-3 h-3"/> {post.location}</span>}
                          {post.music && <span className="text-[9px] text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg"><Music className="w-3 h-3"/> {post.music}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="relative group/menu">
                      <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 transition-all border border-slate-200/50 bg-white/30 backdrop-blur-sm"><MoreHorizontal className="w-6 h-6"/></button>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-2 hidden group-hover/menu:block z-20">
                         <button onClick={() => handleHidePost(post.id)} className="w-full text-left p-3 hover:bg-slate-100/80 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 italic transition-all">
                           <EyeOff className="w-4 h-4"/> Ẩn bài viết
                         </button>
                         <button onClick={() => setShowReportModal(post.id)} className="w-full text-left p-3 hover:bg-red-100/80 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 italic transition-all">
                           <Flag className="w-4 h-4"/> Báo cáo vi phạm
                         </button>
                         <button className="w-full text-left p-3 hover:bg-slate-100/80 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 italic transition-all">
                           <Trash2 className="w-4 h-4"/> Xóa bài
                         </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-8 pb-6">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map(tag => <span key={tag} className="text-[9px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg font-bold">@{tag}</span>)}
                      </div>
                    )}
                  </div>

                  {post.image && (
                    <div className="px-8 pb-6 relative group/img">
                      <img src={post.image} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl border-3 border-white" />
                      <div className="absolute inset-x-8 bottom-8 bg-black/50 backdrop-blur-xl p-4 rounded-3xl border border-white/30 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-between text-white">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-xl"><Sparkles className="w-4 h-4"/></div>
                            <span className="text-[10px] font-black uppercase tracking-widest italic">AI Approved Content</span>
                         </div>
                         <button className="p-2 bg-white/20 rounded-xl hover:bg-white/40 transition-all"><Download className="w-4 h-4"/></button>
                      </div>
                    </div>
                  )}

                  <div className="px-8 py-6 border-t border-white/30 flex justify-between items-center bg-slate-50/20 backdrop-blur-sm">
                    <div className="flex gap-8">
                      <button onClick={() => handleToggleLike(post.id)} className={`flex items-center gap-2 text-[11px] font-black transition-all ${post.isLiked ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-600'}`}>
                        <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`}/> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all"><MessageCircle className="w-5 h-5"/> {post.comments?.length || 0} REPLY</button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleSharePost(post.id)} className="p-3 bg-white/50 backdrop-blur-md border border-white/50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-lg"><Share2 className="w-5 h-5"/></button>
                      <button 
                        onClick={() => handleToggleSave(post.id)}
                        className={`p-3 rounded-2xl transition-all border ${savedPosts.has(post.id) ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 border-amber-600' : 'bg-white/50 backdrop-blur-md border-white/50 text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${savedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* COMMENTS SECTION */}
                  <div className="px-8 pb-8 pt-6 space-y-6 bg-slate-50/30 backdrop-blur-sm">
                    {post.comments && post.comments.map(comment => (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex gap-4 group">
                          <img src={comment.avatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover" />
                          <div className="bg-white/60 backdrop-blur-md p-4 rounded-[1.5rem] rounded-tl-none border border-white/50 max-w-sm shadow-lg transition-all hover:shadow-xl hover:bg-white/80">
                            <span className="text-[10px] font-black text-indigo-900 uppercase block mb-1">{comment.user}</span>
                            <p className="text-[11px] text-slate-700 font-bold italic leading-relaxed">{comment.text}</p>
                            <span className="text-[8px] text-slate-400 font-black mt-2 block">{comment.timestamp}</span>
                          </div>
                        </div>

                        {/* Nested replies */}
                        {comment.replies && comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-4 ml-8 group">
                            <img src={reply.avatar} className="w-9 h-9 rounded-2xl border-2 border-white shadow-md object-cover" />
                            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-[1.2rem] rounded-tl-none border border-white/40 max-w-xs shadow-md text-[10px]">
                              <span className="font-black text-purple-900 uppercase block mb-0.5">{reply.user}</span>
                              <p className="text-slate-700 font-bold italic">{reply.text}</p>
                              <span className="text-[7px] text-slate-400 font-black mt-1 block">{reply.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Comment input */}
                    <div className="flex gap-4 pt-4 border-t border-white/20">
                       <img src={myAvatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover" />
                       <input 
                        type="text" 
                        placeholder="Viết bình luận của bạn..." 
                        className="flex-1 bg-white/60 backdrop-blur-md border border-white/50 rounded-[1.5rem] px-6 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white shadow-lg transition-all"
                        onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value.trim()) { handleAddComment(post.id, e.target.value); e.target.value = ""; } }}
                       />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50">
                  <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="font-black text-slate-300 italic uppercase tracking-widest">Không tìm thấy bài viết</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: NHẮN TIN */}
          {activeTab === 'chat' && (
            <div className="w-full max-w-6xl h-[calc(100vh-140px)] flex bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden animate-in zoom-in duration-500 ring-1 ring-white/80">
               <aside className="w-80 border-r border-white/30 flex flex-col shrink-0 bg-slate-50/30 backdrop-blur-sm">
                  <div className="p-8 border-b border-white/20 bg-white/50 backdrop-blur-md">
                    <h3 className="text-xl font-black italic text-indigo-900 tracking-tighter uppercase">💬 Terminal Chat</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {chats.map(chat => (
                      <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full p-5 flex items-center gap-4 rounded-[1.5rem] transition-all group relative overflow-hidden ${activeChat?.id === chat.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl translate-x-2' : 'hover:bg-white/50 text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'chat' && activeChat?.id === chat.id && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                        <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-white/50 relative z-10" />
                        <div className="text-left overflow-hidden relative z-10">
                           <h4 className="font-black text-xs truncate uppercase tracking-widest">{chat.name}</h4>
                           <p className={`text-[10px] truncate italic ${activeChat?.id === chat.id ? 'text-indigo-200' : 'text-slate-400'}`}>{chat.lastMsg || (chat.online ? "🟢 Online" : "🔴 Offline")}</p>
                        </div>
                      </button>
                    ))}
                  </div>
               </aside>
               <section className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
                  {activeChat ? (
                    <>
                      <div className="h-20 px-8 border-b border-white/20 flex items-center justify-between shadow-sm z-10 bg-white/40 backdrop-blur-md">
                        <div className="flex items-center gap-4 font-black italic uppercase tracking-widest text-indigo-900 text-sm">
                          <img src={activeChat.avatar} className="w-10 h-10 rounded-xl border-2 border-white/50" />
                          {activeChat.name}
                          {activeChat.online && <span className="text-[8px] bg-emerald-500 text-white px-2 py-1 rounded-full animate-pulse">ONLINE</span>}
                        </div>
                        <div className="flex gap-3">
                          <button className="p-3 bg-white/60 backdrop-blur-md border border-white/30 text-indigo-600 rounded-2xl hover:bg-white transition-all"><Video className="w-5 h-5"/></button>
                          <button className="p-3 bg-white/60 backdrop-blur-md border border-white/30 text-indigo-600 rounded-2xl hover:bg-white transition-all"><Phone className="w-5 h-5"/></button>
                        </div>
                      </div>
                      <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-50/50 to-transparent scrollbar-hide">
                         {activeChat.messages.length > 0 ? activeChat.messages.map(m => (
                            <div key={m.id} className={`flex flex-col ${m.sender === 'Bạn' ? 'items-end' : 'items-start'} gap-1 animate-in slide-up`}>
                              <div className={`p-4 rounded-[1.5rem] text-[11px] font-bold max-w-sm shadow-xl transition-all ${m.sender === 'Bạn' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-200' : 'bg-white/70 backdrop-blur-md border border-white/50 text-slate-700 rounded-tl-none shadow-slate-200'}`}>
                                {m.text}
                              </div>
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mx-2">{m.time}</span>
                            </div>
                         )) : (
                           <div className="flex items-center justify-center h-full text-slate-300">
                             <span className="text-[10px] font-black uppercase">Không có tin nhắn</span>
                           </div>
                         )}
                      </div>
                      <div className="p-6 border-t border-white/20 flex items-center gap-5 bg-white/50 backdrop-blur-md">
                        <input 
                          type="text" 
                          placeholder="💬 Nhập tin nhắn..." 
                          className="flex-1 bg-white/60 backdrop-blur-md border border-white/50 rounded-[1.5rem] px-8 py-4 text-xs font-black italic outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white transition-all shadow-lg uppercase tracking-widest"
                          onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value.trim()) { handleSendMessage(e.target.value); e.target.value = ""; } }}
                        />
                        <button className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border border-white/30"><SendHorizontal className="w-6 h-6"/></button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                       <MessageCircle className="w-20 h-20 opacity-10 mb-4 animate-bounce" />
                       <h3 className="font-black italic tracking-widest opacity-30 uppercase">Chọn cuộc trò chuyện</h3>
                    </div>
                  )}
               </section>
            </div>
          )}

          {/* TAB: ĐÃ LƯU */}
          {activeTab === 'saved' && (
            <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-right duration-500">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl text-white shadow-2xl shadow-amber-200"><Bookmark className="w-6 h-6 fill-current" /></div>
                  <h3 className="font-black text-3xl italic text-slate-900 uppercase tracking-tighter">📚 Kho lưu trữ</h3>
               </div>
               {savedPostsList.length > 0 ? savedPostsList.map(post => (
                 <div key={post.id} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden hover:shadow-3xl hover:bg-white/80 transition-all animate-in fade-in ring-1 ring-white/80">
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img src={post.avatar} className="w-12 h-12 rounded-xl border-2 border-white shadow-lg object-cover" />
                          <div>
                            <h4 className="font-black text-sm text-slate-900 italic uppercase">{post.author}</h4>
                            <span className="text-[9px] text-slate-400 font-black">{post.time}</span>
                          </div>
                        </div>
                        <button onClick={() => handleToggleSave(post.id)} className="text-amber-600 font-black text-[10px] bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-all">✕ GỠ BỎ</button>
                      </div>
                      <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{post.content}"</p>
                      {post.image && <img src={post.image} className="w-full h-64 object-cover rounded-2xl border-2 border-white/50" />}
                      <button onClick={() => handleSharePost(post.id)} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"><Share2 className="w-4 h-4"/> ✈️ Chia sẻ lên tường</button>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 border-dashed">
                    <Bookmark className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                    <p className="font-black text-slate-300 italic uppercase tracking-widest">Kho lưu trữ trống</p>
                    <p className="text-[11px] text-slate-400 italic mt-2">Lưu bài viết để xem sau</p>
                 </div>
               )}
            </div>
          )}

        </div>
      </main>

      {/* MODALS */}
      {showReportModal && <ReportModal postId={showReportModal} onClose={() => setShowReportModal(null)} />}
      <StatusNotification />
      
      {/* CSS GLOBAL */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-from-bottom { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: fade-in 0.5s ease-out forwards; }
        .slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-in-from-bottom { animation: slide-in-from-bottom 0.3s ease-out; }
        .zoom-in { animation: zoom-in 0.3s ease-out; }
      `}} />
    </div>
  );
};

export default CommunityHub;
