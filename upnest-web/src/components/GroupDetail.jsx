import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Users, ArrowLeft, Settings, MoreVertical, Loader, Plus } from 'lucide-react';
import groupService from '../../services/groupService';
import './GroupDetail.css';

/**
 * GroupDetail - Chi tiết nhóm với posts, members, interactions
 */
function GroupDetail({ groupId, userId, onBack }) {
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // posts, members, about
  const [newPostContent, setNewPostContent] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadGroupDetail();
  }, [groupId]);

  // Load group chi tiết
  const loadGroupDetail = async () => {
    try {
      setLoading(true);
      const data = await groupService.getGroupDetail(groupId);
      setGroup(data);
      
      // Check membership
      const membership = await groupService.checkMembership(groupId);
      setIsMember(membership.isMember);
      setIsAdmin(membership.isAdmin);
      
      // Load posts và members
      loadPosts();
      loadMembers();
    } catch (error) {
      console.error('Error loading group:', error);
      // Mock data
      setGroup(generateMockGroup());
      setIsMember(true);
      loadPosts();
      loadMembers();
    } finally {
      setLoading(false);
    }
  };

  // Load posts
  const loadPosts = async () => {
    try {
      const data = await groupService.getGroupPosts(groupId, 0, 10);
      setPosts(data.posts || data.content || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts(generateMockPosts());
    }
  };

  // Load members
  const loadMembers = async () => {
    try {
      const data = await groupService.getGroupMembers(groupId, 0, 10);
      setMembers(data.members || data.content || []);
    } catch (error) {
      console.error('Error loading members:', error);
      setMembers(generateMockMembers());
    }
  };

  // Tạo post mới
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }

    try {
      await groupService.createGroupPost(groupId, {
        content: newPostContent,
        mediaIds: ''
      });
      
      setNewPostContent('');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Lỗi khi đăng bài');
    }
  };

  // Join/Leave group
  const handleJoinLeave = async () => {
    try {
      setLoading(true);
      if (isMember) {
        await groupService.leaveGroup(groupId);
        setIsMember(false);
      } else {
        await groupService.joinGroup(groupId);
        setIsMember(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const generateMockGroup = () => ({
    id: groupId,
    name: 'Nhóm Giáo Dục',
    description: 'Nơi chia sẻ kiến thức và kinh nghiệm học tập',
    coverImage: `https://api.dicebear.com/7.x/shapes/svg?seed=${groupId}`,
    rules: 'Luôn tôn trọng, không spam',
    category: 'Education',
    memberCount: 120,
    postCount: 45,
    groupType: 'PUBLIC'
  });

  const generateMockPosts = () => [
    {
      id: 'post_1',
      content: 'Bài viết mẫu từ nhóm',
      author: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      likeCount: 5,
      commentCount: 2,
      createdAt: new Date()
    }
  ];

  const generateMockMembers = () => [
    {
      id: 'member_1',
      user: { name: 'Member 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member1' },
      role: 'MEMBER',
      joinedAt: new Date()
    }
  ];

  if (loading && !group) {
    return (
      <div className="group-detail loading">
        <Loader size={40} className="spin" />
      </div>
    );
  }

  return (
    <div className="group-detail">
      {/* Header */}
      <div className="group-detail-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        
        {group && (
          <div className="group-cover">
            <img src={group.coverImage} alt={group.name} />
            <div className="group-info-overlay">
              <h1>{group.name}</h1>
              <div className="group-stats-bar">
                <span><Users size={16} /> {group.memberCount} thành viên</span>
                <span>|</span>
                <span>{group.postCount} bài viết</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="group-action-bar">
        <button 
          className={`btn-action ${isMember ? 'joined' : ''}`}
          onClick={handleJoinLeave}
        >
          {isMember ? '✓ Đã tham gia' : 'Tham gia'}
        </button>
        
        {isAdmin && (
          <button className="btn-action settings">
            <Settings size={18} /> Cài đặt
          </button>
        )}

        <button className="btn-action more">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="group-tabs">
        <button
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Bài viết
        </button>
        <button
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Thành viên ({members.length})
        </button>
        <button
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Thông tin
        </button>
      </div>

      <div className="group-content">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="posts-section">
            {isMember && (
              <form onSubmit={handleCreatePost} className="new-post-form">
                <div className="post-input-group">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=current-user" 
                    alt="Your avatar" 
                    className="user-avatar"
                  />
                  <div className="post-input-wrapper">
                    <textarea
                      placeholder="Bạn đang nghĩ gì?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="post-input"
                      rows={2}
                    />
                    <button type="submit" className="btn-post">
                      <Plus size={18} /> Đăng bài
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Posts List */}
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map(post => (
                  <GroupPostItem 
                    key={post.id} 
                    post={post}
                    groupId={groupId}
                    onPostUpdated={loadPosts}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <p>Chưa có bài viết trong nhóm</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="members-section">
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <img 
                    src={member.user.avatar} 
                    alt={member.user.name}
                    className="member-avatar"
                  />
                  <div className="member-info">
                    <h4>{member.user.name}</h4>
                    <p className="member-role">
                      {member.role === 'ADMIN' ? '👑 Admin' : 
                       member.role === 'MODERATOR' ? '⭐ Moderator' : 
                       'Thành viên'}
                    </p>
                    <small>Tham gia {formatDate(member.joinedAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-card">
              <h3>Về Nhóm</h3>
              <p>{group?.description}</p>
            </div>

            {group?.rules && (
              <div className="about-card">
                <h3>Quy Tắc Nhóm</h3>
                <p>{group.rules}</p>
              </div>
            )}

            <div className="about-card">
              <h3>Thông Tin</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Danh mục:</label>
                  <span>{group?.category}</span>
                </div>
                <div className="info-item">
                  <label>Loại:</label>
                  <span>{group?.groupType === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}</span>
                </div>
                <div className="info-item">
                  <label>Thành viên:</label>
                  <span>{group?.memberCount}</span>
                </div>
                <div className="info-item">
                  <label>Bài viết:</label>
                  <span>{group?.postCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * GroupPostItem Component
 */
function GroupPostItem({ post, groupId, onPostUpdated }) {
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await groupService.unlikePost(groupId, post.id);
        setLikeCount(likeCount - 1);
      } else {
        await groupService.likePost(groupId, post.id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="group-post-item">
      <div className="post-header">
        <img 
          src={post.author.avatar} 
          alt={post.author.name}
          className="post-author-avatar"
        />
        <div className="post-author-info">
          <h4>{post.author.name}</h4>
          <small>{formatDate(post.createdAt)}</small>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      {post.mediaIds && (
        <div className="post-media">
          {/* Media render */}
        </div>
      )}

      <div className="post-stats">
        <span>❤️ {likeCount}</span>
        <span>💬 {post.commentCount}</span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart size={18} className={isLiked ? 'filled' : ''} />
          Thích
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} />
          Bình luận
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {/* Comments render */}
        </div>
      )}
    </div>
  );
}

// Helper function
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

export default GroupDetail;
