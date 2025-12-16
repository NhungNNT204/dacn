/**
 * Component: MessageBubble
 * Purpose: Display individual messages in chat
 * Features: Sender info, timestamp, attachments, read receipts, reactions
 */

import React, { useState } from 'react';
import { MoreHorizontal, Download, Copy, Share2, Smile } from 'lucide-react';
import './MessageBubble.css';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export default function MessageBubble({
  message = {},
  isCurrentUser = false,
  showSenderInfo = true,
  onDelete = () => {},
  onEdit = () => {},
  onDownloadFile = () => {},
  onReact = () => {},
  canDeleteMessage = false,
  canEditMessage = false
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatTime = (date) => {
    if (!date) return '';
    const time = new Date(date);
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) {
      return null;
    }

    return (
      <div className="message-attachments">
        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="attachment-item">
            {attachment.type.startsWith('image/') ? (
              <div className="image-preview">
                <img
                  src={attachment.url || attachment.data}
                  alt={attachment.name}
                  className="attachment-image"
                />
              </div>
            ) : attachment.type.startsWith('video/') ? (
              <div className="video-preview">
                <video
                  controls
                  className="attachment-video"
                  src={attachment.url || attachment.data}
                />
              </div>
            ) : (
              <div className="file-attachment">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{attachment.name}</span>
                  <span className="file-size">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  className="download-btn"
                  onClick={() => onDownloadFile(attachment)}
                  title="Download"
                >
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <div className="message-reactions">
        {Object.entries(message.reactions).map(([emoji, count]) => (
          <button
            key={emoji}
            className="reaction-item"
            title={`${count} people reacted`}
          >
            {emoji} {count > 1 ? count : ''}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`message-bubble-wrapper ${
        isCurrentUser ? 'current-user' : 'other-user'
      }`}
    >
      {/* Sender Avatar & Info */}
      {showSenderInfo && !isCurrentUser && (
        <div className="message-sender-info">
          <img
            src={message.senderAvatar || '/default-avatar.png'}
            alt={message.senderName}
            className="sender-avatar"
          />
        </div>
      )}

      <div className="message-content-wrapper">
        {/* Sender Name for Group Chats */}
        {showSenderInfo && !isCurrentUser && (
          <span className="message-sender-name">{message.senderName}</span>
        )}

        {/* Message Bubble */}
        <div className="message-bubble">
          {/* Text Content */}
          {message.content && (
            <p className="message-text">
              {message.content}
              {message.isEdited && (
                <span className="edited-badge">(edited)</span>
              )}
            </p>
          )}

          {/* Attachments */}
          {renderAttachments()}

          {/* Message Footer */}
          <div className="message-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>

            {/* Read Receipt */}
            {isCurrentUser && message.isRead && (
              <span className="read-receipt" title="Read">
                ✓✓
              </span>
            )}
            {isCurrentUser && !message.isRead && message.isSent && (
              <span className="sent-receipt" title="Sent">
                ✓
              </span>
            )}
          </div>
        </div>

        {/* Reactions */}
        {renderReactions()}

        {/* Message Actions */}
        <div className="message-actions">
          {/* Reaction Picker */}
          <div className="reaction-picker-wrapper">
            <button
              className="action-btn"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              title="React"
            >
              <Smile size={16} />
            </button>

            {showReactionPicker && (
              <div className="reaction-picker">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    className="reaction-option"
                    onClick={() => {
                      onReact(emoji);
                      setShowReactionPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More Menu */}
          {(canDeleteMessage || canEditMessage) && (
            <div className="message-menu-wrapper">
              <button
                className="action-btn"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="message-menu">
                  <button
                    className="menu-item"
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                      setShowMenu(false);
                    }}
                  >
                    <Copy size={14} /> Copy
                  </button>

                  {canEditMessage && (
                    <button
                      className="menu-item"
                      onClick={() => {
                        onEdit(message);
                        setShowMenu(false);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {canDeleteMessage && (
                    <button
                      className="menu-item delete"
                      onClick={() => {
                        onDelete(message.id);
                        setShowMenu(false);
                      }}
                    >
                      Delete
                    </button>
                  )}

                  <button
                    className="menu-item"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Message',
                          text: message.content
                        });
                      }
                      setShowMenu(false);
                    }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
