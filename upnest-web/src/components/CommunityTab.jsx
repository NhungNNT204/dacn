import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MessageCircle, ThumbsUp, Share2, MoreHorizontal,
  Send, Image as ImageIcon, Paperclip, Video, UserPlus, UserMinus,
  Flag, Bookmark, Trash2, EyeOff, X, Smile, ShieldAlert,
  Users, Globe, Bell, Search, Layout, Phone, Mic, Camera,
  MoreVertical, Reply, Share, Check, Sparkles, Wand2, FileText, Loader2,
  SendHorizontal, Heart, Menu, Settings, LogOut, Music, MapPin,
  AtSign, Hash, Trophy, Lightbulb, Zap, Command, Download, Smile as SmileIcon
} from 'lucide-react';

// Cấu hình Gemini API
const apiKey = "";
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const CommunityTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed', 'saved', 'friends'
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationError, setModerationError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [location, setLocation] = useState("");
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [hiddenPostIds, setHiddenPostIds] = useState([]);
  const [expandedComments, setExpandedComments] = useState({}); // Track expanded comment threads
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we're replying to
  const [emojiPickerActive, setEmojiPickerActive] = useState(false);

  // Avatar chính
  const myAvatar = "https://lh3.googleusercontent.com/d/1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC";

  // Mock data - Bài viết giáo dục công nghệ phong phú
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Lê Minh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
      content: "Đang nghiên cứu cách tích hợp AI vào hệ thống SCADA để dự báo bảo trì tự động. Công nghệ này thực sự là tương lai của ngành Tự động hóa! 🤖💻 #AI #Automation #Industry40",
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
          time: "1 giờ trước",
          likes: 8,
          replies: [
            {
              id: 102,
              user: "Lê Minh",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
              text: "Đúng rồi! Mình đang dùng model quantization để giảm latency xuống dưới 100ms.",
              time: "30 phút trước",
              likes: 3
            }
          ]
        }
      ]
    },
    {
      id: 2,
      author: "Trần Thế Duyệt",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duyet",
      content: "Kiến trúc Microservices mang lại sự linh hoạt cực lớn cho các hệ thống giáo dục quy mô lớn. Kubernetes là chìa khóa để quản lý container hiệu quả. #CloudComputing #Kubernetes",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      likes: 128,
      isLiked: true,
      isSaved: true,
      music: "Tech Lofi",
      time: "5 giờ trước",
      comments: []
    },
    {
      id: 3,
      author: "Nguyễn Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VanC",
      content: "Vừa hoàn thành khóa học Deep Learning. Mạng nơ-ron nhân tạo thực sự làm thay đổi cách chúng ta nhìn nhận dữ liệu. #NeuralNetworks #MachineLearning #DataScience",
      image: "https://images.unsplash.com/photo-1526374965328-7f5ec890c111?w=800&q=80",
      likes: 89,
      isLiked: false,
      isSaved: false,
      location: "Trung tâm dữ liệu",
      tags: ["Lê Minh", "Hoàng An"],
      time: "8 giờ trước",
      comments: [
        {
          id: 103,
          user: "Khánh Linh",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
          text: "Bạn có recommend framework nào không? TensorFlow hay PyTorch?",
          time: "7 giờ trước",
          likes: 15,
          replies: []
        }
      ]
    },
    {
      id: 4,
      author: "Phạm Hải Anh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HaiAnh",
      content: "AWS Lambda + DynamoDB = serverless solutions tuyệt vời cho startup. Chi phí rất rẻ so với traditional servers. #AWS #Serverless #CloudArchitecture",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      likes: 67,
      isLiked: false,
      isSaved: false,
      time: "10 giờ trước",
      comments: []
    },
    {
      id: 5,
      author: "Bùi Quang Duy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuangDuy",
      content: "Robotics + Python = automation tuyệt vời! Mình vừa xây dựng robot giải Rubik's cube bằng OpenCV. Công nghệ thật kinh điển! 🤖 #Robotics #ComputerVision #Python",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      likes: 156,
      isLiked: false,
      isSaved: false,
      music: "Epic Tech",
      location: "Lab Robotics",
      tags: ["Mọi người"],
      time: "12 giờ trước",
      comments: []
    }
  ]);

  // Danh sách bạn bè
  const [friends, setFriends] = useState([
    { id: 10, name: "Nguyễn Văn A", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A", skills: ["Python", "Web Dev"] },
    { id: 11, name: "Khánh Linh", status: "offline", isFriend: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh", skills: ["AI", "ML"] },
    { id: 12, name: "Hoàng An", status: "online", isFriend: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An", skills: ["Cloud", "DevOps"] },
    { id: 13, name: "Trần Hà", status: "online", isFriend: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ha", skills: ["UI/UX", "Design"] }
  ]);

  // Emojis nhanh
  const quickEmojis = ['🤖', '💻', '🚀', '🔥', '💡', '⚡', '✨', '🎯'];

  // --- Hàm gọi Gemini API ---
  const callGemini = async (prompt, systemInstruction = "") => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "SAFE";
    } catch (error) {
      return "SAFE";
    }
  };

  // --- Xử lý tạo bài đăng ---
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    setIsPosting(true);
    setModerationError("");

    // Kiểm duyệt AI
    const result = await callGemini(
      `Analyze: "${newPostContent}". Respond "UNSAFE" if it has violence, gore, hatred, or 18+ content. Respond "SAFE" otherwise. 1 word only.`
    );

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

    setModerationError("✨ Bài đăng được duyệt an toàn! Đã đăng thành công.");
    setTimeout(() => setModerationError(""), 3000);
  };

  // --- Xử lý like ---
  const handleToggleLike = (postId) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  // --- Xử lý lưu bài ---
  const handleToggleSave = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
    setModerationError("✨ Đã cập nhật kho lưu trữ!");
    setTimeout(() => setModerationError(""), 2000);
  };

  // --- Xử lý ẩn bài ---
  const handleHidePost = (postId) => {
    setHiddenPostIds(prev => [...prev, postId]);
    setModerationError("✨ Bài viết đã bị ẩn khỏi dòng thời gian.");
    setTimeout(() => setModerationError(""), 2000);
  };

  // --- Xử lý chia sẻ ---
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

  // --- Xử lý báo cáo vi phạm ---
  const handleReportAbuse = (postId, postAuthor) => {
    setModerationError(`✨ Cảm ơn! Chúng tôi đã nhận báo cáo về bài viết của ${postAuthor}. Đội ngũ moderator sẽ xem xét trong 24h.`);
    setTimeout(() => setModerationError(""), 4000);
  };

  // --- Xử lý thêm bình luận/trả lời ---
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
          // Comment level 1
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

  // --- Bộ lọc bài viết ---
  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => !hiddenPostIds.includes(p.id))
      .filter(p =>
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [posts, searchQuery, hiddenPostIds]);

  // --- Bài viết đã lưu ---
  const savedPosts = useMemo(
    () => posts.filter(p => p.isSaved && !hiddenPostIds.includes(p.id)),
    [posts, hiddenPostIds]
  );

  // --- Component: Bình luận đa cấp ---
  const CommentThread = ({ postId, comment, level = 0 }) => {
    const isExpanded = expandedComments[comment.id];
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div key={comment.id} className={`${level > 0 ? 'ml-8 border-l-2 border-indigo-100 pl-6' : ''} space-y-4`}>
        {/* Bình luận chính */}
        <div className="flex gap-4 group">
          <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-2xl border border-white shadow-sm object-cover" />
          <div className="flex-1">
            <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <span className="text-[10px] font-black text-indigo-900 uppercase block mb-1">{comment.user}</span>
              <p className="text-[11px] text-slate-600 font-bold italic leading-relaxed">{comment.text}</p>
              <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-400 font-bold">
                <span>{comment.time}</span>
                <span>👍 {comment.likes}</span>
                <button onClick={() => setReplyingTo(comment.id)} className="text-indigo-600 hover:underline">
                  Trả lời
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input trả lời nếu đang focus */}
        {replyingTo === comment.id && (
          <div className="flex gap-3 ml-16 animate-in slide-in-from-top">
            <img src={myAvatar} alt="you" className="w-10 h-10 rounded-2xl border border-white shadow-sm object-cover" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Viết phản hồi..."
                autoFocus
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-2.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleAddComment(postId, e.target.value, comment.id);
                    e.target.value = '';
                  }
                }}
              />
              <button className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Danh sách trả lời (Nested Replies) */}
        {hasReplies && (
          <div className="space-y-4 ml-4">
            <button
              onClick={() => setExpandedComments(prev => ({ ...prev, [comment.id]: !isExpanded }))}
              className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">

      {/* TAB NAVIGATION */}
      <div className="flex gap-4 border-b-2 border-slate-100 pb-4">
        {[
          { id: 'feed', label: '📰 Bảng tin', icon: Globe },
          { id: 'saved', label: '🔖 Đã lưu', icon: Bookmark },
          { id: 'friends', label: '👥 Kết nối', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-6 py-3 font-black text-[11px] uppercase tracking-widest transition-all relative ${
              activeSubTab === tab.id
                ? 'text-indigo-700'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {/* SUBTAB: BẢNG TIN */}
      {activeSubTab === 'feed' && (
        <div className="space-y-8">
          {/* HỘP ĐĂNG BÀI */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white backdrop-blur-sm bg-white/95 space-y-6">
            <div className="flex gap-5">
              <img src={myAvatar} alt="your avatar" className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm object-cover" />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Chia sẻ giải pháp công nghệ hôm nay... 💡"
                className="w-full bg-slate-50 border-none rounded-3xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none h-28 resize-none transition-all shadow-inner"
              />
            </div>

            {/* Info tags */}
            {(location || selectedMusic || taggedFriends.length > 0) && (
              <div className="flex flex-wrap gap-2 px-2 animate-in slide-in-from-top-2">
                {location && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                )}
                {selectedMusic && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <Music className="w-3 h-3" /> {selectedMusic}
                  </span>
                )}
                {taggedFriends.map(f => (
                  <span key={f} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <AtSign className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            )}

            {moderationError && (
              <div className={`p-4 rounded-2xl text-[10px] font-black flex items-center gap-3 animate-in slide-in-from-top ${
                moderationError.includes('✨') ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50'
              }`}>
                <ShieldAlert className="w-5 h-5" />
                {moderationError}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex gap-1">
                <button onClick={() => setLocation("Phòng Lab Hub")} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all" title="Vị trí">
                  <MapPin className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedMusic("Tech Lofi Beats")} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all" title="Nhạc">
                  <Music className="w-5 h-5" />
                </button>
                <button onClick={() => setTaggedFriends(["Hoàng An", "Lê Minh"])} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all" title="Tag bạn">
                  <AtSign className="w-5 h-5" />
                </button>
                <button onClick={() => setEmojiPickerActive(!emojiPickerActive)} className="p-3 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all" title="Cảm xúc">
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              {emojiPickerActive && (
                <div className="flex gap-2 mr-4 animate-in slide-in-from-bottom-2">
                  {quickEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => { setNewPostContent(newPostContent + emoji); setEmojiPickerActive(false); }}
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleCreatePost}
                disabled={isPosting}
                className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-12 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest text-[11px]"
              >
                {isPosting ? <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> : '✨'} ĐĂNG BÀI
              </button>
            </div>
          </div>

          {/* DANH SÁCH BÀI VIẾT */}
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-[3rem] border border-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-in fade-in">
              {/* Header */}
              <div className="p-7 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-slate-900 leading-tight italic tracking-tighter">{post.author}</h4>
                      <span className="bg-indigo-600 text-white p-1 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{post.time}</span>
                      {post.location && (
                        <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-1">
                          <MapPin className="w-2 h-2" /> {post.location}
                        </span>
                      )}
                      {post.music && (
                        <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
                          <Music className="w-2 h-2" /> {post.music}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu 3 chấm */}
                <div className="relative group/menu">
                  <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 transition-all">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 hidden group-hover/menu:block z-20 animate-in slide-in-from-top-2">
                    <button
                      onClick={() => handleHidePost(post.id)}
                      className="w-full text-left p-3 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2 italic"
                    >
                      <EyeOff className="w-4 h-4" /> Ẩn bài viết
                    </button>
                    <button
                      onClick={() => handleReportAbuse(post.id, post.author)}
                      className="w-full text-left p-3 hover:bg-red-50 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 italic"
                    >
                      <Flag className="w-4 h-4" /> Báo cáo vi phạm
                    </button>
                  </div>
                </div>
              </div>

              {/* Nội dung */}
              <div className="px-8 pb-6">
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{post.content}</p>
              </div>

              {/* Hình ảnh */}
              {post.image && (
                <div className="px-6 pb-6 relative group/img">
                  <img src={post.image} alt="post content" className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl border border-white" />
                  <div className="absolute inset-x-10 bottom-10 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/20 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600 rounded-xl">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest italic">AI Analysis ✓</span>
                    </div>
                    <button className="p-2 bg-white/20 rounded-xl hover:bg-white/40">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="px-8 py-5 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
                <div className="flex gap-8">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-2 text-[11px] font-black transition-all ${
                      post.isLiked ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-all">
                    <MessageCircle className="w-5 h-5" /> {post.comments?.length || 0}
                  </button>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleShare(post.id)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleSave(post.id)}
                    className={`p-3 rounded-2xl transition-all ${
                      post.isSaved ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white border border-slate-100 text-slate-400 hover:text-amber-600'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* COMMENTS SECTION */}
              <div className="px-8 pb-8 pt-6 space-y-6 bg-slate-50/30">
                {post.comments.map(c => (
                  <CommentThread key={c.id} postId={post.id} comment={c} level={0} />
                ))}

                {/* Input bình luận chính */}
                <div className="flex gap-4 pt-2">
                  <img src={myAvatar} alt="your avatar" className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover" />
                  <input
                    type="text"
                    placeholder="Tham gia thảo luận chuyên môn..."
                    className="flex-1 bg-white border border-slate-200 rounded-[1.5rem] px-6 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB: ĐÃ LƯU */}
      {activeSubTab === 'saved' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 shadow-lg shadow-amber-50">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-black text-2xl italic text-slate-900 uppercase tracking-tighter">Kho Lưu Trữ</h3>
          </div>

          {savedPosts.length > 0 ? (
            savedPosts.map(post => (
              <div key={post.id} className="bg-white rounded-[2.5rem] border border-white shadow-xl overflow-hidden animate-in fade-in p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-xl border border-slate-100 shadow-sm object-cover" />
                    <h4 className="font-black text-sm text-slate-900 italic uppercase">{post.author}</h4>
                  </div>
                  <button
                    onClick={() => handleToggleSave(post.id)}
                    className="text-amber-500 font-black text-[10px] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-all"
                  >
                    GỠ BỎ
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-600 italic leading-relaxed mb-6">"{post.content}"</p>
                <button
                  onClick={() => handleShare(post.id)}
                  className="w-full py-3 bg-slate-50 text-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Chia sẻ tài liệu
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed">
              <Bookmark className="w-20 h-20 text-slate-100 mx-auto mb-6" />
              <p className="font-black text-slate-300 italic uppercase tracking-widest">KHO LƯU TRỮ ĐANG TRỐNG</p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: KẾT NỐI BẠN BÈ */}
      {activeSubTab === 'friends' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-700 shadow-lg shadow-purple-50">
              <Users className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-black text-2xl italic text-slate-900 uppercase tracking-tighter">Kết Nối Bạn Bè</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {friends.map(friend => (
              <div key={friend.id} className="bg-white rounded-[2rem] border border-white shadow-lg p-6 hover:shadow-xl transition-all animate-in fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-2xl border-2 border-indigo-100 shadow-sm object-cover" />
                  <div className="flex-1">
                    <h4 className="font-black text-sm text-slate-900 italic">{friend.name}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${friend.status === 'online' ? 'text-green-600' : 'text-slate-400'}`}>
                      🟢 {friend.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {friend.skills?.map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className={`w-full py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  friend.isFriend
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  {friend.isFriend ? '✓ Bạn bè' : '+ Thêm bạn'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-from-bottom-2 {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .slide-in-from-top {
          animation: slide-in-from-top 0.3s ease-out forwards;
        }
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.4s ease-out forwards;
        }
        .slide-in-from-bottom-2 {
          animation: slide-in-from-bottom-2 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CommunityTab;
