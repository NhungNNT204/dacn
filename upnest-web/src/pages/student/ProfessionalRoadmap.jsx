import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map as MapIcon, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Search,
  Zap,
  BookOpen,
  X,
  ArrowDown,
  Loader2
} from 'lucide-react';
import { generateLearningRoadmap } from '../../services/geminiService';
import './ProfessionalRoadmap.css';

/**
 * Professional Learning Roadmap Component
 * Lấy cảm hứng từ roadmap.sh với tree-style visualization
 */

const BrainCircuitIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V21" /><path d="M9 18h6" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105V21" />
    <path d="M15 13a2 2 0 0 1 2 2" /><path d="M7 15a2 2 0 0 0 2-2" /><path d="M12 13v4" />
  </svg>
);

const FileText = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default function ProfessionalRoadmap() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [user, setUser] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectSuccess, setSelectSuccess] = useState(false);
  const [selectedRoadmapKey, setSelectedRoadmapKey] = useState(null);

  useEffect(() => {
    loadUserData();
    loadRoadmaps();
    loadSelectedRoadmap();
  }, []);

  useEffect(() => {
    if (selectedRoadmap) {
      loadAIRecommendation(selectedRoadmap);
    }
  }, [selectedRoadmap]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      }
    } catch (error) {
      console.log('Using mock user data');
      setUser({ fullName: 'Nguyễn Thị Thùy Nhung', level: 4 });
    }
  };

  const loadSelectedRoadmap = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/learning/professional-roadmap/selected', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.hasSelection && data.code) {
            setSelectedRoadmapKey(data.code);
            // Tự động load roadmap detail nếu đã chọn
            loadRoadmapDetail(data.code);
          }
        }
      }
    } catch (error) {
      console.log('Error loading selected roadmap:', error);
    }
  };

  const loadRoadmaps = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/learning/professional-roadmap', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setRoadmaps(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data fallback
    setRoadmaps([
      {
        title: "Frontend Developer",
        description: "Lộ trình từ con số 0 đến chuyên gia xây dựng giao diện Web hiện đại.",
        match: 92,
        code: "frontend"
      },
      {
        title: "Backend Developer",
        description: "Làm chủ máy chủ, cơ sở dữ liệu và hệ thống API quy mô lớn.",
        match: 95,
        code: "backend"
      }
    ]);
    setIsLoading(false);
  };

  const loadRoadmapDetail = async (roadmapKey) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/learning/professional-roadmap/${roadmapKey}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSelectedRoadmap(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }
    setIsLoading(false);
  };

  const loadAIRecommendation = async (roadmap) => {
    if (!roadmap || !user) return;

    setIsLoadingAI(true);
    try {
      // Tìm milestone đang active
      const activeMilestone = roadmap.sections?.flatMap(s => s.milestones || [])
        .find(m => m.status === 'active');

      if (activeMilestone) {
        const aiData = await generateLearningRoadmap({
          careerPath: roadmap.title,
          pathCode: roadmap.code,
          userInfo: {
            fullName: user.fullName || 'Nguyễn Thị Thùy Nhung',
            level: user.level || 4,
            skills: []
          },
          stepIndex: roadmap.sections?.flatMap(s => s.milestones || []).indexOf(activeMilestone) || 0,
          currentStep: activeMilestone
        });

        setAiRecommendation({
          focus: aiData.stepTitle || activeMilestone.title,
          message: aiData.description || `Hãy tập trung vào ${activeMilestone.title}`,
          potential: "Cao (Top 5%)",
          estimatedCompletion: calculateEstimatedDate(aiData.estimatedDuration)
        });
      }
    } catch (error) {
      console.error('Error loading AI recommendation:', error);
      setAiRecommendation({
        focus: "JavaScript Advanced",
        message: "Dựa trên dữ liệu học tập, bạn đã nắm chắc HTML/CSS. Hãy dành 14 ngày tới để làm chủ Async/Await và ES6 Classes trước khi tiến tới React.",
        potential: "Cao (Top 5%)",
        estimatedCompletion: "20/01/2025"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const calculateEstimatedDate = (duration) => {
    const days = duration ? parseInt(duration.match(/\d+/)?.[0] || '14') * 7 : 14;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('vi-VN');
  };

  const getUserName = () => {
    if (!user || !user.fullName) return 'Nhung';
    const parts = user.fullName.split(' ');
    return parts[parts.length - 1];
  };

  const handleSelectRoadmap = async () => {
    if (!selectedRoadmap || !selectedRoadmap.code) return;

    setIsSelecting(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/learning/professional-roadmap/select', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            roadmapKey: selectedRoadmap.code
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setSelectSuccess(true);
          setSelectedRoadmapKey(selectedRoadmap.code);
          // Hiển thị toast success
          setTimeout(() => setSelectSuccess(false), 3000);
          // Có thể thêm toast notification đẹp hơn
        } else {
          alert(data.message || 'Có lỗi xảy ra khi chọn lộ trình');
        }
      }
    } catch (error) {
      console.error('Error selecting roadmap:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSelecting(false);
    }
  };

  const filteredRoadmaps = useMemo(() => {
    if (!searchTerm) return roadmaps;
    return roadmaps.filter(roadmap =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roadmaps, searchTerm]);

  if (isLoading) {
    return <div className="roadmap-loading">Đang tải...</div>;
  }

  return (
    <div className="professional-roadmap-page">
      {/* Header */}
      <header className="roadmap-header">
        <div className="roadmap-header-content">
          <div className="roadmap-header-left">
            <div className="roadmap-title-wrapper">
              <div className="roadmap-icon">
                <Compass size={28} strokeWidth={2.5} />
              </div>
              <h1>Lộ trình học tập</h1>
            </div>
            <p className="roadmap-subtitle">
              Dữ liệu chuẩn từ <span className="roadmap-link">roadmap.sh</span> phối hợp cùng trí tuệ nhân tạo UpNest.
            </p>
          </div>

          {/* Search Box */}
          <div className="roadmap-search-wrapper">
            <div className="roadmap-search-box">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Tìm lộ trình (Frontend, DevOps...)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="roadmap-container">
        {/* TRẠNG THÁI 1: CHỌN LỘ TRÌNH */}
        {!selectedRoadmap ? (
          <div className="roadmap-selection-grid">
            {filteredRoadmaps.map((roadmap) => (
              <button 
                key={roadmap.code}
                onClick={() => loadRoadmapDetail(roadmap.code)}
                className={`roadmap-card ${selectedRoadmapKey === roadmap.code ? 'selected-roadmap' : ''}`}
              >
                {selectedRoadmapKey === roadmap.code && (
                  <div className="roadmap-selected-badge">
                    <CheckCircle2 size={16} />
                    <span>Đã chọn</span>
                  </div>
                )}
                <div className="roadmap-card-progress">
                  <div className="progress-circle">
                    <span>{roadmap.match}%</span>
                  </div>
                </div>
                <div className="roadmap-card-icon">
                  {roadmap.code === 'frontend' ? '🎨' : roadmap.code === 'backend' ? '⚙️' : '📊'}
                </div>
                <div className="roadmap-card-content">
                  <h3>{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                </div>
                <div className="roadmap-card-action">
                  {selectedRoadmapKey === roadmap.code ? (
                    <>Xem lộ trình của tôi <CheckCircle2 size={16} /></>
                  ) : (
                    <>Khám phá bản đồ <ArrowRight size={16} /></>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI 2: CHI TIẾT BẢN ĐỒ */
          <div className="roadmap-detail">
            {/* Controls */}
            <div className="roadmap-controls">
              <button 
                onClick={() => {
                  setSelectedRoadmap(null);
                  setActiveMilestone(null);
                  setAiRecommendation(null);
                  setSelectSuccess(false);
                }}
                className="back-button"
              >
                <X size={16} /> Quay lại danh sách
              </button>
              <div className="roadmap-controls-right">
                <div className="progress-display">
                  <span>Tiến độ của bạn</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${selectedRoadmap.overallProgress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={handleSelectRoadmap}
                  disabled={isSelecting || selectSuccess || selectedRoadmapKey === selectedRoadmap.code}
                  className={`select-roadmap-btn ${selectSuccess ? 'success' : ''} ${selectedRoadmapKey === selectedRoadmap.code ? 'selected' : ''}`}
                >
                  {isSelecting ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Đang lưu...
                    </>
                  ) : selectSuccess || selectedRoadmapKey === selectedRoadmap.code ? (
                    <>
                      <CheckCircle2 size={18} />
                      Đã chọn lộ trình này
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Chọn lộ trình này
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="roadmap-detail-grid">
              {/* ROADMAP TREE */}
              <div className="roadmap-tree">
                {selectedRoadmap.sections?.map((section, sIdx) => (
                  <div key={sIdx} className="roadmap-section">
                    <div className="section-header">
                      <h4>{section.level}</h4>
                      <div className="section-divider"></div>
                    </div>

                    <div className="milestones-container">
                      {section.milestones?.map((milestone, mIdx) => (
                        <div key={milestone.id} className="milestone-wrapper">
                          {/* Milestone Node */}
                          <button 
                            onClick={() => setActiveMilestone(
                              activeMilestone?.id === milestone.id ? null : milestone
                            )}
                            className={`milestone-node milestone-${milestone.status}`}
                          >
                            <div className="milestone-content">
                              <div className={`milestone-icon milestone-icon-${milestone.status}`}>
                                {milestone.status === 'completed' ? (
                                  <CheckCircle2 size={24} />
                                ) : milestone.status === 'active' ? (
                                  <Zap size={24} />
                                ) : (
                                  <Lock size={20} />
                                )}
                              </div>
                              <div className="milestone-info">
                                <p className="milestone-title">{milestone.title}</p>
                                <p className="milestone-subtitle">
                                  {milestone.topics?.length || 0} Chủ đề chính
                                </p>
                              </div>
                            </div>
                            <ChevronRight 
                              size={20} 
                              className={`milestone-arrow ${activeMilestone?.id === milestone.id ? 'rotated' : ''}`}
                            />
                          </button>

                          {/* Connector Line */}
                          {mIdx < section.milestones.length - 1 && (
                            <div className="milestone-connector"></div>
                          )}

                          {/* Sub-topics */}
                          {activeMilestone?.id === milestone.id && milestone.topics && (
                            <div className="sub-topics-list">
                              {milestone.topics.map((topic, tIdx) => (
                                <div key={tIdx} className="sub-topic-item">
                                  <span>{topic}</span>
                                  <ArrowRight size={14} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Section Connector */}
                    {sIdx < selectedRoadmap.sections.length - 1 && (
                      <div className="section-connector">
                        <div className="connector-line"></div>
                        <ArrowDown size={20} />
                        <div className="connector-line"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="roadmap-sidebar">
                {/* AI Recommendation Card */}
                <div className="ai-card">
                  <div className="ai-card-background">
                    <BrainCircuitIcon size={150} />
                  </div>
                  <div className="ai-card-content">
                    <div className="ai-card-header">
                      <Sparkles size={24} />
                      <span>AI Tư vấn Lộ trình</span>
                    </div>
                    {isLoadingAI ? (
                      <div className="ai-loading">Đang tải...</div>
                    ) : aiRecommendation ? (
                      <>
                        <h4>
                          Tập trung vào <br/>
                          <span className="ai-focus">{aiRecommendation.focus}</span>
                        </h4>
                        <p>{aiRecommendation.message}</p>
                        <div className="ai-metrics">
                          <div className="ai-metric">
                            <p className="metric-label">Tiềm năng</p>
                            <p className="metric-value">{aiRecommendation.potential}</p>
                          </div>
                          <div className="ai-metric">
                            <p className="metric-label">Dự kiến xong</p>
                            <p className="metric-value">{aiRecommendation.estimatedCompletion}</p>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Resources Card */}
                <div className="resources-card">
                  <h3>
                    <BookOpen size={18} />
                    Tài liệu đề xuất
                  </h3>
                  <div className="resources-list">
                    {[
                      { title: "MDN JavaScript Guide", type: "blue" },
                      { title: "Clean Code Handbook", type: "emerald" },
                      { title: "React Security Best Practices", type: "rose" }
                    ].map((res, i) => (
                      <div key={i} className="resource-item">
                        <div className={`resource-icon resource-icon-${res.type}`}>
                          <FileText size={16}/>
                        </div>
                        <p>{res.title}</p>
                        <ArrowRight size={14} />
                      </div>
                    ))}
                  </div>
                  <button className="view-library-btn">
                    Xem kho thư viện →
                  </button>
                </div>

                {/* Career Connect Card */}
                <div className="career-connect-card">
                  <div className="career-icon">💼</div>
                  <div className="career-content">
                    <h4>Kết nối doanh nghiệp</h4>
                    <p>
                      Hoàn thành thêm 2 cột mốc để mở khóa tính năng gửi CV tự động tới các đối tác của UpNest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {selectSuccess && (
        <div className="roadmap-toast-success">
          <div className="toast-content">
            <CheckCircle2 size={24} className="toast-icon" />
            <div className="toast-message">
              <strong>Thành công!</strong>
              <p>Đã chọn lộ trình {selectedRoadmap?.title} làm lộ trình học tập của bạn</p>
            </div>
            <button 
              className="toast-close-btn"
              onClick={() => setSelectSuccess(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

