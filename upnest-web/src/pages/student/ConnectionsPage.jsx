import React, { useEffect, useMemo, useState } from 'react';
import './Connections.css';
import {
  followUser,
  getFollowers,
  getFollowing,
  getFriends,
  searchUsers,
  unfollowUser,
  updateMyPresence,
} from '../../services/connectionService';

const TABS = [
  { key: 'friends', label: 'Bạn bè' },
  { key: 'following', label: 'Đang theo dõi' },
  { key: 'followers', label: 'Người theo dõi' },
  { key: 'search', label: 'Tìm kiếm' },
];

export default function ConnectionsPage() {
  const [tab, setTab] = useState('friends');
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTab = async (nextTab) => {
    setLoading(true);
    setError('');
    try {
      if (nextTab === 'friends') setItems(await getFriends());
      if (nextTab === 'following') setItems(await getFollowing());
      if (nextTab === 'followers') setItems(await getFollowers());
      if (nextTab === 'search') setItems([]);
    } catch (e) {
      setError(e.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // mark online when opening this page
    updateMyPresence({ online: true }).catch(() => {});
  }, []);

  useEffect(() => {
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onSearch = async () => {
    const keyword = q.trim();
    const courseKeyword = course.trim();
    if (!keyword && !courseKeyword) return;
    setLoading(true);
    setError('');
    try {
      setItems(await searchUsers(keyword, courseKeyword));
    } catch (e) {
      setError(e.message || 'Không thể tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (row) => {
    try {
      if (row.isFollowing) {
        await unfollowUser(row.userId);
        setItems((prev) => prev.map((x) => (x.userId === row.userId ? { ...x, isFollowing: false, isFriend: false } : x)));
      } else {
        await followUser(row.userId);
        setItems((prev) => prev.map((x) => (x.userId === row.userId ? { ...x, isFollowing: true, isFriend: x.isFollower } : x)));
      }
    } catch (e) {
      setError(e.message || 'Không thể thực hiện thao tác');
    }
  };

  const title = useMemo(() => {
    const t = TABS.find((x) => x.key === tab);
    return t ? t.label : 'Kết nối';
  }, [tab]);

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h2 className="connections-title">{title}</h2>
        <div className="connections-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'search' && (
        <div className="ui-surface ui-card search-bar">
          <input
            className="ui-input search-input"
            placeholder="Tìm theo tên, email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
          />
          <input
            className="ui-input search-input"
            placeholder="Filter theo khóa học đang học..."
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
          />
          <button className="ui-btn ui-btn-primary" onClick={onSearch} disabled={loading || (!q.trim() && !course.trim())}>
            {loading ? <span className="ui-spinner" aria-hidden="true" /> : 'Tìm'}
          </button>
        </div>
      )}

      {error && <div className="ui-surface ui-card" style={{ borderColor: 'rgba(239,68,68,.25)' }}>{error}</div>}

      {loading && tab !== 'search' && (
        <div className="ui-surface ui-card">Đang tải...</div>
      )}

      <div className="connections-list">
        {!loading && items.length === 0 && (
          <div className="empty">
            {tab === 'search' ? 'Nhập từ khóa để tìm người dùng.' : 'Chưa có dữ liệu.'}
          </div>
        )}

        {items.map((u) => (
          <div key={u.userId} className="conn-row">
            <div className="conn-left">
              <div className="conn-avatar">
                {u.avatarUrl ? <img src={u.avatarUrl} alt={u.fullName} /> : (u.fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="conn-meta">
                <p className="conn-name">
                  {u.fullName || u.email}
                  {u.online && (
                    <span className="badge-online">
                      <span className="dot" aria-hidden="true" />
                      Online
                    </span>
                  )}
                </p>
                <p className="conn-sub">
                  {u.currentCourseTitle ? `Đang học: ${u.currentCourseTitle}` : 'Chưa cập nhật khóa đang học'}
                </p>
              </div>
            </div>

            <div className="conn-actions">
              <button className={`ui-btn ${u.isFollowing ? 'ui-btn-ghost' : 'ui-btn-primary'}`} onClick={() => toggleFollow(u)}>
                {u.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


