import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/ShareModal.css';

/**
 * ShareModal - Modal để chia sẻ bài đăng
 */
export default function ShareModal({ postId, onClose, onShare }) {
    const [message, setMessage] = useState('');
    const [shareType, setShareType] = useState('FEED');
    
    const handleShare = () => {
        onShare(postId, message, shareType);
    };
    
    return (
        <div className="share-modal">
            <div className="share-modal-overlay" onClick={onClose}></div>
            <div className="share-modal-content">
                <div className="share-modal-header">
                    <h2>Chia sẻ bài viết</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="share-modal-body">
                    <div className="share-type-select">
                        <label>
                            <input
                                type="radio"
                                name="shareType"
                                value="FEED"
                                checked={shareType === 'FEED'}
                                onChange={(e) => setShareType(e.target.value)}
                            />
                            <span>Dòng thời gian</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shareType"
                                value="MESSAGE"
                                checked={shareType === 'MESSAGE'}
                                onChange={(e) => setShareType(e.target.value)}
                            />
                            <span>Tin nhắn riêng</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shareType"
                                value="GROUP"
                                checked={shareType === 'GROUP'}
                                onChange={(e) => setShareType(e.target.value)}
                            />
                            <span>Nhóm</span>
                        </label>
                    </div>
                    
                    <textarea
                        placeholder="Thêm bình luận về bài viết này..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="share-message"
                    ></textarea>
                </div>
                
                <div className="share-modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="share-btn" onClick={handleShare}>
                        Chia sẻ
                    </button>
                </div>
            </div>
        </div>
    );
}
