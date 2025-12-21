import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Settings, Bell, CheckCircle2, Heart, Share2,
  ChevronRight, MessageSquare, StickyNote, Send, Download, FileText
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './CoursePlayer.css';

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('discussion'); // 'discussion' or 'notes'
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadCourseData();
  }, [courseId, lessonId]);

  const loadCourseData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const url = lessonId 
          ? `http://localhost:8080/api/v1/courses/${courseId}/play?lessonId=${lessonId}`
          : `http://localhost:8080/api/v1/courses/${courseId}/play`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPlayerData(data);
          setNoteContent(data.note?.content || '');
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockData = getMockData();
    setPlayerData(mockData);
    setNoteContent(mockData.note?.content || '');
    setIsLoading(false);
  };

  const getMockData = () => ({
    course: {
      id: courseId || 1,
      title: 'Video Series: Làm chủ Spring Boot trong 30 ngày',
      category: 'BACKEND'
    },
    currentLesson: {
      id: lessonId || 1,
      title: 'Setup môi trường Development',
      description: 'Học cách setup môi trường phát triển cho Spring Boot',
      lessonType: 'VIDEO',
      videoUrl: 'https://youtu.be/N4wGWY1w9RU',
      youtubeId: 'N4wGWY1w9RU',
      durationSeconds: 765, // 12:45
      content: `<h2>CHƯƠNG 1: GIỚI THIỆU VỀ ALGORITH</h2>
        <p>Trong nội dung bài học này, chúng ta sẽ cùng đi sâu vào tìm hiểu về các khái niệm nền tảng trong cnhungên mục Lập trình.</p>
        <blockquote>"Kiến thức không tự nhiên sinh ra, nó được đúc kết từ quá trình rèn luyện và nghiên cứu không ngừng nghỉ."</blockquote>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
      isCompleted: false
    },
    lessons: [
      { id: 1, title: 'Setup môi trường Development', durationSeconds: 765, isCompleted: false },
      { id: 2, title: 'Cấu trúc thư mục Spring Boot', durationSeconds: 765, isCompleted: false },
      { id: 3, title: 'Kết nối Database MySQL', durationSeconds: 765, isCompleted: false },
      { id: 4, title: 'Bảo mật với JWT Token', durationSeconds: 765, isCompleted: false }
    ],
    overallProgress: 25,
    comments: [
      {
        id: 1,
        userName: 'Anh Tuấn',
        content: 'Bài giảng rất chi tiết ạ, em thắc mắc về phần deploy...',
        timeAgo: '2 GIỜ TRƯỚC',
        likeCount: 5
      },
      {
        id: 2,
        userName: 'Thùy Linh',
        content: 'Tài liệu rất hay, cảm ơn cô Minh Thư!',
        timeAgo: 'HÔM QUA',
        likeCount: 3
      }
    ],
    commentCount: 12,
    note: null
  });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    const commentToSend = commentContent.trim();
    
    // Add comment immediately to UI (optimistic update)
    const newComment = {
      id: Date.now(),
      userName: 'Bạn', // TODO: Get from user context
      content: commentToSend,
      timeAgo: 'VỪA XONG',
      likeCount: 0
    };

    setPlayerData(prev => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])],
      commentCount: (prev.commentCount || 0) + 1
    }));
    setCommentContent('');

    // Then save to backend
    try {
      const token = localStorage.getItem('accessToken');
      if (token && playerData?.currentLesson?.id) {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/${courseId}/lessons/${playerData.currentLesson.id}/comments`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentToSend })
          }
        );
        if (response.ok) {
          // Reload to get server response with proper ID
          loadCourseData();
        }
      }
    } catch (error) {
      console.log('Error posting comment, but comment is shown in UI');
    }
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/${courseId}/lessons/${playerData.currentLesson.id}/notes`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: noteContent })
          }
        );
        if (response.ok) {
          // Show success message
        }
      }
    } catch (error) {
      console.log('Error saving note');
    }
  };

  const handleDownloadNote = (format = 'pdf') => {
    if (!noteContent.trim()) {
      alert('Không có ghi chú để tải xuống!');
      return;
    }

    const lessonTitle = playerData?.currentLesson?.title || 'Ghi chú';
    const courseTitle = playerData?.course?.title || 'Khóa học';
    const fileName = `${courseTitle}_${lessonTitle}_GhiChu`.replace(/[^a-z0-9]/gi, '_');

    if (format === 'pdf') {
      // Export to PDF using html2pdf
      const element = document.createElement('div');
      element.style.padding = '40px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.innerHTML = `
        <h1 style="color: #6366f1; margin-bottom: 20px;">${courseTitle}</h1>
        <h2 style="color: #1e293b; margin-bottom: 16px;">${lessonTitle}</h2>
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
          <h3 style="color: #475569; margin-bottom: 12px;">Ghi chú của tôi:</h3>
          <div style="white-space: pre-wrap; line-height: 1.8; color: #1f2937;">${noteContent}</div>
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
          Xuất từ UPNEST.EDU - ${new Date().toLocaleDateString('vi-VN')}
        </div>
      `;

      // Use html2pdf
      try {
        html2pdf().set({
          margin: [10, 10, 10, 10],
          filename: `${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
      } catch (error) {
        // Fallback: Open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #6366f1; }
                h2 { color: #1e293b; }
                pre { white-space: pre-wrap; line-height: 1.8; }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else if (format === 'docx') {
      // Export to Word (DOCX) - simple text format
      const content = `
KHÓA HỌC: ${courseTitle}
BÀI HỌC: ${lessonTitle}

GHI CHÚ CỦA TÔI:
${noteContent}

---
Xuất từ UPNEST.EDU - ${new Date().toLocaleDateString('vi-VN')}
      `.trim();

      const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/${courseId}/lessons/${playerData.currentLesson.id}/complete`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (response.ok) {
          loadCourseData(); // Reload to update progress
        }
      }
    } catch (error) {
      console.log('Error completing lesson');
    }
  };

  const handleLessonClick = (lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  if (isLoading || !playerData) {
    return <div className="course-player-loading">Đang tải...</div>;
  }

  const currentLesson = playerData.currentLesson;
  const isVideoLesson = currentLesson.lessonType === 'VIDEO';

  return (
    <div className="course-player">
      {/* Header */}
      <div className="course-player-header">
        <div className="header-left">
          <div className="course-title-row">
            <span className="course-title">{playerData.course.title}</span>
          </div>
          <div className="course-meta">
            <span className="course-category">{playerData.course.category}</span>
            <span className="separator">-</span>
            <span className="course-chapter">CHƯƠNG 1</span>
          </div>
        </div>
        <div className="header-right">
          <button className="complete-btn" onClick={handleCompleteLesson}>
            <CheckCircle2 size={18} />
            HOÀN THÀNH PHẦN NÀY
          </button>
          <button className="icon-btn">
            <Settings size={20} />
          </button>
          <button className="icon-btn">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="course-player-content">
        {/* Main Content Area */}
        <div className="player-main">
          {/* Video Player */}
          {isVideoLesson && currentLesson.videoUrl ? (
            <div className="video-player-wrapper">
              {currentLesson.youtubeId ? (
                <iframe
                  className="video-player youtube-embed"
                  src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0&modestbranding=1`}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={currentLesson.videoUrl}
                    className="video-player"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={handlePlayPause}
                  />
                  <div className="video-overlay" onClick={handlePlayPause}>
                    {!isPlaying && (
                      <div className="play-button-large">
                        <Play size={64} fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="video-controls">
                    <button className="control-btn" onClick={handlePlayPause}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <span className="time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="document-viewer">
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            </div>
          )}

          {/* Tabs and Interaction */}
          <div className="player-interaction">
            <div className="interaction-tabs">
              <button
                className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
                onClick={() => setActiveTab('discussion')}
              >
                <MessageSquare size={16} />
                THẢO LUẬN ({playerData.commentCount || 0})
              </button>
              <button
                className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <StickyNote size={16} />
                GHI CHÚ CỦA TÔI
              </button>
              <div className="interaction-icons">
                <button className="icon-btn-small">
                  <Heart size={18} />
                </button>
                <button className="icon-btn-small">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Discussion Tab */}
            {activeTab === 'discussion' && (
              <div className="discussion-section">
                <div className="comment-input-wrapper">
                  <div className="comment-input-icon">H</div>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Đặt câu hỏi về nội dung bài học này..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <button className="comment-send-btn" onClick={handleSubmitComment}>
                    <Send size={18} />
                  </button>
                </div>

                <div className="comments-list">
                  {playerData.comments?.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.userName}</span>
                          <span className="comment-time">{comment.timeAgo}</span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="notes-section">
                <div className="notes-header">
                  <h3 className="notes-title">Ghi chú của tôi</h3>
                  <div className="notes-actions">
                    <button 
                      className="download-btn" 
                      onClick={() => handleDownloadNote('pdf')}
                      title="Tải về PDF"
                    >
                      <FileText size={16} />
                      PDF
                    </button>
                    <button 
                      className="download-btn" 
                      onClick={() => handleDownloadNote('docx')}
                      title="Tải về Word"
                    >
                      <Download size={16} />
                      Word
                    </button>
                  </div>
                </div>
                <textarea
                  className="notes-textarea"
                  placeholder="Viết ghi chú của bạn tại đây..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onBlur={handleSaveNote}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="player-sidebar">
          <h3 className="sidebar-title">NỘI DUNG HỌC TẬP</h3>
          
          <div className="lessons-list">
            {playerData.lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className={`lesson-item ${lesson.id === currentLesson.id ? 'active' : ''} ${lesson.isCompleted ? 'completed' : ''}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="lesson-info">
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-duration">{formatTime(lesson.durationSeconds || 0)}</span>
                </div>
                {lesson.isCompleted && (
                  <CheckCircle2 size={16} className="lesson-check-icon" />
                )}
              </div>
            ))}
          </div>

          <div className="progress-section">
            <div className="progress-label">TIẾN ĐỘ BÀI HỌC</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${playerData.overallProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

