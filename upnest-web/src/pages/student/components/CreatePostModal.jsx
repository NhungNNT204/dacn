import React from "react";
import PostCreator from "./PostCreator";
import "../styles/PostCreator.css";

/**
 * Lightweight modal wrapper cho PostCreator.
 * Props:
 *  - isOpen: boolean hiển thị
 *  - onClose: hàm đóng modal
 *  - currentUser: thông tin user (không bắt buộc PostCreator hiện tại)
 *  - onPostCreated: callback sau khi tạo post thành công
 *  - showModerationAlert: callback để hiển thị cảnh báo (nếu cần)
 */
const CreatePostModal = ({ isOpen, onClose, currentUser, onPostCreated, showModerationAlert }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tạo bài viết mới</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <PostCreator
            groupId={null}
            onPostCreated={(post) => {
              onPostCreated?.(post);
              onClose?.();
            }}
          />
        </div>
        {showModerationAlert && (
          <p className="text-xs text-slate-500 mt-2">
            Nội dung sẽ được kiểm duyệt theo tiêu chuẩn cộng đồng.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;

