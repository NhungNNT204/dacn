import React, { useState } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';
import '../styles/ChatList.css';

/**
 * ChatList - Danh sách cuộc trò chuyện
 */
const ChatList = ({ conversations, selectedChat, onSelectChat, searchQuery, onSearchChange, onCreateGroup }) => {
  const [filter, setFilter] = useState('all'); // all, unread, groups, 1-1

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (filter === 'groups') return matchesSearch && conv.isGroup;
    if (filter === '1-1') return matchesSearch && !conv.isGroup;
    
    return matchesSearch;
  });

  return (
    <div className="chat-list-container">
      {/* Header */}
      <div className="chat-list-header">
        <h2>Nhắn tin</h2>
        <button className="new-chat-btn" onClick={onCreateGroup} title="Tạo nhóm mới">
          +
        </button>
      </div>

      {/* Search */}
      <div className="chat-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter Tabs */}
      <div className="chat-filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc
        </button>
        <button
          className={`filter-tab ${filter === 'groups' ? 'active' : ''}`}
          onClick={() => setFilter('groups')}
        >
          Nhóm
        </button>
        <button
          className={`filter-tab ${filter === '1-1' ? 'active' : ''}`}
          onClick={() => setFilter('1-1')}
        >
          Cá nhân
        </button>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            <MessageCircle size={48} />
            <p>Không có cuộc trò chuyện nào</p>
            <button className="start-chat-btn" onClick={onCreateGroup}>
              Tạo cuộc trò chuyện
            </button>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedChat?.id === conversation.id ? 'active' : ''}`}
              onClick={() => onSelectChat(conversation)}
            >
              {/* Avatar */}
              <div className="conversation-avatar">
                {conversation.avatar ? (
                  <img src={conversation.avatar} alt={conversation.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {conversation.isGroup && (
                  <span className="chat-type-icon" title="Nhóm chat">👥</span>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="unread-indicator"></span>
                )}
              </div>

              {/* Content */}
              <div className="conversation-content">
                <div className="conversation-header">
                  <h3 className="conversation-name">{conversation.name}</h3>
                  <span className="conversation-time">{conversation.lastMessageTime}</span>
                </div>

                <div className="conversation-preview">
                  {conversation.lastMessage && (
                    <>
                      <span className="preview-text">
                        {conversation.lastMessage.length > 40
                          ? conversation.lastMessage.substring(0, 40) + '...'
                          : conversation.lastMessage}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Unread Badge */}
              {conversation.unreadCount > 0 && (
                <div className="unread-badge">
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
