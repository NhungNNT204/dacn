/**
 * Component: ChatList
 * Purpose: Display list of conversations (personal, group, classroom)
 * Features: Search, unread badge, last message preview, user avatars, loading & error handling
 */

import React, { useState, useMemo, useEffect } from 'react';
import { MessageCircle, Users, BookOpen, Search, X } from 'lucide-react';
import './ChatList.css';
import chatService from '../services/chatService';

export default function ChatList({
  conversations: propConversations = [],
  selectedConversation = null,
  onSelectConversation = () => {},
  onCreateChat = () => {},
  currentUser = {},
  unreadCounts: propUnreadCounts = {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, personal, group, classroom
  const [conversations, setConversations] = useState(propConversations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState(propUnreadCounts);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load conversations from chat service
  const loadConversations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await chatService.getConversations();
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        setError('Failed to load conversations');
        setConversations(propConversations);
      }
    } catch (err) {
      console.error('Load conversations error:', err);
      setError(err.message);
      setConversations(propConversations);
    } finally {
      setIsLoading(false);
    }
  };

  // Load unread counts
  useEffect(() => {
    loadUnreadCounts();
  }, []);

  const loadUnreadCounts = async () => {
    try {
      const result = await chatService.getUnreadCounts();
      if (result.success && result.data) {
        setUnreadCounts(result.data);
      }
    } catch (err) {
      console.error('Load unread counts error:', err);
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Type filter
      if (filterType !== 'all' && conv.type !== filterType) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          conv.name?.toLowerCase().includes(query) ||
          conv.participants?.some(p => p.name?.toLowerCase().includes(query)) ||
          conv.lastMessage?.content?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [conversations, searchQuery, filterType]);

  // Sort by last message time
  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || 0).getTime();
      const timeB = new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA;
    });
  }, [filteredConversations]);

  const getConversationIcon = (type) => {
    switch (type) {
      case 'personal':
        return <MessageCircle size={16} className="chat-type-icon" />;
      case 'group':
        return <Users size={16} className="chat-type-icon" />;
      case 'classroom':
        return <BookOpen size={16} className="chat-type-icon" />;
      default:
        return <MessageCircle size={16} className="chat-type-icon" />;
    }
  };

  const getConversationName = (conv) => {
    if (conv.type === 'personal') {
      const otherUser = conv.participants.find(p => p.id !== currentUser.id);
      return otherUser?.name || 'Unknown';
    }
    return conv.name || 'Conversation';
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="chat-list-container">
      {/* Header */}
      <div className="chat-list-header">
        <h2>Messages</h2>
        <button
          className="new-chat-btn"
          onClick={() => onCreateChat()}
          title="New conversation"
        >
          +
        </button>
      </div>

      {/* Search */}
      <div className="chat-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="chat-filter-tabs">
        <button
          className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filterType === 'personal' ? 'active' : ''}`}
          onClick={() => setFilterType('personal')}
        >
          <MessageCircle size={14} /> Personal
        </button>
        <button
          className={`filter-tab ${filterType === 'group' ? 'active' : ''}`}
          onClick={() => setFilterType('group')}
        >
          <Users size={14} /> Groups
        </button>
        <button
          className={`filter-tab ${filterType === 'classroom' ? 'active' : ''}`}
          onClick={() => setFilterType('classroom')}
        >
          <BookOpen size={14} /> Class
        </button>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button onClick={loadConversations} className="retry-btn">
              Retry
            </button>
          </div>
        ) : sortedConversations.length > 0 ? (
          sortedConversations.map((conv) => {
            const isSelected = selectedConversation?.id === conv.id;
            const unreadCount = unreadCounts[conv.id] || 0;

            return (
              <div
                key={conv.id}
                className={`conversation-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectConversation(conv)}
              >
                {/* Avatar */}
                <div className="conversation-avatar">
                  {conv.avatar ? (
                    <img src={conv.avatar} alt={getConversationName(conv)} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getConversationIcon(conv.type)}
                    </div>
                  )}
                  {conv.isOnline && <div className="online-indicator" />}
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

                  <div className="conversation-preview">
                    {conv.lastMessage ? (
                      <>
                        <span className="preview-sender">
                          {conv.lastMessage.senderName === currentUser.name
                            ? 'You'
                            : conv.lastMessage.senderName}
                          :
                        </span>
                        <span className="preview-text">
                          {conv.lastMessage.content.substring(0, 40)}
                          {conv.lastMessage.content.length > 40 ? '...' : ''}
                        </span>
                        {conv.lastMessage.attachment && (
                          <span className="preview-attachment">📎</span>
                        )}
                      </>
                    ) : (
                      <span className="preview-empty">No messages yet</span>
                    )}
                  </div>
                </div>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                  <div className="unread-badge">{unreadCount}</div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-conversations">
            <MessageCircle size={32} />
            <p>No conversations yet</p>
            <button onClick={() => onCreateChat?.()} className="start-chat-btn">
              Start a conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
