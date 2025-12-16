import React, { useState } from 'react';
import { ArrowLeft, Edit2, Share2, Heart, MessageCircle, Eye } from 'lucide-react';
import './BlogSection.css';

/**
 * BlogSection - Thế giới viết blog cá nhân
 * Cho phép học viên viết, chia sẻ và đọc các bài viết chi tiết
 */
export default function BlogSection({ onBack }) {
  const [view, setView] = useState('list'); // list, write, read
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: '5 Thói quen của lập trình viên giỏi',
      author: 'Chị Linh Mentor',
      avatar: 'CL',
      date: '15/12/2025',
      category: 'Career Tips',
      content: `Khi bắt đầu sự nghiệp lập trình, có 5 thói quen quan trọng mà bạn cần phát triển:

1. **Viết code sạch và dễ đọc**
Người khác sẽ phải đọc code của bạn nhiều hơn cả việc bạn viết nó. Code sạch không chỉ giúp người khác hiểu dễ hơn mà còn giúp bạn debug nhanh hơn khi gặp lỗi.

2. **Sử dụng Git và Version Control**
Git không chỉ là công cụ để lưu code mà nó còn giúp bạn theo dõi lịch sử thay đổi, hợp tác với những người khác và quay lại phiên bản cũ khi cần.

3. **Viết Unit Tests**
Tests không phải là "công việc thêm" mà là phần không thể thiếu của quá trình phát triển. Tests tốt giúp bạn có tự tin hơn khi refactor code.

4. **Học không ngừng**
Công nghệ thay đổi rất nhanh. Hãy dành thời gian mỗi tuần để học cái mới, đọc articles hoặc xem tutorials.

5. **Giao tiếp tốt với team**
Code chỉ là một phần nhỏ của công việc. Khả năng giao tiếp, giải thích ý tưởng của bạn cho các thành viên khác trong team cũng rất quan trọng.

Hãy bắt đầu phát triển những thói quen tốt này từ bây giờ! 🚀`,
      image: null,
      likes: 89,
      comments: 23,
      views: 234,
      liked: false,
      tags: ['#Programming', '#CareerTips', '#BestPractices']
    },
    {
      id: 2,
      title: 'Hành trình từ beginner đến mid-level developer',
      author: 'Trần Minh',
      avatar: 'TM',
      date: '12/12/2025',
      category: 'Learning Journey',
      content: `Sau 18 tháng học và làm việc, mình đã nâng kỹ năng từ không biết gì đến mid-level developer. Đây là hành trình của mình...

**Tháng 1-3: Nền tảng**
Những tháng đầu tiên tập trung vào HTML, CSS, JavaScript cơ bản. Phải thành thật là khó khăn vì mọi thứ đều là mới.

**Tháng 4-6: React**
Sau khi nắm vững JavaScript, mình bắt đầu học React. Ban đầu hooks khó hiểu nhưng sau khi làm vài project nhỏ thì hiểu rõ hơn.

**Tháng 7-12: Projects thực tế**
Bắt đầu làm những projects lớn hơn, gặp phải bugs, phải debug và học cách xử lý những vấn đề thực tế.

**Tháng 13-18: Deepening & Specialization**
Đi sâu vào một số chủ đề như state management, testing, performance optimization.

Bây giờ mình có thể tự tin nhập cuộc thị trường lao động. Hành trình còn dài nhưng mình đã sẵn sàng! 💪`,
      image: null,
      likes: 56,
      comments: 14,
      views: 189,
      liked: false,
      tags: ['#LearningJourney', '#CareerGrowth', '#Developer']
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox: Khi nào dùng cái nào?',
      author: 'Nguyễn Anh',
      avatar: 'NA',
      date: '10/12/2025',
      category: 'CSS Tips',
      content: `Một câu hỏi phổ biến: CSS Grid và Flexbox - nên dùng cái nào? Câu trả lời là: tùy vào tình huống!

**Flexbox dành cho: 1 chiều**
- Navigation menus
- Centering content
- Space distribution trong 1 hàng hoặc 1 cột
- Responsive layouts đơn giản

**CSS Grid dành cho: 2 chiều**
- Complex page layouts
- Dashboard layouts
- Image galleries
- Magazine-style designs

**Ví dụ thực tế:**

Làm navigation menu? Dùng Flexbox.
Làm layout trang chủ với header, sidebar, content? Dùng Grid.
Làm list items với wrapping? Flexbox.
Làm dashboard với nhiều widgets? Grid.

Thực tế là bạn thường dùng cả hai trong cùng một project. Grid cho layout chính, Flexbox cho chi tiết bên trong các component.

**Lời khuyên:**
Hãy bắt đầu với Flexbox vì nó dễ hiểu hơn. Sau đó học Grid khi cần layout phức tạp hơn.`,
      image: null,
      likes: 42,
      comments: 8,
      views: 156,
      liked: false,
      tags: ['#CSS', '#Flexbox', '#Grid', '#WebDevelopment']
    }
  ]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'General',
    content: ''
  });

  const categories = [
    'General',
    'Career Tips',
    'Learning Journey',
    'CSS Tips',
    'JavaScript',
    'React',
    'Web Development',
    'Personal Thoughts'
  ];

  const handleLike = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId
        ? { ...blog, liked: !blog.liked, likes: blog.liked ? blog.likes - 1 : blog.likes + 1 }
        : blog
    ));
  };

  const handlePublishBlog = () => {
    if (newBlog.title.trim() && newBlog.content.trim()) {
      const blog = {
        id: Date.now(),
        title: newBlog.title,
        author: 'Nguyễn Hồng',
        avatar: 'NH',
        date: new Date().toLocaleDateString('vi-VN'),
        category: newBlog.category,
        content: newBlog.content,
        image: null,
        likes: 0,
        comments: 0,
        views: 0,
        liked: false,
        tags: []
      };
      setBlogs([blog, ...blogs]);
      setNewBlog({ title: '', category: 'General', content: '' });
      setView('list');
    }
  };

  return (
    <div className="blog-section">
      {/* Header */}
      <div className="blog-header">
        <div className="header-content">
          <h1>📚 Thế giới Blog</h1>
          <p>Chia sẻ kiến thức, kinh nghiệm và suy nghĩ của bạn</p>
        </div>
        <button
          className="write-blog-button"
          onClick={() => setView('write')}
        >
          <Edit2 size={18} />
          <span>Viết bài viết</span>
        </button>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="blogs-list">
          <div className="blogs-container">
            {blogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <div className="blog-card-header">
                  <div className="blog-author-info">
                    <div className="blog-avatar">{blog.avatar}</div>
                    <div className="blog-meta">
                      <h3 className="blog-title">{blog.title}</h3>
                      <div className="blog-byline">
                        <span className="blog-author">{blog.author}</span>
                        <span className="blog-separator">•</span>
                        <span className="blog-date">{blog.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="blog-category">{blog.category}</span>
                </div>

                <div className="blog-excerpt">
                  {blog.content.substring(0, 150)}...
                </div>

                <div className="blog-tags">
                  {blog.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="blog-tag">{tag}</span>
                  ))}
                </div>

                <div className="blog-stats">
                  <span className="stat">
                    <Eye size={16} />
                    {blog.views} lượt xem
                  </span>
                  <span className="stat">
                    <Heart size={16} />
                    {blog.likes} lượt thích
                  </span>
                  <span className="stat">
                    <MessageCircle size={16} />
                    {blog.comments} bình luận
                  </span>
                </div>

                <div className="blog-actions">
                  <button
                    className="read-button"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setView('read');
                    }}
                  >
                    Đọc toàn bộ
                  </button>
                  <button
                    className={`like-button ${blog.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(blog.id)}
                  >
                    <Heart size={18} />
                    Thích
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Write View */}
      {view === 'write' && (
        <div className="blog-write">
          <div className="write-container">
            <button className="back-button" onClick={() => setView('list')}>
              <ArrowLeft size={20} />
            </button>

            <div className="write-form">
              <h2>Viết bài viết mới</h2>

              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select
                  className="form-select"
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nội dung *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Viết nội dung bài viết của bạn... Bạn có thể sử dụng Markdown (# heading, **bold**, *italic*, ...)"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  rows={15}
                />
              </div>

              <div className="write-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setView('list');
                    setNewBlog({ title: '', category: 'General', content: '' });
                  }}
                >
                  Hủy
                </button>
                <button
                  className="publish-button"
                  onClick={handlePublishBlog}
                  disabled={!newBlog.title.trim() || !newBlog.content.trim()}
                >
                  Xuất bản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Read View */}
      {view === 'read' && selectedBlog && (
        <article className="blog-read">
          <button className="back-button" onClick={() => setView('list')}>
            <ArrowLeft size={20} />
          </button>

          <div className="read-container">
            <header className="blog-read-header">
              <h1>{selectedBlog.title}</h1>
              <div className="read-meta">
                <div className="read-author-info">
                  <div className="read-avatar">{selectedBlog.avatar}</div>
                  <div>
                    <p className="read-author">{selectedBlog.author}</p>
                    <p className="read-date">{selectedBlog.date}</p>
                  </div>
                </div>
                <div className="read-category-badge">{selectedBlog.category}</div>
              </div>
            </header>

            <div className="blog-read-content">
              {selectedBlog.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="blog-read-tags">
              {selectedBlog.tags.map((tag, idx) => (
                <span key={idx} className="read-tag">{tag}</span>
              ))}
            </div>

            <div className="blog-read-actions">
              <button
                className={`read-like-button ${selectedBlog.liked ? 'liked' : ''}`}
                onClick={() => handleLike(selectedBlog.id)}
              >
                <Heart size={20} />
                <span>{selectedBlog.likes} Thích</span>
              </button>
              <button className="read-comment-button">
                <MessageCircle size={20} />
                <span>{selectedBlog.comments} Bình luận</span>
              </button>
              <button className="read-share-button">
                <Share2 size={20} />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h3>Bình luận ({selectedBlog.comments})</h3>
              <div className="comment-form">
                <div className="comment-avatar">NH</div>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Viết bình luận của bạn..."
                />
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
