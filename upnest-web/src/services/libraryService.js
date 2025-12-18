/**
 * Library Service - Quản lý thư viện tài liệu số
 */
const API_BASE = 'http://localhost:8080/api/v1/library';

/**
 * Upload tài liệu mới
 */
export const uploadDocument = async (file, title, description, category, isPublic) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    formData.append('isPublic', isPublic ? 'true' : 'false');

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Upload failed');
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Lấy danh sách tài liệu của user
 */
export const getMyDocuments = async (page = 0, size = 20) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return getMockDocuments(page, size);
    }

    const response = await fetch(`${API_BASE}/my-documents?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching my documents:', error);
  }
  
  return getMockDocuments(page, size);
};

/**
 * Lấy danh sách tài liệu công khai
 */
export const getPublicDocuments = async (page = 0, size = 20) => {
  try {
    const response = await fetch(`${API_BASE}/public?page=${page}&size=${size}`);

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching public documents:', error);
  }
  
  return getMockDocuments(page, size);
};

/**
 * Tìm kiếm tài liệu
 */
export const searchDocuments = async (keyword, category, isPublic, page = 0, size = 20) => {
  try {
    const token = localStorage.getItem('accessToken');
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (isPublic !== null) params.append('isPublic', isPublic.toString());

    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/search?${params}`, {
      headers
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error searching documents:', error);
  }
  
  return getMockDocuments(page, size);
};

/**
 * Lấy tài liệu phổ biến
 */
export const getPopularDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE}/popular`);

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching popular documents:', error);
  }
  
  return [];
};

/**
 * Download tài liệu
 */
export const downloadDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/${documentId}/download`, {
      headers
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error downloading document:', error);
    return false;
  }
};

/**
 * Xóa tài liệu
 */
export const deleteDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE}/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.status === 204;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

/**
 * Lấy thống kê
 */
export const getStats = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { totalDocuments: 0 };
    }

    const response = await fetch(`${API_BASE}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
  
  return { totalDocuments: 0 };
};

/**
 * Mock data cho development
 */
const getMockDocuments = (page, size) => {
  const mockDocuments = [
    {
      id: 1,
      title: 'Java Programming Basics',
      description: 'Tài liệu cơ bản về lập trình Java',
      fileName: 'java-basics.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      category: 'TEXTBOOK',
      documentType: 'PDF',
      isPublic: true,
      downloadCount: 150,
      viewCount: 500,
      userName: 'Nguyễn Văn A',
      createdAt: '2025-01-10T10:00:00'
    },
    {
      id: 2,
      title: 'React Hooks Guide',
      description: 'Hướng dẫn sử dụng React Hooks',
      fileName: 'react-hooks.pdf',
      fileSize: 1536000,
      mimeType: 'application/pdf',
      category: 'REFERENCE',
      documentType: 'PDF',
      isPublic: true,
      downloadCount: 200,
      viewCount: 800,
      userName: 'Trần Thị B',
      createdAt: '2025-01-08T14:30:00'
    }
  ];

  return {
    documents: mockDocuments.slice(page * size, (page + 1) * size),
    totalElements: mockDocuments.length,
    totalPages: Math.ceil(mockDocuments.length / size),
    currentPage: page,
    pageSize: size,
    hasNext: (page + 1) * size < mockDocuments.length,
    hasPrevious: page > 0
  };
};

