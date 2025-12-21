import React, { useState } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreHorizontal, X } from 'lucide-react';
import '../styles/ChatBox.css';

/**
 * ChatBox - Khung chat hiển thị tin nhắn
 */
const ChatBox = ({
  chat,
  messages,
  messageInput,
  onMessageChange,
  onSendMessage,
  onSendMedia,
  onCall,
  onVideoCall,
  onAddReaction,
  messagesEndRef,
  connectionStatus,
  isLoading
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😠', '🔥', '🎉'];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    onMessageChange(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-box">
      {/* Header */}
      <div className="chat-box-header">
        <div className="chat-info">
          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
          ) : (
            <div className="chat-avatar-placeholder">
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="chat-details">
            <h2>{chat.name}</h2>
            {chat.isGroup && <p>{chat.members} thành viên</p>}
            <p className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'connected' ? '🟢 Đã kết nối' : '🔴 Đang kết nối...'}
            </p>
          </div>
        </div>

        <div className="chat-actions">
          <button
            className="action-btn"
            onClick={onCall}
            title="Gọi thoại"
          >
            <Phone size={20} />
          </button>
          <button
            className="action-btn"
            onClick={onVideoCall}
            title="Gọi video"
          >
            <Video size={20} />
          </button>
          <button className="action-btn" title="Thêm tùy chọn">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {isLoading ? (
          <div className="loading">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>Bắt đầu cuộc trò cnhungện</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-group ${message.senderId === 1 ? 'sent' : 'received'}`}
              onMouseEnter={() => setHoveredMessageId(message.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {/* Avatar */}
              {message.senderId !== 1 && (
                <img
                  src={message.senderAvatar}
                  alt={message.senderName}
                  className="message-avatar"
                />
              )}

              {/* Message Content */}
              <div className="message-content">
                {/* Name (group chat) */}
                {chat.isGroup && message.senderId !== 1 && (
                  <p className="message-sender">{message.senderName}</p>
                )}

                {/* Message Bubble */}
                <div className="message-bubble">
                  {/* Media */}
                  {message.messageType === 'IMAGE' && message.mediaUrl && (
                    <img src={message.mediaUrl} alt="message media" className="message-media" />
                  )}
                  {message.messageType === 'VIDEO' && message.mediaUrl && (
                    <video
                      src={message.mediaUrl}
                      className="message-media"
                      controls
                    />
                  )}

                  {/* Text */}
                  {message.content && (
                    <p className="message-text">
                      {message.content}
                      {message.isEdited && <span className="edited-label">(đã chỉnh sửa)</span>}
                    </p>
                  )}

                  {/* Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="message-reactions">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="reaction">
                          {emoji} {count > 1 ? count : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Time */}
                <p className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                {/* Actions */}
                {hoveredMessageId === message.id && (
                  <div className="message-actions">
                    <div className="quick-reactions">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          className="quick-emoji"
                          onClick={() => onAddReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {emojis.map(emoji => (
              <button
                key={emoji}
                className="emoji-btn"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form className="message-form" onSubmit={handleSendMessage}>
          <button
            type="button"
            className="input-btn emoji-btn-main"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            className="input-btn"
            onClick={() => onSendMedia('image')}
            title="Gửi ảnh"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="message-input"
            rows="1"
          />

          <button
            type="submit"
            className="send-btn"
            disabled={!messageInput.trim()}
            title="Gửi"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
