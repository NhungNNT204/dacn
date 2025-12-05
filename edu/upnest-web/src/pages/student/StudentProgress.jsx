import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  Award,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Zap,
  CheckCircle2
} from 'lucide-react';

const StudentProgress = ({ user, logout }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'week', 'month', 'year'

  // Mock statistics data
  const progressStats = {
    overallProgress: 68,
    weeklyStreak: 5,
    totalHours: 42.5,
    averageScore: 87,
    skillsLearned: 24,
    certificatesEarned: 3,
    weeklyActivity: [
      { day: 'Thứ 2', hours: 2.5, completed: 3 },
      { day: 'Thứ 3', hours: 1.5, completed: 2 },
      { day: 'Thứ 4', hours: 3, completed: 4 },
      { day: 'Thứ 5', hours: 2, completed: 2 },
      { day: 'Thứ 6', hours: 4.5, completed: 5 },
      { day: 'Thứ 7', hours: 3, completed: 3 },
      { day: 'Chủ nhật', hours: 1, completed: 1 },
    ],
    skills: [
      { name: 'React', proficiency: 78, level: 'Trung cấp' },
      { name: 'JavaScript', proficiency: 82, level: 'Nâng cao' },
      { name: 'CSS/Tailwind', proficiency: 75, level: 'Trung cấp' },
      { name: 'REST APIs', proficiency: 70, level: 'Trung cấp' },
      { name: 'Git/GitHub', proficiency: 65, level: 'Sơ cấp' },
      { name: 'Node.js', proficiency: 60, level: 'Sơ cấp' },
    ],
    milestones: [
      { id: 1, title: 'Hoàn thành React Basics', date: '2025-11-15', completed: true },
      { id: 2, title: 'Nộp Project React Todo App', date: '2025-12-01', completed: true },
      { id: 3, title: 'Bắt đầu khóa Advanced React', date: '2025-12-05', completed: true },
      { id: 4, title: 'Hoàn thành State Management', date: '2025-12-15', completed: false },
      { id: 5, title: 'Tham gia Capstone Project', date: '2025-12-20', completed: false },
    ],
    subjectsProgress: [
      { name: 'Lập trình Front-end', progress: 75 },
      { name: 'Lập trình Back-end', progress: 45 },
      { name: 'Cơ sở dữ liệu', progress: 60 },
      { name: 'Thiết kế UX/UI', progress: 55 },
      { name: 'DevOps/Deployment', progress: 30 },
    ],
  };

  const maxHours = Math.max(...progressStats.weeklyActivity.map(a => a.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* === HEADER === */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Tiến độ học tập</h2>
        <p className="text-gray-600 mt-1">Theo dõi và phân tích hiệu suất học tập của bạn</p>
      </div>

      {/* === KPI CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Progress */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-bold bg-white/20 px-2.5 py-1 rounded-full">+5% từ tháng trước</span>
          </div>
          <p className="text-blue-100 text-sm mb-1">Tiến độ tổng thể</p>
          <p className="text-3xl font-bold">{progressStats.overallProgress}%</p>
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${progressStats.overallProgress}%` }}></div>
          </div>
        </div>

        {/* Card 2: Weekly Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <Activity className="w-5 h-5 mb-3" />
          <p className="text-orange-100 text-sm mb-1">Học liên tiếp</p>
          <p className="text-3xl font-bold">{progressStats.weeklyStreak} ngày</p>
          <p className="text-orange-100 text-xs mt-3">🔥 Giữ vững chuỗi nhân</p>
        </div>

        {/* Card 3: Total Hours */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <Zap className="w-5 h-5 mb-3" />
          <p className="text-emerald-100 text-sm mb-1">Giờ học tuần này</p>
          <p className="text-3xl font-bold">{progressStats.totalHours}h</p>
          <p className="text-emerald-100 text-xs mt-3">Bình quân: 6h/ngày</p>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <Award className="w-5 h-5 mb-3" />
          <p className="text-purple-100 text-sm mb-1">Điểm trung bình</p>
          <p className="text-3xl font-bold">{progressStats.averageScore}/100</p>
          <p className="text-purple-100 text-xs mt-3">Loại giỏi</p>
        </div>
      </div>

      {/* === MAIN GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* === WEEKLY ACTIVITY === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" /> Hoạt động trong tuần
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-around gap-2 h-48 mb-4">
              {progressStats.weeklyActivity.map((activity, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div className="relative w-full flex items-end justify-center h-32">
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg w-full transition-all hover:from-blue-600 hover:to-blue-400 cursor-pointer"
                        style={{ height: `${(activity.hours / maxHours) * 100}%` }}
                        title={`${activity.hours}h`}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">{activity.hours}h</p>
                    <p className="text-xs text-gray-500">{activity.day}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{progressStats.weeklyActivity.reduce((sum, a) => sum + a.hours, 0).toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">Tổng giờ</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{progressStats.weeklyActivity.reduce((sum, a) => sum + a.completed, 0)}</p>
                <p className="text-xs text-gray-600 mt-1">Bài học</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{(progressStats.weeklyActivity.reduce((sum, a) => sum + a.hours, 0) / 7).toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">Trung bình/ngày</p>
              </div>
            </div>
          </div>

          {/* === SKILLS PROFICIENCY === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-emerald-600" /> Kỹ năng của bạn
            </h3>
            <div className="space-y-4">
              {progressStats.skills.map((skill, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{skill.name}</span>
                    <span className="text-sm font-bold text-blue-600">{skill.proficiency}%</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all group-hover:shadow-lg"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap font-semibold">
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* === SUBJECTS PROGRESS === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
              <PieChart className="w-5 h-5 text-indigo-600" /> Môn học
            </h3>
            <div className="space-y-4">
              {progressStats.subjectsProgress.map((subject, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-sm font-semibold text-gray-700">{subject.name}</p>
                    <span className="text-xs font-bold text-blue-600">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        subject.progress >= 75
                          ? 'bg-green-500'
                          : subject.progress >= 50
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === MILESTONES === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-amber-600" /> Mục tiêu
            </h3>
            <div className="space-y-3">
              {progressStats.milestones.map((milestone) => (
                <div key={milestone.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 pt-0.5">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === ACHIEVEMENTS === */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
          <Award className="w-5 h-5 text-amber-600" /> Thành tựu & Chứng chỉ
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((cert) => (
            <div key={cert} className="flex flex-col items-center text-center group cursor-pointer">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                cert <= 3 ? 'bg-yellow-400' : 'bg-gray-300'
              }`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <p className="text-xs font-semibold text-gray-800 mt-2 line-clamp-2">
                {cert <= 3 ? `Chứng chỉ ${cert}` : 'Đang mở'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
