import React, { useState, useEffect } from 'react';
import { Users, Phone, AlertCircle, Menu, X } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import chatService from '../../../services/chatService';
import '../styles/StudentChat.css';

const StudentChat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState(null);

  // Initialize chat service
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      // Initialize WebSocket connection
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        await chatService.initWebSocket(userId, token);
      }

      // Load conversations
      const result = await chatService.getConversations();
      if (result.success) {
        setConversations(result.data);
        // Select first conversation by default if available
        if (result.data.length > 0 && !selectedConversation) {
          setSelectedConversation(result.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setError('Không thể khởi tạo chat. Vui lòng tải lại trang.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setIsMobileMenuOpen(false);
  };

  const handleNewChat = (type) => {
    setNewChatType(type);
    setShowNewChatModal(true);
  };

  const handleCreateNewChat = async (participantIds, groupName) => {
    try {
      let result;

      if (newChatType === '1:1' && participantIds.length === 1) {
        result = await chatService.createPrivateChat(participantIds[0]);
      } else if (newChatType === 'group' && participantIds.length > 0) {
        result = await chatService.createGroupChat(
          groupName || 'Nhóm mới',
          participantIds
        );
      }

      if (result.success) {
        setConversations(prev => [result.data, ...prev]);
        setSelectedConversation(result.data);
        setShowNewChatModal(false);
        setNewChatType(null);
        setIsMobileMenuOpen(false);
      } else {
        setError(result.message || 'Không thể tạo cuộc hội thoại mới');
      }
    } catch (err) {
      console.error('Failed to create new chat:', err);
      setError('Lỗi khi tạo cuộc hội thoại mới');
    }
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
    setIsMobileMenuOpen(true);
  };

  if (isInitializing) {
    return (
      <div className="student-chat loading">
        <div className="spinner" />
        <p>Đang khởi tạo chat...</p>
      </div>
    );
  }

  return (
    <div className="student-chat">
      {/* Error Banner */}
      {error && (
        <div className="chat-error-banner">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)}>Đóng</button>
        </div>
      )}

      {/* Main Container */}
      <div className="chat-main-container">
        {/* Sidebar - Desktop */}
        <div className={`chat-sidebar-wrapper desktop-sidebar`}>
          <ChatSidebar
            activeConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Sidebar - Mobile */}
        <div className={`chat-sidebar-wrapper mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-header">
            <h2>Tin nhắn</h2>
            <button
              className="close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ChatSidebar
            activeConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Chat Window */}
        <div className="chat-window-wrapper">
          {selectedConversation ? (
            <>
              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                title="Hiển thị cuộc hội thoại"
              >
                <Menu className="w-5 h-5" />
              </button>

              <ChatWindow
                conversation={selectedConversation}
                onClose={handleCloseChat}
              />
            </>
          ) : (
            <div className="chat-window-empty">
              <div className="empty-state">
                <Users className="w-16 h-16" />
                <h3>Chọn một cuộc hội thoại</h3>
                <p>Chọn bên trái để bắt đầu trò cnhungện</p>
                <button
                  className="btn-create-chat"
                  onClick={() => handleNewChat('1:1')}
                >
                  <Phone className="w-4 h-4" />
                  Tạo cuộc hội thoại mới
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          type={newChatType}
          onClose={() => {
            setShowNewChatModal(false);
            setNewChatType(null);
          }}
          onCreate={handleCreateNewChat}
        />
      )}
    </div>
  );
};

// New Chat Modal Component
const NewChatModal = ({ type, onClose, onCreate }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = async () => {
    // Mock available users
    const mockUsers = [
      { id: 'user-2', name: 'Nguyễn Minh Tuấn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tuán' },
      { id: 'user-3', name: 'Trần Thị Phương', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong' },
      { id: 'user-4', name: 'Lê Văn Hùng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hung' },
      { id: 'user-5', name: 'Phạm Thị Linh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linh' },
      { id: 'user-6', name: 'Hoàng Anh Tuấn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ATeam' }
    ];
    setAvailableUsers(mockUsers);
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedUsers.find(u => u.id === user.id)
  );

  const handleSelectUser = (user) => {
    if (type === '1:1' && selectedUsers.length === 0) {
      setSelectedUsers([user]);
    } else if (type === 'group') {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreate = () => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất một người');
      return;
    }

    if (type === 'group' && !groupName.trim()) {
      alert('Vui lòng nhập tên nhóm');
      return;
    }

    onCreate(
      selectedUsers.map(u => u.id),
      groupName
    );
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {type === '1:1'
              ? 'Tạo cuộc hội thoại riêng'
              : 'Tạo nhóm chat mới'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          {/* Group Name Input */}
          {type === 'group' && (
            <div className="form-group">
              <label htmlFor="group-name">Tên nhóm</label>
              <input
                id="group-name"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm"
                className="form-input"
              />
            </div>
          )}

          {/* Search Users */}
          <div className="form-group">
            <label htmlFor="search-users">
              {type === '1:1' ? 'Chọn người' : 'Thêm thành viên'}
            </label>
            <input
              id="search-users"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="form-input"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="selected-users">
              {selectedUsers.map(user => (
                <div key={user.id} className="selected-user-chip">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Available Users */}
          <div className="available-users">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy người dùng</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  className="user-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={selectedUsers.length === 0}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
