/**
 * Notification Service - Quản lý thông báo
 */
const API_BASE = 'http://localhost:8080/api/v1/social/notifications';

/**
 * Lấy danh sách thông báo với phân trang
 */
export const getNotifications = async (page = 0, size = 20) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return getMockNotifications(page, size);
    }

    const response = await fetch(`${API_BASE}?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
  
  return getMockNotifications(page, size);
};

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const getUnreadCount = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return 3; // Mock
    }

    const response = await fetch(`${API_BASE}/unread/count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.count || 0;
    }
  } catch (error) {
    console.error('Error fetching unread count:', error);
  }
  
  return 3; // Mock
};

/**
 * Đánh dấu thông báo là đã đọc
 */
export const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    await fetch(`${API_BASE}/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    await fetch(`${API_BASE}/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
};

/**
 * Mock data cho development
 */
const getMockNotifications = (page, size) => {
  const mockNotifications = [
    {
      id: 1,
      type: 'LIKE',
      title: 'Ai đó đã thích bài viết của bạn',
      message: 'Nguyễn Văn A đã thích bài viết "Java Basics"',
      senderName: 'Nguyễn Văn A',
      senderAvatar: null,
      isRead: false,
      createdAt: '2025-01-15T10:30:00'
    },
    {
      id: 2,
      type: 'COMMENT',
      title: 'Bình luận mới',
      message: 'Trần Thị B đã bình luận: "Bài viết rất hữu ích!"',
      senderName: 'Trần Thị B',
      senderAvatar: null,
      isRead: false,
      createdAt: '2025-01-15T09:15:00'
    },
    {
      id: 3,
      type: 'FOLLOW',
      title: 'Người theo dõi mới',
      message: 'Lê Văn C đã bắt đầu theo dõi bạn',
      senderName: 'Lê Văn C',
      senderAvatar: null,
      isRead: false,
      createdAt: '2025-01-15T08:00:00'
    }
  ];

  return {
    notifications: mockNotifications.slice(page * size, (page + 1) * size),
    totalElements: mockNotifications.length,
    totalPages: Math.ceil(mockNotifications.length / size),
    currentPage: page,
    pageSize: size,
    hasNext: (page + 1) * size < mockNotifications.length,
    hasPrevious: page > 0
  };
};
