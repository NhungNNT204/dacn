/**
 * Component: PostReactions
 * Purpose: Hiển thị bảng reaction với các loại cảm xúc
 * Features: Popup reaction selector, current reaction indicator
 */

import React, { useState, useRef, useEffect } from 'react';
import { SmilePlus } from 'lucide-react';
import { REACTION_EMOJIS, REACTION_TYPES } from '../../../services/postInteractionService';
import '../styles/PostReactions.css';

const PostReactions = ({ postId, userReaction, onReaction, isLoading = false }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const pickerRef = useRef(null);

  /**
   * Xử lý click reaction
   */
  const handleReactionClick = (reactionType) => {
    onReaction(reactionType);
    setShowReactionPicker(false);
  };

  /**
   * Đóng picker khi click bên ngoài
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowReactionPicker(false);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showReactionPicker]);

  return (
    <div className="post-reactions" ref={pickerRef}>
      <button
        className={`reaction-btn ${isLoading ? 'loading' : ''}`}
        onClick={() => setShowReactionPicker(!showReactionPicker)}
        title="Thêm cảm xúc"
        disabled={isLoading}
      >
        {userReaction ? (
          <>
            <span className="reaction-emoji">{REACTION_EMOJIS[userReaction]}</span>
            <span className="reaction-label">
              {userReaction.charAt(0).toUpperCase() + userReaction.slice(1)}
            </span>
          </>
        ) : (
          <>
            <SmilePlus size={20} />
            <span>Cảm xúc</span>
          </>
        )}
      </button>

      {showReactionPicker && (
        <div className="reaction-picker">
          <div className="reaction-list">
            {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
              <button
                key={type}
                className={`reaction-option ${userReaction === type ? 'active' : ''}`}
                onClick={() => handleReactionClick(type)}
                title={type}
                disabled={isLoading}
              >
                <span className="emoji">{emoji}</span>
                <span className="type">{type}</span>
              </button>
            ))}
          </div>
          {userReaction && (
            <button
              className="reaction-remove"
              onClick={() => handleReactionClick(null)}
              disabled={isLoading}
            >
              Bỏ cảm xúc
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostReactions;
