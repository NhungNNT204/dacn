import React, { useState, useEffect } from 'react';
import { Phone, Video, X } from 'lucide-react';
import '../styles/CallModal.css';

/**
 * CallModal - Modal cho cuộc gọi thoại/video
 */
const CallModal = ({ chatName, callType, onAccept, onReject }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        {/* Avatar */}
        <div className="call-avatar">
          <div className="avatar-circle">
            {chatName?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <h2>{chatName}</h2>
        <p className="call-type">
          {callType === 'VIDEO' ? '📹 Gọi video' : '☎️ Gọi thoại'}
        </p>
        <p className="call-duration">
          {isRinging ? 'Đang gọi...' : formatTime(seconds)}
        </p>

        {/* Actions */}
        <div className="call-actions">
          <button
            className="call-btn accept"
            onClick={onAccept}
            title="Trả lời"
          >
            {callType === 'VIDEO' ? <Video size={28} /> : <Phone size={28} />}
          </button>
          
          <button
            className="call-btn reject"
            onClick={onReject}
            title="Từ chối"
          >
            <X size={28} />
          </button>
        </div>

        {/* Ringing Animation */}
        {isRinging && <div className="ringing-animation"></div>}
      </div>
    </div>
  );
};

export default CallModal;
