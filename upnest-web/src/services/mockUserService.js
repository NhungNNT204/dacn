/**
 * Mock User Service
 * Purpose: Provide mock user data when backend is not available
 * Will be replaced with real API calls when backend is ready
 */

// Mock user data
const mockUser = {
  id: 'user-123',
  name: 'Nguyễn Văn A',
  email: 'nguyenvanA@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
  role: 'STUDENT',
  class: 'Lớp 10A1',
  school: 'Trường THPT Cnhungên Sư Phạm',
  joinDate: '2024-01-15',
  bio: 'Sinh viên năng động, yêu thích học tập',
  status: 'online',
  lastSeen: new Date().toISOString()
};

// Mock conversations data
const mockConversations = [
  {
    id: 'conv-1',
    type: 'personal',
    name: 'Trần Thị B',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff',
    participants: [
      { id: 'user-456', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff' }
    ],
    lastMessage: {
      content: 'Bài tập hôm nay làm thế nào?',
      sender: 'user-456',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unreadCount: 2,
    createdAt: '2024-01-20',
    messages: []
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Nhóm Lý 10A1',
    avatar: 'https://ui-avatars.com/api/?name=Group+Ly&background=4ECDC4&color=fff',
    participants: [
      { id: 'user-123', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
      { id: 'user-456', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff' },
      { id: 'user-789', name: 'Lê Minh C', avatar: 'https://ui-avatars.com/api/?name=Le+Minh+C&background=95E1D3&color=fff' }
    ],
    lastMessage: {
      content: 'C ơi, qua tới hôm nay để làm bài tập nhé',
      sender: 'user-456',
      senderName: 'Trần Thị B',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: '2024-02-10',
    messages: []
  },
  {
    id: 'conv-3',
    type: 'classroom',
    name: 'Lớp 10A1',
    avatar: 'https://ui-avatars.com/api/?name=Class+10A1&background=FFD93D&color=fff',
    participants: [
      { id: 'teacher-001', name: 'Thầy Trần nhung', avatar: 'https://ui-avatars.com/api/?name=Thay+Tran+nhung&background=FF6348&color=fff', role: 'TEACHER' },
      { id: 'user-123', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
      { id: 'user-456', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff' }
    ],
    lastMessage: {
      content: 'Buổi học hôm nay thảo luận về chủ đề: Định luật bảo toàn năng lượng',
      sender: 'teacher-001',
      senderName: 'Thầy Trần nhung',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: '2023-09-01',
    messages: []
  }
];

// Mock messages for a conversation
const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      sender: 'user-456',
      senderName: 'Trần Thị B',
      senderAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff',
      content: 'Hôm nay có bài tập không?',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      sender: 'user-123',
      senderName: 'Nguyễn Văn A',
      senderAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
      content: 'Có, thầy giao bài về phương trình bậc 2',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      sender: 'user-456',
      senderName: 'Trần Thị B',
      senderAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff',
      content: 'Bài tập hôm nay làm thế nào?',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false
    }
  ],
  'conv-2': [
    {
      id: 'msg-1',
      conversationId: 'conv-2',
      sender: 'user-789',
      senderName: 'Lê Minh C',
      senderAvatar: 'https://ui-avatars.com/api/?name=Le+Minh+C&background=95E1D3&color=fff',
      content: 'Các bạn ơi, ai đã làm xong bài tập chưa?',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-2',
      conversationId: 'conv-2',
      sender: 'user-456',
      senderName: 'Trần Thị B',
      senderAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff',
      content: 'Mình đã làm được 80%, còn mấy bài khó',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-3',
      conversationId: 'conv-2',
      sender: 'user-456',
      senderName: 'Trần Thị B',
      senderAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=FF6B6B&color=fff',
      content: 'C ơi, qua tới hôm nay để làm bài tập nhé',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false
    }
  ],
  'conv-3': [
    {
      id: 'msg-1',
      conversationId: 'conv-3',
      sender: 'teacher-001',
      senderName: 'Thầy Trần nhung',
      senderAvatar: 'https://ui-avatars.com/api/?name=Thay+Tran+nhung&background=FF6348&color=fff',
      content: 'Buổi học hôm nay thảo luận về chủ đề: Định luật bảo toàn năng lượng',
      type: 'text',
      attachments: [],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true
    }
  ]
};

class MockUserService {
  // Get current user profile
  async getProfile() {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { ...mockUser },
          message: 'Profile loaded successfully'
        });
      }, 500);
    });
  }

  // Get all conversations
  async getConversations() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockConversations,
          message: 'Conversations loaded successfully'
        });
      }, 300);
    });
  }

  // Get messages for a specific conversation
  async getMessages(conversationId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = mockMessages[conversationId] || [];
        resolve({
          success: true,
          data: {
            messages: messages.slice(0, limit),
            total: messages.length,
            hasMore: messages.length > limit
          },
          message: 'Messages loaded successfully'
        });
      }, 300);
    });
  }

  // Send message
  async sendMessage(conversationId, messageData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          sender: 'user-123',
          senderName: mockUser.name,
          senderAvatar: mockUser.avatar,
          ...messageData,
          timestamp: new Date().toISOString(),
          isRead: false
        };

        // Add to mock messages
        if (!mockMessages[conversationId]) {
          mockMessages[conversationId] = [];
        }
        mockMessages[conversationId].push(newMessage);

        resolve({
          success: true,
          data: newMessage,
          message: 'Message sent successfully'
        });
      }, 200);
    });
  }

  // Create conversation
  async createConversation(type, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversation = {
          id: `conv-${Date.now()}`,
          type,
          ...data,
          createdAt: new Date().toISOString(),
          messages: []
        };

        mockConversations.push(newConversation);

        resolve({
          success: true,
          data: newConversation,
          message: 'Conversation created successfully'
        });
      }, 300);
    });
  }

  // Search conversations
  async searchConversations(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockConversations.filter(conv =>
          conv.name?.toLowerCase().includes(query.toLowerCase()) ||
          conv.participants?.some(p => p.name?.toLowerCase().includes(query.toLowerCase()))
        );

        resolve({
          success: true,
          data: results,
          message: 'Search completed'
        });
      }, 200);
    });
  }

  // Mark message as read
  async markAsRead(messageId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { messageId, isRead: true },
          message: 'Message marked as read'
        });
      }, 100);
    });
  }

  // Upload file/media
  async uploadMedia(file, conversationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate file upload
        const fileSize = file.size || 0;
        const fileName = file.name || 'Unknown';

        resolve({
          success: true,
          data: {
            id: `media-${Date.now()}`,
            name: fileName,
            size: fileSize,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString()
          },
          message: 'File uploaded successfully'
        });
      }, 1000);
    });
  }
}

export default new MockUserService();
