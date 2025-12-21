import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Music, 
  Users, 
  Hash, 
  Globe, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  Search,
  Play,
  Award,
  Zap
} from 'lucide-react';
import './CreatePostModal.css';

/**
 * DỮ LIỆU MẪU CHO TÍNH NĂNG CHỌN LỰA
 */
const MOCK_FRIENDS = [
  { id: 1, name: "Minh Quân", avatar: "MQ" },
  { id: 2, name: "Thanh Hương", avatar: "TH" },
  { id: 3, name: "Anh Tuấn", avatar: "AT" },
  { id: 4, name: "Cô Minh Thư", avatar: "MT" }
];

const STUDY_MUSIC = [
  { id: 1, title: "Deep Focus Lo-fi", author: "UpNest Studio" },
  { id: 2, title: "Coding Session Beats", author: "SynthWave" },
  { id: 3, title: "Piano for Reading", author: "Classic Chill" }
];

const SKILLS = ["UI/UX Design", "Business Analysis", "ReactJS", "Spring Boot", "UML Modeling", "Figma", "Java", "Database"];

const BADGES = [
  { id: 1, name: "Học viên xuất sắc", icon: "⭐" },
  { id: 2, name: "Hoàn thành dự án", icon: "🏆" },
  { id: 3, name: "Giúp đỡ đồng đội", icon: "🤝" }
];

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onPostCreated,
  showModerationAlert 
}) => {
  const [content, setContent] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [taggedSkills, setTaggedSkills] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [privacy, setPrivacy] = useState('PUBLIC');
  const fileInputRef = useRef(null);

  // Logic: Thêm/Xóa nhạc
  const toggleMusic = (music) => {
    if (selectedMusic?.id === music.id) setSelectedMusic(null);
    else setSelectedMusic(music);
    setShowMusicPicker(false);
  };

  // Logic: Thêm/Xóa bạn bè
  const toggleFriend = (friend) => {
    if (taggedFriends.find(f => f.id === friend.id)) {
      setTaggedFriends(taggedFriends.filter(f => f.id !== friend.id));
    } else {
      setTaggedFriends([...taggedFriends, friend]);
    }
  };

  // Logic: Thêm/Xóa kỹ năng
  const toggleSkill = (skill) => {
    if (taggedSkills.includes(skill)) {
      setTaggedSkills(taggedSkills.filter(s => s !== skill));
    } else {
      setTaggedSkills([...taggedSkills, skill]);
    }
  };

  // Logic: Thêm/Xóa badge
  const toggleBadge = (badge) => {
    if (selectedBadges.find(b => b.id === badge.id)) {
      setSelectedBadges(selectedBadges.filter(b => b.id !== badge.id));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  // Xử lý chọn file
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles]);
    }
    if (videoFiles.length > 0) {
      setSelectedVideo(videoFiles[0]);
    }
  };

  // Kiểm tra content moderation
  const checkContentModeration = (content) => {
    const BANNED_KEYWORDS = [
      "18+", "máu me", "kích động", "sexy", "bạo lực", "đồi trụy",
      "giết", "chết", "máu", "bạo lực", "đánh nhau", "chiến tranh",
      "sex", "tình dục", "khiêu dâm", "nude", "khỏa thân", "xxx"
    ];
    const lowerContent = content.toLowerCase();
    return BANNED_KEYWORDS.find(word => lowerContent.includes(word.toLowerCase()));
  };

  // Xử lý đăng bài
  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0 && !selectedVideo) return;

    // Kiểm tra moderation ở frontend trước
    const violation = checkContentModeration(content);
    if (violation) {
      showModerationAlert(`Nội dung chứa từ khóa vi phạm "${violation}". Bài viết bị từ chối đăng theo tiêu chuẩn cộng đồng.`);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const postType = selectedVideo ? 'VIDEO' : (selectedImages.length > 0 ? 'IMAGE' : 'TEXT');
        
        // Tạo tags từ skills, friends, badges
        const tags = [
          ...taggedSkills.map(s => `#${s}`),
          ...taggedFriends.map(f => `@${f.name}`),
          ...selectedBadges.map(b => b.icon)
        ].join(' ');

        const finalContent = content + (tags ? `\n\n${tags}` : '');
        
        const response = await fetch('http://localhost:8080/api/v1/social/posts/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: finalContent,
            postType: postType.toLowerCase(),
            imageUrl: selectedImages.length > 0 ? URL.createObjectURL(selectedImages[0]) : null,
            videoUrl: selectedVideo ? URL.createObjectURL(selectedVideo) : null
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Backend moderation failed
          if (data.violationType || data.details) {
            showModerationAlert(
              data.message || 'Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!',
              {
                message: data.message,
                violationType: data.violationType,
                foundKeywords: data.foundKeywords,
                details: data.details
              }
            );
          } else {
            showModerationAlert(data.message || 'Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!');
          }
          return;
        }

        // Success
        onPostCreated();
        handleClose();
      }
    } catch (error) {
      console.log('Error creating post:', error);
      if (error.message && (error.message.includes('vi phạm') || error.message.includes('violation'))) {
        showModerationAlert('Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!');
      }
    }
  };

  // Reset form khi đóng
  const handleClose = () => {
    setContent("");
    setSelectedMusic(null);
    setTaggedFriends([]);
    setTaggedSkills([]);
    setSelectedBadges([]);
    setSelectedImages([]);
    setSelectedVideo(null);
    setShowMusicPicker(false);
    setShowFriendPicker(false);
    setShowSkillPicker(false);
    setShowBadgePicker(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-post-modal-overlay" onClick={handleClose}>
      <div className="create-post-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="create-post-modal-header">
          <div className="w-10"></div>
          <h2 className="create-post-modal-title">Tạo bài viết mới</h2>
          <button 
            onClick={handleClose}
            className="create-post-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="create-post-modal-body">
          {/* User Info & Privacy */}
          <div className="create-post-user-info">
            <div className="create-post-avatar">{currentUser?.avatar || 'N'}</div>
            <div className="create-post-user-details">
              <h3 className="create-post-user-name">{currentUser?.name || 'Nguyễn Thị Thùy Nhung'}</h3>
              <button className="create-post-privacy-btn">
                <Globe size={12} /> Công khai <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Text Area */}
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ tiến trình học tập của bạn..."
            className="create-post-textarea"
          />

          {/* Media Preview */}
          {(selectedImages.length > 0 || selectedVideo) && (
            <div className="create-post-media-preview">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="media-preview-item">
                  <img src={URL.createObjectURL(img)} alt="Preview" />
                  <button onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              {selectedVideo && (
                <div className="media-preview-item">
                  <video src={URL.createObjectURL(selectedVideo)} controls />
                  <button onClick={() => setSelectedVideo(null)}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tags Preview Area */}
          {(taggedFriends.length > 0 || taggedSkills.length > 0 || selectedMusic || selectedBadges.length > 0) && (
            <div className="create-post-tags-preview">
              {selectedMusic && (
                <div className="tag-item tag-music">
                  <Play size={12} fill="currentColor" /> {selectedMusic.title}
                </div>
              )}
              {selectedBadges.map(badge => (
                <div key={badge.id} className="tag-item tag-badge">
                  {badge.icon} {badge.name}
                </div>
              ))}
              {taggedFriends.map(f => (
                <div key={f.id} className="tag-item tag-friend">
                  <Users size={12} /> {f.name}
                </div>
              ))}
              {taggedSkills.map(s => (
                <div key={s} className="tag-item tag-skill">
                  <Hash size={12} /> {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Công cụ đính kèm */}
        <div className="create-post-tools">
          <div className="create-post-tools-box">
            <span className="create-post-tools-label">Thêm vào bài học</span>
            <div className="create-post-tools-icons">
              <button 
                onClick={() => { 
                  setShowMusicPicker(!showMusicPicker); 
                  setShowFriendPicker(false); 
                  setShowSkillPicker(false);
                  setShowBadgePicker(false);
                }}
                className={`tool-icon ${showMusicPicker ? 'active music' : ''}`}
                title="Thêm nhạc tập trung"
              >
                <Music size={22} />
              </button>
              <button 
                onClick={() => { 
                  setShowFriendPicker(!showFriendPicker); 
                  setShowMusicPicker(false); 
                  setShowSkillPicker(false);
                  setShowBadgePicker(false);
                }}
                className={`tool-icon ${showFriendPicker ? 'active friend' : ''}`}
                title="Tag đồng đội"
              >
                <Users size={22} />
              </button>
              <button 
                onClick={() => { 
                  setShowSkillPicker(!showSkillPicker); 
                  setShowMusicPicker(false); 
                  setShowFriendPicker(false);
                  setShowBadgePicker(false);
                }}
                className={`tool-icon ${showSkillPicker ? 'active skill' : ''}`}
                title="Gắn thẻ kĩ năng"
              >
                <Hash size={22} />
              </button>
              <button 
                onClick={() => {
                  setShowBadgePicker(!showBadgePicker);
                  setShowMusicPicker(false);
                  setShowFriendPicker(false);
                  setShowSkillPicker(false);
                }}
                className={`tool-icon ${showBadgePicker ? 'active badge' : ''}`}
                title="Huy hiệu thành tựu"
              >
                <Award size={22} />
              </button>
              <label className="tool-icon" title="Ảnh minh họa">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <ImageIcon size={22} />
              </label>
            </div>
          </div>

          {/* Sub-pickers */}
          <div className="create-post-pickers">
            {/* Music Picker */}
            {showMusicPicker && (
              <div className="picker-container">
                <p className="picker-title">Giai điệu tập trung (AI Lo-fi)</p>
                {STUDY_MUSIC.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => toggleMusic(m)} 
                    className={`picker-item ${selectedMusic?.id === m.id ? 'selected' : ''}`}
                  >
                    <div className="picker-item-left">
                      <div className="picker-item-icon music">
                        <Music size={18}/>
                      </div>
                      <div className="picker-item-text">
                        <p className="picker-item-title">{m.title}</p>
                        <p className="picker-item-subtitle">{m.author}</p>
                      </div>
                    </div>
                    {selectedMusic?.id === m.id && <CheckCircle2 size={16} className="picker-check" />}
                  </button>
                ))}
              </div>
            )}

            {/* Friend Picker */}
            {showFriendPicker && (
              <div className="picker-container">
                <div className="picker-search">
                  <Search className="picker-search-icon" size={14} />
                  <input type="text" placeholder="Tìm tên đồng đội..." className="picker-search-input" />
                </div>
                {MOCK_FRIENDS.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => toggleFriend(f)} 
                    className={`picker-item ${taggedFriends.find(tf => tf.id === f.id) ? 'selected' : ''}`}
                  >
                    <div className="picker-item-left">
                      <div className="picker-item-icon friend">
                        {f.avatar}
                      </div>
                      <p className="picker-item-title">{f.name}</p>
                    </div>
                    {taggedFriends.find(tf => tf.id === f.id) && <CheckCircle2 size={16} className="picker-check" />}
                  </button>
                ))}
              </div>
            )}

            {/* Skill Picker */}
            {showSkillPicker && (
              <div className="picker-container">
                <p className="picker-title">Kĩ năng bạn đang rèn luyện?</p>
                <div className="picker-skills-grid">
                  {SKILLS.map(s => (
                    <button 
                      key={s} 
                      onClick={() => toggleSkill(s)} 
                      className={`picker-skill-btn ${taggedSkills.includes(s) ? 'selected' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badge Picker */}
            {showBadgePicker && (
              <div className="picker-container">
                <p className="picker-title">Huy hiệu thành tựu</p>
                <div className="picker-badges-grid">
                  {BADGES.map(badge => (
                    <button 
                      key={badge.id} 
                      onClick={() => toggleBadge(badge)} 
                      className={`picker-badge-btn ${selectedBadges.find(b => b.id === badge.id) ? 'selected' : ''}`}
                    >
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-name">{badge.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            onClick={handlePost}
            disabled={!content.trim() && selectedImages.length === 0 && !selectedVideo}
            className={`create-post-submit-btn ${content.trim() || selectedImages.length > 0 || selectedVideo ? 'active' : 'disabled'}`}
          >
            Đăng hành trình của tôi <Sparkles size={20} className={content.trim() || selectedImages.length > 0 || selectedVideo ? 'sparkle' : ''} />
          </button>
        </div>

      </div>

      {/* Background Innovations Info (Optional Desktop Only) */}
      <div className="create-post-innovation-info">
        <div className="innovation-card">
          <div className="innovation-header">
            <Zap size={24} className="innovation-icon" />
            <h4 className="innovation-title">Đổi mới Sáng tạo</h4>
          </div>
          <p className="innovation-text">
            "Chia sẻ không chỉ là đăng bài, mà là cách bạn truyền cảm hứng học tập thông qua <strong>Âm nhạc</strong> và <strong>Thành tựu</strong> thực tế."
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

