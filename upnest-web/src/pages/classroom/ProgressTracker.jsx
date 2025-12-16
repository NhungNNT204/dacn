import React, { useState } from 'react';
import './ProgressTracker.css';

/**
 * ProgressTracker - Theo dõi tiến độ học tập
 * Hiển thị tiến độ hoàn thành bài tập, điểm số, thống kê
 */
export default function ProgressTracker({ classroom }) {
  const [progressData] = useState({
    overallGrade: 8.4,
    totalAssignments: 15,
    completedAssignments: 13,
    averageScore: 83,
    lastUpdate: '2 giờ trước',
    assignments: [
      { id: 1, name: 'Portfolio Website', grade: 90, maxGrade: 100, status: 'graded', date: '2025-12-10' },
      { id: 2, name: 'CSS Grid Layout', grade: 85, maxGrade: 50, status: 'graded', date: '2025-12-12' },
      { id: 3, name: 'JavaScript Functions', grade: 80, maxGrade: 75, status: 'graded', date: '2025-12-14' },
      { id: 4, name: 'Flexbox Quiz', grade: 88, maxGrade: 100, status: 'graded', date: '2025-12-09' },
      { id: 5, name: 'Responsive Design', grade: null, maxGrade: 100, status: 'pending', date: null },
      { id: 6, name: 'API Integration Project', grade: null, maxGrade: 150, status: 'submitted', date: null }
    ],
    skills: [
      { name: 'HTML', proficiency: 90, projects: 5 },
      { name: 'CSS', proficiency: 85, projects: 4 },
      { name: 'JavaScript', proficiency: 75, projects: 3 },
      { name: 'React', proficiency: 70, projects: 2 },
      { name: 'Responsive Design', proficiency: 80, projects: 3 }
    ],
    weeklyActivity: [
      { day: 'Thứ 2', submissions: 2, hours: 5 },
      { day: 'Thứ 3', submissions: 1, hours: 3 },
      { day: 'Thứ 4', submissions: 3, hours: 7 },
      { day: 'Thứ 5', submissions: 1, hours: 4 },
      { day: 'Thứ 6', submissions: 2, hours: 6 },
      { day: 'Thứ 7', submissions: 1, hours: 2 },
      { day: 'Chủ nhật', submissions: 0, hours: 0 }
    ]
  });

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const getGradeColor = (grade, maxGrade = 100) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return '#28a745'; // Green
    if (percentage >= 80) return '#17a2b8'; // Blue
    if (percentage >= 70) return '#ffc107'; // Yellow
    if (percentage >= 60) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'graded':
        return { text: '📊 Đã chấm', color: '#28a745' };
      case 'submitted':
        return { text: '✅ Đã nộp', color: '#17a2b8' };
      case 'pending':
        return { text: '⏳ Chưa nộp', color: '#ffc107' };
      default:
        return { text: 'Không xác định', color: '#6c757d' };
    }
  };

  return (
    <div className="progress-tracker">
      {/* Overall Stats */}
      <div className="overall-stats">
        <div className="stat-card main-stat">
          <h3>📊 Điểm trung bình</h3>
          <div className="grade-display">
            <div className="grade-circle" style={{ borderColor: getGradeColor(progressData.overallGrade) }}>
              <span className="grade-value">{progressData.overallGrade}</span>
              <span className="grade-max">/10</span>
            </div>
          </div>
          <p className="grade-label">
            {progressData.overallGrade >= 8 ? '🌟 Xuất sắc' :
             progressData.overallGrade >= 7 ? '👍 Tốt' :
             progressData.overallGrade >= 6 ? '📚 Trung bình' : '⚠️ Cần cố gắng'}
          </p>
        </div>

        <div className="stat-card">
          <h3>📝 Bài tập</h3>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(progressData.completedAssignments / progressData.totalAssignments) * 100}%`
                }}
              ></div>
            </div>
          </div>
          <p className="progress-text">{progressData.completedAssignments}/{progressData.totalAssignments} hoàn thành</p>
        </div>

        <div className="stat-card">
          <h3>⏰ Cập nhật cuối</h3>
          <p className="last-update">{progressData.lastUpdate}</p>
        </div>

        <div className="stat-card">
          <h3>📈 Trung bình điểm</h3>
          <p className="average-score" style={{ color: getGradeColor(progressData.averageScore) }}>
            {progressData.averageScore}%
          </p>
        </div>
      </div>

      {/* Assignments Progress */}
      <div className="assignments-progress">
        <h2>📋 Tiến độ bài tập</h2>
        <div className="assignment-list">
          {progressData.assignments.map(assignment => (
            <div
              key={assignment.id}
              className="assignment-progress-item"
              onClick={() => setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment)}
              style={{
                borderLeftColor: assignment.grade 
                  ? getGradeColor(assignment.grade, assignment.maxGrade)
                  : '#ddd'
              }}
            >
              <div className="assignment-header">
                <div className="assignment-info">
                  <h4>{assignment.name}</h4>
                  <p className="assignment-max-grade">Điểm tối đa: {assignment.maxGrade}</p>
                </div>
                <div className="assignment-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusBadge(assignment.status).color }}
                  >
                    {getStatusBadge(assignment.status).text}
                  </span>
                </div>
              </div>

              {assignment.grade !== null && (
                <div className="assignment-grade">
                  <div className="grade-bar-container">
                    <div className="grade-bar">
                      <div
                        className="grade-bar-fill"
                        style={{
                          width: `${(assignment.grade / assignment.maxGrade) * 100}%`,
                          backgroundColor: getGradeColor(assignment.grade, assignment.maxGrade)
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="grade-text">
                    {assignment.grade}/{assignment.maxGrade} ({Math.round((assignment.grade / assignment.maxGrade) * 100)}%)
                  </span>
                </div>
              )}

              {assignment.date && (
                <p className="assignment-date">📅 {new Date(assignment.date).toLocaleDateString('vi-VN')}</p>
              )}

              {selectedAssignment?.id === assignment.id && (
                <div className="assignment-details-expanded">
                  <p>✓ Bài tập đã được chấm điểm</p>
                  <p>💬 Xem nhận xét từ giáo viên trong tab "Bài tập"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Development */}
      <div className="skills-development">
        <h2>🎓 Phát triển kỹ năng</h2>
        <div className="skills-grid">
          {progressData.skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <h4>{skill.name}</h4>
                <span className="proficiency-badge" style={{ color: getGradeColor(skill.proficiency) }}>
                  {skill.proficiency}%
                </span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-bar-fill"
                  style={{
                    width: `${skill.proficiency}%`,
                    backgroundColor: getGradeColor(skill.proficiency)
                  }}
                ></div>
              </div>
              <p className="skill-projects">📁 {skill.projects} dự án</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="weekly-activity">
        <h2>📅 Hoạt động tuần này</h2>
        <div className="activity-chart">
          {progressData.weeklyActivity.map((day, index) => (
            <div key={index} className="activity-bar-container">
              <div className="activity-bar">
                <div
                  className="submissions-bar"
                  style={{
                    height: `${(day.submissions / 3) * 100}%`,
                    backgroundColor: '#007bff'
                  }}
                  title={`${day.submissions} bài nộp`}
                ></div>
              </div>
              <p className="day-label">{day.day}</p>
              <p className="activity-count">{day.hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <h2>📊 Biểu đồ tiến độ</h2>
        <div className="performance-chart">
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
              <span>90-100: Xuất sắc</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#17a2b8' }}></span>
              <span>80-89: Tốt</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
              <span>70-79: Trung bình</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#fd7e14' }}></span>
              <span>60-69: Yếu</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#dc3545' }}></span>
              <span>Dưới 60: Rất yếu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h2>💡 Gợi ý cải thiện</h2>
        <div className="recommendation-items">
          <div className="recommendation-item">
            <span className="rec-icon">📚</span>
            <p>Tập trung vào JavaScript - Kỹ năng này cần được nâng cao hơn</p>
          </div>
          <div className="recommendation-item">
            <span className="rec-icon">🎯</span>
            <p>Hoàn thành 2 bài tập còn lại để đạt 100% tiến độ</p>
          </div>
          <div className="recommendation-item">
            <span className="rec-icon">⏰</span>
            <p>Tăng thời gian học tập vào tuần - đặc biệt vào thứ 7 và chủ nhật</p>
          </div>
        </div>
      </div>
    </div>
  );
}
