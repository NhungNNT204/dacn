import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Settings,
  LogOut,
  Camera,
  Edit2,
  Save,
  X,
  Shield,
  Bell,
  Lock
} from 'lucide-react';

const StudentProfile = ({ user, logout }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Nguyễn Văn A',
    email: user?.email || 'student@upnest.edu',
    phone: '+84912345678',
    location: 'Hà Nội, Việt Nam',
    bio: 'Đam mê lập trình và công nghệ. Luôn sẵn sàng học hỏi và chia sẻ kiến thức.',
    avatar: 'https://via.placeholder.com/120',
  });
  const [editData, setEditData] = useState(profileData);
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData(profileData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData(prev => ({ ...prev, avatar: event.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Khóa học', value: '8', color: 'blue' },
    { icon: Award, label: 'Chứng chỉ', value: '3', color: 'amber' },
    { icon: Shield, label: 'Điểm danh', value: '92%', color: 'green' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* === HEADER === */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hồ sơ của tôi</h2>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        {!isEditMode && (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Chỉnh sửa
          </button>
        )}
      </div>

      {/* === PROFILE CARD === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar + Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-xl bg-gray-100 border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={isEditMode ? editData.avatar : profileData.avatar}
                  alt={profileData.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditMode && (
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-800">{profileData.fullName}</h3>
                  <p className="text-gray-600 mt-1">Học sinh</p>
                  <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {profileData.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {profileData.phone}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {profileData.location}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Giới thiệu</h4>
              {isEditMode ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="text-gray-600">{profileData.bio}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditMode && (
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" /> Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Save className="w-4 h-4" /> Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === STATS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* === SETTINGS SECTIONS === */}
      <div className="space-y-4">
        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-red-600" /> Bảo mật
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">Đổi mật khẩu</p>
                <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn thường xuyên</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                Đổi
              </button>
            </div>
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">Xác thực hai bước</p>
                <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản với 2FA</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                Bật
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" /> Thông báo
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Thông báo email', desc: 'Nhận email về cập nhật khóa học' },
              { label: 'Thông báo tuần', desc: 'Báo cáo tiến độ hàng tuần' },
              { label: 'Lời mời lớp học', desc: 'Khi bạn được thêm vào lớp học' },
            ].map((notif, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{notif.label}</p>
                  <p className="text-xs text-gray-600">{notif.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={idx < 2}
                  className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Other Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-700" /> Cài đặt khác
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">Quyền riêng tư</p>
                <p className="text-sm text-gray-600">Quản lý ai có thể xem hồ sơ của bạn</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                Cài đặt
              </button>
            </div>
            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">Tải dữ liệu của tôi</p>
                <p className="text-sm text-gray-600">Xuất tất cả dữ liệu cá nhân của bạn</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                Tải
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-md"
        >
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
