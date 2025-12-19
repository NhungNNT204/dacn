import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Compass, Map, Sparkles, ChevronRight, CheckCircle2, 
  Lock, ArrowRight, Zap, Award, BarChart3, PenTool, 
  TrendingUp, X, BrainCircuit
} from 'lucide-react';
import './CareerOrientation.css';

// Icon component
const BrainCircuitIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V21" /><path d="M9 18h6" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105V21" />
    <path d="M15 13a2 2 0 0 1 2 2" /><path d="M7 15a2 2 0 0 0 2-2" /><path d="M12 13v4" />
  </svg>
);

export default function CareerOrientation() {
  const navigate = useNavigate();
  const { pathCode } = useParams();
  const [careerPaths, setCareerPaths] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedPathCode, setSelectedPathCode] = useState(pathCode || null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
    if (selectedPathCode) {
      loadRoadmap(selectedPathCode);
    } else {
      loadCareerPaths();
    }
  }, [selectedPathCode]);

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

  const loadCareerPaths = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/career/paths', {
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
        id: 1,
        code: 'ba',
        title: 'Business Analyst (BA)',
        icon: 'BarChart3',
        color: 'indigo',
        matchPercentage: 95,
        description: 'Cầu nối giữa kinh doanh và công nghệ. Phân tích yêu cầu và tối ưu quy trình.',
        marketDemand: 'Rất cao',
        avgSalary: '15M - 45M VNĐ',
        difficulty: 'MODERATE',
        durationMonths: 8
      },
      {
        id: 2,
        code: 'uiux',
        title: 'UI/UX Designer',
        icon: 'PenTool',
        color: 'rose',
        matchPercentage: 88,
        description: 'Kiến tạo trải nghiệm người dùng tinh tế và giao diện ứng dụng hiện đại.',
        marketDemand: 'Cao',
        avgSalary: '12M - 40M VNĐ',
        difficulty: 'MODERATE',
        durationMonths: 6
      },
      {
        id: 3,
        code: 'da',
        title: 'Data Analyst',
        icon: 'TrendingUp',
        color: 'emerald',
        matchPercentage: 72,
        description: 'Khám phá câu chuyện đằng sau các con số để đưa ra quyết định kinh doanh.',
        marketDemand: 'Đang tăng',
        avgSalary: '18M - 50M VNĐ',
        difficulty: 'HARD',
        durationMonths: 7
      }
    ];
    setCareerPaths(mockPaths);
    setIsLoading(false);
  };

  const loadRoadmap = async (code) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/career/roadmap/${code}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setRoadmap(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock roadmap data
    const mockRoadmap = {
      careerPath: careerPaths.find(p => p.code === code) || {
        title: 'Business Analyst (BA)',
        color: 'indigo',
        difficulty: 'MODERATE',
        durationMonths: 8
      },
      overallProgress: 25,
      currentStepIndex: 1,
      currentProgress: 35,
      aiAnalysis: 'Dựa trên các dự án cũ, bạn có khả năng **Tư duy Logic đạt 9.5/10** và kỹ năng **Viết tài liệu sắc bén**. Lộ trình này sẽ giúp bạn thăng tiến nhanh hơn 40% so với lập trình thuần túy.',
      aiRecommendation: 'Tại sao Business Analyst là lựa chọn số 1 của bạn?',
      steps: [
        {
          id: 1,
          orderIndex: 0,
          title: 'Nền tảng nghiệp vụ',
          tasks: ['Khơi gợi yêu cầu (Elicitation)', 'Viết User Stories', 'BPMN 2.0 Cơ bản'],
          rewardXp: 500,
          badge: 'BA Starter',
          status: 'completed'
        },
        {
          id: 2,
          orderIndex: 1,
          title: 'Phân tích & Thiết kế hệ thống',
          tasks: ['Vẽ sơ đồ UML', 'Database Schema Design', 'API Documentation'],
          rewardXp: 800,
          badge: 'System Thinker',
          status: 'active'
        },
        {
          id: 3,
          orderIndex: 2,
          title: 'Quản lý sản phẩm (Product)',
          tasks: ['Backlog Management', 'Agile/Scrum Framework', 'UAT Testing'],
          rewardXp: 1200,
          badge: 'Product Owner',
          status: 'locked'
        },
        {
          id: 4,
          orderIndex: 3,
          title: 'Thực chiến dự án (Internship)',
          tasks: ['Làm việc cùng Dev/QC', 'Xử lý Change Requests', 'Hoàn thiện Portfolio'],
          rewardXp: 2000,
          badge: 'Professional BA',
          status: 'locked'
        }
      ]
    };
    setRoadmap(mockRoadmap);
    setIsLoading(false);
  };

  const handleSelectPath = async (code) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch('http://localhost:8080/api/v1/career/select', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ careerPathCode: code })
        });
      }
    } catch (error) {
      console.log('Failed to save selection');
    }
    
    setSelectedPathCode(code);
    navigate(`/career/${code}`);
  };

  const handleBackToSelection = () => {
    setSelectedPathCode(null);
    setRoadmap(null);
    navigate('/career');
  };

  const getIconComponent = (iconName) => {
    const icons = {
      BarChart3: BarChart3,
      PenTool: PenTool,
      TrendingUp: TrendingUp
    };
    return icons[iconName] || BarChart3;
  };

  const getUserName = () => {
    if (!user || !user.fullName) return 'Nhung';
    const parts = user.fullName.split(' ');
    return parts[parts.length - 1];
  };

  if (isLoading) {
    return <div className="career-loading">Đang tải...</div>;
  }

  return (
    <div className="career-orientation-page">
      {/* Header Section */}
      <div className="career-header">
        <div className="career-header-content">
          <div className="career-header-left">
            <div className="career-title-wrapper">
              <div className="career-icon">
                <Compass size={28} />
              </div>
              <h1>Định hướng sự nghiệp</h1>
            </div>
            <p className="career-subtitle">
              Dựa trên kết quả học tập của <span className="highlight">{getUserName()}</span>, AI đã phân tích các lộ trình tiềm năng nhất giúp bạn đạt được mức lương kỳ vọng.
            </p>
          </div>
          
          <div className="career-header-right">
            <div className="skill-indicator">
              <p className="skill-label">Kỹ năng hiện tại</p>
              <p className="skill-value">Top 5% Student</p>
            </div>
            <div className="trophy-icon">🏆</div>
          </div>
        </div>
      </div>

      <div className="career-container">
        {!selectedPathCode ? (
          /* Career Path Selection */
          <div className="career-selection">
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
                const offset = circumference - (circumference * path.matchPercentage) / 100;
                
                return (
                  <button
                    key={path.id}
                    onClick={() => handleSelectPath(path.code)}
                    className="career-path-card"
                  >
                    {/* Progress Circle */}
                    <div className="path-progress-circle">
                      <svg className="progress-svg" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="4"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          transform="rotate(-90 32 32)"
                        />
                      </svg>
                      <span className="progress-percentage">{path.matchPercentage}%</span>
                    </div>

                    <div className={`path-icon path-icon-${path.color}`}>
                      <IconComponent size={32} />
                    </div>
                    
                    <div className="path-content">
                      <h3>{path.title}</h3>
                      <p>{path.description}</p>
                    </div>

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
                    
                    <div className="path-action">
                      Chi tiết lộ trình <ArrowRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : roadmap ? (
          /* Roadmap Detail */
          <div className="career-roadmap">
            {/* AI Analysis & Progress Cards */}
            <div className="roadmap-header-cards">
              <div className="ai-analysis-card">
                <div className="ai-background-icon">
                  <BrainCircuitIcon size={180} />
                </div>
                <div className="ai-content">
                  <div className="ai-header">
                    <div className="ai-icon-wrapper">
                      <Sparkles size={20} />
                    </div>
                    <span>Phân tích sự phù hợp</span>
                  </div>
                  <h3>
                    Tại sao <span className="career-name">{roadmap.careerPath.title}</span> là lựa chọn số 1 của {getUserName()}?
                  </h3>
                  <p>{roadmap.aiAnalysis}</p>
                  <div className="ai-metrics">
                    <div className="metric-item">
                      <div className="metric-bar metric-bar-green"></div>
                      <div>
                        <p className="metric-label">Độ khó</p>
                        <p className="metric-value">{roadmap.careerPath.difficulty === 'MODERATE' ? 'Vừa phải' : roadmap.careerPath.difficulty}</p>
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-bar metric-bar-amber"></div>
                      <div>
                        <p className="metric-label">Thời gian học</p>
                        <p className="metric-value">{roadmap.careerPath.durationMonths} - {roadmap.careerPath.durationMonths + 2} tháng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-card">
                <div className="progress-header">
                  <p className="progress-label">Tiến độ lộ trình</p>
                  <p className="progress-percentage-large">{roadmap.overallProgress}% Done</p>
                </div>
                <div className="progress-content">
                  <div className="badges-preview">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="badge-icon">🏅</div>
                    ))}
                    <div className="badge-more">+12</div>
                  </div>
                  <button onClick={handleBackToSelection} className="change-goal-btn">
                    Thay đổi mục tiêu
                  </button>
                </div>
              </div>
            </div>

            {/* Knowledge Roadmap */}
            <div className="knowledge-roadmap">
              <h2>
                <Map size={24} />
                Bản đồ kho báu kiến thức
              </h2>
              
              <div className="roadmap-steps">
                <div className="roadmap-connector"></div>
                
                {roadmap.steps.map((step, idx) => (
                  <div key={step.id} className="roadmap-step">
                    <div className="step-milestone">
                      <div className={`milestone-ball milestone-${step.status}`}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 size={36} strokeWidth={3} />
                        ) : step.status === 'active' ? (
                          <Zap size={32} fill="currentColor" />
                        ) : (
                          <Lock size={28} />
                        )}
                      </div>
                      <div className="step-title-wrapper">
                        <h4 className={step.status === 'locked' ? 'locked' : ''}>{step.title}</h4>
                        {step.status === 'active' && (
                          <span className="learning-badge">Đang học</span>
                        )}
                      </div>
                    </div>

                    <div className={`step-card step-${step.status}`}>
                      <div className="step-tasks">
                        {step.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="task-item">
                            <div className={`task-checkbox task-${step.status}`}>
                              <CheckCircle2 size={12} />
                            </div>
                            <p>{task}</p>
                          </div>
                        ))}
                      </div>
                      <div className="step-footer">
                        <div className="step-badge-info">
                          <Award size={14} />
                          <span>{step.badge}</span>
                        </div>
                        <span className="step-xp">+{step.rewardXp} XP</span>
                      </div>
                    </div>

                    {step.status === 'active' && (
                      <button className="explore-step-btn">
                        Khám phá chặng này <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Internship Opportunity */}
            <div className="internship-card">
              <div className="internship-icon">💼</div>
              <div className="internship-content">
                <h3>Cơ hội thực tập dành riêng cho bạn</h3>
                <p>
                  Sau khi hoàn thành <strong>Chặng 2</strong>, UpNest AI sẽ tự động gửi hồ sơ năng lực của bạn đến 5 doanh nghiệp đối tác hàng đầu đang tuyển dụng vị trí <strong>{roadmap.careerPath.title} Intern</strong>.
                </p>
                <button className="view-partners-btn">
                  Xem danh sách doanh nghiệp đối tác <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

