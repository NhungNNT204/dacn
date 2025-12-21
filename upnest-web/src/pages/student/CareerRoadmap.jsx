import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Compass, Target, Map, Sparkles, ChevronRight, CheckCircle2, 
  Lock, ArrowRight, Trophy, Star, TrendingUp, Users, Code2, 
  BarChart3, PenTool, Search, Zap, Award, Globe, Briefcase
} from 'lucide-react';
import './CareerRoadmap.css';

// Icon component
const BrainCircuit = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V21" /><path d="M9 18h6" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105V21" />
    <path d="M15 13a2 2 0 0 1 2 2" /><path d="M7 15a2 2 0 0 0 2-2" /><path d="M12 13v4" />
  </svg>
);

export default function CareerRoadmap() {
  const navigate = useNavigate();
  const { pathId } = useParams();
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userStats, setUserStats] = useState({ skillLevel: 'Top 5% Student', progress: 25 });

  useEffect(() => {
    loadCareerPaths();
    if (pathId) {
      loadRoadmapDetail(pathId);
    }
  }, [pathId]);

  const loadCareerPaths = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/career-paths', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCareerPaths(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockPaths = [
      {
        id: 'ba',
        title: "Business Analyst (BA)",
        icon: 'BarChart3',
        color: "indigo",
        match: 95,
        description: "Cầu nối giữa kinh doanh và công nghệ. Phân tích yêu cầu và tối ưu quy trình.",
        marketDemand: "Rất cao",
        avgSalary: "15M - 45M VNĐ"
      },
      {
        id: 'uiux',
        title: "UI/UX Designer",
        icon: 'PenTool',
        color: "rose",
        match: 88,
        description: "Kiến tạo trải nghiệm người dùng tinh tế và giao diện ứng dụng hiện đại.",
        marketDemand: "Cao",
        avgSalary: "12M - 40M VNĐ"
      },
      {
        id: 'da',
        title: "Data Analyst",
        icon: 'TrendingUp',
        color: "emerald",
        match: 72,
        description: "Khám phá câu cnhungện đằng sau các con số để đưa ra quyết định kinh doanh.",
        marketDemand: "Đang tăng",
        avgSalary: "18M - 50M VNĐ"
      }
    ];
    setCareerPaths(mockPaths);
    setIsLoading(false);
  };

  const loadRoadmapDetail = async (pathId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/career-paths/${pathId}/roadmap`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSelectedPath(data.path);
          setRoadmapSteps(data.steps);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data for BA roadmap
    const mockSteps = [
      {
        id: 1,
        title: "Nền tảng nghiệp vụ",
        status: "completed",
        tasks: ["Khơi gợi yêu cầu (Elicitation)", "Viết User Stories", "BPMN 2.0 Cơ bản"],
        xp: 500,
        badge: "BA Starter"
      },
      {
        id: 2,
        title: "Phân tích & Thiết kế hệ thống",
        status: "active",
        tasks: ["Vẽ sơ đồ UML", "Database Schema Design", "API Documentation"],
        xp: 800,
        badge: "System Thinker"
      },
      {
        id: 3,
        title: "Quản lý sản phẩm (Product)",
        status: "locked",
        tasks: ["Backlog Management", "Agile/Scrum Framework", "UAT Testing"],
        xp: 1200,
        badge: "Product Owner"
      },
      {
        id: 4,
        title: "Thực chiến dự án (Internship)",
        status: "locked",
        tasks: ["Làm việc cùng Dev/QC", "Xử lý Change Requests", "Hoàn thiện Portfolio"],
        xp: 2000,
        badge: "Professional BA"
      }
    ];

    const mockPath = careerPaths.find(p => p.id === pathId) || {
      id: 'ba',
      title: "Business Analyst (BA)",
      color: "indigo",
      match: 95
    };

    setSelectedPath(mockPath);
    setRoadmapSteps(mockSteps);
    setIsLoading(false);
  };

  const handleSelectPath = (pathId) => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/career-roadmap/${pathId}`);
    }, 400);
  };

  const handleBackToSelection = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/career-roadmap');
      setSelectedPath(null);
      setRoadmapSteps([]);
    }, 400);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      BarChart3: BarChart3,
      PenTool: PenTool,
      TrendingUp: TrendingUp
    };
    return icons[iconName] || BarChart3;
  };

  if (isLoading) {
    return <div className="career-roadmap-loading">Đang tải...</div>;
  }

  return (
    <div className="career-roadmap-page">
      {/* Header Section */}
      <div className="career-roadmap-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-title-wrapper">
              <div className="header-icon">
                <Compass size={28} />
              </div>
              <h1>Định hướng sự nghiệp</h1>
            </div>
            <p className="header-description">
              Dựa trên kết quả học tập của <span>Nhung</span>, AI đã phân tích các lộ trình tiềm năng nhất giúp bạn đạt được mức lương kỳ vọng.
            </p>
          </div>
          
          <div className="header-right">
            <div className="skill-indicator">
              <p className="skill-label">Kỹ năng hiện tại</p>
              <p className="skill-value">{userStats.skillLevel}</p>
            </div>
            <div className="skill-icon">🏆</div>
          </div>
        </div>
      </div>

      <div className="career-roadmap-container">
        {!selectedPath && !pathId ? (
          /* Selection View */
          <div className={`selection-view ${isAnimating ? 'fade-out' : ''}`}>
            <div className="selection-header">
              <h2>Lựa chọn đích đến của bạn</h2>
              <div className="ai-badge">
                <Sparkles size={14} />
                AI Recommendation Enabled
              </div>
            </div>

            <div className="career-paths-grid">
              {careerPaths.map((path) => {
                const IconComponent = getIconComponent(path.icon);
                const circumference = 2 * Math.PI * 28;
                const strokeDashoffset = circumference - (circumference * path.match) / 100;

                return (
                  <button
                    key={path.id}
                    onClick={() => handleSelectPath(path.id)}
                    className="career-path-card"
                  >
                    {/* Progress Circle */}
                    <div className="progress-circle">
                      <svg className="progress-svg" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          className="progress-bg"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          className="progress-bar"
                          style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset
                          }}
                        />
                      </svg>
                      <span className="progress-text">{path.match}%</span>
                    </div>

                    {/* Icon */}
                    <div className={`path-icon path-icon-${path.color}`}>
                      <IconComponent size={32} />
                    </div>

                    {/* Content */}
                    <div className="path-content">
                      <h3>{path.title}</h3>
                      <p>{path.description}</p>
                    </div>

                    {/* Info Boxes */}
                    <div className="path-info">
                      <div className="info-box">
                        <p className="info-label">Nhu cầu</p>
                        <p className="info-value">{path.marketDemand}</p>
                      </div>
                      <div className="info-box">
                        <p className="info-label">Thu nhập</p>
                        <p className="info-value">{path.avgSalary}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="path-cta">
                      Chi tiết lộ trình <ArrowRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Roadmap Detail View */
          <div className={`roadmap-detail-view ${isAnimating ? 'fade-out' : ''}`}>
            {/* AI Analysis Card + Progress Widget */}
            <div className="roadmap-dashboard">
              {/* AI Motivation Card */}
              <div className="ai-analysis-card">
                <div className="ai-background-icon">
                  <BrainCircuit size={180} />
                </div>
                <div className="ai-content">
                  <div className="ai-header">
                    <div className="ai-icon-wrapper">
                      <Sparkles size={20} />
                    </div>
                    <span>Phân tích sự phù hợp</span>
                  </div>
                  <h3>
                    Tại sao <span>{selectedPath?.title}</span> là lựa chọn số 1 của Nhung?
                  </h3>
                  <p>
                    Dựa trên các dự án cũ, bạn có khả năng <strong>Tư duy Logic đạt 9.5/10</strong> và kỹ năng <strong>Viết tài liệu sắc bén</strong>. Lộ trình này sẽ giúp bạn thăng tiến nhanh hơn 40% so với lập trình thuần túy.
                  </p>
                  <div className="ai-metrics">
                    <div className="ai-metric">
                      <div className="metric-indicator metric-difficulty"></div>
                      <div>
                        <p className="metric-label">Độ khó</p>
                        <p className="metric-value">Vừa phải</p>
                      </div>
                    </div>
                    <div className="ai-metric">
                      <div className="metric-indicator metric-duration"></div>
                      <div>
                        <p className="metric-label">Thời gian học</p>
                        <p className="metric-value">6 - 8 tháng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Widget */}
              <div className="progress-widget">
                <div className="widget-header">
                  <p className="widget-label">Tiến độ lộ trình</p>
                  <p className="widget-progress">{userStats.progress}% Done</p>
                </div>
                <div className="widget-content">
                  <div className="achievement-badges">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="achievement-badge">🏅</div>
                    ))}
                    <div className="achievement-badge achievement-more">+12</div>
                  </div>
                  <button onClick={handleBackToSelection} className="change-goal-btn">
                    Thay đổi mục tiêu
                  </button>
                </div>
              </div>
            </div>

            {/* Roadmap Timeline */}
            <div className="roadmap-timeline-section">
              <h2 className="timeline-title">
                <Map size={24} />
                Bản đồ kho báu kiến thức
              </h2>

              <div className="roadmap-timeline">
                {roadmapSteps.map((step, idx) => (
                  <div key={step.id} className="roadmap-step">
                    {/* Milestone Ball */}
                    <div className="milestone-wrapper">
                      <div className={`milestone-ball milestone-${step.status}`}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 size={36} strokeWidth={3} />
                        ) : step.status === 'active' ? (
                          <Zap size={32} fill="currentColor" />
                        ) : (
                          <Lock size={28} />
                        )}
                      </div>
                      <div className="milestone-label">
                        <h4 className={step.status === 'locked' ? 'locked' : ''}>{step.title}</h4>
                        {step.status === 'active' && (
                          <span className="active-badge">Đang học</span>
                        )}
                      </div>
                    </div>

                    {/* Task Card */}
                    <div className={`task-card ${step.status === 'locked' ? 'locked' : ''}`}>
                      <div className="task-list">
                        {step.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="task-item">
                            <div className={`task-checkbox ${step.status === 'completed' ? 'completed' : ''}`}>
                              <CheckCircle2 size={12} />
                            </div>
                            <p>{task}</p>
                          </div>
                        ))}
                      </div>
                      <div className="task-footer">
                        <div className="task-badge">
                          <Award size={14} />
                          <span>{step.badge}</span>
                        </div>
                        <span className="task-xp">+{step.xp} XP</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {step.status === 'active' && (
                      <button className="explore-btn">
                        Khám phá chặng này <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Internship Opportunity Card */}
            <div className="internship-card">
              <div className="internship-icon">💼</div>
              <div className="internship-content">
                <h3>Cơ hội thực tập dành riêng cho bạn</h3>
                <p>
                  Sau khi hoàn thành <strong>Chặng 2</strong>, UpNest AI sẽ tự động gửi hồ sơ năng lực của bạn đến 5 doanh nghiệp đối tác hàng đầu đang tuyển dụng vị trí <strong>Business Analyst Intern</strong>.
                </p>
                <button className="partner-link">
                  Xem danh sách doanh nghiệp đối tác <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

