import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Phone, Video, MoreHorizontal, X, Smile, Paperclip, Search, Menu } from 'lucide-react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import CallModal from './CallModal';
import chatService from '../../services/chatService';
import '../styles/ChatPage.css';

/**
 * ChatPage - Trang Messenger chính
 * Gồm: danh sách chat, chat box, gọi điện
 */
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load conversations khi mount
  useEffect(() => {
    loadConversations();
    
    // Kết nối WebSocket
    chatService.connectWebSocket(
      1, // userId
      handleWebSocketMessage,
      setConnectionStatus
    );
    
    return () => {
      chatService.disconnectWebSocket();
    };
  }, []);

  // Load messages khi chọn chat
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  // Scroll xuống khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations(1);
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải cuộc trò chuyện:', error);
    }
  };

  const loadMessages = async (chatGroupId) => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(chatGroupId);
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải tin nhắn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSocketMessage = (data) => {
    // Xử lý message từ WebSocket
    if (data.type === 'message') {
      if (selectedChat?.id === data.chatGroupId) {
        setMessages(prev => [...prev, data.message]);
      }
    } else if (data.type === 'typing') {
      console.log(`${data.userName} đang gõ...`);
    } else if (data.type === 'call') {
      console.log('Cuộc gọi đến:', data);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const content = messageInput;
    setMessageInput('');

    try {
      const result = await chatService.sendMessage(selectedChat.id, content);
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  const handleSendMedia = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const mediaUrl = URL.createObjectURL(file);
        try {
          const result = await chatService.sendMessage(
            selectedChat.id,
            '',
            type === 'image' ? 'IMAGE' : 'VIDEO',
            mediaUrl
          );
          if (result.success) {
            setMessages(prev => [...prev, result.data]);
          }
        } catch (error) {
          console.error('Lỗi khi gửi media:', error);
        }
      }
    };
    input.click();
  };

  const handleCallClick = (type) => {
    setCallType(type);
    setShowCallModal(true);
  };

  const handleMakeCall = async () => {
    try {
      const result = await chatService.initiateCall(selectedChat.id, callType);
      if (result.success) {
        console.log('Cuộc gọi được khởi tạo');
      }
    } catch (error) {
      console.error('Lỗi khi gọi:', error);
    }
    setShowCallModal(false);
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await chatService.addReaction(messageId, emoji);
      // Cập nhật message UI
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: { ...msg.reactions, [emoji]: (msg.reactions?.[emoji] || 0) + 1 } }
            : msg
        )
      );
    } catch (error) {
      console.error('Lỗi khi thêm reaction:', error);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat List */}
        <ChatList
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateGroup={() => setShowCreateGroup(true)}
        />

        {/* Chat Box */}
        {selectedChat ? (
          <ChatBox
            chat={selectedChat}
            messages={messages}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSendMessage={handleSendMessage}
            onSendMedia={handleSendMedia}
            onCall={() => handleCallClick('VOICE')}
            onVideoCall={() => handleCallClick('VIDEO')}
            onAddReaction={handleAddReaction}
            messagesEndRef={messagesEndRef}
            connectionStatus={connectionStatus}
            isLoading={isLoading}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Chọn cuộc trò chuyện để bắt đầu</h2>
              <p>Chọn một tin nhắn từ danh sách hoặc tạo cuộc trò chuyện mới</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <CallModal
          chatName={selectedChat?.name}
          callType={callType}
          onAccept={handleMakeCall}
          onReject={() => setShowCallModal(false)}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreated={(group) => {
            setConversations(prev => [...prev, group]);
            setShowCreateGroup(false);
          }}
        />
      )}
    </div>
  );
};

/**
 * CreateGroupModal - Modal tạo group chat
 */
const CreateGroupModal = ({ onClose, onCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    try {
      const result = await chatService.createGroupChat({
        name: groupName,
        description: '',
        memberIds: selectedMembers
      });
      if (result.success) {
        onCreated(result.data);
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tạo nhóm chat</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <input
            type="text"
            placeholder="Tên nhóm"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-input"
          />
          
          <div className="members-selector">
            <label>Thêm thành viên</label>
            {/* Member selection UI */}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
