import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Pencil, 
  GraduationCap, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Trophy,
  ArrowRight,
  Clock,
  Flame,
  Star,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Layout,
  Rss,
  Library,
  Users2,
  Medal,
  Play,
  Search,
  Video,
  FileText,
  Calendar,
  Compass
} from 'lucide-react';

/**
 * Dữ liệu Mock - Tối ưu hóa độ tương phản cho mạng xã hội giáo dục
 */
const localMockUserService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: {
        fullName: "Nguyễn Thị Thùy Nhung",
        email: "nhung.nguyen@upnest.edu",
        role: "STUDENT",
        avatarUrl: null,
        joinDate: "Tháng 9, 2024",
        stats: {
          courses: 5,
          friends: 124,
          posts: 42,
          xp: 1450,
          streak: 12,
          level: 4,
          nextLevelXp: 2000
        }
      }
    };
  }
};

export default function StudentDashboard() {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = (path) => console.log(`Cnhungển hướng: ${path}`);
  }

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await localMockUserService.getProfile();
      setUser(result.data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm">Đang khởi tạo không gian tri thức...</p>
      </div>
    );
  }

  const stats = user?.stats;
  const xpPercentage = (stats?.xp / stats?.nextLevelXp) * 100;

  // return (
  //   <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 px-4 sm:px-6 font-sans text-slate-900 bg-[#f8fafc]">
      
  //     {/* --- HEADER: LOGO & GLOBAL NAV (Tăng độ tương phản) --- */}
  //     <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
  //       <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
  //         <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
  //           <GraduationCap className="text-white" size={28} />
  //         </div>
  //         <div className="flex flex-col">
  //           <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">UPNEST<span className="text-indigo-600">.EDU</span></span>
  //           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cộng đồng học tập</span>
  //         </div>
  //       </div>

  //       <div className="flex-1 max-w-md hidden lg:block">
  //         <div className="relative">
  //           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
  //           <input 
  //             type="text" 
  //             placeholder="Tìm kiếm bài giảng, bạn bè hoặc nhóm học..." 
  //             className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
  //           />
  //         </div>
  //       </div>

  //       <div className="flex items-center gap-2">
  //          {[
  //            { icon: <Rss size={20}/>, label: 'Feed', path: '/news-feed', color: 'text-rose-500' },
  //            { icon: <Compass size={20}/>, label: 'Khám phá', path: '/explore', color: 'text-indigo-500' },
  //            { icon: <MessageSquare size={20}/>, label: 'Chat', path: '/messages', color: 'text-emerald-500' }
  //          ].map((btn, idx) => (
  //            <button 
  //             key={idx}
  //             onClick={() => navigate(btn.path)}
  //             className={`p-3 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all flex items-center gap-2 font-bold text-xs ${btn.color} border border-transparent hover:border-slate-100`}
  //            >
  //              {btn.icon}
  //              <span className="hidden xl:inline uppercase tracking-widest">{btn.label}</span>
  //            </button>
  //          ))}
  //       </div>
  //     </div>

  //     {/* --- SECTION 1: HERO SOCIAL IDENTITY (Tăng độ tương phản văn bản) --- */}
  //     <div className="relative overflow-hidden bg-gradient-to-br from-white to-indigo-50 rounded-[3rem] p-8 lg:p-12 border border-indigo-100 shadow-xl shadow-indigo-100/10 group">
  //       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full -mr-48 -mt-48 blur-3xl opacity-60"></div>
        
  //       <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
  //         <div className="relative">
  //           <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-[3.5rem] bg-white p-2 shadow-2xl shadow-indigo-200/40 flex items-center justify-center transition-all duration-700 hover:rotate-3">
  //              <div className="w-full h-full rounded-[3rem] bg-indigo-600 flex items-center justify-center text-white text-7xl font-black">
  //               {user?.fullName?.charAt(0)}
  //              </div>
  //           </div>
  //           <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl border-4 border-slate-50">
  //               <div className="w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse"></div>
  //           </div>
  //         </div>

  //         <div className="flex-1 text-center lg:text-left space-y-6">
  //           <div className="space-y-2">
  //             <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
  //               <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
  //                 Xin chào, {user?.fullName?.split(' ').pop()}!
  //               </h1>
  //               <div className="flex gap-2">
  //                  <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200">LVL {stats?.level}</span>
  //                  <span className="px-4 py-1.5 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-200">Preminum</span>
  //               </div>
  //             </div>
  //             <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
  //               Hôm nay bạn đã sẵn sàng nâng cấp kiến thức cùng <span className="text-indigo-600 font-bold">124 đồng đội</span> đang trực tuyến chưa?
  //             </p>
  //           </div>

  //           <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
  //             <button 
  //               onClick={() => navigate('/classroom')}
  //               className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center gap-3"
  //             >
  //               <Play size={18} fill="currentColor" /> Tiếp tục bài học
  //             </button>
  //             <button 
  //               onClick={() => navigate('/news-feed')}
  //               className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3"
  //             >
  //               <Rss size={18} className="text-rose-500" /> Bảng tin cộng đồng
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* --- SECTION 2: STATS CARDS (Khoa học & Trực quan) --- */}
  //     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
  //       {[
  //         { label: 'Khóa học', value: stats?.courses, icon: <BookOpen size={28}/>, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Đang hoạt động' },
  //         { label: 'Bạn bè', value: stats?.friends, icon: <Users2 size={28}/>, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Mạng lưới xã hội' },
  //         { label: 'Bài viết', value: stats?.posts, icon: <MessageSquare size={28}/>, color: 'text-rose-600', bg: 'bg-rose-50', sub: 'Lượt tương tác' },
  //         { label: 'Kinh nghiệm', value: stats?.xp, icon: <Trophy size={28}/>, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Hạng Bạc (Top 10%)' },
  //       ].map((item, i) => (
  //         <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden">
  //           <div className={`absolute top-0 right-0 w-20 h-20 ${item.bg} opacity-30 rounded-bl-[3rem] group-hover:scale-110 transition-transform`}></div>
  //           <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-6 transition-transform`}>
  //             {item.icon}
  //           </div>
  //           <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2">{item.label}</h4>
  //           <div className="space-y-1">
  //               <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">{item.value}</span>
  //               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>

  //     {/* --- SECTION 3: SOCIAL EDUCATION NAV (Các nút điều hướng đặc trưng) --- */}
  //     <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
  //       <div className="lg:col-span-3 space-y-10">
  //         <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-100 shadow-sm space-y-10">
  //           <div className="flex items-center justify-between border-b border-slate-50 pb-8">
  //              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
  //                <Layout size={28} className="text-indigo-600" />
  //                Tiện ích học tập & Kết nối
  //              </h3>
  //              <div className="hidden sm:flex gap-2">
  //                 <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
  //                 <div className="w-4 h-1 bg-indigo-100 rounded-full"></div>
  //              </div>
  //           </div>

  //           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
  //               {[
  //                 { title: 'Lớp học ảo', icon: <Video size={32}/>, color: 'bg-blue-600', text: 'text-white', path: '/classroom', desc: 'Livestream' },
  //                 { title: 'Nhóm học', icon: <Users size={32}/>, color: 'bg-white', text: 'text-indigo-600', path: '/groups', desc: 'Thảo luận' },
  //                 { title: 'Thư viện', icon: <Library size={32}/>, color: 'bg-white', text: 'text-emerald-600', path: '/library', desc: 'Tài liệu' },
  //                 { title: 'Hỏi đáp AI', icon: <Sparkles size={32}/>, color: 'bg-white', text: 'text-rose-600', path: '/ai-chat', desc: 'Trợ lý 24/7' },
  //               ].map((nav, i) => (
  //                 <button 
  //                   key={i} 
  //                   onClick={() => navigate(nav.path)}
  //                   className={`${nav.color} p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-4 group relative overflow-hidden active:scale-95`}
  //                 >
  //                   <div className={`${nav.color === 'bg-blue-600' ? 'text-white' : nav.text} group-hover:scale-110 transition-transform duration-500`}>{nav.icon}</div>
  //                   <div>
  //                     <p className={`text-sm font-black uppercase tracking-widest ${nav.color === 'bg-blue-600' ? 'text-white' : 'text-slate-800'}`}>{nav.title}</p>
  //                     <p className={`text-[10px] font-bold mt-1 uppercase ${nav.color === 'bg-blue-600' ? 'text-blue-100' : 'text-slate-400'}`}>{nav.desc}</p>
  //                   </div>
  //                 </button>
  //               ))}
  //           </div>
  //         </div>

  //         {/* Social Activity Feed Preview */}
  //         <div className="space-y-6">
  //           <h3 className="text-2xl font-black text-slate-800 px-4 flex items-center gap-3">
  //             <TrendingUp size={28} className="text-rose-500" />
  //             Đang diễn ra trong cộng đồng
  //           </h3>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 items-start group hover:shadow-lg transition-all">
  //                 <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">MT</div>
  //                 <div className="flex-1 space-y-2">
  //                   <p className="text-sm text-slate-600 font-medium"><strong>Thầy Minh</strong> vừa đăng tài liệu mới vào nhóm <strong>Java Expert</strong></p>
  //                   <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Xem ngay →</button>
  //                 </div>
  //              </div>
  //              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 items-start group hover:shadow-lg transition-all">
  //                 <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-xl">HG</div>
  //                 <div className="flex-1 space-y-2">
  //                   <p className="text-sm text-slate-600 font-medium"><strong>Hương Giang</strong> và 5 người khác vừa đạt nhung hiệu <strong>"Mọt sách tháng 9"</strong></p>
  //                   <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Chúc mừng →</button>
  //                 </div>
  //              </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Sidebar: Momentum & Achievements */}
  //       <div className="space-y-10">
          
  //         {/* Level Tracker - Scientific Design */}
  //         <div className="bg-slate-900 rounded-[3rem] p-10 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-indigo-200">
  //           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
  //           <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Tiến độ cấp độ</h3>
            
  //           <div className="relative inline-flex items-center justify-center">
  //               <svg className="w-44 h-44 transform -rotate-90">
  //                   <circle cx="88" cy="88" r="80" stroke="#1e293b" strokeWidth="10" fill="transparent" />
  //                   <circle cx="88" cy="88" r="80" stroke="url(#grad1)" strokeWidth="10" fill="transparent" 
  //                       strokeDasharray={502.4} 
  //                       strokeDashoffset={502.4 - (502.4 * xpPercentage) / 100} 
  //                       strokeLinecap="round" 
  //                       className="transition-all duration-1000 ease-out" />
  //                   <defs>
  //                     <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
  //                       <stop offset="0%" stopColor="#6366f1" />
  //                       <stop offset="100%" stopColor="#a855f7" />
  //                     </linearGradient>
  //                   </defs>
  //               </svg>
  //               <div className="absolute flex flex-col items-center">
  //                   <span className="text-5xl font-black text-white tracking-tighter">{stats?.xp}</span>
  //                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Point XP</span>
  //               </div>
  //           </div>
            
  //           <div className="space-y-4">
  //              <p className="text-xs font-bold text-slate-400 px-4">Đạt thêm <span className="text-white">550 XP</span> để lên Level 5 và nhận nhung hiệu cnhungên gia!</p>
  //              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40">
  //                 Nhiệm vụ hàng ngày
  //              </button>
  //           </div>
  //         </div>

  //         {/* Activity Log - Scientific List */}
  //         <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
  //           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Nhật ký học tập</h3>
  //           <div className="space-y-6">
  //             {[
  //               { title: 'Nộp bài tập Java', time: '10p trước', icon: <CheckCircle2 size={16}/>, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  //               { title: 'Vào nhóm UI/UX', time: '2h trước', icon: <Users size={16}/>, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  //               { title: 'Lịch thi sắp tới', time: 'Hôm qua', icon: <Calendar size={16}/>, color: 'text-amber-500', bg: 'bg-amber-50' },
  //             ].map((log, i) => (
  //               <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
  //                 <div className={`w-10 h-10 rounded-xl ${log.bg} ${log.color} flex items-center justify-center shadow-sm`}>
  //                   {log.icon}
  //                 </div>
  //                 <div className="flex-1 min-w-0">
  //                   <p className="text-sm font-black text-slate-700 truncate tracking-tight">{log.title}</p>
  //                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{log.time}</p>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //           <button className="w-full py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest border-t border-slate-50 mt-4 hover:bg-indigo-50 transition-colors rounded-2xl">Xem tất cả lịch sử →</button>
  //         </div>

  //       </div>
  //     </div>

  //   </div>
  // );

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50">
      {/* <p className="text-slate-600">Navigation component - This file is deprecated. Please use StudentLayout instead.</p> */}
    </div>
  );
}