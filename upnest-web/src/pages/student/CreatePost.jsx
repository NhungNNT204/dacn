import React, { useState } from 'react';
import { Image, Smile, Send, X } from 'lucide-react';
import './CreatePost.css';

/**
 * CreatePost - Thành phần tạo bài đăng/trạng thái
 * Cho phép học viên chia sẻ nội dung, hình ảnh, và tùy chọn quyền riêng tư
 */
export default function CreatePost({ onPostCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('status');
  const [privacy, setPrivacy] = useState('public');
  const [selectedClass, setSelectedClass] = useState('all');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const classes = [
    { id: 'all', name: '👥 Tất cả bạn bè' },
    { id: 'wd101', name: '📚 Web Development 101' },
    { id: 'js-adv', name: '⚛️ JavaScript Advanced' },
    { id: 'react', name: '⚛️ React Fundamentals' }
  ];

  const postTypes = [
    { value: 'status', label: '💭 Trạng thái', icon: '💭' },
    { value: 'question', label: '❓ Câu hỏi', icon: '❓' },
    { value: 'achievement', label: '🏆 Thành tích', icon: '🏆' },
    { value: 'blog', label: '📝 Bài viết', icon: '📝' },
    { value: 'resource', label: '📚 Chia sẻ tài liệu', icon: '📚' }
  ];

  const emojis = ['😀', '😂', '❤️', '👍', '🔥', '😍', '🎉', '💯', '📚', '💡', '✨', '🚀'];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (content.trim()) {
      const images = attachedFiles
        .filter((f) => (f.type || '').startsWith('image/'))
        .map((f) => ({ kind: 'image', name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }));
      const videos = attachedFiles
        .filter((f) => (f.type || '').startsWith('video/'))
        .map((f) => ({ kind: 'video', name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }));
      const docs = attachedFiles
        .filter((f) => !(f.type || '').startsWith('image/') && !(f.type || '').startsWith('video/'))
        .map((f) => ({ kind: 'doc', name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }));

      const newPost = {
        id: Date.now(),
        author: {
          name: 'Nguyễn Hồng',
          avatar: 'NH',
          role: 'Student',
          timestamp: 'Vừa xong',
          verified: false
        },
        type: postType,
        content: content,
        // HomeFeed/FeedPostCard expect these optional fields:
        imageUrl: images[0]?.url || null,
        videoUrl: videos[0]?.url || null,
        // Keep all attachments for rendering/download
        attachments: [...images, ...videos, ...docs],
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        class: selectedClass === 'all' ? 'Tất cả' : classes.find(c => c.id === selectedClass)?.name,
        tags: [],
        privacy: privacy
      };

      if (onPostCreated) {
        onPostCreated(newPost);
      }

      // Reset form
      setContent('');
      setPostType('status');
      setPrivacy('public');
      setSelectedClass('all');
      setAttachedFiles([]);
      setIsExpanded(false);
    }
  };

  const handleAddEmoji = (emoji) => {
    setContent(content + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        {/* User Info Header */}
        <div className="create-post-header">
          <div className="user-avatar">NH</div>
          <textarea
            className="post-input"
            placeholder="Chia sẻ suy nghĩ của bạn, Nguyễn Hồng..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 4 : 1}
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <>
            {/* Post Type Selection */}
            <div className="post-type-selector">
              <label>Loại bài đăng:</label>
              <div className="type-buttons">
                {postTypes.map(type => (
                  <button
                    key={type.value}
                    className={`type-button ${postType === type.value ? 'active' : ''}`}
                    onClick={() => setPostType(type.value)}
                    title={type.label}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-text">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Class/Audience Selection */}
            <div className="class-selector">
              <label>Chia sẻ với:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="class-select"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Privacy Selection */}
            <div className="privacy-selector">
              <label>Quyền riêng tư:</label>
              <div className="privacy-options">
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={privacy === 'public'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>🌍 Công khai</span>
                </label>
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="class"
                    checked={privacy === 'class'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>🏫 Chỉ lớp</span>
                </label>
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={privacy === 'private'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>🔒 Riêng tư</span>
                </label>
              </div>
            </div>

            {/* Attached Files */}
            {attachedFiles.length > 0 && (
              <div className="attached-files">
                <h4>Tập tin đính kèm:</h4>
                <div className="files-list">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <span className="file-icon">📎</span>
                      <span className="file-name">{file.name}</span>
                      <button
                        className="remove-file"
                        onClick={() => removeFile(idx)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="emoji-picker">
                <div className="emoji-grid">
                  {emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      className="emoji-button"
                      onClick={() => handleAddEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="create-post-actions">
              <div className="action-tools">
                <label className="tool-button" title="Thêm ảnh/video/tài liệu">
                  <Image size={20} />
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className="tool-button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Thêm emoji"
                >
                  <Smile size={20} />
                </button>
              </div>

              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setAttachedFiles([]);
                  }}
                >
                  Hủy
                </button>
                <button
                  className="post-button"
                  onClick={handlePost}
                  disabled={!content.trim()}
                >
                  <Send size={18} />
                  <span>Đăng</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions Bar (when collapsed) */}
        {!isExpanded && (
          <div className="quick-actions">
            <label className="quick-button" title="Thêm hình ảnh">
              <Image size={18} />
              <span>Hình ảnh</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            <button className="quick-button" title="Đặt câu hỏi">
              ❓ Câu hỏi
            </button>
            <button className="quick-button" title="Chia sẻ thành tích">
              🏆 Thành tích
            </button>
            <button className="quick-button" title="Viết bài viết">
              📝 Bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
