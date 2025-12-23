import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageCircle, ThumbsUp, Share2, MoreHorizontal,
  Send, Image as ImageIcon, Paperclip, Video, UserPlus, UserMinus,
  Flag, Bookmark, Trash2, EyeOff, X, Smile, ShieldAlert,
  Users, Globe, Bell, Search, Layout, Phone, Mic, Camera,
  MoreVertical, Reply, Share, Check, Sparkles, Wand2, FileText, Loader2,
  SendHorizontal, Heart, Menu, Settings, LogOut, Music, MapPin,
  AtSign, Hash, Trophy, Lightbulb, Zap, Command, Download
} from 'lucide-react';
import CommunityTab from './CommunityTab';

// Cấu hình Gemini API
const apiKey = "";
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const App = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeChat, setActiveChat] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationError, setModerationError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State cho các tính năng đăng bài mở rộng
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [location, setLocation] = useState("");
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [hiddenPostIds, setHiddenPostIds] = useState([]);

  // Link avatar từ Google Drive
  const myAvatar = "https://lh3.googleusercontent.com/d/1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC";

  // --- MOCK DATA (TECH & EDUCATION FOCUS) ---
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
      music: "Synthwave Future",
      location: "Phòng nghiên cứu AI",
      tags: ["Hoàng An"],
      time: "2 giờ trước",
      comments: [
        {
          id: 101,
          user: "Hoàng An",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
          text: "Rất ấn tượng! Mình nghĩ việc tối ưu hóa latency là quan trọng nhất trong mô hình này.",
          replies: []
        }
      ]
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
      time: "5 giờ trước",
      comments: []
    }
  ]);

  const [chats, setChats] = useState([
    { id: 1, name: "Nhóm IT-01", type: "group", lastMsg: "Video lab đã lên rồi nhé!", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Group", messages: [] },
    { id: 2, name: "Thầy Duyệt", type: "1-1", lastMsg: "Bài tập của em rất tốt.", online: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duyet", messages: [] }
  ]);

  const [friends, setFriends] = useState([
    { id: 10, name: "Nguyễn Văn A", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A" },
    { id: 11, name: "Khánh Linh", status: "offline", isFriend: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh" },
    { id: 12, name: "Hoàng An", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An" }
  ]);

  // --- LOGIC FUNCTIONS ---
  const callGemini = async (prompt, systemInstruction = "") => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "SAFE";
    } catch (error) {
      return "SAFE";
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    setIsPosting(true);
    setModerationError("");

    // Kiểm duyệt bằng AI
    const result = await callGemini(`Analyze: "${newPostContent}". Respond "UNSAFE" if it has violence, gore, or 18+. Respond "SAFE" otherwise. 1 word only.`);

    if (result.toUpperCase().includes("UNSAFE")) {
      setModerationError("✨ AI phát hiện nội dung không phù hợp với tiêu chuẩn cộng đồng.");
      setIsPosting(false);
      return;
    }

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
  };

  const handleToggleLike = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleToggleSave = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
    setModerationError("✨ Đã cập nhật kho lưu trữ!");
    setTimeout(() => setModerationError(""), 2000);
  };

  const handleHidePost = (postId) => {
    setHiddenPostIds(prev => [...prev, postId]);
  };

  const handleShare = (postId) => {
    const original = posts.find(p => p.id === postId);
    if (!original) return;
    const shared = {
      ...original,
      id: Date.now(),
      author: "Nguyễn Thị Thùy Nhung",
      isShared: true,
      content: `(Chia sẻ từ ${original.author}): ${original.content}`,
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

  const handleAddComment = (postId, text, parentId = null) => {
    if (!text.trim()) return;
    const newComment = { id: Date.now(), user: "Nguyễn Thị Thùy Nhung", avatar: myAvatar, text, time: "Vừa xong", replies: [] };
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (!parentId) return { ...post, comments: [...post.comments, newComment] };
        return { ...post, comments: post.comments.map(c => c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c) };
      }
      return post;
    }));
  };

  const handleSendMessage = (text) => {
    if (!text.trim() || !activeChat) return;
    const newMsg = { id: Date.now(), sender: "Bạn", text, time: "14:45" };
    setChats(chats.map(c => c.id === activeChat.id ? { ...c, messages: [...c.messages, newMsg], lastMsg: text } : c));
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
  };

  // --- FILTERED VIEWS ---
  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => !hiddenPostIds.includes(p.id))
      .filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery, hiddenPostIds]);

  const savedPosts = useMemo(() => posts.filter(p => p.isSaved && !hiddenPostIds.includes(p.id)), [posts, hiddenPostIds]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-24'} flex flex-col shadow-2xl`}>
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter italic leading-none text-indigo-900">UPNEST.EDU</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Community Hub</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
          {[
            { id: 'feed', IconComponent: Globe, label: 'Bảng tin' },
            { id: 'community', IconComponent: Users, label: 'Cộng đồng' },
            { id: 'chat', IconComponent: MessageCircle, label: 'Tin nhắn' },
            { id: 'friends', IconComponent: Users, label: 'Bạn bè' },
            { id: 'saved', IconComponent: Bookmark, label: 'Đã lưu' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 p-4 rounded-[1.5rem] font-black transition-all group relative ${
                activeTab === item.id ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <item.IconComponent className={`w-6 h-6 shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isSidebarOpen && <span className="text-xs uppercase tracking-widest">{item.label}</span>}
              {activeTab === item.id && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-5 p-4 rounded-[1.5rem] font-black text-slate-400 hover:bg-slate-50 transition-all">
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
        <header className="h-24 bg-white/60 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6 flex-1 max-w-3xl">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiến thức công nghệ, bài viết hoặc bạn bè..."
                className="w-full pl-14 pr-6 py-3.5 bg-slate-100/50 border border-transparent rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[11px] font-black uppercase tracking-tighter text-slate-900">Nguyễn Thị Thùy Nhung</span>
              <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">Level 12: Expert</span>
            </div>
            <div className="relative p-3 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white bg-indigo-100 shadow-xl overflow-hidden cursor-pointer hover:scale-110 transition-transform ring-1 ring-slate-200">
              <img src={myAvatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center bg-slate-50 scrollbar-hide">

          {/* COMMUNITY TAB */}
          {activeTab === 'community' && <CommunityTab />}

          {/* TAB: BẢNG TIN */}
          {activeTab === 'feed' && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">

              {/* BOX ĐĂNG BÀI */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white space-y-6">
                <div className="flex gap-5">
                  <img src={myAvatar} className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm object-cover" />
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Chia sẻ giải pháp công nghệ hôm nay..."
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none h-28 resize-none transition-all shadow-inner"
                  />
                </div>

                {/* Info tags in composer */}
                {(location || selectedMusic || taggedFriends.length > 0) && (
                  <div className="flex flex-wrap gap-2 px-2 animate-in slide-in-from-top-2">
                    {location && <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>}
                    {selectedMusic && <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg flex items-center gap-1"><Music className="w-3 h-3" /> {selectedMusic}</span>}
                    {taggedFriends.map(f => <span key={f} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg flex items-center gap-1"><AtSign className="w-3 h-3" /> {f}</span>)}
                  </div>
                )}

                {moderationError && <div className={`p-4 rounded-2xl text-[10px] font-black flex items-center gap-3 animate-in slide-in-from-top ${moderationError.includes('✨') ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50'}`}><ShieldAlert className="w-5 h-5" />{moderationError}</div>}

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex gap-1">
                    <button onClick={() => setLocation("Phòng Lab Hub")} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><MapPin className="w-5 h-5" /></button>
                    <button onClick={() => setSelectedMusic("Tech Lofi Beats")} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Music className="w-5 h-5" /></button>
                    <button onClick={() => setTaggedFriends(["Hoàng An"])} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><AtSign className="w-5 h-5" /></button>
                    <button className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Smile className="w-5 h-5" /></button>
                  </div>
                  <button onClick={handleCreatePost} disabled={isPosting} className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-12 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest text-[11px]">
                    {isPosting ? 'ANALYZING...' : 'ĐĂNG BÀI'}
                  </button>
                </div>
              </div>

              {/* LIST POSTS */}
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-[3rem] border border-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-in fade-in">
                  <div className="p-7 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <img src={post.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 leading-tight italic tracking-tighter">{post.author}</h4>
                          <span className="bg-indigo-600 text-white p-1 rounded-full"><Check className="w-3 h-3" /></span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{post.time}</span>
                          {post.location && <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-1"><MapPin className="w-2 h-2" /> {post.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="relative group/menu">
                      <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 transition-all"><MoreHorizontal className="w-6 h-6" /></button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 hidden group-hover/menu:block z-20">
                        <button onClick={() => handleHidePost(post.id)} className="w-full text-left p-3 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2 italic">
                          <EyeOff className="w-4 h-4" /> Ẩn bài viết
                        </button>
                        <button className="w-full text-left p-3 hover:bg-red-50 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 italic">
                          <Flag className="w-4 h-4" /> Báo cáo vi phạm
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-6">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="px-6 pb-6 relative group/img">
                      <img src={post.image} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl border border-white" />
                      <div className="absolute inset-x-10 bottom-10 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/20 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-600 rounded-xl"><Sparkles className="w-4 h-4" /></div>
                          <span className="text-[10px] font-black uppercase tracking-widest italic">AI Analysis</span>
                        </div>
                        <button className="p-2 bg-white/20 rounded-xl hover:bg-white/40"><Download className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}

                  <div className="px-8 py-5 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
                    <div className="flex gap-8">
                      <button onClick={() => handleToggleLike(post.id)} className={`flex items-center gap-2 text-[11px] font-black transition-all ${post.isLiked ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-600'}`}>
                        <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all"><MessageCircle className="w-5 h-5" /> {post.comments?.length || 0} PHẢN HỒI</button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleShare(post.id)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Share2 className="w-5 h-5" /></button>
                      <button
                        onClick={() => handleToggleSave(post.id)}
                        className={`p-3 rounded-2xl transition-all ${post.isSaved ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white border border-slate-100 text-slate-400 hover:text-amber-600'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* COMMENTS */}
                  <div className="px-8 pb-8 pt-6 space-y-6 bg-slate-50/30">
                    {post.comments.map(c => (
                      <div key={c.id} className="space-y-4">
                        <div className="flex gap-4 group">
                          <img src={c.avatar} className="w-10 h-10 rounded-2xl border border-white shadow-sm" />
                          <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 max-w-sm shadow-sm transition-all hover:shadow-md">
                            <span className="text-[10px] font-black text-indigo-900 uppercase block mb-1">{c.user}</span>
                            <p className="text-[11px] text-slate-600 font-bold italic leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-4 pt-2">
                      <img src={myAvatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover" />
                      <input
                        type="text"
                        placeholder="Tham gia thảo luận chuyên môn..."
                        className="flex-1 bg-white border border-slate-200 rounded-[1.5rem] px-6 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner transition-all"
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleAddComment(post.id, e.target.value); e.target.value = ""; } }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: NHẮN TIN */}
          {activeTab === 'chat' && (
            <div className="w-full max-w-6xl h-[calc(100vh-140px)] flex bg-white rounded-[3rem] border border-white shadow-2xl overflow-hidden animate-in zoom-in duration-500">
              <aside className="w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/30">
                <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md">
                  <h3 className="text-xl font-black italic text-indigo-900 tracking-tighter uppercase">Terminal Chat</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {chats.map(chat => (
                    <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full p-5 flex items-center gap-4 rounded-3xl transition-all ${activeChat?.id === chat.id ? 'bg-indigo-700 text-white shadow-xl translate-x-2' : 'hover:bg-white text-slate-500'}`}>
                      <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                      <div className="text-left overflow-hidden">
                        <h4 className="font-black text-xs truncate uppercase tracking-widest">{chat.name}</h4>
                        <p className={`text-[10px] truncate italic ${activeChat?.id === chat.id ? 'text-indigo-200' : 'text-slate-400'}`}>{chat.lastMsg || "Online"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>
              <section className="flex-1 flex flex-col bg-white">
                {activeChat ? (
                  <>
                    <div className="h-20 px-8 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                      <div className="flex items-center gap-4 font-black italic uppercase tracking-widest text-indigo-900 text-sm">
                        <img src={activeChat.avatar} className="w-10 h-10 rounded-xl" />
                        {activeChat.name}
                      </div>
                      <div className="flex gap-3">
                        <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all"><Video className="w-5 h-5" /></button>
                        <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all"><Phone className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/20 scrollbar-hide">
                      {activeChat.messages.map(m => (
                        <div key={m.id} className={`flex flex-col ${m.sender === 'Bạn' ? 'items-end' : 'items-start'} gap-1 animate-in slide-up`}>
                          <div className={`p-4 rounded-3xl text-[11px] font-bold max-w-sm shadow-xl ${m.sender === 'Bạn' ? 'bg-indigo-700 text-white rounded-tr-none shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-slate-100'}`}>
                            {m.text}
                          </div>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mx-2">{m.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-slate-100 flex items-center gap-5 bg-white">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-100 border-none rounded-[1.5rem] px-8 py-4 text-xs font-black italic outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner uppercase tracking-widest"
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage(e.target.value); e.target.value = ""; } }}
                      />
                      <button className="p-4 bg-indigo-700 text-white rounded-2xl shadow-xl hover:bg-indigo-800 transition-all"><SendHorizontal className="w-6 h-6" /></button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                    <MessageCircle className="w-20 h-20 opacity-10 mb-4 animate-bounce" />
                    <h3 className="font-black italic tracking-widest opacity-30">SELECT CONVERSATION</h3>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB: ĐÃ LƯU */}
          {activeTab === 'saved' && (
            <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 shadow-lg shadow-amber-50"><Bookmark className="w-6 h-6 fill-current" /></div>
                <h3 className="font-black text-2xl italic text-slate-900 uppercase tracking-tighter">Kho lưu trữ chuyên sâu</h3>
              </div>
              {savedPosts.length > 0 ? savedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-[2.5rem] border border-white shadow-xl overflow-hidden animate-in fade-in p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <img src={post.avatar} className="w-12 h-12 rounded-xl border border-slate-100 shadow-sm" />
                      <h4 className="font-black text-sm text-slate-900 italic uppercase">{post.author}</h4>
                    </div>
                    <button onClick={() => handleToggleSave(post.id)} className="text-amber-500 font-black text-[10px] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-all">GỠ BỎ</button>
                  </div>
                  <p className="text-sm font-bold text-slate-600 italic leading-relaxed mb-6">"{post.content}"</p>
                  <button onClick={() => handleShare(post.id)} className="w-full py-3 bg-slate-50 text-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"><Share2 className="w-4 h-4" /> Chia sẻ tài liệu</button>
                </div>
              )) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed">
                  <Bookmark className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                  <p className="font-black text-slate-300 italic uppercase tracking-widest">KHO LƯU TRỮ ĐANG TRỐNG</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* CSS GLOBAL */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.5s ease-out forwards; }
        .slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .zoom-in { animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </div>
  );
};

export default App;
