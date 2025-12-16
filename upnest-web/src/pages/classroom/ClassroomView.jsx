import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../student/StudentLayout';
import AnnouncementFeed from './AnnouncementFeed';
import AssignmentSection from './AssignmentSection';
import ClassroomRoster from './ClassroomRoster';
import ProgressTracker from './ProgressTracker';
import './ClassroomView.css';

/**
 * ClassroomView - Giao diện lớp học kiểu Edmodo
 * Hiển thị thông báo, bài tập, danh sách học sinh, tiến độ
 */
export default function ClassroomView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('announcements');
  const [selectedClass, setSelectedClass] = useState(null);

  // Sample classroom data
  const classrooms = [
    {
      id: 1,
      name: 'Web Development 101',
      subject: 'Web Development',
      teacher: 'Nguyễn Minh Tuấn',
      code: 'WEB101',
      students: 25,
      color: '#007bff',
      icon: '💻'
    },
    {
      id: 2,
      name: 'JavaScript Advanced',
      subject: 'Programming',
      teacher: 'Trần Thị Hoa',
      code: 'JS201',
      students: 18,
      color: '#28a745',
      icon: '⚙️'
    },
    {
      id: 3,
      name: 'UI/UX Design',
      subject: 'Design',
      teacher: 'Lê Văn Hùng',
      code: 'UX301',
      students: 22,
      color: '#ffc107',
      icon: '🎨'
    }
  ];

  const currentClass = selectedClass || classrooms[0];

  const handleClassSelect = (classroom) => {
    setSelectedClass(classroom);
    setActiveTab('announcements');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return <AnnouncementFeed classroom={currentClass} />;
      case 'assignments':
        return <AssignmentSection classroom={currentClass} />;
      case 'roster':
        return <ClassroomRoster classroom={currentClass} />;
      case 'progress':
        return <ProgressTracker classroom={currentClass} />;
      default:
        return <AnnouncementFeed classroom={currentClass} />;
    }
  };

  return (
    <StudentLayout>
      <div className="classroom-view">
        {/* Classroom Selector */}
        <div className="classroom-selector">
          <h2>🏫 Lớp học của tôi</h2>
          <div className="classroom-list">
            {classrooms.map(classroom => (
              <div
                key={classroom.id}
                className={`classroom-card ${selectedClass?.id === classroom.id ? 'active' : ''}`}
                onClick={() => handleClassSelect(classroom)}
                style={{ borderLeftColor: classroom.color }}
              >
                <div className="classroom-icon" style={{ backgroundColor: classroom.color }}>
                  {classroom.icon}
                </div>
                <div className="classroom-info">
                  <h4>{classroom.name}</h4>
                  <p className="teacher-name">👨‍🏫 {classroom.teacher}</p>
                  <p className="class-code">Mã: {classroom.code}</p>
                  <p className="student-count">👥 {classroom.students} học sinh</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classroom Content */}
        <div className="classroom-container">
          {/* Classroom Header */}
          <div className="classroom-header" style={{ backgroundColor: currentClass.color }}>
            <div className="classroom-header-content">
              <h1>{currentClass.name}</h1>
              <p>{currentClass.subject} • Giáo viên: {currentClass.teacher}</p>
              <p className="class-code-large">Mã lớp: <span>{currentClass.code}</span></p>
            </div>
            <div className="classroom-header-icon" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              {currentClass.icon}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="classroom-tabs">
            <button
              className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              📢 Thông báo
            </button>
            <button
              className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              📝 Bài tập
            </button>
            <button
              className={`tab-button ${activeTab === 'roster' ? 'active' : ''}`}
              onClick={() => setActiveTab('roster')}
            >
              👥 Danh sách
            </button>
            <button
              className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              📊 Tiến độ
            </button>
          </div>

          {/* Tab Content */}
          <div className="classroom-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
