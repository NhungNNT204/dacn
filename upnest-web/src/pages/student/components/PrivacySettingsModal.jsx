import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

/**
 * PrivacySettingsModal - Modal cài đặt quyền riêng tư
 */
const PrivacySettingsModal = ({ settings, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    postVisibility: settings?.postVisibility || 'PUBLIC',
    commentPermission: settings?.commentPermission || 'EVERYONE',
    reactionPermission: settings?.reactionPermission || 'EVERYONE',
    allowTag: settings?.allowTag !== false,
    allowNotifications: settings?.allowNotifications !== false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="privacy-modal-overlay" onClick={onClose}>
      <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Cài đặt quyền riêng tư</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="privacy-form">
          {/* Quyền xem bài viết */}
          <div className="form-group">
            <label>Ai có thể xem bài viết của bạn?</label>
            <select
              name="postVisibility"
              value={formData.postVisibility}
              onChange={handleChange}
            >
              <option value="PUBLIC">Công khai</option>
              <option value="FRIENDS">Chỉ bạn bè</option>
              <option value="PRIVATE">Riêng tư</option>
            </select>
          </div>

          {/* Quyền bình luận */}
          <div className="form-group">
            <label>Ai có thể bình luận bài viết?</label>
            <select
              name="commentPermission"
              value={formData.commentPermission}
              onChange={handleChange}
            >
              <option value="EVERYONE">Tất cả mọi người</option>
              <option value="FRIENDS">Chỉ bạn bè</option>
              <option value="NOBODY">Không ai</option>
            </select>
          </div>

          {/* Quyền reaction */}
          <div className="form-group">
            <label>Ai có thể thích/react bài viết?</label>
            <select
              name="reactionPermission"
              value={formData.reactionPermission}
              onChange={handleChange}
            >
              <option value="EVERYONE">Tất cả mọi người</option>
              <option value="FRIENDS">Chỉ bạn bè</option>
              <option value="NOBODY">Không ai</option>
            </select>
          </div>

          {/* Cho phép tag */}
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="allowTag"
              checked={formData.allowTag}
              onChange={handleChange}
              id="allowTag"
            />
            <label htmlFor="allowTag">Cho phép người khác tag bạn trong bài viết</label>
          </div>

          {/* Cho phép thông báo */}
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="allowNotifications"
              checked={formData.allowNotifications}
              onChange={handleChange}
              id="allowNotifications"
            />
            <label htmlFor="allowNotifications">Nhận thông báo khi ai đó theo dõi bạn</label>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={20} /> Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivacySettingsModal;
