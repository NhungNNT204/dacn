import React, { useState } from 'react';
import './AssignmentSection.css';

/**
 * AssignmentSection - Danh sách bài tập
 * Hiển thị các bài tập, deadline, trạng thái nộp
 */
export default function AssignmentSection({ classroom }) {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Tạo một trang web về portfolio cá nhân',
      description: 'Sử dụng HTML, CSS, JavaScript để tạo trang web giới thiệu bản thân',
      dueDate: '2025-12-20',
      daysLeft: 4,
      status: 'pending', // pending, submitted, graded, overdue
      points: 100,
      submissionCount: 18,
      totalStudents: 25,
      attachments: 2,
      content: `
Requirements:
- Responsive design (mobile, tablet, desktop)
- At least 3 sections (header, about, projects)
- Working contact form
- Smooth animations
- Clean and modern design
      `
    },
    {
      id: 2,
      title: 'CSS Grid Layout Practice',
      description: 'Thực hành các layout khác nhau bằng CSS Grid',
      dueDate: '2025-12-18',
      daysLeft: 2,
      status: 'pending',
      points: 50,
      submissionCount: 15,
      totalStudents: 25,
      attachments: 1,
      content: 'Create 5 different layouts using CSS Grid'
    },
    {
      id: 3,
      title: 'JavaScript Function Exercises',
      description: 'Giải quyết 10 bài tập về hàm JavaScript',
      dueDate: '2025-12-15',
      daysLeft: -1,
      status: 'overdue',
      points: 75,
      submissionCount: 22,
      totalStudents: 25,
      attachments: 0,
      content: 'Complete all 10 function exercises'
    },
    {
      id: 4,
      title: 'Flexbox Quiz',
      description: 'Trắc nghiệm 20 câu về Flexbox',
      dueDate: '2025-12-10',
      daysLeft: -6,
      status: 'graded',
      points: 50,
      submissionCount: 25,
      totalStudents: 25,
      grade: 45,
      feedback: 'Tốt! Bạn đã hiểu rõ khái niệm Flexbox. Cần chú ý hơn đến flex-grow và flex-shrink.',
      attachments: 0,
      content: 'Quiz về Flexbox properties'
    }
  ]);

  const [expandedId, setExpandedId] = useState(null);
  const [submissionForm, setSubmissionForm] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'submitted': return '#17a2b8';
      case 'graded': return '#28a745';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return '⏳ Chưa nộp';
      case 'submitted': return '✅ Đã nộp';
      case 'graded': return '📊 Đã chấm điểm';
      case 'overdue': return '❌ Quá hạn';
      default: return 'Không xác định';
    }
  };

  const handleSubmit = (assignmentId) => {
    setSubmissionForm(assignmentId);
  };

  const handleConfirmSubmission = () => {
    setAssignments(assignments.map(a => 
      a.id === submissionForm ? { ...a, status: 'submitted', submissionCount: a.submissionCount + 1 } : a
    ));
    setSubmissionForm(null);
  };

  return (
    <div className="assignment-section">
      {/* Assignment Filters */}
      <div className="assignment-filters">
        <button className="filter-btn active">📋 Tất cả</button>
        <button className="filter-btn">⏳ Chưa nộp</button>
        <button className="filter-btn">✅ Đã nộp</button>
        <button className="filter-btn">📊 Đã chấm</button>
      </div>

      {/* Assignments List */}
      <div className="assignments-list">
        {assignments.map(assignment => (
          <div
            key={assignment.id}
            className={`assignment-card ${assignment.status}`}
            style={{ borderLeftColor: getStatusColor(assignment.status) }}
          >
            {/* Assignment Header */}
            <div 
              className="assignment-header"
              onClick={() => setExpandedId(expandedId === assignment.id ? null : assignment.id)}
            >
              <div className="assignment-icon">
                {assignment.status === 'graded' ? '📊' : 
                 assignment.status === 'overdue' ? '⏰' : 
                 assignment.status === 'submitted' ? '✅' : '📝'}
              </div>
              
              <div className="assignment-title-section">
                <h3 className="assignment-title">{assignment.title}</h3>
                <p className="assignment-description">{assignment.description}</p>
              </div>

              <div className="assignment-info">
                <div className="due-date">
                  <span className={`date-badge ${assignment.daysLeft < 0 ? 'overdue' : ''}`}>
                    {assignment.daysLeft < 0 
                      ? `Quá hạn ${Math.abs(assignment.daysLeft)} ngày`
                      : assignment.daysLeft === 0 
                      ? 'Hôm nay'
                      : `Còn ${assignment.daysLeft} ngày`
                    }
                  </span>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(assignment.status) }}>
                  {getStatusText(assignment.status)}
                </div>
              </div>

              <button className="expand-btn">
                {expandedId === assignment.id ? '▼' : '▶'}
              </button>
            </div>

            {/* Assignment Details (Expanded) */}
            {expandedId === assignment.id && (
              <div className="assignment-details">
                {/* Content */}
                <div className="detail-section">
                  <h4>📌 Chi tiết bài tập</h4>
                  <p className="detail-content">{assignment.content}</p>
                </div>

                {/* Submission Stats */}
                <div className="submission-stats">
                  <div className="stat-item">
                    <span className="stat-label">Điểm tối đa:</span>
                    <span className="stat-value">{assignment.points}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã nộp:</span>
                    <span className="stat-value">{assignment.submissionCount}/{assignment.totalStudents}</span>
                  </div>
                  {assignment.status === 'graded' && (
                    <div className="stat-item">
                      <span className="stat-label">Điểm của bạn:</span>
                      <span className="stat-value grade">{assignment.grade}/{assignment.points}</span>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {assignment.feedback && (
                  <div className="feedback-section">
                    <h4>💬 Nhận xét từ giáo viên</h4>
                    <div className="feedback-box">
                      <p>{assignment.feedback}</p>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {assignment.attachments > 0 && (
                  <div className="attachments-section">
                    <h4>📎 Tài liệu đính kèm ({assignment.attachments})</h4>
                    <div className="attachment-list">
                      <div className="attachment-item">
                        📄 assignment-guidelines.pdf
                      </div>
                      {assignment.attachments > 1 && (
                        <div className="attachment-item">
                          📄 starter-template.html
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submission Button */}
                {assignment.status !== 'graded' && (
                  <div className="submission-section">
                    <button 
                      className="btn-submit-assignment"
                      onClick={() => handleSubmit(assignment.id)}
                      disabled={submissionForm === assignment.id}
                    >
                      {assignment.status === 'submitted' ? '✅ Đã nộp' : '📤 Nộp bài'}
                    </button>
                  </div>
                )}

                {/* Submission Form */}
                {submissionForm === assignment.id && (
                  <div className="submission-form">
                    <h4>📤 Nộp bài tập</h4>
                    <div className="form-group">
                      <label>Chọn tệp để tải lên:</label>
                      <div className="file-upload">
                        <input type="file" multiple />
                        <p>Kéo tệp vào đây hoặc nhấp để chọn</p>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Ghi chú (tùy chọn):</label>
                      <textarea placeholder="Thêm ghi chú cho giáo viên..." rows="3" />
                    </div>
                    <div className="form-actions">
                      <button className="btn-cancel" onClick={() => setSubmissionForm(null)}>
                        Hủy
                      </button>
                      <button className="btn-confirm" onClick={handleConfirmSubmission}>
                        ✅ Xác nhận nộp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
