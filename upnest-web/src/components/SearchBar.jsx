import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import searchService from '../services/searchService';

/**
 * SearchBar Component
 * Mini search bar với suggestions dropdown
 * Dùng cho header hoặc global navigation
 */
const SearchBar = ({ placeholder = "Tìm kiếm...", onSearch, compact = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setLoading(true);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce API call
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchService.getSuggestions(value);
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);

    if (onSearch) {
      onSearch(suggestion.title, suggestion.type);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query, 'all');
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`search-bar-container ${compact ? 'compact' : ''}`}>
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <svg className="search-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            title="Xóa"
          >
            ✕
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div ref={suggestionsRef} className="search-suggestions-dropdown">
          {loading ? (
            <div className="suggestions-loading">
              <div className="tiny-spinner"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="suggestions-list">
                {suggestions.slice(0, 8).map((suggestion) => (
                  <div
                    key={`${suggestion.type}-${suggestion.id}`}
                    className="suggestion-row"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-emoji">{suggestion.icon}</span>
                    <div className="suggestion-info">
                      <p className="suggestion-name">{suggestion.title}</p>
                      <p className="suggestion-meta">{suggestion.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="suggestions-footer">
                <a href="/search" className="view-all-link">
                  Xem tất cả kết quả →
                </a>
              </div>
            </>
          ) : (
            <div className="suggestions-empty">
              <p>Không tìm thấy kết quả</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
