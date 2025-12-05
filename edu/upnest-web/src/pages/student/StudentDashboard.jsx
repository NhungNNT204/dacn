import React, { useState, useEffect, useCallback } from 'react';
import {
  Flame,
  Trophy,
  Clock,
  BookOpen,
  FileText,
  BarChart3,
  PlayCircle,
  GraduationCap,
  Lightbulb
} from 'lucide-react';

const StudentDashboard = ({ user, logout }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data cho gamification
  const studentStats = {
    currentLevel: 8,
    currentXP: 2450,
    xpToNextLevel: 5000,
    learningStreak: 12,
    completedCourses: 3,
    totalLearningHours: 42,
    tasksToday: 3,
    upcomingDeadline: '2025-12-10',
  };

  const suggestedCourses = [
    { id: 'sug-1', title: 'Python Advanced OOP', instructor: 'Nguyễn Minh', difficulty: 'Nâng cao', relevance: '92%' },
    { id: 'sug-2', title: 'Web Scraping with Python', instructor: 'Trần Thắng', difficulty: 'Trung bình', relevance: '88%' },
    { id: 'sug-3', title: 'Data Analysis with Pandas', instructor: 'Lê Huy', difficulty: 'Trung bình', relevance: '85%' },
  ];

  // Lấy danh sách khóa học từ Backend
  const fetchCourses = useCallback(async () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/courses`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        setCourses(await res.json());
      } else if (res.status === 403 || res.status === 401) {
        logout();
      }
    } catch (e) {
      console.error("Lỗi khi lấy khóa học:", e);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) return <div className="p-8 text-center text-blue-600 font-bold">Đang tải dữ liệu...</div>;

  const progressPercent = (studentStats.currentXP / studentStats.xpToNextLevel) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* === HERO BANNER + GAMIFICATION === */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Chào mừng trở lại, {user?.fullName}! 👋</h2>
              <p className="text-blue-100 text-lg">Tiếp tục hành trình học tập của bạn</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">Cấp {studentStats.currentLevel}</div>
              <div className="text-blue-100 text-sm">XP: {studentStats.currentXP} / {studentStats.xpToNextLevel}</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6">
            <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-blue-100 text-xs mt-2">{progressPercent.toFixed(0)}% đến cấp {studentStats.currentLevel + 1}</p>
          </div>

          {/* Learning Streak + Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-300" />
                <div>
                  <p className="text-blue-100 text-xs">Learning Streak</p>
                  <p className="text-2xl font-bold">{studentStats.learningStreak} ngày</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <div>
                  <p className="text-blue-100 text-xs">Khóa hoàn thành</p>
                  <p className="text-2xl font-bold">{studentStats.completedCourses}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-green-300" />
                <div>
                  <p className="text-blue-100 text-xs">Giờ học</p>
                  <p className="text-2xl font-bold">{studentStats.totalLearningHours}h</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex gap-3">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
              <PlayCircle className="w-5 h-5" /> Tiếp tục bài học
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
              <GraduationCap className="w-5 h-5" /> Khám phá khóa học
            </button>
          </div>
        </div>
      </div>

      {/* === PERSONAL OVERVIEW (TASKS & DEADLINES) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Today */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Việc hôm nay
            </h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{studentStats.tasksToday}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Nộp bài tập React Hooks</p>
                <p className="text-xs text-gray-500 mt-1">Sắp đến hạn: 3 giờ</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Xem video bài 5 - State Management</p>
                <p className="text-xs text-gray-500 mt-1">Hạn chót: 2025-12-08</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Tham gia bài kiểm tra đơn nguyên</p>
                <p className="text-xs text-gray-500 mt-1">Hạn chót: {studentStats.upcomingDeadline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> Tiến độ học tập
          </h3>
          <div className="space-y-4">
            {courses.slice(0, 3).map((course, idx) => (
              <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.instructor}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{65 + idx * 10}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${65 + idx * 10}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{12 + idx * 3} / {18 + idx * 2} bài học hoàn thành</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === GỢI Ý KHÓA HỌC MỚI === */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" /> Khóa học gợi ý cho bạn
          </h3>
          <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">Xem tất cả →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedCourses.map((course) => (
            <div key={course.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{course.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">Giảng viên: {course.instructor}</p>
                </div>
                <span className="inline-block bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">{course.difficulty}</span>
              </div>
              <div className="mb-4 p-3 bg-white rounded-lg border border-amber-100">
                <p className="text-xs text-gray-600 mb-1">Độ phù hợp</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                      style={{ width: course.relevance }}
                    ></div>
                  </div>
                  <span className="ml-2 font-bold text-orange-600">{course.relevance}</span>
                </div>
              </div>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors transform group-hover:scale-105">
                Đăng ký ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
