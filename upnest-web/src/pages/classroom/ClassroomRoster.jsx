import React, { useState } from 'react';
import './ClassroomRoster.css';

/**
 * ClassroomRoster - Danh sách học sinh trong lớp
 * Hiển thị thành viên lớp học, trạng thái, gửi tin nhắn
 */
export default function ClassroomRoster({ classroom }) {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Trần Văn An',
      email: 'tvan.an@upnest.edu',
      joinedDate: '2025-09-01',
      avatar: 'T',
      status: 'active',
      role: 'student',
      submissions: 15,
      gradeAverage: 8.5,
      lastActive: '2 giờ trước'
    },
    {
      id: 2,
      name: 'Phạm Thị Bình',
      email: 'pthi.binh@upnest.edu',
      joinedDate: '2025-09-02',
      avatar: 'P',
      status: 'active',
      role: 'student',
      submissions: 18,
      gradeAverage: 9.2,
      lastActive: '30 phút trước'
    },
    {
      id: 3,
      name: 'Lê Minh Châu',
      email: 'lminh.chau@upnest.edu',
      joinedDate: '2025-09-03',
      avatar: 'L',
      status: 'active',
      role: 'student',
      submissions: 12,
      gradeAverage: 7.8,
      lastActive: '1 ngày trước'
    },
    {
      id: 4,
      name: 'Hoàng Đức Hùng',
      email: 'hduc.hung@upnest.edu',
      joinedDate: '2025-09-04',
      avatar: 'H',
      status: 'inactive',
      role: 'student',
      submissions: 8,
      gradeAverage: 6.5,
      lastActive: '3 ngày trước'
    },
    {
      id: 5,
      name: 'Vũ Thị Dung',
      email: 'vthi.dung@upnest.edu',
      joinedDate: '2025-09-05',
      avatar: 'V',
      status: 'active',
      role: 'student',
      submissions: 20,
      gradeAverage: 9.5,
      lastActive: '10 phút trước'
    },
    {
      id: 6,
      name: 'Nguyễn Văn Kiên',
      email: 'nvan.kien@upnest.edu',
      joinedDate: '2025-09-06',
      avatar: 'N',
      status: 'active',
      role: 'student',
      submissions: 14,
      gradeAverage: 8.0,
      lastActive: '4 giờ trước'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'grade':
        return b.gradeAverage - a.gradeAverage;
      case 'submissions':
        return b.submissions - a.submissions;
      case 'lastActive':
        return new Date(b.lastActive) - new Date(a.lastActive);
      default:
        return 0;
    }
  });

  const handleMessageStudent = (student) => {
    alert(`Gửi tin nhắn cho ${student.name}: Tính năng sẽ sớm có mặt!`);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const getStatusIndicator = (status) => {
    return status === 'active' ? '🟢' : '🔴';
  };

  return (
    <div className="classroom-roster">
      {/* Header Stats */}
      <div className="roster-stats">
        <div className="stat-card">
          <h4>👥 Tổng học sinh</h4>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h4>🟢 Đang hoạt động</h4>
          <p className="stat-number">{students.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h4>⭐ Trung bình lớp</h4>
          <p className="stat-number">{(students.reduce((sum, s) => sum + s.gradeAverage, 0) / students.length).toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h4>📝 Tổng nộp bài</h4>
          <p className="stat-number">{students.reduce((sum, s) => sum + s.submissions, 0)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="roster-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-box">
          <label>Sắp xếp theo:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="name">Tên</option>
            <option value="grade">Điểm trung bình</option>
            <option value="submissions">Số bài nộp</option>
            <option value="lastActive">Hoạt động gần đây</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="students-list">
        {sortedStudents.map(student => (
          <div key={student.id} className="student-card">
            {/* Student Info */}
            <div className="student-main-info">
              <div className="student-avatar-section">
                <div className={`student-avatar ${student.status}`}>
                  {student.avatar}
                </div>
                <span className="status-indicator" title={student.status}>
                  {getStatusIndicator(student.status)}
                </span>
              </div>

              <div className="student-info">
                <h4 className="student-name">{student.name}</h4>
                <p className="student-email">{student.email}</p>
                <p className="student-joined">📅 Tham gia: {new Date(student.joinedDate).toLocaleDateString('vi-VN')}</p>
                <p className="student-last-active">⏰ Hoạt động: {student.lastActive}</p>
              </div>

              {/* Student Stats */}
              <div className="student-stats">
                <div className="stat">
                  <span className="stat-label">Điểm TB:</span>
                  <span className={`stat-value ${student.gradeAverage >= 8 ? 'excellent' : student.gradeAverage >= 7 ? 'good' : 'normal'}`}>
                    {student.gradeAverage}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Bài nộp:</span>
                  <span className="stat-value">{student.submissions}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="student-actions">
                <button
                  className="action-btn message-btn"
                  onClick={() => handleMessageStudent(student)}
                  title="Gửi tin nhắn"
                >
                  💬
                </button>
                <button
                  className="action-btn profile-btn"
                  onClick={() => handleViewProfile(student)}
                  title="Xem hồ sơ"
                >
                  👁️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedStudent(null)}>✕</button>
            
            <div className="modal-header">
              <div className="modal-avatar">{selectedStudent.avatar}</div>
              <div className="modal-title">
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.email}</p>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <span className="label">Trạng thái:</span>
                <span className="value">
                  {getStatusIndicator(selectedStudent.status)} {selectedStudent.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Tham gia:</span>
                <span className="value">{new Date(selectedStudent.joinedDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="detail-row">
                <span className="label">Hoạt động gần đây:</span>
                <span className="value">{selectedStudent.lastActive}</span>
              </div>
              <div className="detail-row">
                <span className="label">Điểm trung bình:</span>
                <span className="value excellent">{selectedStudent.gradeAverage}/10</span>
              </div>
              <div className="detail-row">
                <span className="label">Bài tập đã nộp:</span>
                <span className="value">{selectedStudent.submissions}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-modal" onClick={() => handleMessageStudent(selectedStudent)}>
                💬 Gửi tin nhắn
              </button>
              <button className="btn-modal secondary" onClick={() => setSelectedStudent(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedStudents.length === 0 && (
        <div className="empty-state">
          <p>🔍 Không tìm thấy học sinh nào</p>
        </div>
      )}
    </div>
  );
}
