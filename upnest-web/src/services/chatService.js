/**
 * Chat Service for Messaging System
 * Purpose: Handle all chat operations (messages, conversations, media, etc)
 */

import mockUserService from './mockUserService';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const USE_MOCK_SERVICE = true;

class ChatService {
  constructor() {
    this.messageListeners = [];
    this.typingListeners = [];
  }

  /**
   * Get all conversations (1-1, group, classroom)
   */
  async getConversations(filters = {}) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.getConversations();
      }

      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/chat/conversations?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      return data || { success: true, data: [] };
    } catch (error) {
      console.error('Get conversations error:', error);
      return await mockUserService.getConversations();
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId, options = {}) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.getMessages(conversationId, options);
      }

      const params = new URLSearchParams({
        limit: options.limit || 50,
        offset: options.offset || 0
      });

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return data || { success: true, data: { messages: [] } };
    } catch (error) {
      console.error('Get messages error:', error);
      return await mockUserService.getMessages(conversationId, options);
    }
  }

  /**
   * Send a message (text, with media, with attachments)
   */
  async sendMessage(conversationId, messageData) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.sendMessage(conversationId, messageData);
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(messageData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Notify listeners
      this.messageListeners.forEach(listener => {
        if (listener.conversationId === conversationId) {
          listener.callback(data.data);
        }
      });

      return data || { success: true, data: messageData };
    } catch (error) {
      console.error('Send message error:', error);
      return await mockUserService.sendMessage(conversationId, messageData);
    }
  }

  /**
   * Create a new conversation
   * Types: 'personal' (1-1), 'group' (1-N), 'classroom' (1-All)
   */
  async createConversation(type, data) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.createConversation(type, data);
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ type, ...data })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const result = await response.json();
      return result || { success: true, data: {} };
    } catch (error) {
      console.error('Create conversation error:', error);
      return await mockUserService.createConversation(type, data);
    }
  }

  /**
   * Search conversations
   */
  async searchConversations(query) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.searchConversations(query);
      }

      const params = new URLSearchParams({ q: query });
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/search?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search conversations');
      }

      const data = await response.json();
      return data || { success: true, data: [] };
    } catch (error) {
      console.error('Search conversations error:', error);
      return await mockUserService.searchConversations(query);
    }
  }

  /**
   * Upload media/files
   * Supports: images (jpg, png, gif), videos (mp4, webm), documents (pdf, docx, xlsx, etc)
   */
  async uploadMedia(file, conversationId) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.uploadMedia(file, conversationId);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await fetch(
        `${API_BASE_URL}/chat/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data || { success: true, data: {} };
    } catch (error) {
      console.error('Upload media error:', error);
      return await mockUserService.uploadMedia(file, conversationId);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    try {
      if (USE_MOCK_SERVICE) {
        return await mockUserService.markAsRead(messageId);
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/messages/${messageId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark as read error:', error);
      return { success: false };
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(conversationId, messageId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true, data: { messageId } });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete message error:', error);
      return { success: false };
    }
  }

  /**
   * Edit a message
   */
  async editMessage(conversationId, messageId, content) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true, data: { messageId, content } });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ content })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to edit message');
      }

      return await response.json();
    } catch (error) {
      console.error('Edit message error:', error);
      return { success: false };
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/typing`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      return { success: response.ok };
    } catch (error) {
      console.error('Typing indicator error:', error);
      return { success: false };
    }
  }

  /**
   * Register message listener
   */
  onMessage(conversationId, callback) {
    this.messageListeners.push({ conversationId, callback });
    
    return () => {
      this.messageListeners = this.messageListeners.filter(
        l => !(l.conversationId === conversationId && l.callback === callback)
      );
    };
  }

  /**
   * Register typing listener
   */
  onTyping(conversationId, callback) {
    this.typingListeners.push({ conversationId, callback });
    
    return () => {
      this.typingListeners = this.typingListeners.filter(
        l => !(l.conversationId === conversationId && l.callback === callback)
      );
    };
  }

  /**
   * Get unread message count
   */
  async getUnreadCounts() {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true, data: {} });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/unread-counts`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get unread counts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get unread counts error:', error);
      return { success: false, data: {} };
    }
  }

  /**
   * Add member to group/classroom
   */
  async addMember(conversationId, userId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ userId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      return await response.json();
    } catch (error) {
      console.error('Add member error:', error);
      return { success: false };
    }
  }

  /**
   * Remove member from group/classroom
   */
  async removeMember(conversationId, userId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/members/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      return await response.json();
    } catch (error) {
      console.error('Remove member error:', error);
      return { success: false };
    }
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/archive`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to archive conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Archive conversation error:', error);
      return { success: false };
    }
  }

  /**
   * Pin conversation
   */
  async pinConversation(conversationId) {
    try {
      if (USE_MOCK_SERVICE) {
        return Promise.resolve({ success: true });
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/pin`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to pin conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Pin conversation error:', error);
      return { success: false };
    }
  }
}

export default new ChatService();
