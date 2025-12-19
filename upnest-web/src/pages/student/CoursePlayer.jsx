import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Settings, Bell, CheckCircle2, Heart, Share2,
  ChevronRight, MessageSquare, StickyNote, Send
} from 'lucide-react';
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
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      durationSeconds: 765, // 12:45
      content: `<h2>CHƯƠNG 1: GIỚI THIỆU VỀ ALGORITH</h2>
        <p>Trong nội dung bài học này, chúng ta sẽ cùng đi sâu vào tìm hiểu về các khái niệm nền tảng trong chuyên mục Lập trình.</p>
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

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/courses/${courseId}/lessons/${playerData.currentLesson.id}/comments`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentContent })
          }
        );
        if (response.ok) {
          setCommentContent('');
          loadCourseData(); // Reload comments
        }
      }
    } catch (error) {
      console.log('Error posting comment');
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

