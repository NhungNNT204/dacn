import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, AlertCircle } from 'lucide-react';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';
import chatService from '../../../services/chatService';
import '../styles/ChatWindow.css';

const ChatWindow = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
      subscribeToMessages();
      subscribeToTyping();
    }

    return () => {
      // Cleanup listeners
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    setError(null);
    try {
      const result = await chatService.getMessages(conversation.id, 1, 50);
      if (result.success) {
        setMessages(result.data || []);
      } else {
        setError(result.message || 'Không thể tải tin nhắn');
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Lỗi khi tải tin nhắn');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const subscribeToMessages = () => {
    const unsubscribe = chatService.onMessage((newMessage) => {
      if (newMessage.type === 'newMessage' && 
          newMessage.message.conversationId === conversation.id) {
        setMessages(prev => [...prev, newMessage.message]);
        
        // Mark as read
        if (newMessage.message.senderId !== 'current-user') {
          chatService.markAsRead(conversation.id, newMessage.message.id);
        }
      }
    });

    return unsubscribe;
  };

  const subscribeToTyping = () => {
    const unsubscribe = chatService.onTyping((typingData) => {
      if (typingData.conversationId === conversation.id) {
        setTypingUsers(prev => {
          const existing = prev.filter(u => u.userId !== typingData.userId);
          return [...existing, typingData];
        });

        // Clear typing indicator after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTypingUsers(prev => 
            prev.filter(u => u.userId !== typingData.userId)
          );
        }, 3000);
      }
    });

    return unsubscribe;
  };

  const handleSendMessage = async (content, attachments) => {
    try {
      const result = await chatService.sendMessage(
        conversation.id,
        content,
        attachments
      );

      if (result.success) {
        // Message will be added via WebSocket listener
        setError(null);
      } else {
        setError(result.message || 'Không thể gửi tin nhắn');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Lỗi khi gửi tin nhắn');
    }
  };

  const handleTyping = () => {
    chatService.sendTypingIndicator(conversation.id);
  };

  const getConversationName = () => {
    if (conversation.type === '1:1') {
      return conversation.participantName;
    }
    if (conversation.type === 'group') {
      return conversation.groupName;
    }
    return conversation.channelName;
  };

  const getHeaderSubtitle = () => {
    if (conversation.type === '1:1') {
      return conversation.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến';
    }
    if (conversation.type === 'group') {
      return `${conversation.participantCount} thành viên`;
    }
    return conversation.description || '';
  };

  if (!conversation) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <AlertCircle className="w-16 h-16" />
          <p>Chọn một cuộc hội thoại để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <img
            src={conversation.type === '1:1'
              ? conversation.participantAvatar
              : conversation.type === 'group'
              ? conversation.groupAvatar
              : conversation.channelAvatar}
            alt={getConversationName()}
            className="chat-header-avatar"
          />
          <div className="chat-header-text">
            <h3>{getConversationName()}</h3>
            <p className="header-subtitle">{getHeaderSubtitle()}</p>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="icon-btn" title="Cuộc gọi thoại">
            <Phone className="w-5 h-5" />
          </button>
          <button className="icon-btn" title="Cuộc gọi video">
            <Video className="w-5 h-5" />
          </button>
          <button className="icon-btn" title="Thêm tùy chọn">
            <MoreVertical className="w-5 h-5" />
          </button>
          {onClose && (
            <button className="icon-btn close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button onClick={() => setError(null)}>Đóng</button>
        </div>
      )}

      {/* Messages Container */}
      <div className="messages-container">
        {isLoadingMessages ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải tin nhắn...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>Chưa có tin nhắn nào</p>
            <p className="subtitle">Hãy gửi tin nhắn đầu tiên của bạn</p>
          </div>
        ) : (
          <>
            <MessageBox messages={messages} />
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="typing-indicators">
            {typingUsers.map(user => (
              <div key={user.userId} className="typing-indicator">
                <p>{user.userName || 'Người dùng'} đang nhập...</p>
                <div className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ChatWindow;
