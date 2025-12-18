import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Users, Megaphone, X } from 'lucide-react';
import chatService from '../../../services/chatService';
import '../styles/ChatSidebar.css';

const ChatSidebar = ({ activeConversationId, onSelectConversation, onNewChat }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const result = await chatService.getConversations();
      if (result.success) {
        setConversations(result.data);
        setFilteredConversations(result.data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter conversations based on search and type
  useEffect(() => {
    let filtered = conversations;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(conv => conv.type === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv => {
        const name = conv.type === '1:1'
          ? conv.participantName
          : conv.type === 'group'
          ? conv.groupName
          : conv.channelName || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredConversations(filtered);
  }, [searchQuery, selectedFilter, conversations]);

  const getConversationName = (conv) => {
    if (conv.type === '1:1') return conv.participantName;
    if (conv.type === 'group') return conv.groupName;
    return conv.channelName;
  };

  const getConversationAvatar = (conv) => {
    if (conv.type === '1:1') return conv.participantAvatar;
    if (conv.type === 'group') return conv.groupAvatar;
    return conv.channelAvatar;
  };

  const getConversationIcon = (type) => {
    switch (type) {
      case '1:1':
        return <MessageCircle className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      case 'broadcast':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const handleNewChat = (type) => {
    setShowNewChatMenu(false);
    onNewChat && onNewChat(type);
  };

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="chat-sidebar-header">
        <h2>Tin nhắn</h2>
        <div className="new-chat-menu">
          <button
            className="btn-new-chat"
            onClick={() => setShowNewChatMenu(!showNewChatMenu)}
            title="Tin nhắn mới"
          >
            <Plus className="w-5 h-5" />
          </button>
          {showNewChatMenu && (
            <div className="new-chat-dropdown">
              <button onClick={() => handleNewChat('1:1')}>
                <MessageCircle className="w-4 h-4" />
                Tin nhắn riêng
              </button>
              <button onClick={() => handleNewChat('group')}>
                <Users className="w-4 h-4" />
                Nhóm chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="chat-search-container">
        <Search className="w-4 h-4 search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm tin nhắn..."
          className="chat-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="chat-filter-tabs">
        <button
          className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-tab ${selectedFilter === '1:1' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('1:1')}
        >
          <MessageCircle className="w-3 h-3" />
          Riêng
        </button>
        <button
          className={`filter-tab ${selectedFilter === 'group' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('group')}
        >
          <Users className="w-3 h-3" />
          Nhóm
        </button>
        <button
          className={`filter-tab ${selectedFilter === 'broadcast' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('broadcast')}
        >
          <Megaphone className="w-3 h-3" />
          Thông báo
        </button>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle className="w-12 h-12" />
            <p>Không có cuộc hội thoại nào</p>
            {searchQuery && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${
                conv.unreadCount > 0 ? 'unread' : ''
              }`}
              onClick={() => onSelectConversation(conv)}
            >
              {/* Avatar */}
              <div className="conversation-avatar">
                <img
                  src={getConversationAvatar(conv)}
                  alt={getConversationName(conv)}
                  className="avatar-img"
                />
                {conv.type === '1:1' && conv.isOnline && (
                  <div className="online-indicator" />
                )}
                <div className="conversation-type-badge">
                  {getConversationIcon(conv.type)}
                </div>
              </div>

              {/* Content */}
              <div className="conversation-content">
                <div className="conversation-header">
                  <h3 className="conversation-name">
                    {getConversationName(conv)}
                  </h3>
                  <span className="conversation-time">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>

                <p className="conversation-preview">
                  {conv.lastMessage || 'Không có tin nhắn nào'}
                </p>

                {conv.type === 'group' && (
                  <div className="conversation-meta">
                    <Users className="w-3 h-3" />
                    <span>{conv.participantCount} thành viên</span>
                  </div>
                )}
              </div>

              {/* Unread Badge */}
              {conv.unreadCount > 0 && (
                <div className="unread-badge">
                  {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return messageDate.toLocaleDateString('vi-VN', {
    month: 'short',
    day: 'numeric'
  });
};

export default ChatSidebar;
