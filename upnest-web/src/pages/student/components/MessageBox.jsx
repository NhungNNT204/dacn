import React from 'react';
import { Download, Play, Image as ImageIcon } from 'lucide-react';
import '../styles/MessageBox.css';

const MessageBox = ({ messages }) => {
  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'text':
        return <p className="message-text">{message.content}</p>;

      case 'image':
        return (
          <img
            src={message.content}
            alt="Shared"
            className="message-image"
            loading="lazy"
          />
        );

      case 'video':
        return (
          <div className="message-video">
            <video width="100%" controls>
              <source src={message.content} />
            </video>
          </div>
        );

      case 'file':
        return (
          <div className="message-file">
            <div className="file-icon">
              <Download className="w-6 h-6" />
            </div>
            <div className="file-info">
              <p className="file-name">{message.fileName}</p>
              <p className="file-size">{formatFileSize(message.fileSize)}</p>
            </div>
            <a
              href={message.content}
              download
              className="download-btn"
              title="Tải xuống"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        );

      case 'mixed':
        return (
          <div className="message-mixed">
            <p className="message-text">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="attachments-preview">
                {message.attachments.map((attachment, idx) => (
                  <div key={idx} className="attachment-item">
                    {attachment.type === 'image' && (
                      <img
                        src={attachment.url}
                        alt="Attached"
                        loading="lazy"
                      />
                    )}
                    {attachment.type === 'video' && (
                      <video width="100%">
                        <source src={attachment.url} />
                      </video>
                    )}
                    {attachment.type === 'file' && (
                      <div className="file-icon">
                        <Download className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <p className="message-text">{message.content}</p>;
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sending':
        return '⏱';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="message-box">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Divider */}
          <div className="date-divider">
            <span>{date}</span>
          </div>

          {/* Messages for this date */}
          {msgs.map((message, index) => {
            const isCurrentUser = message.senderId === 'current-user';
            const showAvatar = !isCurrentUser && (
              index === 0 ||
              msgs[index - 1]?.senderId !== message.senderId
            );
            const showName = !isCurrentUser && showAvatar;

            return (
              <div
                key={message.id}
                className={`message-group ${isCurrentUser ? 'sent' : 'received'}`}
              >
                {showAvatar && !isCurrentUser && (
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="message-avatar"
                    title={message.senderName}
                  />
                )}

                <div className="message-content-wrapper">
                  {showName && (
                    <div className="message-sender-name">
                      {message.senderName}
                    </div>
                  )}

                  <div className="message-bubble">
                    {renderMessageContent(message)}

                    {message.edited && (
                      <span className="message-edited">
                        (đã chỉnh sửa)
                      </span>
                    )}
                  </div>

                  <div className="message-meta">
                    <span className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </span>
                    {isCurrentUser && (
                      <span className="message-status" title={message.status}>
                        {getMessageStatus(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Helper function to group messages by date
const groupMessagesByDate = (messages) => {
  const grouped = {};

  messages.forEach(message => {
    const date = new Date(message.timestamp);
    const dateKey = formatDate(date);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
};

// Format date for grouping
const formatDate = (date) => {
  const now = new Date();
  const messageDate = new Date(date);

  const isToday = messageDate.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === messageDate.toDateString();

  if (isToday) return 'Hôm nay';
  if (isYesterday) return 'Hôm qua';

  return messageDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Format message time
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default MessageBox;
