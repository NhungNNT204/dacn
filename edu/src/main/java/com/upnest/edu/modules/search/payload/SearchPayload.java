package com.upnest.edu.modules.search.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

/**
 * SearchPayload - Tất cả DTOs cho Search API
 */
public class SearchPayload {

  // ============ USER DTO ============
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String avatar;
    private String bio;
    private boolean isFollowing;
    private int followerCount;
  }

  // ============ PAGE DTO ============
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class PageDTO {
    private Long id;
    private String name;
    private String description;
    private String coverImage;
    private int followerCount;
    private boolean isFollowing;
    private String category;
  }

  // ============ GROUP DTO ============
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class GroupDTO {
    private Long id;
    private String name;
    private String description;
    private String coverImage;
    private int memberCount;
    private boolean isJoined;
    private String privacy;
  }

  // ============ EVENT DTO ============
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class EventDTO {
    private Long id;
    private String name;
    private String description;
    private String coverImage;
    private String startDate;
    private String endDate;
    private String location;
    private int attendeeCount;
    private boolean isAttending;
  }

  // ============ SUGGESTION DTO ============
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SuggestionDTO {
    private Long id;
    private String title;
    private String subtitle;
    private String type;
    private String icon;
    private String thumbnail;
    private double relevanceScore;
  }

  // ============ SEARCH RESPONSES ============

  /**
   * Global search response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class GlobalSearchResponse {
    private String keyword;
    private List<UserDTO> users;
    private List<PageDTO> pages;
    private List<GroupDTO> groups;
    private List<EventDTO> events;
    private int totalResults;
    private long timestamp;
  }

  /**
   * Generic search response for type-specific search
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SearchResponse<T> {
    private String query;
    private String type;
    private List<T> results;
    private int totalResults;
    private boolean hasMore;
    private long timestamp;
  }

  /**
   * Suggestions response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SuggestionsResponse {
    private String query;
    private List<SuggestionDTO> suggestions;
    private List<String> recentSearches;
    private List<String> trendingSearches;
    private long timestamp;
  }

  /**
   * Advanced search request
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class AdvancedSearchRequest {
    private String query;
    private Map<String, Object> filters;
    private List<String> types;
    private String sortBy;
    private String order;
  }

  /**
   * Advanced search response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class AdvancedSearchResponse {
    private String query;
    private Map<String, Object> filters;
    private List<UserDTO> users;
    private List<PageDTO> pages;
    private List<GroupDTO> groups;
    private List<EventDTO> events;
    private long timestamp;
  }

  /**
   * Trending searches response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class TrendingResponse {
    private List<String> trending;
    private List<String> popularTags;
    private long timestamp;
  }

  /**
   * Popular items response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class PopularResponse {
    private String type;
    private List<?> items;
    private int totalItems;
    private long timestamp;
  }

  /**
   * Search history response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SearchHistoryResponse {
    private List<String> history;
    private long timestamp;
  }

  /**
   * Saved search DTO
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SavedSearchDTO {
    private Long id;
    private String query;
    private String name;
    private long createdAt;
  }

  /**
   * Save search request
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SaveSearchRequest {
    private String query;
    private String name;
  }

  /**
   * Saved searches response
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SavedSearchesResponse {
    private List<SavedSearchDTO> savedSearches;
    private long timestamp;
  }

  /**
   * Filter configuration for advanced search
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class FilterConfig {
    private String type;
    private String field;
    private String operator;
    private Object value;
  }

  /**
   * Search suggestion input
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SuggestionsRequest {
    private String query;
    private String type;
    private int limit;
  }

  /**
   * Search filters DTO
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SearchFiltersDTO {
    private List<String> types;
    private String sortBy;
    private String order;
    private Integer limit;
    private Integer offset;
  }

  /**
   * Search statistics
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SearchStatsDTO {
    private String keyword;
    private int userCount;
    private int pageCount;
    private int groupCount;
    private int eventCount;
    private long searchTime; // milliseconds
    private long timestamp;
  }
}
