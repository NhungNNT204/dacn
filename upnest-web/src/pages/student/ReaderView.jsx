import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, X, Download, FileText, Video, ChevronRight, ChevronLeft,
  Bookmark, Highlighter, MessageCircle, Sparkles, ZoomIn, ZoomOut,
  Type, Sun, Moon, Maximize2, Minimize2, Send, FileDown
} from 'lucide-react';
import './ReaderView.css';

export default function ReaderView() {
  const { itemId, type } = useParams(); // type: 'pdf', 'video', 'epub'
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const pdfViewerRef = useRef(null);
  
  const [itemData, setItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light'); // light, dark, sepia
  const [focusMode, setFocusMode] = useState(false);
  const [showTOC, setShowTOC] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadItemData();
  }, [itemId, type]);

  const loadItemData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/library/${itemId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setItemData(data);
          loadAISummary(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockData = {
      id: itemId || 1,
      title: type === 'video' 
        ? 'VIDEO SERIES: LÀM CHỦ SPRING BOOT TRONG 30 NGÀY'
        : 'Cấu trúc dữ liệu và Giải thuật cho người mới',
      author: type === 'video' ? 'CÔ MINH THƯ' : 'THS. NGUYỄN VĂN A',
      fileType: type === 'video' ? 'MP4' : 'PDF',
      fileUrl: type === 'video' 
        ? 'https://youtu.be/N4wGWY1w9RU'
        : 'https://mozilla.github.io/pdf.js/web/viewer.html?file=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      youtubeId: type === 'video' ? 'N4wGWY1w9RU' : null,
      category: type === 'video' ? 'BACKEND' : 'LẬP TRÌNH',
      chapters: type === 'video' 
        ? [
            { id: 1, title: 'Giới thiệu Spring Boot', time: '0:00' },
            { id: 2, title: 'Setup môi trường', time: '5:30' },
            { id: 3, title: 'Tạo project đầu tiên', time: '12:15' },
            { id: 4, title: 'Cấu hình Database', time: '20:45' }
          ]
        : [
            { id: 1, title: 'Chương 1: Giới thiệu về Cấu trúc dữ liệu', page: 1 },
            { id: 2, title: 'Chương 2: Mảng và Danh sách', page: 15 },
            { id: 3, title: 'Chương 3: Cây và Đồ thị', page: 32 },
            { id: 4, title: 'Chương 4: Thuật toán tìm kiếm', page: 48 }
          ]
    };
    setItemData(mockData);
    loadAISummary(mockData);
    setIsLoading(false);
  };

  const loadAISummary = async (data) => {
    // Mock AI summary
    setTimeout(() => {
      setAiSummary('Tài liệu này cung cấp kiến thức nền tảng về cấu trúc dữ liệu và giải thuật, phù hợp cho người mới bắt đầu. Nội dung bao gồm các khái niệm cơ bản về mảng, danh sách, cây và đồ thị, cùng với các thuật toán tìm kiếm và sắp xếp phổ biến.');
      setAiSuggestions([
        { title: 'Thuật toán sắp xếp nhanh', type: 'concept' },
        { title: 'Cấu trúc dữ liệu Heap', type: 'related' },
        { title: 'Độ phức tạp thuật toán', type: 'concept' }
      ]);
    }, 500);
  };

  const handleDownload = async () => {
    if (!itemData) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(
          `http://localhost:8080/api/v1/library/${itemId}/download`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${itemData.title}.${itemData.fileType.toLowerCase()}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return;
        }
      }
    } catch (error) {
      console.log('Error downloading, using direct link');
    }

    // Fallback: Direct download
    window.open(itemData.fileUrl, '_blank');
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const handleHighlight = () => {
    if (!selectedText) return;
    const newHighlight = {
      id: Date.now(),
      text: selectedText,
      chapter: activeChapter,
      color: '#ffeb3b'
    };
    setHighlights([...highlights, newHighlight]);
    setSelectedText('');
  };

  const handleBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      chapter: activeChapter,
      title: itemData.chapters[activeChapter]?.title || `Trang ${activeChapter + 1}`
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const handleAIChat = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatMessage('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse = `Dựa trên nội dung bạn đang đọc, "${userMessage}" có thể được hiểu như sau: Đây là một khái niệm quan trọng trong lập trình, giúp bạn hiểu cách dữ liệu được tổ chức và xử lý hiệu quả.`;
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(
          `http://localhost:8080/api/v1/library/${itemId}/notes`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: notes })
          }
        );
      }
    } catch (error) {
      console.log('Error saving note');
    }
  };

  if (isLoading || !itemData) {
    return (
      <div className="reader-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải nội dung...</p>
      </div>
    );
  }

  const isVideo = itemData.fileType === 'MP4' || itemData.youtubeId;
  const isPDF = itemData.fileType === 'PDF';

  return (
    <div className={`reader-view ${theme} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Header Toolbar */}
      <div className="reader-header">
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate(-1)}>
            <X size={20} />
          </button>
          <div className="header-title">
            <h2>{itemData.title}</h2>
            <span className="header-author">{itemData.author}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={handleDownload} title="Tải xuống">
            <Download size={18} />
          </button>
          <button 
            className="header-btn" 
            onClick={() => setShowTOC(!showTOC)}
            title="Mục lục"
          >
            <BookOpen size={18} />
          </button>
          <button 
            className="header-btn" 
            onClick={() => setShowAI(!showAI)}
            title="Trợ lý AI"
          >
            <Sparkles size={18} />
          </button>
          <button 
            className="header-btn" 
            onClick={() => setFocusMode(!focusMode)}
            title="Chế độ tập trung"
          >
            {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Floating Toolbar */}
      {selectedText && (
        <div className="floating-toolbar">
          <button className="toolbar-btn" onClick={handleHighlight} title="Highlight">
            <Highlighter size={16} />
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => setShowChat(true)}
            title="Hỏi AI"
          >
            <MessageCircle size={16} />
          </button>
          <span className="toolbar-text">{selectedText.substring(0, 30)}...</span>
        </div>
      )}

      <div className="reader-content">
        {/* Left Sidebar - Table of Contents */}
        {showTOC && (
          <aside className="reader-sidebar reader-toc">
            <h3 className="sidebar-title">MỤC LỤC</h3>
            <div className="toc-list">
              {itemData.chapters?.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  className={`toc-item ${idx === activeChapter ? 'active' : ''}`}
                  onClick={() => setActiveChapter(idx)}
                >
                  <span className="toc-number">{idx + 1}</span>
                  <span className="toc-title">{chapter.title}</span>
                  {isVideo && <span className="toc-time">{chapter.time}</span>}
                  {isPDF && <span className="toc-page">Trang {chapter.page}</span>}
                </button>
              ))}
            </div>
            {bookmarks.length > 0 && (
              <div className="bookmarks-section">
                <h4 className="bookmarks-title">ĐÁNH DẤU</h4>
                {bookmarks.map(bookmark => (
                  <div key={bookmark.id} className="bookmark-item">
                    {bookmark.title}
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* Main Content Area */}
        <main className="reader-main" ref={contentRef} onMouseUp={handleTextSelection}>
          {isVideo ? (
            <div className="video-container">
              <iframe
                className="reader-video"
                src={`https://www.youtube.com/embed/${itemData.youtubeId}?rel=0&modestbranding=1`}
                title={itemData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isPDF ? (
            <div className="pdf-container">
              <iframe
                ref={pdfViewerRef}
                className="reader-pdf"
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(itemData.fileUrl)}`}
                title={itemData.title}
              />
            </div>
          ) : (
            <div className="text-content">
              <div className="content-toolbar">
                <div className="toolbar-group">
                  <button 
                    className="tool-btn" 
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    title="Giảm cỡ chữ"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="font-size-display">{fontSize}px</span>
                  <button 
                    className="tool-btn" 
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    title="Tăng cỡ chữ"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
                <div className="toolbar-group">
                  <button 
                    className={`tool-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                    title="Sáng"
                  >
                    <Sun size={16} />
                  </button>
                  <button 
                    className={`tool-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                    title="Tối"
                  >
                    <Moon size={16} />
                  </button>
                </div>
                <button className="tool-btn" onClick={handleBookmark} title="Đánh dấu trang">
                  <Bookmark size={16} />
                </button>
              </div>
              <article 
                className="reader-article"
                style={{ fontSize: `${fontSize}px` }}
              >
                <h1>{itemData.title}</h1>
                <p className="article-author">Tác giả: {itemData.author}</p>
                <div className="article-content">
                  {itemData.chapters?.map((chapter, idx) => (
                    <section 
                      key={chapter.id}
                      className={`chapter-section ${idx === activeChapter ? 'active' : ''}`}
                    >
                      <h2>{chapter.title}</h2>
                      <p>
                        Đây là nội dung của {chapter.title}. Trong phần này, chúng ta sẽ tìm hiểu 
                        về các khái niệm quan trọng và cách áp dụng chúng vào thực tế. Nội dung 
                        được trình bày một cách chi tiết và dễ hiểu, phù hợp cho người mới bắt đầu.
                      </p>
                      <p>
                        Bạn có thể highlight bất kỳ đoạn text nào để lưu lại những điểm quan trọng, 
                        hoặc sử dụng AI Chat để hỏi về các khái niệm bạn chưa hiểu rõ.
                      </p>
                    </section>
                  ))}
                </div>
              </article>
            </div>
          )}
        </main>

        {/* Right Sidebar - AI Assistant & Notes */}
        {showAI && (
          <aside className="reader-sidebar reader-ai">
            <div className="ai-section">
              <div className="ai-header">
                <Sparkles size={20} className="ai-icon" />
                <h3 className="sidebar-title">TRỢ LÝ AI</h3>
              </div>
              <div className="ai-summary">
                <h4>Tóm tắt nội dung</h4>
                <p>{aiSummary || 'Đang tải tóm tắt...'}</p>
              </div>
              {aiSuggestions.length > 0 && (
                <div className="ai-suggestions">
                  <h4>Gợi ý liên quan</h4>
                  {aiSuggestions.map((suggestion, idx) => (
                    <button key={idx} className="suggestion-item">
                      <ChevronRight size={14} />
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="notes-section">
              <h3 className="sidebar-title">GHI CHÚ CỦA TÔI</h3>
              <textarea
                className="notes-textarea"
                placeholder="Viết ghi chú của bạn tại đây..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleSaveNote}
              />
            </div>
          </aside>
        )}
      </div>

      {/* AI Chat Bubble */}
      {showChat && (
        <div className="ai-chat-bubble">
          <div className="chat-header">
            <Sparkles size={18} />
            <span>Trợ lý AI</span>
            <button className="chat-close" onClick={() => setShowChat(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="chat-messages">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Hỏi về nội dung đang đọc..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
            />
            <button className="chat-send" onClick={handleAIChat}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Button (Floating) */}
      {!showChat && (
        <button 
          className="ai-chat-button"
          onClick={() => setShowChat(true)}
          title="Hỏi AI"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

