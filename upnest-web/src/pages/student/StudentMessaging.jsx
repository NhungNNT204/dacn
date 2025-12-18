/**
 * Component: StudentMessaging
 * Purpose: Complete messaging system page with chat list and window
 * Features: 1-1 chats, group chats, classroom chats, file sharing, typing indicators
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChatList from '../../components/ChatList';
import ChatWindow from '../../components/ChatWindow';
import chatService from '../../services/chatService';
import userService from '../../services/userService';
import './StudentMessaging.css';

export default function StudentMessaging({ onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageError, setMessageError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Load current user on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response.success) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    loadCurrentUser();

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load conversations when user is ready
  useEffect(() => {
    if (currentUser?.id) {
      loadConversations();
    }
  }, [currentUser?.id]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id && currentUser?.id) {
      loadMessages();
      
      // Register typing indicator listener
      const unsubscribe = chatService.onTyping(
        selectedConversation.id,
        (typingUsersList) => {
          setTypingUsers(typingUsersList);
        }
      );

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [selectedConversation?.id, currentUser?.id]);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await chatService.getConversations({
        limit: 50,
        offset: 0
      });

      if (response.success) {
        setConversations(response.data || []);
        setMessageError(null);
      } else {
        setMessageError(response.message || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setMessageError(error.message || 'Error loading conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation?.id) return;

    setIsLoadingMessages(true);
    try {
      const response = await chatService.getMessages(
        selectedConversation.id,
        { limit: 50, offset: 0 }
      );

      if (response.success) {
        setMessages(response.data || []);
        setMessageError(null);
      } else {
        setMessageError(response.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessageError(error.message || 'Error loading messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = useCallback(async (messageData) => {
    if (!selectedConversation?.id || !currentUser?.id) return;

    try {
      const response = await chatService.sendMessage(
        selectedConversation.id,
        {
          content: messageData.content,
          type: 'text',
          attachments: messageData.files || []
        }
      );

      if (response.success) {
        // Add message to local state optimistically
        const newMessage = {
          id: response.data?.id || `msg-${Date.now()}`,
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          content: messageData.content,
          timestamp: new Date().toISOString(),
          attachments: messageData.files || [],
          reactions: {},
          readBy: [currentUser.id]
        };

        setMessages([...messages, newMessage]);
        setMessageError(null);

        // Update last message in conversation
        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              lastMessage: {
                content: messageData.content,
                senderName: currentUser.name,
                timestamp: new Date().toISOString()
              },
              lastMessageTime: new Date().toISOString()
            };
          }
          return conv;
        });
        setConversations(updatedConversations);
      } else {
        setMessageError(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageError(error.message || 'Error sending message');
    }
  }, [selectedConversation?.id, currentUser?.id, messages, conversations]);

  const handleUploadFile = useCallback(async (files) => {
    if (!selectedConversation?.id || !files.length) return;

    try {
      for (const file of files) {
        await chatService.uploadMedia(file.file, selectedConversation.id);
      }
      setMessageError(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessageError(error.message || 'Error uploading file');
    }
  }, [selectedConversation?.id]);

  const handleDeleteMessage = useCallback(async (messageId) => {
    if (!selectedConversation?.id) return;

    try {
      const response = await chatService.deleteMessage(
        selectedConversation.id,
        messageId
      );

      if (response.success) {
        setMessages(messages.filter(m => m.id !== messageId));
        setMessageError(null);
      } else {
        setMessageError(response.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setMessageError(error.message || 'Error deleting message');
    }
  }, [selectedConversation?.id, messages]);

  const handleEditMessage = useCallback(async (messageId, newContent) => {
    if (!selectedConversation?.id) return;

    try {
      const response = await chatService.editMessage(
        selectedConversation.id,
        messageId,
        newContent
      );

      if (response.success) {
        setMessages(messages.map(m =>
          m.id === messageId ? { ...m, content: newContent, edited: true } : m
        ));
        setMessageError(null);
      } else {
        setMessageError(response.message || 'Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      setMessageError(error.message || 'Error editing message');
    }
  }, [selectedConversation?.id, messages]);

  const handleCreateConversation = async (type, data) => {
    try {
      const response = await chatService.createConversation(type, data);

      if (response.success) {
        const newConversation = response.data;
        setConversations([newConversation, ...conversations]);
        setSelectedConversation(newConversation);
        setMessageError(null);
      } else {
        setMessageError(response.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setMessageError(error.message || 'Error creating conversation');
    }
  };

  if (!currentUser) {
    return (
      <div className="messaging-loading">
        <div className="spinner"></div>
        <p>Loading messaging system...</p>
      </div>
    );
  }

  return (
    <div className="student-messaging">
      {/* Error Banner */}
      {messageError && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{messageError}</span>
            <button
              className="error-close"
              onClick={() => setMessageError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="messaging-container">
        {/* Chat List Panel */}
        <div className={`chat-list-panel ${selectedConversation && isMobileView ? 'hidden' : ''}`}>
          <ChatList
            conversations={conversations}
            currentUser={currentUser}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onCreateChat={() => handleCreateConversation('personal', {})}
            isLoading={isLoadingConversations}
            error={messageError}
            onRetry={loadConversations}
          />
        </div>

        {/* Chat Window Panel */}
        <div className={`chat-window-panel ${!selectedConversation && isMobileView ? 'hidden' : ''}`}>
          {selectedConversation && isMobileView && (
            <div className="mobile-header">
              <button
                className="back-btn"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <h3>{selectedConversation.name || 'Chat'}</h3>
            </div>
          )}

          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onUploadFile={handleUploadFile}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            isLoading={isLoadingMessages}
            typingUsers={typingUsers}
          />
        </div>
      </div>
    </div>
  );
}
