import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, Share, MoreVertical, Users, Plus, Search, Filter, Loader } from 'lucide-react';
import groupService from '../../services/groupService';
import './GroupsPage.css';

/**
 * GroupsPage - Trang chính cho hệ thống nhóm
 * Hiển thị danh sách nhóm, search, filter, tạo nhóm mới
 */
function GroupsPage({ userId }) {
  // States
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMyGroups, setShowMyGroups] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [trending, setTrending] = useState([]);
  const [suggested, setSuggested] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groupType: 'PUBLIC',
    category: 'Education',
    rules: ''
  });

  const debounceTimer = useRef(null);

  // Danh mục nhóm
  const categories = [
    'all', 'Education', 'Technology', 'Business', 'Health', 
    'Sports', 'Travel', 'Food', 'Art'
  ];

  // Load groups khi component mount
  useEffect(() => {
    loadGroups();
    loadTrendingGroups();
    loadSuggestedGroups();
  }, []);

  // Load groups từ API
  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getAllGroups(0, 20);
      setGroups(data.content || []);
      setFilteredGroups(data.content || []);
    } catch (error) {
      console.error('Error loading groups:', error);
      // Mock data
      setGroups(generateMockGroups());
      setFilteredGroups(generateMockGroups());
    } finally {
      setLoading(false);
    }
  };

  // Load trending groups
  const loadTrendingGroups = async () => {
    try {
      const data = await groupService.getTrendingGroups(0, 5);
      setTrending(data.content || []);
    } catch (error) {
      console.error('Error loading trending:', error);
    }
  };

  // Load suggested groups
  const loadSuggestedGroups = async () => {
    try {
      const data = await groupService.getSuggestedGroups(0, 5);
      setSuggested(data.content || []);
    } catch (error) {
      console.error('Error loading suggested:', error);
    }
  };

  // Search debounced
  const handleSearchInput = useCallback((value) => {
    setSearchQuery(value);
    
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (value.trim()) {
        // API search
        groupService.searchGroups(value)
          .then(data => setFilteredGroups(data.results || []))
          .catch(error => console.error('Search error:', error));
      } else {
        setFilteredGroups(groups);
      }
    }, 300);
  }, [groups]);

  // Filter groups
  useEffect(() => {
    let result = [...groups];

    if (selectedCategory !== 'all') {
      result = result.filter(g => g.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      result = result.filter(g => g.groupType === selectedType);
    }

    setFilteredGroups(result);
  }, [selectedCategory, selectedType, groups]);

  // Tạo nhóm mới
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên nhóm');
      return;
    }

    try {
      setLoading(true);
      await groupService.createGroup(formData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        groupType: 'PUBLIC',
        category: 'Education',
        rules: ''
      });
      setShowCreateForm(false);
      
      // Reload groups
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Lỗi khi tạo nhóm');
    } finally {
      setLoading(false);
    }
  };

  // Load user's groups
  const handleShowMyGroups = async () => {
    try {
      setLoading(true);
      setShowMyGroups(!showMyGroups);
      
      if (!showMyGroups) {
        const data = await groupService.getUserGroups(0, 20);
        setFilteredGroups(data.content || []);
      } else {
        setFilteredGroups(groups);
      }
    } catch (error) {
      console.error('Error loading my groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock groups
  const generateMockGroups = () => {
    const categories = ['Education', 'Technology', 'Business', 'Health'];
    const groups = [];
    
    for (let i = 0; i < 12; i++) {
      groups.push({
        id: `group_${i}`,
        name: `Nhóm ${categories[i % categories.length]} ${i + 1}`,
        description: 'Mô tả nhóm',
        coverImage: `https://api.dicebear.com/7.x/shapes/svg?seed=group${i}`,
        groupType: ['PUBLIC', 'PRIVATE', 'CLOSED'][i % 3],
        category: categories[i % categories.length],
        memberCount: Math.floor(Math.random() * 100) + 10,
        postCount: Math.floor(Math.random() * 50) + 5
      });
    }
    
    return groups;
  };

  return (
    <div className="groups-page">
      {/* Header */}
      <div className="groups-header">
        <h1>Cộng Đồng Nhóm</h1>
        <p>Tham gia các nhóm, chia sẻ ý tưởng và kết nối với mọi người</p>
      </div>

      {/* Action Bar */}
      <div className="groups-actions">
        <div className="search-section">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="btn-create" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={20} />
          Tạo nhóm
        </button>

        <button 
          className={`btn-my-groups ${showMyGroups ? 'active' : ''}`}
          onClick={handleShowMyGroups}
        >
          <Users size={20} />
          Nhóm của tôi
        </button>
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="create-group-form">
          <h2>Tạo Nhóm Mới</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="form-group">
              <label>Tên nhóm *</label>
              <input
                type="text"
                placeholder="Nhập tên nhóm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                placeholder="Mô tả nhóm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loại nhóm</label>
                <select
                  value={formData.groupType}
                  onChange={(e) => setFormData({...formData, groupType: e.target.value})}
                  className="form-select"
                >
                  <option value="PUBLIC">Công khai</option>
                  <option value="PRIVATE">Riêng tư</option>
                  <option value="CLOSED">Đóng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="form-select"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Quy tắc nhóm</label>
              <textarea
                placeholder="Quy tắc nhóm"
                value={formData.rules}
                onChange={(e) => setFormData({...formData, rules: e.target.value})}
                className="form-textarea"
                rows={2}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <Loader size={18} className="spin" /> : 'Tạo nhóm'}
              </button>
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowCreateForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="groups-filters">
        <div className="filter-section">
          <Filter size={18} />
          <label>Danh mục:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Tất cả' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Loại:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="PUBLIC">Công khai</option>
            <option value="PRIVATE">Riêng tư</option>
            <option value="CLOSED">Đóng</option>
          </select>
        </div>
      </div>

      {/* Trending Groups */}
      {trending.length > 0 && (
        <div className="trending-section">
          <h3>🔥 Nhóm Trending</h3>
          <div className="trending-grid">
            {trending.map(group => (
              <a key={group.id} href={`/group/${group.id}`} className="trending-card">
                <img src={group.coverImage} alt={group.name} />
                <div className="card-overlay">
                  <h4>{group.name}</h4>
                  <p>{group.memberCount} thành viên</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="loading-container">
          <Loader size={40} className="spin" />
          <p>Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Results info */}
          <div className="results-info">
            <p>Hiển thị {filteredGroups.length} nhóm</p>
          </div>

          {/* Groups Grid */}
          {filteredGroups.length > 0 ? (
            <div className="groups-grid">
              {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} onGroupUpdated={loadGroups} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h3>Không tìm thấy nhóm</h3>
              <p>Hãy thử tìm kiếm từ khác hoặc tạo nhóm mới</p>
            </div>
          )}
        </>
      )}

      {/* Suggested Groups */}
      {suggested.length > 0 && (
        <div className="suggested-section">
          <h3>📌 Gợi Ý Cho Bạn</h3>
          <div className="suggested-list">
            {suggested.map(group => (
              <div key={group.id} className="suggested-item">
                <img src={group.coverImage} alt={group.name} />
                <div className="suggested-info">
                  <a href={`/group/${group.id}`}><h4>{group.name}</h4></a>
                  <p>{group.memberCount} thành viên</p>
                </div>
                <button className="btn-join">Tham gia</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * GroupCard Component
 */
function GroupCard({ group, onGroupUpdated }) {
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    checkMembership();
  }, [group.id]);

  const checkMembership = async () => {
    try {
      const result = await groupService.checkMembership(group.id);
      setIsMember(result.isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleJoinLeave = async () => {
    try {
      setIsJoining(true);
      if (isMember) {
        await groupService.leaveGroup(group.id);
        setIsMember(false);
      } else {
        await groupService.joinGroup(group.id);
        setIsMember(true);
      }
      onGroupUpdated?.();
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi cập nhật trạng thái');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="group-card">
      <img src={group.coverImage} alt={group.name} className="group-cover" />
      
      <div className="group-content">
        <div className="group-header">
          <a href={`/group/${group.id}`} className="group-name">{group.name}</a>
          <span className={`group-type ${group.groupType.toLowerCase()}`}>
            {group.groupType === 'PUBLIC' ? '🌐 Công khai' : 
             group.groupType === 'PRIVATE' ? '🔒 Riêng tư' : 
             '🔐 Đóng'}
          </span>
        </div>

        <p className="group-description">{group.description?.substring(0, 80)}...</p>

        <div className="group-stats">
          <div className="stat">
            <Users size={16} />
            <span>{group.memberCount} thành viên</span>
          </div>
          <div className="stat">
            <MessageCircle size={16} />
            <span>{group.postCount} bài viết</span>
          </div>
        </div>

        <button 
          className={`btn-join-card ${isMember ? 'joined' : ''}`}
          onClick={handleJoinLeave}
          disabled={isJoining}
        >
          {isMember ? '✓ Đã tham gia' : 'Tham gia'}
        </button>
      </div>
    </div>
  );
}

export default GroupsPage;
