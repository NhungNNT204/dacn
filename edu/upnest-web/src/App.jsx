import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Trophy,
  Flame,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  PlayCircle,
  Clock,
  Lock,
  ArrowLeft,
  Lightbulb
} from 'lucide-react';

// Import Student Page Components
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboardPage from './pages/student/StudentDashboard';
import StudentCoursesPage from './pages/student/StudentCourses';
import StudentProgressPage from './pages/student/StudentProgress';
import StudentProfilePage from './pages/student/StudentProfile';

// --- MOCK DATA (Dữ liệu giả lập để hiển thị UI khi chưa có dữ liệu thật) ---
// Dữ liệu này chỉ dùng cho giao diện Admin và Teacher, Student Dashboard đã dùng API
const MOCK_STATS_ADMIN = [
  { title: 'Tổng Học viên', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { title: 'Khóa học', value: '42', change: '+4', icon: BookOpen, color: 'bg-emerald-500' },
  { title: 'Doanh thu tháng', value: '150tr', change: '+8%', icon: CreditCard, color: 'bg-violet-500' },
  { title: 'Truy cập hôm nay', value: '856', change: '+24%', icon: BarChart3, color: 'bg-orange-500' },
];

const MOCK_ACTIVITIES = [
  { user: 'Nguyễn Văn A', action: 'đã nộp bài tập', target: 'Java Core', time: '2 phút trước', role: 'student' },
  { user: 'Trần Thị B', action: 'đăng ký khóa học', target: 'ReactJS Advanced', time: '15 phút trước', role: 'student' },
  { user: 'Lê Văn C', action: 'đạt huy hiệu', target: 'Ong chăm chỉ', time: '1 giờ trước', role: 'student' },
];

// --- COMPONENTS HỌC VIÊN ---

// Component hiển thị chi tiết khóa học và video player
const CoursePlayer = ({ courseId, onBack }) => {
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE}/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) {
          setCurrentLesson(data.lessons.sort((a, b) => a.orderIndex - b.orderIndex)[0]); // Sắp xếp theo orderIndex và chọn bài 1
        }
      } catch (err) { console.error("Lỗi lấy chi tiết khóa học:", err); }
    };
    fetchCourseDetail();
  }, [courseId]);

  if (!course) return <div className="p-8 text-center text-gray-600">Đang tải nội dung khóa học...</div>;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Thanh tiêu đề */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-blue-600 font-bold flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-150px)]">
        {/* Cột trái: Video Player */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
          {currentLesson ? (
            <div className="w-full h-full flex flex-col">
               <iframe 
                 className="w-full aspect-video min-h-64"
                 src={currentLesson.videoUrl} 
                 title={currentLesson.title}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
               <div className="p-4 bg-white flex-1">
                 <h3 className="text-xl font-bold text-gray-800">{currentLesson.title}</h3>
                 <p className="text-gray-600 mt-2">Nội dung bài học...</p>
               </div>
            </div>
          ) : (
            <p className="text-white p-8 text-center">Chưa có bài học nào trong khóa này.</p>
          )}
        </div>

        {/* Cột phải: Danh sách bài học */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full lg:col-span-1">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Nội dung khóa học</h3>
            <p className="text-xs text-gray-500">{course.lessons?.length || 0} bài học</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {course.lessons?.sort((a, b) => a.orderIndex - b.orderIndex).map((lesson, idx) => (
              <button 
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${currentLesson?.id === lesson.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'hover:bg-gray-50'}`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentLesson?.id === lesson.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {lesson.orderIndex}
                </div>
                <div>
                  <p className={`text-sm font-medium ${currentLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-700'}`}>{lesson.title}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> Video</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// Component Hiển thị Dashboard của Học viên (Using StudentLayout with modular pages)
const StudentDashboard = ({ user, logout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Hiển thị Course Player nếu có khóa học được chọn
  if (selectedCourseId) {
    return <CoursePlayer courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
  }

  // Render page dựa trên currentPage state từ StudentLayout
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboardPage user={user} logout={logout} />;
      case 'courses':
        return <StudentCoursesPage user={user} logout={logout} />;
      case 'progress':
        return <StudentProgressPage user={user} logout={logout} />;
      case 'profile':
        return <StudentProfilePage user={user} logout={logout} />;
      default:
        return <StudentDashboardPage user={user} logout={logout} />;
    }
  };

  return (
    <StudentLayout user={user} logout={logout} onPageChange={setCurrentPage}>
      {renderPage()}
    </StudentLayout>
  );
};


// --- LOGIN SCREEN CÓ 2FA (UI-FIRST, real backend by default) ---
const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [step, setStep] = useState(1); // 1: Nhập Email/Pass, 2: Nhập OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // API base URL from .env (default: real backend)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
  const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH !== 'false';

  // Xử lý Bước 1: Email/Pass
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (USE_MOCK_AUTH) {
      // Simulate a small network delay
      await new Promise(r => setTimeout(r, 500));
      if (email === 'admin@upnest.edu' && password === '123456') {
        // Admin requires 2FA
        setStep(2);
        setIsLoading(false);
        return;
      }
      if (email === 'student@upnest.edu' && password === '123456') {
        const data = { token: 'mock-student-token', role: 'STUDENT', fullName: 'Student Mock', is2faRequired: false };
        finishLogin(data);
        setIsLoading(false);
        return;
      }
      setError('Sai email hoặc mật khẩu!');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Read body once, then decide how to parse
      const bodyText = await res.text();
      let data = {};
      
      try {
        if (bodyText) {
          data = JSON.parse(bodyText);
        }
      } catch (parseErr) {
        console.error('Failed to parse JSON:', parseErr, 'Body was:', bodyText);
      }

      if (res.ok) {
        if (data.is2faRequired) {
          setStep(2);
        } else {
          finishLogin(data);
        }
      } else {
        // Server returned error status
        setError(data.message || bodyText || 'Sai email hoặc mật khẩu!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Lỗi kết nối Server hoặc API không phản hồi');
    } finally { setIsLoading(false); }
  };

  // Xử lý Bước 2: Gửi mã OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (USE_MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 400));
      // For mock mode accept any 6-digit code that is numeric
      if (/^\d{6}$/.test(otp)) {
        const data = { token: 'mock-admin-token', role: 'ADMIN', fullName: 'Admin Mock', is2faRequired: false };
        finishLogin(data);
      } else {
        setError('Mã OTP không đúng!');
      }
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: parseInt(otp) }),
      });

      const textResponse = await res.text();
      let data = {};
      
      try {
        if (textResponse) {
          data = JSON.parse(textResponse);
        }
      } catch (parseErr) {
        console.error('Failed to parse OTP response:', parseErr, 'Body was:', textResponse);
      }
      
      if (res.ok) {
        finishLogin(data);
      } else {
        setError(data.message || textResponse || 'Mã OTP không đúng!');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Lỗi xác thực mã OTP');
    } finally { setIsLoading(false); }
  };

  const finishLogin = (data) => {
    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to persist login to localStorage', e);
    }
    onLoginSuccess(data);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {step === 1 ? <GraduationCap className="text-white w-8 h-8" /> : <Lock className="text-white w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-white">UpNest Edu</h1>
          <p className="text-blue-100 text-sm">Hệ thống quản lý</p>
        </div>

        {step === 1 ? (
          // FORM BƯỚC 1: EMAIL / PASS
          <form onSubmit={handleLogin} className="p-8 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 text-center">Đăng nhập</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@upnest.edu" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
              {isLoading ? 'Đang kiểm tra...' : 'Đăng nhập ngay'}
            </button>
            <div className="text-center text-xs text-gray-400 mt-4 border-t pt-4">
               <p>Admin (Cần 2FA): admin@upnest.edu / 123456</p>
               <p>Student (Không 2FA): student@upnest.edu / 123456</p>
            </div>
            {USE_MOCK_AUTH && (
              <div className="text-center text-xs text-gray-400 mt-2">(Mock auth enabled — frontend UI only)</div>
            )}
          </form>
        ) : (
          // FORM BƯỚC 2: NHẬP OTP
          <form onSubmit={handleVerifyOtp} className="p-8 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 text-center">Xác thực 2 lớp (2FA)</h2>
            <p className="text-sm text-gray-500 text-center">Vui lòng nhập mã 6 số từ ứng dụng Google Authenticator cho tài khoản **{email}**.</p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center">{error}</div>}

            <div className="flex justify-center">
              <input 
                type="text" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                className="w-40 text-center text-3xl tracking-widest py-2 border-b-2 border-indigo-500 focus:outline-none font-mono" 
                placeholder="000000" 
                autoFocus
                required 
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md">
              {isLoading ? 'Đang xác thực...' : 'Xác nhận mã OTP'}
            </button>
            <button type="button" onClick={() => {setStep(1); setError('');}} className="w-full text-gray-500 text-sm hover:underline">← Quay lại đăng nhập</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTS CHUNG ---

// Sidebar
const Sidebar = ({ role, isOpen, toggleSidebar, currentTab, setCurrentTab, logout }) => {
  const menuItems = {
    // ... (Giữ nguyên menuItems)
    ADMIN: [
      { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
      { id: 'users', label: 'QL Người dùng', icon: Users },
      { id: 'courses', label: 'QL Khóa học', icon: BookOpen },
      { id: 'finance', label: 'Tài chính', icon: CreditCard },
      { id: 'settings', label: 'Cài đặt', icon: Settings },
    ],
    TEACHER: [
      { id: 'dashboard', label: 'Lớp của tôi', icon: LayoutDashboard },
      { id: 'schedule', label: 'Lịch dạy', icon: Calendar },
      { id: 'grading', label: 'Chấm điểm', icon: FileText },
      { id: 'resources', label: 'Kho học liệu', icon: BookOpen },
    ],
    STUDENT: [
      { id: 'dashboard', label: 'Góc học tập', icon: GraduationCap },
      { id: 'my-courses', label: 'Khóa học của tôi', icon: BookOpen },
      { id: 'achievements', label: 'Thành tích', icon: Trophy },
      { id: 'community', label: 'Cộng đồng', icon: Users },
      { id: 'settings', label: 'Cài đặt', icon: Settings },
    ]
  };

  const items = menuItems[role] || menuItems['STUDENT'];

  return (
    <>
      {isOpen && (<div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={toggleSidebar}/>)}
      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-xl
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-950">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            UpNest Edu
          </span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={toggleSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`
                w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                ${currentTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Thông tin User nhỏ ở dưới cùng */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button onClick={logout} className="w-full flex items-center gap-3 hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md
              ${role === 'ADMIN' ? 'bg-gradient-to-tr from-red-500 to-orange-500' : 
                role === 'TEACHER' ? 'bg-gradient-to-tr from-purple-500 to-pink-500' : 
                'bg-gradient-to-tr from-blue-500 to-cyan-500'}
            `}>
              {role === 'ADMIN' ? 'AD' : role === 'TEACHER' ? 'GV' : 'HV'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              {/* <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p> */}
              <p className="text-xs text-slate-400 truncate capitalize">{role.toLowerCase()}</p>
            </div>
            <LogOut className="w-5 h-5 text-slate-500 cursor-pointer hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
};

// Header
const Header = ({ toggleSidebar, role, user, logout }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 lg:w-96 border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder={role === 'ADMIN' ? "Tìm người dùng, hóa đơn..." : "Tìm bài học, khóa học..."}
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Vai trò hiện tại (Hiển thị cố định) */}
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-700 font-bold px-2 py-1 bg-white rounded-md">{role}</span>
        </div>

        {/* Gamification Stats (Chỉ hiện cho Student) */}
        {role === 'STUDENT' && (
          <div className="hidden sm:flex items-center gap-4 border-l pl-4 border-gray-200">
            <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full border border-orange-100" title="Streak (Chuỗi ngày học)">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span className="text-sm">12</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100" title="XP (Điểm kinh nghiệm)">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">450 XP</span>
            </div>
          </div>
        )}

        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={logout}>
          <LogOut className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
    </header>
  );
};

// Admin Dashboard (Giữ nguyên)
const AdminDashboard = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {MOCK_STATS_ADMIN.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-${stat.color.replace('bg-', '')}/30`}>
            <stat.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Bảng điều khiển Admin</h3>
        <p className="text-gray-500 mt-2">Đăng nhập bằng Admin và xác thực 2FA thành công!</p>
    </div>
  </div>
);

// Teacher Dashboard (Giữ nguyên)
const TeacherDashboard = () => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển Giảng viên</h2>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">Đây là giao diện dành cho giáo viên (Teacher).</p>
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Logic đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentTab('dashboard'); // Reset tab
  }, []);
  
  // Logic đăng nhập thành công
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Chọn Component chính để render
  const renderMainComponent = () => {
    if (!user) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    // Nếu đã đăng nhập, chọn Dashboard phù hợp với Role
    switch(user.role) {
      case 'ADMIN': return <AdminDashboard user={user} />;
      case 'TEACHER': return <TeacherDashboard user={user} />;
      case 'STUDENT': return <StudentDashboard user={user} logout={logout} />;
      default: return <StudentDashboard user={user} logout={logout} />;
    }
  };

  if (!user) {
    // Nếu chưa đăng nhập, render full màn hình Login
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Nếu đã đăng nhập, render Layout chính
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <Sidebar 
        user={user}
        role={user.role} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        logout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
        <Header 
          toggleSidebar={toggleSidebar} 
          user={user}
          role={user.role} 
          logout={logout}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;