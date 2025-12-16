/**
 * Component: ChatWindow
 * Purpose: Main chat display area with message history
 * Features: Scroll to bottom, typing indicator, online status
 */

import React, { useEffect, useRef, useState } from 'react';
import { Send, Info, Phone, Video, MoreHorizontal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import './ChatWindow.css';

export default function ChatWindow({
  conversation = null,
  messages = [],
  currentUser = {},
  onSendMessage = () => {},
  onUploadFile = () => {},
  onDeleteMessage = () => {},
  onEditMessage = () => {},
  onDownloadFile = () => {},
  onReactToMessage = () => {},
  isLoading = false,
  hasMore = false,
  onLoadMore = () => {},
  typingUsers = []
}) {
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="chat-window-empty">
        <h2>Select a conversation to start messaging</h2>
        <p>Choose a chat from the list or create a new one</p>
      </div>
    );
  }

  const getConversationTitle = () => {
    if (conversation.type === 'personal') {
      const otherUser = conversation.participants?.find(
        (p) => p.id !== currentUser.id
      );
      return otherUser?.name || 'Chat';
    }
    return conversation.name || 'Chat';
  };

  const getParticipantCount = () => {
    return conversation.participants?.length || 0;
  };

  const canDeleteMessage = (message) => {
    return (
      message.senderId === currentUser.id ||
      currentUser.role === 'teacher' ||
      currentUser.role === 'admin'
    );
  };

  const canEditMessage = (message) => {
    return message.senderId === currentUser.id;
  };

  return (
    <div className="chat-window-container">
      {/* Header */}
      <div className="chat-window-header">
        <div className="header-left">
          <div className="conversation-title-section">
            <h2 className="conversation-title">{getConversationTitle()}</h2>
            <p className="conversation-subtitle">
              {conversation.type === 'personal'
                ? conversation.isOnline
                  ? 'Online'
                  : 'Offline'
                : `${getParticipantCount()} members`}
            </p>
          </div>
        </div>

        <div className="header-right">
          {conversation.type === 'personal' && (
            <>
              <button className="header-action-btn" title="Call">
                <Phone size={20} />
              </button>
              <button className="header-action-btn" title="Video call">
                <Video size={20} />
              </button>
            </>
          )}
          <button className="header-action-btn" title="Info">
            <Info size={20} />
          </button>
          <button className="header-action-btn" title="More">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="chat-messages" ref={messageListRef}>
        {hasMore && (
          <button
            className="load-more-btn"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load earlier messages'}
          </button>
        )}

        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const showSenderInfo =
              conversation.type !== 'personal' ||
              (index > 0 && messages[index - 1]?.senderId !== message.senderId);

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showSenderInfo={showSenderInfo}
                canDeleteMessage={canDeleteMessage(message)}
                canEditMessage={canEditMessage(message)}
                onDelete={onDeleteMessage}
                onEdit={(msg) => {
                  setEditingMessageId(msg.id);
                  onEditMessage(msg);
                }}
                onDownloadFile={onDownloadFile}
                onReact={(emoji) => onReactToMessage(message.id, emoji)}
              />
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {typingUsers.length === 1
                ? `${typingUsers[0].name} is typing`
                : `${typingUsers.length} people are typing`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onUploadFile={onUploadFile}
        disabled={isLoading}
      />
    </div>
  );
}
