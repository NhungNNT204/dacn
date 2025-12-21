import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle, 
  Eye,
  Award,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Send
} from 'lucide-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './QAPage.css';

/**
 * QA Page - Trang Hỏi Đáp Realtime
 * 
 * Features:
 * - Hiển thị danh sách câu hỏi với phân trang
 * - Tạo câu hỏi mới
 * - Xem chi tiết câu hỏi và trả lời
 * - Upvote/Downvote realtime
 * - Bình luận
 * - WebSocket realtime updates
 */
const QAPage = () => {
  // States
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, OPEN, ANSWERED, CLOSED
  
  // Form states
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: '',
    courseId: null
  });
  const [newAnswer, setNewAnswer] = useState('');
  
  // WebSocket
  const stompClient = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // API Base URL
  const API_URL = 'http://localhost:8080/api/v1/qa';
  const token = localStorage.getItem('accessToken');
  
  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, filterStatus, searchTerm]);
  
  // Setup WebSocket
  useEffect(() => {
    setupWebSocket();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);
  
  /**
   * Setup WebSocket connection
   */
  const setupWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws-qa');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    
    client.onConnect = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Subscribe to new questions
      client.subscribe('/topic/qa/new', (message) => {
        const update = JSON.parse(message.body);
        console.log('New question:', update);
        // Refresh questions list
        fetchQuestions();
      });
    };
    
    client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
      setIsConnected(false);
    };
    
    client.activate();
    stompClient.current = client;
  };
  
  /**
   * Fetch questions from API
   */
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      let url = `${API_URL}/questions?page=${currentPage}&size=10`;
      
      if (searchTerm) {
        url = `${API_URL}/questions/search?keyword=${encodeURIComponent(searchTerm)}&page=${currentPage}&size=10`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      
      let filteredQuestions = data.content;
      if (filterStatus !== 'ALL') {
        filteredQuestions = filteredQuestions.filter(q => q.status === filterStatus);
      }
      
      setQuestions(filteredQuestions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Create new question
   */
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const createdQuestion = await response.json();
      
      // Reset form
      setNewQuestion({ title: '', content: '', tags: '', courseId: null });
      setShowCreateModal(false);
      
      // Refresh questions
      fetchQuestions();
      
      alert('Câu hỏi đã được tạo thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };
  
  /**
   * View question detail
   */
  const handleViewQuestion = async (questionId) => {
    try {
      // Fetch question detail
      const questionRes = await fetch(`${API_URL}/questions/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!questionRes.ok) throw new Error('Failed to fetch question');
      const question = await questionRes.json();
      setSelectedQuestion(question);
      
      // Fetch answers
      const answersRes = await fetch(`${API_URL}/questions/${questionId}/answers?page=0&size=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!answersRes.ok) throw new Error('Failed to fetch answers');
      const answersData = await answersRes.json();
      setAnswers(answersData.content);
      
      // Subscribe to realtime updates for this question
      if (stompClient.current && isConnected) {
        stompClient.current.subscribe(`/topic/questions/${questionId}`, (message) => {
          const update = JSON.parse(message.body);
          console.log('Question update:', update);
          
          if (update.eventType === 'VOTE_ADDED' || update.eventType === 'VOTE_CHANGED' || update.eventType === 'VOTE_REMOVED') {
            // Update vote count in UI
            if (update.payload.answerId) {
              setAnswers(prev => prev.map(a => 
                a.answerId === update.payload.answerId 
                  ? { ...a, likeCount: update.payload.voteScore }
                  : a
              ));
            } else {
              setSelectedQuestion(prev => ({
                ...prev,
                likeCount: update.payload.voteScore
              }));
            }
          } else if (update.eventType === 'ANSWER_CREATED') {
            // Refresh answers
            fetchAnswers(questionId);
          }
        });
      }
    } catch (error) {
      console.error('Error viewing question:', error);
      alert('Không thể tải câu hỏi');
    }
  };
  
  /**
   * Vote for question
   */
  const handleVoteQuestion = async (questionId, voteType) => {
    try {
      const endpoint = voteType === 'UPVOTE' ? 'upvote' : 'downvote';
      const response = await fetch(`${API_URL}/questions/${questionId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to vote');
      
      const data = await response.json();
      
      // Update local state
      if (selectedQuestion && selectedQuestion.questionId === questionId) {
        setSelectedQuestion(prev => ({
          ...prev,
          likeCount: data.voteScore
        }));
      }
      
      setQuestions(prev => prev.map(q => 
        q.questionId === questionId 
          ? { ...q, likeCount: data.voteScore }
          : q
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  
  /**
   * Vote for answer
   */
  const handleVoteAnswer = async (answerId, voteType) => {
    try {
      const endpoint = voteType === 'UPVOTE' ? 'upvote' : 'downvote';
      const response = await fetch(`${API_URL}/answers/${answerId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to vote');
      
      const data = await response.json();
      
      // Update local state
      setAnswers(prev => prev.map(a => 
        a.answerId === answerId 
          ? { ...a, likeCount: data.voteScore }
          : a
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  
  /**
   * Submit answer
   */
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!newAnswer.trim()) {
      alert('Vui lòng nhập nội dung câu trả lời');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/answers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: selectedQuestion.questionId,
          content: newAnswer
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const createdAnswer = await response.json();
      
      // Add new answer to list
      setAnswers(prev => [...prev, createdAnswer]);
      setNewAnswer('');
      
      alert('Câu trả lời đã được gửi!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };
  
  /**
   * Fetch answers for a question
   */
  const fetchAnswers = async (questionId) => {
    try {
      const response = await fetch(`${API_URL}/questions/${questionId}/answers?page=0&size=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch answers');
      const data = await response.json();
      setAnswers(data.content);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };
  
  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      OPEN: { icon: <Clock size={14} />, text: 'Đang mở', class: 'status-open' },
      ANSWERED: { icon: <CheckCircle2 size={14} />, text: 'Đã trả lời', class: 'status-answered' },
      CLOSED: { icon: <XCircle size={14} />, text: 'Đã đóng', class: 'status-closed' }
    };
    
    const badge = badges[status] || badges.OPEN;
    
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };
  
  // Render
  return (
    <div className="qa-page">
      {/* Header */}
      <div className="qa-header">
        <div className="qa-header-left">
          <h1>
            <MessageSquare size={32} />
            Hỏi Đáp
          </h1>
          <p>Đặt câu hỏi và nhận câu trả lời từ cộng đồng</p>
        </div>
        
        <button 
          className="btn-create-question"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Đặt câu hỏi
        </button>
      </div>
      
      {/* Filters */}
      <div className="qa-filters">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-status">
          <Filter size={18} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="OPEN">Đang mở</option>
            <option value="ANSWERED">Đã trả lời</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
        </div>
        
        {isConnected && (
          <span className="websocket-status connected">
            ● Realtime
          </span>
        )}
      </div>
      
      {/* Main Content */}
      <div className="qa-content">
        {/* Questions List */}
        {!selectedQuestion ? (
          <div className="questions-list">
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : questions.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={64} />
                <p>Chưa có câu hỏi nào</p>
              </div>
            ) : (
              <>
                {questions.map(question => (
                  <div 
                    key={question.questionId} 
                    className="question-card"
                    onClick={() => handleViewQuestion(question.questionId)}
                  >
                    <div className="question-stats">
                      <div className="stat">
                        <ThumbsUp size={16} />
                        <span>{question.likeCount}</span>
                      </div>
                      <div className="stat">
                        <MessageCircle size={16} />
                        <span>{question.answerCount}</span>
                      </div>
                      <div className="stat">
                        <Eye size={16} />
                        <span>{question.viewCount}</span>
                      </div>
                    </div>
                    
                    <div className="question-content">
                      <h3>{question.title}</h3>
                      <p>{question.content.substring(0, 200)}...</p>
                      
                      <div className="question-meta">
                        {getStatusBadge(question.status)}
                        
                        {question.tags && (
                          <div className="tags">
                            {question.tags.split(',').map((tag, i) => (
                              <span key={i} className="tag">{tag.trim()}</span>
                            ))}
                          </div>
                        )}
                        
                        <span className="timestamp">
                          {new Date(question.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    {question.bestAnswerId && (
                      <div className="best-answer-badge">
                        <Award size={18} />
                        Có câu trả lời tốt nhất
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Trước
                    </button>
                    <span>Trang {currentPage + 1} / {totalPages}</span>
                    <button 
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Question Detail View */
          <div className="question-detail">
            <button 
              className="btn-back"
              onClick={() => {
                setSelectedQuestion(null);
                setAnswers([]);
              }}
            >
              ← Quay lại
            </button>
            
            {/* Question */}
            <div className="question-detail-card">
              <div className="question-header">
                <h2>{selectedQuestion.title}</h2>
                {getStatusBadge(selectedQuestion.status)}
              </div>
              
              <div className="question-body">
                <p>{selectedQuestion.content}</p>
              </div>
              
              <div className="question-actions">
                <button 
                  className="btn-vote"
                  onClick={() => handleVoteQuestion(selectedQuestion.questionId, 'UPVOTE')}
                >
                  <ThumbsUp size={18} />
                  Upvote ({selectedQuestion.likeCount})
                </button>
                
                <button 
                  className="btn-vote downvote"
                  onClick={() => handleVoteQuestion(selectedQuestion.questionId, 'DOWNVOTE')}
                >
                  <ThumbsDown size={18} />
                  Downvote
                </button>
                
                <div className="question-stats-detail">
                  <Eye size={16} /> {selectedQuestion.viewCount} lượt xem
                </div>
              </div>
              
              {selectedQuestion.tags && (
                <div className="tags">
                  {selectedQuestion.tags.split(',').map((tag, i) => (
                    <span key={i} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Answers */}
            <div className="answers-section">
              <h3>
                <MessageCircle size={24} />
                {answers.length} Câu trả lời
              </h3>
              
              {answers.length === 0 ? (
                <p className="no-answers">Chưa có câu trả lời nào. Hãy là người đầu tiên trả lời!</p>
              ) : (
                <div className="answers-list">
                  {answers.map(answer => (
                    <div key={answer.answerId} className={`answer-card ${answer.isBestAnswer ? 'best-answer' : ''}`}>
                      {answer.isBestAnswer && (
                        <div className="best-answer-label">
                          <Award size={20} />
                          Câu trả lời tốt nhất
                        </div>
                      )}
                      
                      <p>{answer.content}</p>
                      
                      <div className="answer-actions">
                        <button 
                          className="btn-vote-small"
                          onClick={() => handleVoteAnswer(answer.answerId, 'UPVOTE')}
                        >
                          <ThumbsUp size={16} />
                          {answer.likeCount}
                        </button>
                        
                        <button 
                          className="btn-vote-small"
                          onClick={() => handleVoteAnswer(answer.answerId, 'DOWNVOTE')}
                        >
                          <ThumbsDown size={16} />
                        </button>
                        
                        <span className="timestamp">
                          {new Date(answer.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Answer Form */}
              <form className="answer-form" onSubmit={handleSubmitAnswer}>
                <h4>Câu trả lời của bạn</h4>
                <textarea 
                  placeholder="Nhập câu trả lời của bạn..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={6}
                />
                <button type="submit" className="btn-submit-answer">
                  <Send size={18} />
                  Gửi câu trả lời
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Question Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Đặt câu hỏi mới</h2>
            
            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label>Tiêu đề <span className="required">*</span></label>
                <input 
                  type="text"
                  placeholder="Nhập tiêu đề câu hỏi..."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Nội dung <span className="required">*</span></label>
                <textarea 
                  placeholder="Mô tả chi tiết câu hỏi của bạn..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                  rows={8}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <input 
                  type="text"
                  placeholder="Java, Spring Boot, Database (phân cách bằng dấu phẩy)"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Tạo câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAPage;

