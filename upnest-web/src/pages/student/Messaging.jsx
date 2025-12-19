import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Phone, Video, Info, Send, Paperclip, 
  Image as ImageIcon, Smile, Plus, FileText, 
  Download, User, ChevronRight, BellOff, Trash2, X
} from 'lucide-react';
import './Messaging.css';

export default function Messaging() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    loadConversations();
    
    // WebSocket connection (simplified - use proper WebSocket library in production)
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Initialize WebSocket connection for realtime messaging
      // wsRef.current = new WebSocket(`ws://localhost:8080/ws/messaging?token=${token}`);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/messaging/conversations?filter=${activeFilter}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
          if (data.length > 0 && !selectedChat) {
            setSelectedChat(data[0]);
          }
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockConversations = [
      {
        id: 1,
        name: "Cô Minh Thư (Giảng viên)",
        avatar: "MT",
        role: "Giảng viên",
        lastMessage: "Em nhớ xem kỹ phần Security bài 12 nhé!",
        lastMessageTimeFormatted: "2 phút trước",
        unreadCount: 2,
        isOnline: true,
        conversationType: "INDIVIDUAL",
        avatarColor: "bg-indigo-600"
      },
      {
        id: 2,
        name: "Nhóm Java Spring Boot Expert",
        avatar: "JS",
        role: "Nhóm học tập",
        lastMessage: "Huy: Mình đã đẩy source code lên git rồi...",
        lastMessageTimeFormatted: "10:30",
        unreadCount: 0,
        isOnline: false,
        conversationType: "GROUP",
        avatarColor: "bg-emerald-600"
      },
      {
        id: 3,
        name: "Trợ lý học tập UpNest AI",
        avatar: "AI",
        role: "AI Assistant",
        lastMessage: "Lộ trình học tập của bạn đã được cập nhật.",
        lastMessageTimeFormatted: "Hôm qua",
        unreadCount: 0,
        isOnline: true,
        conversationType: "AI",
        avatarColor: "bg-gradient-to-tr from-purple-600 to-blue-500"
      },
      {
        id: 4,
        name: "Trần Bình",
        avatar: "TB",
        role: "Học viên",
        lastMessage: "Đi cafe học bài không ông?",
        lastMessageTimeFormatted: "3 giờ trước",
        unreadCount: 0,
        isOnline: true,
        conversationType: "INDIVIDUAL",
        avatarColor: "bg-rose-500"
      }
    ];
    setConversations(mockConversations);
    if (mockConversations.length > 0 && !selectedChat) {
      setSelectedChat(mockConversations[0]);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/messaging/conversations/${conversationId}/messages?page=0&size=50`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock messages');
    }

    // Mock messages
    const mockMessages = [
      { id: 1, senderId: 2, senderName: "Cô Minh Thư", senderAvatarInitial: "MT", content: "Phần cấu hình JWT Filter đang gặp chút vấn đề về logic.", messageType: "TEXT", timeFormatted: "09:00 AM", isFromMe: false },
      { id: 2, senderId: 1, senderName: "Huy", senderAvatarInitial: "H", content: "Dạ em chào cô ạ, lỗi đó nằm ở đâu vậy cô?", messageType: "TEXT", timeFormatted: "09:05 AM", isFromMe: true },
      { id: 3, senderId: 2, senderName: "Cô Minh Thư", senderAvatarInitial: "MT", content: "Em nhớ xem kỹ phần Security bài 12 nhé! Cô có đính kèm tài liệu bổ sung ở đây.", messageType: "FILE", timeFormatted: "09:06 AM", isFromMe: false, attachments: [{ fileName: "JWT_EXPERT_NOTE.PDF", fileUrl: "#" }] }
    ];
    setMessages(mockMessages);
  };

  const markAsRead = async (conversationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(
          `http://localhost:8080/api/v1/messaging/conversations/${conversationId}/read`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      }
    } catch (error) {
      console.log('Error marking as read');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() && selectedFiles.length === 0) return;

    const attachmentUrls = [];
    
    // Upload files first
    if (selectedFiles.length > 0) {
      try {
        const token = localStorage.getItem('accessToken');
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await fetch('http://localhost:8080/api/v1/messaging/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            attachmentUrls.push(uploadData.fileUrl);
          }
        }
      } catch (error) {
        console.log('Error uploading files');
      }
    }

    // Send message
    try {
      const token = localStorage.getItem('accessToken');
      const messageType = selectedFiles.length > 0 ? (selectedFiles[0].type.startsWith('image/') ? 'IMAGE' : 'FILE') : 'TEXT';
      
      const response = await fetch(
        `http://localhost:8080/api/v1/messaging/conversations/${selectedChat.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: messageContent,
            messageType: messageType,
            attachmentUrls: attachmentUrls
          })
        }
      );

      if (response.ok) {
        setMessageContent('');
        setSelectedFiles([]);
        loadMessages(selectedChat.id);
        loadConversations(); // Refresh conversation list
      }
    } catch (error) {
      console.log('Error sending message');
    }
  };

  const handleVoiceCall = () => {
    // TODO: Implement voice call (WebRTC or integrate with Twilio, etc.)
    alert('Voice call feature coming soon');
  };

  const handleVideoCall = () => {
    // TODO: Implement video call (WebRTC or integrate with Twilio, etc.)
    alert('Video call feature coming soon');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter(conv => {
    if (activeFilter === 'all') return true;
    return conv.conversationType?.toLowerCase() === activeFilter.toLowerCase();
  });

  const currentUser = { name: 'Huy', avatar: 'H' };

  return (
    <div className="messaging-page">
      {/* Left Sidebar */}
      <aside className="messaging-sidebar-left">
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <h2>TIN NHẮN</h2>
            <button className="icon-btn">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm hội thoại..." 
              className="search-input"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { id: 'all', label: 'TẤT CẢ' },
            { id: 'individual', label: 'CÁ NHÂN' },
            { id: 'group', label: 'NHÓM HỌC' },
            { id: 'ai', label: 'UPNEST' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversations List */}
        <div className="conversations-list">
          {filteredConversations.map(chat => (
            <div
              key={chat.id}
              className={`conversation-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="conversation-avatar-wrapper">
                <div className={`conversation-avatar ${chat.avatarColor || 'bg-indigo-600'}`}>
                  {chat.avatar}
                </div>
                {chat.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header-row">
                  <h4>{chat.name}</h4>
                  <span className="conversation-time">{chat.lastMessageTimeFormatted}</span>
                </div>
                <div className="conversation-message-row">
                  <p className={chat.unreadCount > 0 ? 'unread' : ''}>{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="messaging-main">
        {selectedChat ? (
          <>
            <header className="chat-header">
              <div className="chat-header-left">
                <div className={`chat-avatar ${selectedChat.avatarColor || 'bg-indigo-600'}`}>
                  {selectedChat.avatar}
                </div>
                <div className="chat-info">
                  <h3>{selectedChat.name}</h3>
                  <div className="chat-status">
                    {selectedChat.isOnline ? (
                      <span className="online-status">
                        <span className="status-dot"></span>
                        TRỰC TUYẾN
                      </span>
                    ) : (
                      <span className="offline-status">Ngoại tuyến</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="icon-btn" onClick={handleVoiceCall}>
                  <Phone size={20} />
                </button>
                <button className="icon-btn" onClick={handleVideoCall}>
                  <Video size={20} />
                </button>
                <button 
                  className={`icon-btn ${showDetails ? 'active' : ''}`}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Info size={20} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="messages-container">
              <div className="messages-list">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`message-wrapper ${msg.isFromMe ? 'from-me' : 'from-them'}`}
                  >
                    <div className="message-avatar">{msg.senderAvatarInitial}</div>
                    <div className="message-content-wrapper">
                      <div className={`message-bubble ${msg.isFromMe ? 'me' : 'them'}`}>
                        <p>{msg.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="message-attachments">
                            {msg.attachments.map((att, idx) => (
                              <div key={idx} className="attachment-item">
                                <FileText size={20} />
                                <span>{att.fileName}</span>
                                <Download size={16} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="message-time">{msg.timeFormatted}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              {selectedFiles.length > 0 && (
                <div className="selected-files-preview">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="file-preview">
                      <span>{file.name}</span>
                      <button onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="message-input-wrapper">
                <div className="input-actions-left">
                  <button 
                    className="input-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  <button 
                    className="input-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
                <input
                  type="text"
                  className="message-input"
                  placeholder="Nhập nội dung tin nhắn hoặc '/' để dùng câu lệnh AI..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <div className="input-actions-right">
                  <button className="input-action-btn">
                    <Smile size={20} />
                  </button>
                  <button className="send-btn" onClick={handleSendMessage}>
                    <Send size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Chọn cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </section>

      {/* Right Sidebar - Details */}
      {showDetails && selectedChat && (
        <aside className="messaging-sidebar-right">
          <div className="details-content">
            {/* Profile */}
            <div className="profile-section">
              <div className={`profile-avatar-large ${selectedChat.avatarColor || 'bg-indigo-600'}`}>
                {selectedChat.avatar}
              </div>
              <h3>{selectedChat.name}</h3>
              <p className="profile-role">{selectedChat.role}</p>
            </div>

            {/* Actions */}
            <div className="details-actions">
              <button className="details-action-btn">
                <User size={20} />
                Xem hồ sơ
              </button>
              <button className="details-action-btn">
                <BellOff size={20} />
                Tắt thông báo
              </button>
              <button className="details-action-btn danger">
                <Trash2 size={20} />
                Xóa hội thoại
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

