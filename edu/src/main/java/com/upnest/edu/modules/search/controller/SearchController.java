package com.upnest.edu.modules.search.controller;

import com.upnest.edu.modules.search.service.SearchService;
import com.upnest.edu.modules.search.payload.SearchPayload.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * SearchController - REST API cho tính năng tìm kiếm
 * Hỗ trợ: Global search, Type-specific search, Suggestions
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {

  private final SearchService searchService;

  // ============ GLOBAL SEARCH ============

  /**
   * GET /api/v1/search
   * Tìm kiếm toàn cầu across all entities
   */
  @GetMapping
  public ResponseEntity<GlobalSearchResponse> globalSearch(
      @RequestParam String keyword,
      @PageableDefault(size = 10) Pageable pageable) {

    log.info("Performing global search for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    GlobalSearchResponse response = searchService.globalSearch(keyword, pageable);

    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/v1/search/users
   * Tìm kiếm Users
   */
  @GetMapping("/users")
  public ResponseEntity<SearchResponse<UserDTO>> searchUsers(
      @RequestParam String keyword,
      @RequestParam(defaultValue = "20") int limit) {

    log.info("Searching users for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<UserDTO> users = searchService.searchUsers(keyword, limit);

    SearchResponse<UserDTO> response = SearchResponse.<UserDTO>builder()
        .query(keyword)
        .type("user")
        .results(users)
        .totalResults(users.size())
        .hasMore(users.size() >= limit)
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/v1/search/pages
   * Tìm kiếm Pages
   */
  @GetMapping("/pages")
  public ResponseEntity<SearchResponse<PageDTO>> searchPages(
      @RequestParam String keyword,
      @RequestParam(defaultValue = "20") int limit) {

    log.info("Searching pages for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<PageDTO> pages = searchService.searchPages(keyword, limit);

    SearchResponse<PageDTO> response = SearchResponse.<PageDTO>builder()
        .query(keyword)
        .type("page")
        .results(pages)
        .totalResults(pages.size())
        .hasMore(pages.size() >= limit)
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/v1/search/groups
   * Tìm kiếm Groups
   */
  @GetMapping("/groups")
  public ResponseEntity<SearchResponse<GroupDTO>> searchGroups(
      @RequestParam String keyword,
      @RequestParam(defaultValue = "20") int limit) {

    log.info("Searching groups for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<GroupDTO> groups = searchService.searchGroups(keyword, limit);

    SearchResponse<GroupDTO> response = SearchResponse.<GroupDTO>builder()
        .query(keyword)
        .type("group")
        .results(groups)
        .totalResults(groups.size())
        .hasMore(groups.size() >= limit)
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/v1/search/events
   * Tìm kiếm Events
   */
  @GetMapping("/events")
  public ResponseEntity<SearchResponse<EventDTO>> searchEvents(
      @RequestParam String keyword,
      @RequestParam(defaultValue = "20") int limit) {

    log.info("Searching events for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<EventDTO> events = searchService.searchEvents(keyword, limit);

    SearchResponse<EventDTO> response = SearchResponse.<EventDTO>builder()
        .query(keyword)
        .type("event")
        .results(events)
        .totalResults(events.size())
        .hasMore(events.size() >= limit)
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  // ============ SUGGESTIONS ============

  /**
   * GET /api/v1/search/suggestions
   * Lấy gợi ý tức thì (autocomplete)
   */
  @GetMapping("/suggestions")
  public ResponseEntity<SuggestionsResponse> getSuggestions(
      @RequestParam(required = false) String query,
      @RequestParam(required = false) String type) {

    log.info("Getting suggestions for query: {} type: {}", query, type);

    SuggestionsResponse response = searchService.getSuggestions(query, type);

    return ResponseEntity.ok(response);
  }

  // ============ ADVANCED SEARCH ============

  /**
   * POST /api/v1/search/advanced
   * Advanced search dengan multiple filters
   */
  @PostMapping("/advanced")
  public ResponseEntity<AdvancedSearchResponse> advancedSearch(
      @RequestBody AdvancedSearchRequest request,
      @PageableDefault(size = 20) Pageable pageable) {

    log.info("Performing advanced search with filters: {}", request.getFilters());

    if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    // TODO: Implement advanced search logic
    AdvancedSearchResponse response = AdvancedSearchResponse.builder()
        .query(request.getQuery())
        .filters(request.getFilters())
        .users(searchService.searchUsers(request.getQuery(), 10))
        .pages(searchService.searchPages(request.getQuery(), 10))
        .groups(searchService.searchGroups(request.getQuery(), 10))
        .events(searchService.searchEvents(request.getQuery(), 10))
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  // ============ TRENDING & POPULAR ============

  /**
   * GET /api/v1/search/trending
   * Lấy trending searches
   */
  @GetMapping("/trending")
  public ResponseEntity<TrendingResponse> getTrendingSearches() {
    log.info("Fetching trending searches");

    // TODO: Implement trending logic
    TrendingResponse response = TrendingResponse.builder()
        .trending(List.of(
            "Java Development",
            "Web Design",
            "AI & Machine Learning",
            "Mobile Apps",
            "Cloud Computing"
        ))
        .popularTags(List.of(
            "programming", "design", "education", "technology", "learning"
        ))
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/v1/search/popular/{type}
   * Lấy popular items by type
   */
  @GetMapping("/popular/{type}")
  public ResponseEntity<PopularResponse> getPopularItems(
      @PathVariable String type,
      @RequestParam(defaultValue = "10") int limit) {

    log.info("Fetching popular {} items", type);

    List<?> items = switch (type.toLowerCase()) {
      case "user" -> searchService.searchUsers("", limit);
      case "page" -> searchService.searchPages("", limit);
      case "group" -> searchService.searchGroups("", limit);
      case "event" -> searchService.searchEvents("", limit);
      default -> List.of();
    };

    PopularResponse response = PopularResponse.builder()
        .type(type)
        .items(items)
        .totalItems(items.size())
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  // ============ SEARCH HISTORY ============

  /**
   * GET /api/v1/search/history
   * Lấy lịch sử tìm kiếm
   */
  @GetMapping("/history")
  public ResponseEntity<SearchHistoryResponse> getSearchHistory(
      Authentication authentication) {

    log.info("Fetching search history for user");

    // TODO: Implement search history storage
    SearchHistoryResponse response = SearchHistoryResponse.builder()
        .history(List.of(
            "Java Spring Boot",
            "Web Development",
            "React",
            "Database Design",
            "Cloud Computing"
        ))
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * DELETE /api/v1/search/history/{id}
   * Xóa search history item
   */
  @DeleteMapping("/history/{id}")
  public ResponseEntity<Void> deleteSearchHistoryItem(
      Authentication authentication,
      @PathVariable Long id) {

    log.info("Deleting search history item: {}", id);

    // TODO: Implement history deletion
    return ResponseEntity.ok().build();
  }

  /**
   * DELETE /api/v1/search/history
   * Xóa tất cả search history
   */
  @DeleteMapping("/history")
  public ResponseEntity<Void> clearSearchHistory(
      Authentication authentication) {

    log.info("Clearing all search history for user");

    // TODO: Implement history clearing
    return ResponseEntity.ok().build();
  }

  // ============ SAVED SEARCHES ============

  /**
   * GET /api/v1/search/saved
   * Lấy saved searches
   */
  @GetMapping("/saved")
  public ResponseEntity<SavedSearchesResponse> getSavedSearches(
      Authentication authentication) {

    log.info("Fetching saved searches for user");

    // TODO: Implement saved searches
    SavedSearchesResponse response = SavedSearchesResponse.builder()
        .savedSearches(List.of())
        .timestamp(System.currentTimeMillis())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * POST /api/v1/search/saved
   * Lưu search
   */
  @PostMapping("/saved")
  public ResponseEntity<SavedSearchDTO> saveSearch(
      Authentication authentication,
      @RequestBody SaveSearchRequest request) {

    log.info("Saving search: {}", request.getQuery());

    // TODO: Implement save search
    SavedSearchDTO response = SavedSearchDTO.builder()
        .id(System.currentTimeMillis())
        .query(request.getQuery())
        .name(request.getName())
        .createdAt(System.currentTimeMillis())
        .build();

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   * DELETE /api/v1/search/saved/{id}
   * Xóa saved search
   */
  @DeleteMapping("/saved/{id}")
  public ResponseEntity<Void> deleteSavedSearch(
      Authentication authentication,
      @PathVariable Long id) {

    log.info("Deleting saved search: {}", id);

    // TODO: Implement delete saved search
    return ResponseEntity.ok().build();
  }
}
