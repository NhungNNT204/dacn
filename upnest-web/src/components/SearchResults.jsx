import React, { useState } from 'react';
import './SearchResults.css';

/**
 * SearchResults Component
 * Hiển thị kết quả tìm kiếm theo loại (Users, Pages, Groups, Events)
 */
const SearchResults = ({ results, selectedType }) => {
  const [expandedType, setExpandedType] = useState(selectedType === 'all' ? 'all' : null);

  const renderUserResult = (user) => (
    <div key={user.id} className="result-card user-result">
      <div className="result-avatar">
        <img src={user.avatar} alt={user.name} className="avatar-img"/>
      </div>
      <div className="result-content">
        <h3 className="result-name">{user.name}</h3>
        <p className="result-username">@{user.username}</p>
        {user.bio && <p className="result-bio">{user.bio}</p>}
        <p className="result-meta">{user.followerCount} followers</p>
      </div>
      <button className={`result-action-btn ${user.isFollowing ? 'following' : ''}`}>
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );

  const renderPageResult = (page) => (
    <div key={page.id} className="result-card page-result">
      <div className="result-cover">
        <img src={page.coverImage} alt={page.name} className="cover-img"/>
      </div>
      <div className="result-content">
        <h3 className="result-name">📄 {page.name}</h3>
        <p className="result-description">{page.description}</p>
        <p className="result-meta">{page.followerCount} followers</p>
        {page.category && <span className="result-category">{page.category}</span>}
      </div>
      <button className={`result-action-btn ${page.isFollowing ? 'following' : ''}`}>
        {page.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );

  const renderGroupResult = (group) => (
    <div key={group.id} className="result-card group-result">
      <div className="result-cover">
        <img src={group.coverImage} alt={group.name} className="cover-img"/>
      </div>
      <div className="result-content">
        <h3 className="result-name">👥 {group.name}</h3>
        <p className="result-description">{group.description}</p>
        <div className="result-info-row">
          <span className="result-meta">{group.memberCount} members</span>
          <span className="privacy-badge">{group.privacy}</span>
        </div>
      </div>
      <button className={`result-action-btn ${group.isJoined ? 'joined' : ''}`}>
        {group.isJoined ? 'Joined' : 'Join'}
      </button>
    </div>
  );

  const renderEventResult = (event) => (
    <div key={event.id} className="result-card event-result">
      <div className="result-cover">
        <img src={event.coverImage} alt={event.name} className="cover-img"/>
      </div>
      <div className="result-content">
        <h3 className="result-name">📅 {event.name}</h3>
        <p className="result-description">{event.description}</p>
        <div className="event-details">
          <span className="event-date">📅 {event.startDate}</span>
          <span className="event-location">📍 {event.location}</span>
          <span className="event-attendees">{event.attendeeCount} attending</span>
        </div>
      </div>
      <button className={`result-action-btn ${event.isAttending ? 'attending' : ''}`}>
        {event.isAttending ? 'Going' : 'Interested'}
      </button>
    </div>
  );

  const getResultCount = (type) => {
    return results[type]?.length || 0;
  };

  if (!results) {
    return <div className="no-results">Không có kết quả</div>;
  }

  const userCount = getResultCount('users');
  const pageCount = getResultCount('pages');
  const groupCount = getResultCount('groups');
  const eventCount = getResultCount('events');
  const totalCount = userCount + pageCount + groupCount + eventCount;

  return (
    <div className="search-results-container">
      {/* Results Summary */}
      <div className="results-summary">
        <h2>Kết quả tìm kiếm ({totalCount})</h2>
        {selectedType === 'all' && (
          <div className="results-breakdown">
            {userCount > 0 && <span className="breakdown-item">👤 {userCount} người</span>}
            {pageCount > 0 && <span className="breakdown-item">📄 {pageCount} trang</span>}
            {groupCount > 0 && <span className="breakdown-item">👥 {groupCount} nhóm</span>}
            {eventCount > 0 && <span className="breakdown-item">📅 {eventCount} sự kiện</span>}
          </div>
        )}
      </div>

      {/* Results Sections */}
      {selectedType === 'all' ? (
        <div className="all-results">
          {/* Users Section */}
          {userCount > 0 && (
            <section className="results-section">
              <div
                className="section-header"
                onClick={() => setExpandedType(expandedType === 'users' ? 'all' : 'users')}
              >
                <h3>👤 Người dùng ({userCount})</h3>
                <span className="expand-icon">
                  {expandedType === 'users' ? '▼' : '▶'}
                </span>
              </div>
              {expandedType === 'users' && (
                <div className="results-grid users-grid">
                  {results.users.map(renderUserResult)}
                </div>
              )}
            </section>
          )}

          {/* Pages Section */}
          {pageCount > 0 && (
            <section className="results-section">
              <div
                className="section-header"
                onClick={() => setExpandedType(expandedType === 'pages' ? 'all' : 'pages')}
              >
                <h3>📄 Trang ({pageCount})</h3>
                <span className="expand-icon">
                  {expandedType === 'pages' ? '▼' : '▶'}
                </span>
              </div>
              {expandedType === 'pages' && (
                <div className="results-grid">
                  {results.pages.map(renderPageResult)}
                </div>
              )}
            </section>
          )}

          {/* Groups Section */}
          {groupCount > 0 && (
            <section className="results-section">
              <div
                className="section-header"
                onClick={() => setExpandedType(expandedType === 'groups' ? 'all' : 'groups')}
              >
                <h3>👥 Nhóm ({groupCount})</h3>
                <span className="expand-icon">
                  {expandedType === 'groups' ? '▼' : '▶'}
                </span>
              </div>
              {expandedType === 'groups' && (
                <div className="results-grid">
                  {results.groups.map(renderGroupResult)}
                </div>
              )}
            </section>
          )}

          {/* Events Section */}
          {eventCount > 0 && (
            <section className="results-section">
              <div
                className="section-header"
                onClick={() => setExpandedType(expandedType === 'events' ? 'all' : 'events')}
              >
                <h3>📅 Sự kiện ({eventCount})</h3>
                <span className="expand-icon">
                  {expandedType === 'events' ? '▼' : '▶'}
                </span>
              </div>
              {expandedType === 'events' && (
                <div className="results-grid">
                  {results.events.map(renderEventResult)}
                </div>
              )}
            </section>
          )}

          {totalCount === 0 && (
            <div className="no-results">Không tìm thấy kết quả phù hợp</div>
          )}
        </div>
      ) : (
        // Type-specific results
        <div className="filtered-results">
          {selectedType === 'user' && userCount > 0 && (
            <div className="results-grid users-grid">
              {results.users?.map(renderUserResult)}
            </div>
          )}
          {selectedType === 'page' && pageCount > 0 && (
            <div className="results-grid">
              {results.pages?.map(renderPageResult)}
            </div>
          )}
          {selectedType === 'group' && groupCount > 0 && (
            <div className="results-grid">
              {results.groups?.map(renderGroupResult)}
            </div>
          )}
          {selectedType === 'event' && eventCount > 0 && (
            <div className="results-grid">
              {results.events?.map(renderEventResult)}
            </div>
          )}

          {totalCount === 0 && (
            <div className="no-results">
              Không tìm thấy {selectedType} phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
