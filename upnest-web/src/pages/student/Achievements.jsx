import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, MapPin, Mail, Phone, UserCheck, GraduationCap,
  Layers, BarChart3, Sparkles, CheckCircle2, ExternalLink,
  Printer, ShieldCheck
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './Achievements.css';

// Icon component
const BrainCircuit = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V21" /><path d="M9 18h6" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105V21" />
    <path d="M15 13a2 2 0 0 1 2 2" /><path d="M7 15a2 2 0 0 0 2-2" /><path d="M12 13v4" />
  </svg>
);

export default function Achievements() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/profile/achievements', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockData = {
      userId: 1,
      fullName: "Nguyễn Thị Thùy Nhung",
      email: "thuynhung204@upnest.edu",
      avatarUrl: "https://ui-avatars.com/api/?name=Nhung&background=4f46e5&color=fff&size=512",
      jobTitle: "Intern UI/UX Designer & Business Analyst",
      summary: "Một sinh viên năm cuối chuyên ngành Hệ thống thông tin quản lý với niềm đam mê sâu sắc trong việc thu hẹp khoảng cách giữa nhu cầu kinh doanh và giải pháp công nghệ. Tôi sở hữu kỹ năng phân tích nghiệp vụ sắc bén kết hợp với tư duy thiết kế tập trung vào trải nghiệm người dùng.",
      location: "TP. Hồ Chí Minh, Việt Nam",
      phone: "090 123 4567",
      githubUrl: "github.com/thuynhung204-portfolio",
      linkedinUrl: "linkedin.com/in/thuynhung204",
      level: 4,
      totalXp: 1450,
      streak: 12,
      skills: [
        { name: "Business Requirement Analysis & User Story", level: 90 },
        { name: "UI/UX Design (Figma / Adobe XD)", level: 85 },
        { name: "Data Visualization (Power BI / Tableau)", level: 75 },
        { name: "Process Modeling (BPMN / UML)", level: 80 }
      ],
      certifications: [
        {
          id: 1,
          issuer: "Học viện Công nghệ UpNest",
          name: "Chứng chỉ Chuyên gia Business Analysis & UI/UX",
          issueDate: "2024 - Hiện tại",
          grade: "Xuất sắc",
          score: "9.5/10"
        },
        {
          id: 2,
          issuer: "Đại học Công nghệ Thông tin",
          name: "Cử nhân Hệ thống Thông tin Quản lý",
          issueDate: "2021 - 2025",
          grade: "Giỏi",
          score: "GPA: 3.7/4.0"
        }
      ],
      projects: [
        {
          name: "Hệ thống Quản lý Giáo dục UpNest",
          role: "UI/UX Designer & BA Intern",
          description: "Thực hiện khảo sát người dùng, xây dựng bộ Requirement và thiết kế High-fidelity Prototype cho Dashboard học tập với hơn 1000 người dùng.",
          technologies: ["Figma", "User Research", "BPMN 2.0"]
        },
        {
          name: "Phân tích dữ liệu hành vi người tiêu dùng",
          role: "Data Analyst Assistant",
          description: "Trực quan hóa dữ liệu từ 50.000 giao dịch để tìm ra xu hướng mua sắm theo mùa, hỗ trợ đội ngũ Marketing tối ưu hóa chiến dịch.",
          technologies: ["SQL", "Power BI", "Excel Advanced"]
        }
      ],
      aiAnalysis: "Thùy Nhung sở hữu khả năng phân tích nghiệp vụ sắc bén Top 5% học viên xuất sắc mảng BA/UI năm 2024.",
      aiRecommendation: "Hồ sơ này thể hiện sự nhạy bén vượt trội trong việc phân tích yêu cầu kinh doanh phức tạp và chuyển đổi chúng thành các thiết kế giao diện trực quan. Đề xuất: Phù hợp cho vị trí Associate Product Owner hoặc UX Lead."
    };
    setProfileData(mockData);
    setIsLoading(false);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('cv-content');
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${profileData.fullName.replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading || !profileData) {
    return <div className="achievements-loading">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="achievements-page">
      {/* Navigation Bar */}
      <nav className="achievements-nav">
        <div className="nav-left">
          <div className="nav-icon">
            <ShieldCheck size={24} />
            <span>2</span>
          </div>
          <h2>HỒ SƠ NĂNG LỰC SỐ</h2>
        </div>
        <button className="export-pdf-btn" onClick={handleExportPDF}>
          <Printer size={18} />
          XUẤT BẢN CV (PDF)
        </button>
      </nav>

      <div id="cv-content" className="cv-container">
        {/* Header Section */}
        <header className="cv-header">
          <div className="header-background"></div>
          <div className="header-content">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <img 
                  src={profileData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName)}&background=4f46e5&color=fff&size=512`}
                  alt={profileData.fullName}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName)}&background=4f46e5&color=fff&size=512`;
                  }}
                />
              </div>
              <div className="online-indicator"></div>
            </div>
            <div className="profile-info">
              <h1>{profileData.fullName}</h1>
              <p className="job-title">{profileData.jobTitle}</p>
              <div className="contact-info">
                <span><MapPin size={18} /> {profileData.location}</span>
                <span><Mail size={18} /> {profileData.email}</span>
                <span><Phone size={18} /> {profileData.phone}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - 2 Columns */}
        <div className="cv-main-content">
          {/* Left Column */}
          <aside className="cv-left-column">
            {/* About Me */}
            <div className="content-card about-section">
              <h3>
                <UserCheck size={18} />
                GIỚI THIỆU
              </h3>
              <p>{profileData.summary}</p>
            </div>

            {/* Certification */}
            <div className="content-card certification-section">
              <div className="cert-background-text">UP</div>
              <h3>CHỨNG THỰC TỪ UPNEST</h3>
              <div className="cert-metrics">
                <div className="metric-item">
                  <span className="metric-label">TRÌNH ĐỘ HỌC THUẬT</span>
                  <span className="metric-value">Cấp {profileData.level}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">ĐIỂM KINH NGHIỆM</span>
                  <span className="metric-value">{profileData.totalXp} XP</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">NGÀY HỌC LIÊN TIẾP</span>
                  <span className="metric-value">{profileData.streak} Ngày</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="content-card skills-section">
              <h3>
                <BarChart3 size={20} />
                NĂNG LỰC CHUYÊN MÔN
              </h3>
              <div className="skills-list">
                {profileData.skills?.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column */}
          <div className="cv-right-column">
            {/* AI Analysis */}
            <div className="content-card ai-analysis-section">
              <div className="ai-background-icon">
                <BrainCircuit size={180} />
              </div>
              <div className="ai-content">
                <div className="ai-header">
                  <Sparkles size={28} />
                  <span>PHÂN TÍCH CHUYÊN SÂU TỪ AI</span>
                </div>
                <h4>{profileData.aiAnalysis}</h4>
                <p>{profileData.aiRecommendation}</p>
              </div>
            </div>

            {/* Academic Journey */}
            <div className="content-card academic-section">
              <h3>
                <GraduationCap size={32} />
                HÀNH TRÌNH HỌC THUẬT
              </h3>
              <div className="academic-list">
                {profileData.certifications?.map((cert, idx) => (
                  <div key={cert.id || idx} className="academic-item">
                    <div className="academic-dot"></div>
                    <div className="academic-content">
                      <div className="academic-header">
                        <h4>{cert.issuer}</h4>
                        <span className="academic-time">{cert.issueDate}</span>
                      </div>
                      <p className="academic-degree">{cert.name}</p>
                      <div className="academic-status">
                        <CheckCircle2 size={16} />
                        Xếp loại: {cert.grade} {cert.score && `(${cert.score})`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="content-card projects-section">
              <h3>
                <Layers size={32} />
                DỰ ÁN THỰC TẾ TIÊU BIỂU
              </h3>
              <div className="projects-list">
                {profileData.projects?.map((project, idx) => (
                  <div key={idx} className="project-item">
                    <div className="project-header">
                      <div>
                        <h4>{project.name}</h4>
                        <p className="project-role">{project.role}</p>
                      </div>
                      <ExternalLink size={24} />
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                      {project.technologies?.map((tech, techIdx) => (
                        <span key={techIdx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

