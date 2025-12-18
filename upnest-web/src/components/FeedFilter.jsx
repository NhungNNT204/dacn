/**
 * FeedFilter.jsx
 * Content Filter Bar - Filter posts by type
 * Filters: All | Lessons | Groups | Friends
 */

import React, { useCallback } from 'react';
import { Book, Users, Heart, BarChart3 } from 'lucide-react';
import '../styles/FeedFilter.css';

const FILTER_OPTIONS = [
  {
    id: 'all',
    label: 'Tất cả',
    icon: BarChart3,
    description: 'Tất cả hoạt động'
  },
  {
    id: 'lessons',
    label: 'Bài học',
    icon: Book,
    description: 'Bài viết từ giảng viên'
  },
  {
    id: 'groups',
    label: 'Nhóm',
    icon: Users,
    description: 'Hoạt động nhóm học'
  },
  {
    id: 'friends',
    label: 'Bạn bè',
    icon: Heart,
    description: 'Bài viết từ bạn bè'
  }
];

export default function FeedFilter({ activeFilter, onFilterChange }) {
  const handleFilterClick = useCallback((filterId) => {
    onFilterChange(filterId);
  }, [onFilterChange]);

  return (
    <div className="feed-filter">
      <div className="filter-container">
        {FILTER_OPTIONS.map(option => {
          const Icon = option.icon;
          const isActive = activeFilter === option.id;

          return (
            <button
              key={option.id}
              className={`filter-button ${isActive ? 'active' : ''}`}
              onClick={() => handleFilterClick(option.id)}
              title={option.description}
            >
              <Icon size={18} className="filter-icon" />
              <span className="filter-label">{option.label}</span>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Visual separator */}
      <div className="filter-divider" />
    </div>
  );
}
