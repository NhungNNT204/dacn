import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Grid3x3,
  List
} from 'lucide-react';

const StudentCourses = ({ user, logout }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Lập trình', 'Thiết kế', 'Dữ liệu', 'Web', 'Mobile'];

  // Lấy khóa học từ Backend
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
        const data = await res.json();
        // Thêm mock data cho demo
        const enrichedCourses = (Array.isArray(data) ? data : []).map((c, i) => ({
          ...c,
          progress: Math.random() * 100,
          status: Math.random() > 0.5 ? 'active' : 'completed',
          students: Math.floor(Math.random() * 500) + 50,
          rating: (Math.random() * 2 + 3).toFixed(1),
          category: categories[i % categories.length],
          duration: Math.floor(Math.random() * 30) + 5,
        }));
        setCourses(enrichedCourses);
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

  // Lọc và tìm kiếm khóa học
  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  if (loading) return <div className="p-8 text-center text-blue-600 font-bold">Đang tải khóa học...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* === HEADER === */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Khóa học của bạn</h2>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi tiến độ học tập</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md">
          <PlayCircle className="w-5 h-5" /> Khám phá thêm
        </button>
      </div>

      {/* === SEARCH & FILTER === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterStatus === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang học
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoàn thành
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* === COURSES GRID/LIST === */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">Không tìm thấy khóa học</p>
          <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" />
                {course.status === 'completed' && (
                  <CheckCircle2 className="absolute top-3 right-3 w-6 h-6 text-green-400 bg-white rounded-full p-0.5" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{course.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{course.instructor}</p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}h
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-700">Tiến độ</span>
                    <span className="text-xs font-bold text-blue-600">{Math.round(course.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                  {course.status === 'completed' ? 'Ôn tập' : 'Tiếp tục học'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4 group"
            >
              {/* Thumbnail */}
              <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg relative">
                {course.status === 'completed' && (
                  <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-green-400 bg-white rounded-full p-0.5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800 flex-1">{course.title}</h4>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded flex-shrink-0">
                    {course.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{course.instructor}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}h
                  </span>
                  <span className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 whitespace-nowrap">{Math.round(course.progress)}%</span>
                </div>
              </div>

              {/* Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0">
                {course.status === 'completed' ? 'Ôn' : 'Học'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* === PAGINATION (nếu cần) === */}
      {filteredCourses.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-semibold">
            ← Trước
          </button>
          <div className="flex gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  page === 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-semibold">
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
