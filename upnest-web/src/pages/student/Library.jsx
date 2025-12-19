import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Presentation,
  Download,
  Star,
  Bookmark,
  ChevronDown,
  FileType,
  File
} from 'lucide-react';
import './Library.css';

export default function Library() {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    loadLibraryItems();
  }, [activeTab, sortBy]);

  const loadLibraryItems = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const category = activeTab === 'all' ? 'all' :
                        activeTab === 'ebooks' ? 'ebooks' :
                        activeTab === 'videos' ? 'videos' : 'documents';
        
        const response = await fetch(
          `http://localhost:8080/api/v1/library?category=${category}&sortBy=${sortBy}`, 
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setItems(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockItems = getMockItems(activeTab);
    setItems(mockItems);
    setIsLoading(false);
  };

  const getMockItems = (tab) => {
    const allItems = [
      {
        id: 1,
        title: 'Cấu trúc dữ liệu và Giải thuật cho người mới',
        fileType: 'PDF',
        category: 'LAP_TRINH',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        author: 'THS. NGUYỄN VĂN A',
        rating: 4.8,
        downloadCount: 1240,
        fileSizeFormatted: '5.0 MB'
      },
      {
        id: 2,
        title: 'VIDEO SERIES: LÀM CHỦ SPRING BOOT TRONG 30 NGÀY',
        fileType: 'MP4',
        category: 'BACKEND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        author: 'CÔ MINH THƯ',
        rating: 5.0,
        downloadCount: 3500,
        fileSizeFormatted: '100 MB'
      },
      {
        id: 3,
        title: 'UI/UX Design Principles - Slide Deck',
        fileType: 'PPTX',
        category: 'DESIGN',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        author: 'THS. TRẦN THỊ B',
        rating: 4.7,
        downloadCount: 890,
        fileSizeFormatted: '8.0 MB'
      },
      {
        id: 4,
        title: 'Clean Code - Mã sạch trong lập trình hướng đối tượng',
        fileType: 'EPUB',
        category: 'LAP_TRINH',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        author: 'ROBERT C. MARTIN',
        rating: 4.9,
        downloadCount: 2100,
        fileSizeFormatted: '3.0 MB'
      },
      {
        id: 5,
        title: 'Java Core Programming - E-book',
        fileType: 'PDF',
        category: 'LAP_TRINH',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        author: 'GS. LÊ VĂN C',
        rating: 4.6,
        downloadCount: 980,
        fileSizeFormatted: '6.5 MB'
      },
      {
        id: 6,
        title: 'React Advanced Patterns - Video Series',
        fileType: 'MP4',
        category: 'FRONTEND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        author: 'ANH MINH',
        rating: 4.8,
        downloadCount: 2400,
        fileSizeFormatted: '150 MB'
      }
    ];

    switch (tab) {
      case 'ebooks':
        return allItems.filter(item => item.fileType === 'PDF' || item.fileType === 'EPUB');
      case 'videos':
        return allItems.filter(item => item.fileType === 'MP4');
      case 'documents':
        return allItems.filter(item => item.fileType === 'PPTX' || item.fileType === 'DOCX');
      default:
        return allItems;
    }
  };

  const handleDownload = async (itemId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`http://localhost:8080/api/v1/library/${itemId}/download`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.log('Error incrementing download');
    }
  };

  const handleReadOnline = async (itemId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`http://localhost:8080/api/v1/library/${itemId}/view`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.log('Error incrementing view');
    }
    // TODO: Navigate to reader/viewer page
    window.open(`/library/view/${itemId}`, '_blank');
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return { icon: FileText, color: '#3b82f6' };
      case 'EPUB':
        return { icon: BookOpen, color: '#6366f1' };
      case 'MP4':
        return { icon: Video, color: '#ef4444' };
      case 'PPTX':
      case 'PPT':
        return { icon: Presentation, color: '#10b981' };
      default:
        return { icon: File, color: '#6b7280' };
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'LAP_TRINH': 'LẬP TRÌNH',
      'BACKEND': 'BACKEND',
      'FRONTEND': 'FRONTEND',
      'DESIGN': 'DESIGN'
    };
    return labels[category] || category;
  };

  return (
    <div className="library-page">
      <div className="library-container">
        {/* Header */}
        <div className="library-header">
          <h1>Thư viện số</h1>
          <p className="library-subtitle">
            Khám phá hàng nghìn tài liệu, video và sách điện tử từ cộng đồng
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="library-tabs">
          <button 
            className={`library-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            TẤT CẢ
          </button>
          <button 
            className={`library-tab ${activeTab === 'ebooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('ebooks')}
          >
            E-BOOKS
          </button>
          <button 
            className={`library-tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            VIDEO HỌC TẬP
          </button>
          <button 
            className={`library-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            TÀI LIỆU & SLIDE
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="library-toolbar">
          <div className="sort-dropdown-wrapper">
            <button 
              className="sort-dropdown-btn"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              {sortBy === 'popular' ? 'Phổ biến nhất' : 'Mới nhất'}
              <ChevronDown size={16} />
            </button>
            {showSortDropdown && (
              <div className="sort-dropdown-menu">
                <button 
                  className={`sort-option ${sortBy === 'popular' ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy('popular');
                    setShowSortDropdown(false);
                  }}
                >
                  Phổ biến nhất
                </button>
                <button 
                  className={`sort-option ${sortBy === 'latest' ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy('latest');
                    setShowSortDropdown(false);
                  }}
                >
                  Mới nhất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="library-loading">
            <div className="spinner"></div>
            <p>Đang tải tài liệu...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="library-empty">
            <FileText size={48} />
            <p>Chưa có tài liệu nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="library-grid">
            {items.map((item) => {
              const FileIcon = getFileTypeIcon(item.fileType).icon;
              const fileColor = getFileTypeIcon(item.fileType).color;
              
              return (
                <div key={item.id} className="library-card">
                  {/* File Type Badge */}
                  <div className="file-type-badge" style={{ backgroundColor: fileColor }}>
                    <FileIcon size={16} />
                    <span>{item.fileType}</span>
                  </div>

                  {/* Thumbnail */}
                  <div className="library-thumbnail">
                    <img 
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                      alt={item.title}
                      className="thumbnail-image"
                    />
                    <div className="thumbnail-overlay">
                      <button 
                        className="read-online-btn"
                        onClick={() => handleReadOnline(item.id)}
                      >
                        ĐỌC TRỰC TUYẾN
                      </button>
                      <button 
                        className="download-btn"
                        onClick={() => handleDownload(item.id)}
                        title="Tải xuống"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="library-card-content">
                    {/* Category */}
                    <div className="library-category">
                      {getCategoryLabel(item.category)}
                    </div>

                    {/* Title */}
                    <h3 className="library-title">{item.title}</h3>

                    {/* Author */}
                    <div className="library-author">
                      TÁC GIẢ: {item.author}
                    </div>

                    {/* Footer */}
                    <div className="library-card-footer">
                      <div className="library-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="library-downloads">
                        <Download size={14} />
                        <span>{item.downloadCount.toLocaleString()}</span>
                      </div>
                      <button className="library-bookmark" title="Đánh dấu">
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

