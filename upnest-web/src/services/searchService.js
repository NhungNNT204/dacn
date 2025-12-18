/**
 * searchService.js
 * Service để tương tác với Search API
 * Hỗ trợ: Global search, Type-specific search, Suggestions, History
 */

const API_BASE_URL = '/api/v1/search';

class SearchService {
  // ============ GLOBAL SEARCH ============

  /**
   * Global search across all entities
   */
  async globalSearch(keyword) {
    try {
      const response = await fetch(
        `${API_BASE_URL}?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error performing global search:', error);
      throw error;
    }
  }

  // ============ TYPE-SPECIFIC SEARCH ============

  /**
   * Search by specific type
   */
  async searchByType(keyword, type) {
    try {
      const endpoint = type === 'user' ? 'users' : type === 'page' ? 'pages' : type === 'group' ? 'groups' : 'events';
      const response = await fetch(
        `${API_BASE_URL}/${endpoint}?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error(`Error searching ${type}:`, error);
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(keyword, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Search pages
   */
  async searchPages(keyword, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pages?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error searching pages:', error);
      throw error;
    }
  }

  /**
   * Search groups
   */
  async searchGroups(keyword, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/groups?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  }

  /**
   * Search events
   */
  async searchEvents(keyword, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  // ============ SUGGESTIONS ============

  /**
   * Get real-time suggestions
   */
  async getSuggestions(query, type = null) {
    try {
      let url = `${API_BASE_URL}/suggestions?query=${encodeURIComponent(query)}`;
      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }

  // ============ ADVANCED SEARCH ============

  /**
   * Advanced search with filters
   */
  async advancedSearch(query, filters = {}) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/advanced`,
        {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query,
            filters
          })
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  }

  // ============ TRENDING & POPULAR ============

  /**
   * Get trending searches
   */
  async getTrendingSearches() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      throw error;
    }
  }

  /**
   * Get popular items by type
   */
  async getPopularItems(type, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/popular/${type}?limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching popular items:', error);
      throw error;
    }
  }

  // ============ SEARCH HISTORY ============

  /**
   * Get search history
   */
  async getSearchHistory() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/history`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching search history:', error);
      throw error;
    }
  }

  /**
   * Delete search history item
   */
  async deleteSearchHistoryItem(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/history/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting search history item:', error);
      throw error;
    }
  }

  /**
   * Clear all search history
   */
  async clearSearchHistory() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/history`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  }

  // ============ SAVED SEARCHES ============

  /**
   * Get saved searches
   */
  async getSavedSearches() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/saved`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      throw error;
    }
  }

  /**
   * Save search
   */
  async saveSearch(query, name = null) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/saved`,
        {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query,
            name: name || query
          })
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error saving search:', error);
      throw error;
    }
  }

  /**
   * Delete saved search
   */
  async deleteSavedSearch(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/saved/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting saved search:', error);
      throw error;
    }
  }

  // ============ HELPER METHODS ============

  /**
   * Get auth headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Get mock data for development
   */
  getMockGlobalSearch(keyword) {
    return {
      keyword,
      users: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          username: 'user.a',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Web developer passionate about learning',
          isFollowing: false,
          followerCount: 150
        }
      ],
      pages: [
        {
          id: 100,
          name: 'Tech News Daily',
          description: 'Latest in technology',
          coverImage: 'https://via.placeholder.com/200x100',
          followerCount: 5000,
          isFollowing: false,
          category: 'Technology'
        }
      ],
      groups: [
        {
          id: 200,
          name: 'Web Developers Community',
          description: 'Community for web developers',
          coverImage: 'https://via.placeholder.com/200x100',
          memberCount: 2000,
          isJoined: false,
          privacy: 'PUBLIC'
        }
      ],
      events: [
        {
          id: 300,
          name: 'Web Dev Conference 2025',
          description: 'Annual web development conference',
          coverImage: 'https://via.placeholder.com/200x100',
          startDate: '2025-12-20',
          endDate: '2025-12-22',
          location: 'Online',
          attendeeCount: 500,
          isAttending: false
        }
      ],
      totalResults: 4
    };
  }

  /**
   * Get mock suggestions
   */
  getMockSuggestions(query) {
    return {
      query,
      suggestions: [
        {
          id: 1,
          title: 'Nguyễn Văn A',
          subtitle: '@user.a - 150 followers',
          type: 'user',
          icon: '👤',
          thumbnail: 'https://via.placeholder.com/40',
          relevanceScore: 0.95
        },
        {
          id: 100,
          title: 'Tech News Daily',
          subtitle: '5,000 followers',
          type: 'page',
          icon: '📄',
          thumbnail: 'https://via.placeholder.com/40',
          relevanceScore: 0.85
        }
      ],
      recentSearches: ['Java', 'React', 'Database'],
      trendingSearches: ['AI & Machine Learning', 'Web Development', 'Cloud Computing']
    };
  }
}

// Export singleton instance
export default new SearchService();
