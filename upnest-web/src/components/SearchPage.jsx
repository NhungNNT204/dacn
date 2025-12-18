import React, { useState, useEffect, useRef, useCallback } from 'react';
import searchService from '../services/searchService';
import SearchResults from './SearchResults';
import './SearchPage.css';

/**
 * SearchPage Component
 * Trang chủ cho tính năng tìm kiếm
 * Hỗ trợ: Global search, Filter by type, Suggestions
 */
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Load trending searches on mount
  useEffect(() => {
    loadTrendingSearches();
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load trending searches
  const loadTrendingSearches = async () => {
    try {
      const data = await searchService.getTrendingSearches();
      setTrendingSearches(data.trending || []);
    } catch (error) {
      console.error('Error loading trending searches:', error);
    }
  };

  // Load recent searches
  const loadRecentSearches = async () => {
    try {
      const data = await searchService.getSearchHistory();
      setRecentSearches(data.history || []);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Get suggestions with debounce
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce API call
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchService.getSuggestions(value, selectedType);
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);
  }, [selectedType]);

  // Perform search
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      let data;
      if (selectedType === 'all') {
        data = await searchService.globalSearch(searchQuery);
      } else {
        data = await searchService.searchByType(searchQuery, selectedType);
      }

      setResults(data);
      setQuery(searchQuery);
      setShowSuggestions(false);

      // Save to recent searches
      saveToRecentSearches(searchQuery);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save to recent searches
  const saveToRecentSearches = (searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  // Handle trending search click
  const handleTrendingClick = (trend) => {
    handleSearch(trend);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (query.trim()) {
      handleSearch();
    }
  };

  const searchTypes = ['all', 'user', 'page', 'group', 'event'];

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-page-header">
        <h1>Tìm kiếm</h1>
        <p className="search-subtitle">Tìm kiếm người dùng, trang, nhóm, sự kiện...</p>
      </div>

      {/* Search Box */}
      <div className="search-container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>

            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Tìm kiếm..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setQuery('');
                  setResults(null);
                  setSuggestions([]);
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button type="submit" className="search-btn">
            Tìm kiếm
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className="suggestions-dropdown">
            {suggestions.map((suggestion) => (
              <div
                key={`${suggestion.type}-${suggestion.id}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-icon">{suggestion.icon}</span>
                <div className="suggestion-content">
                  <p className="suggestion-title">{suggestion.title}</p>
                  <p className="suggestion-subtitle">{suggestion.subtitle}</p>
                </div>
                <span className="suggestion-type">{suggestion.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="search-filters">
        {searchTypes.map(type => (
          <button
            key={type}
            className={`filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            {type === 'all' && 'Tất cả'}
            {type === 'user' && '👤 Người dùng'}
            {type === 'page' && '📄 Trang'}
            {type === 'group' && '👥 Nhóm'}
            {type === 'event' && '📅 Sự kiện'}
          </button>
        ))}
      </div>

      {/* Results or Initial View */}
      {loading ? (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Đang tìm kiếm...</p>
        </div>
      ) : searchPerformed && results ? (
        <SearchResults results={results} selectedType={selectedType} />
      ) : (
        <div className="initial-view">
          {/* Trending Section */}
          {trendingSearches.length > 0 && (
            <div className="trending-section">
              <h2>🔥 Đang Trending</h2>
              <div className="trending-list">
                {trendingSearches.map((trend, index) => (
                  <div
                    key={index}
                    className="trending-item"
                    onClick={() => handleTrendingClick(trend)}
                  >
                    <span className="trend-number">{index + 1}</span>
                    <span className="trend-text">{trend}</span>
                    <span className="trend-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Section */}
          {recentSearches.length > 0 && (
            <div className="recent-section">
              <div className="recent-header">
                <h2>⏱️ Tìm kiếm gần đây</h2>
                <button
                  className="clear-history-btn"
                  onClick={async () => {
                    await searchService.clearSearchHistory();
                    setRecentSearches([]);
                  }}
                >
                  Xóa
                </button>
              </div>
              <div className="recent-list">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="recent-item"
                    onClick={() => handleTrendingClick(search)}
                  >
                    <span className="recent-icon">🕐</span>
                    <span className="recent-text">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {trendingSearches.length === 0 && recentSearches.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>Bắt đầu tìm kiếm để tìm người dùng, trang, nhóm hoặc sự kiện</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
