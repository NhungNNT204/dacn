package com.upnest.edu.modules.search.service;

import com.upnest.edu.modules.social.entity.*;
import com.upnest.edu.modules.social.repository.*;
import com.upnest.edu.modules.search.payload.SearchPayload.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

/**
 * SearchService - Quản lý tìm kiếm toàn cầu
 * Hỗ trợ tìm kiếm: Users, Pages, Groups, Events
 * Hỗ trợ gợi ý tức thì (suggestions)
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

  // Repositories - sẽ được inject từ social module
  // private final UserRepository userRepository;
  // private final PageRepository pageRepository;
  // private final GroupRepository groupRepository;
  // private final EventRepository eventRepository;

  // For now, using mock data until repositories are available
  private static final int SUGGESTION_LIMIT = 10;
  private static final int SEARCH_LIMIT = 50;

  // ============ GLOBAL SEARCH ============

  /**
   * Tìm kiếm toàn cầu across all entities
   */
  public GlobalSearchResponse globalSearch(String keyword, Pageable pageable) {
    log.info("Performing global search for keyword: {}", keyword);

    if (keyword == null || keyword.trim().isEmpty()) {
      return GlobalSearchResponse.builder()
          .users(new ArrayList<>())
          .pages(new ArrayList<>())
          .groups(new ArrayList<>())
          .events(new ArrayList<>())
          .totalResults(0)
          .build();
    }

    String searchKeyword = keyword.toLowerCase().trim();

    // Search in each category
    List<UserDTO> users = searchUsers(searchKeyword, pageable.getPageSize());
    List<PageDTO> pages = searchPages(searchKeyword, pageable.getPageSize());
    List<GroupDTO> groups = searchGroups(searchKeyword, pageable.getPageSize());
    List<EventDTO> events = searchEvents(searchKeyword, pageable.getPageSize());

    int totalResults = users.size() + pages.size() + groups.size() + events.size();

    return GlobalSearchResponse.builder()
        .keyword(keyword)
        .users(users)
        .pages(pages)
        .groups(groups)
        .events(events)
        .totalResults(totalResults)
        .timestamp(System.currentTimeMillis())
        .build();
  }

  /**
   * Tìm kiếm Users
   */
  public List<UserDTO> searchUsers(String keyword, int limit) {
    log.info("Searching users for keyword: {}", keyword);

    // Mock implementation - replace with actual repository
    return generateMockUsers(keyword, limit);
  }

  /**
   * Tìm kiếm Pages
   */
  public List<PageDTO> searchPages(String keyword, int limit) {
    log.info("Searching pages for keyword: {}", keyword);

    // Mock implementation
    return generateMockPages(keyword, limit);
  }

  /**
   * Tìm kiếm Groups
   */
  public List<GroupDTO> searchGroups(String keyword, int limit) {
    log.info("Searching groups for keyword: {}", keyword);

    // Mock implementation
    return generateMockGroups(keyword, limit);
  }

  /**
   * Tìm kiếm Events
   */
  public List<EventDTO> searchEvents(String keyword, int limit) {
    log.info("Searching events for keyword: {}", keyword);

    // Mock implementation
    return generateMockEvents(keyword, limit);
  }

  // ============ SUGGESTIONS ============

  /**
   * Lấy gợi ý tức thì khi nhập
   */
  public SuggestionsResponse getSuggestions(String query, String type) {
    log.info("Getting suggestions for query: {} type: {}", query, type);

    if (query == null || query.trim().isEmpty()) {
      return SuggestionsResponse.builder()
          .suggestions(new ArrayList<>())
          .recentSearches(getRecentSearches())
          .trendingSearches(getTrendingSearches())
          .build();
    }

    String searchQuery = query.toLowerCase().trim();
    List<SuggestionDTO> suggestions = new ArrayList<>();

    if (type == null || type.isEmpty() || "all".equals(type)) {
      suggestions.addAll(getUserSuggestions(searchQuery, SUGGESTION_LIMIT / 4));
      suggestions.addAll(getPageSuggestions(searchQuery, SUGGESTION_LIMIT / 4));
      suggestions.addAll(getGroupSuggestions(searchQuery, SUGGESTION_LIMIT / 4));
      suggestions.addAll(getEventSuggestions(searchQuery, SUGGESTION_LIMIT / 4));
    } else {
      switch (type.toLowerCase()) {
        case "user":
          suggestions.addAll(getUserSuggestions(searchQuery, SUGGESTION_LIMIT));
          break;
        case "page":
          suggestions.addAll(getPageSuggestions(searchQuery, SUGGESTION_LIMIT));
          break;
        case "group":
          suggestions.addAll(getGroupSuggestions(searchQuery, SUGGESTION_LIMIT));
          break;
        case "event":
          suggestions.addAll(getEventSuggestions(searchQuery, SUGGESTION_LIMIT));
          break;
      }
    }

    // Sort by relevance score
    suggestions.sort((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()));

    return SuggestionsResponse.builder()
        .query(query)
        .suggestions(suggestions.stream().limit(SUGGESTION_LIMIT).collect(Collectors.toList()))
        .recentSearches(getRecentSearches())
        .trendingSearches(getTrendingSearches())
        .timestamp(System.currentTimeMillis())
        .build();
  }

  /**
   * Gợi ý Users
   */
  private List<SuggestionDTO> getUserSuggestions(String query, int limit) {
    List<UserDTO> users = generateMockUsers(query, limit);
    return users.stream()
        .map(user -> SuggestionDTO.builder()
            .id(user.getId())
            .title(user.getName())
            .subtitle(user.getUsername())
            .type("user")
            .icon("👤")
            .thumbnail(user.getAvatar())
            .relevanceScore(calculateRelevance(user.getName(), query))
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Gợi ý Pages
   */
  private List<SuggestionDTO> getPageSuggestions(String query, int limit) {
    List<PageDTO> pages = generateMockPages(query, limit);
    return pages.stream()
        .map(page -> SuggestionDTO.builder()
            .id(page.getId())
            .title(page.getName())
            .subtitle(String.valueOf(page.getFollowerCount()) + " followers")
            .type("page")
            .icon("📄")
            .thumbnail(page.getCoverImage())
            .relevanceScore(calculateRelevance(page.getName(), query))
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Gợi ý Groups
   */
  private List<SuggestionDTO> getGroupSuggestions(String query, int limit) {
    List<GroupDTO> groups = generateMockGroups(query, limit);
    return groups.stream()
        .map(group -> SuggestionDTO.builder()
            .id(group.getId())
            .title(group.getName())
            .subtitle(String.valueOf(group.getMemberCount()) + " members")
            .type("group")
            .icon("👥")
            .thumbnail(group.getCoverImage())
            .relevanceScore(calculateRelevance(group.getName(), query))
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Gợi ý Events
   */
  private List<SuggestionDTO> getEventSuggestions(String query, int limit) {
    List<EventDTO> events = generateMockEvents(query, limit);
    return events.stream()
        .map(event -> SuggestionDTO.builder()
            .id(event.getId())
            .title(event.getName())
            .subtitle(event.getStartDate())
            .type("event")
            .icon("📅")
            .thumbnail(event.getCoverImage())
            .relevanceScore(calculateRelevance(event.getName(), query))
            .build())
        .collect(Collectors.toList());
  }

  // ============ HELPER METHODS ============

  /**
   * Tính điểm liên quan (relevance score)
   */
  private double calculateRelevance(String text, String query) {
    if (text == null) return 0.0;

    text = text.toLowerCase();
    query = query.toLowerCase();

    // Điểm cao nhất nếu khớp chính xác
    if (text.equals(query)) return 1.0;

    // Điểm cao nếu bắt đầu với query
    if (text.startsWith(query)) return 0.9;

    // Điểm trung bình nếu chứa query
    if (text.contains(query)) return 0.7;

    // Tính Levenshtein distance cho fuzzy matching
    int similarity = calculateSimilarity(text, query);
    return Math.max(0.0, 0.5 - (similarity * 0.1));
  }

  /**
   * Tính độ tương tự giữa 2 strings (Levenshtein distance)
   */
  private int calculateSimilarity(String s1, String s2) {
    int[][] dp = new int[s1.length() + 1][s2.length() + 1];

    for (int i = 0; i <= s1.length(); i++) {
      dp[i][0] = i;
    }
    for (int j = 0; j <= s2.length(); j++) {
      dp[0][j] = j;
    }

    for (int i = 1; i <= s1.length(); i++) {
      for (int j = 1; j <= s2.length(); j++) {
        if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(Math.min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]);
        }
      }
    }

    return dp[s1.length()][s2.length()];
  }

  /**
   * Lấy tìm kiếm gần đây
   */
  private List<String> getRecentSearches() {
    // TODO: Implement from database
    return Arrays.asList(
        "Java Spring Boot",
        "Web Development",
        "React",
        "Database Design",
        "Cloud Computing"
    );
  }

  /**
   * Lấy tìm kiếm đang trending
   */
  private List<String> getTrendingSearches() {
    // TODO: Implement from database based on popularity
    return Arrays.asList(
        "AI & Machine Learning",
        "Mobile Development",
        "DevOps",
        "Blockchain",
        "Cybersecurity"
    );
  }

  // ============ MOCK DATA GENERATORS ============

  private List<UserDTO> generateMockUsers(String keyword, int limit) {
    List<UserDTO> users = new ArrayList<>();
    String[] names = {"Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"};
    String[] usernames = {"user.a", "user.b", "user.c", "user.d", "user.e"};

    for (int i = 0; i < Math.min(limit, names.length); i++) {
      if (names[i].toLowerCase().contains(keyword) || usernames[i].contains(keyword)) {
        users.add(UserDTO.builder()
            .id((long) (i + 1))
            .name(names[i])
            .username(usernames[i])
            .avatar("https://via.placeholder.com/40")
            .isFollowing(i % 2 == 0)
            .followerCount(100 + i * 50)
            .build());
      }
    }
    return users;
  }

  private List<PageDTO> generateMockPages(String keyword, int limit) {
    List<PageDTO> pages = new ArrayList<>();
    String[] pageNames = {"Tech News", "Education Hub", "Development Tips", "Web Design Trends", "Coding Tutorials"};

    for (int i = 0; i < Math.min(limit, pageNames.length); i++) {
      if (pageNames[i].toLowerCase().contains(keyword)) {
        pages.add(PageDTO.builder()
            .id((long) (i + 100))
            .name(pageNames[i])
            .description("Leading source for " + pageNames[i])
            .coverImage("https://via.placeholder.com/200x100")
            .followerCount(1000 + i * 200)
            .isFollowing(i % 2 == 0)
            .build());
      }
    }
    return pages;
  }

  private List<GroupDTO> generateMockGroups(String keyword, int limit) {
    List<GroupDTO> groups = new ArrayList<>();
    String[] groupNames = {"Java Developers", "React Community", "UI/UX Designers", "Full Stack Developers", "Mobile Dev Group"};

    for (int i = 0; i < Math.min(limit, groupNames.length); i++) {
      if (groupNames[i].toLowerCase().contains(keyword)) {
        groups.add(GroupDTO.builder()
            .id((long) (i + 200))
            .name(groupNames[i])
            .description("Community for " + groupNames[i])
            .coverImage("https://via.placeholder.com/200x100")
            .memberCount(500 + i * 100)
            .isJoined(i % 2 == 0)
            .privacy("PUBLIC")
            .build());
      }
    }
    return groups;
  }

  private List<EventDTO> generateMockEvents(String keyword, int limit) {
    List<EventDTO> events = new ArrayList<>();
    String[] eventNames = {"Web Dev Conference", "AI Workshop", "Design Bootcamp", "Coding Marathon", "Tech Meetup"};

    for (int i = 0; i < Math.min(limit, eventNames.length); i++) {
      if (eventNames[i].toLowerCase().contains(keyword)) {
        events.add(EventDTO.builder()
            .id((long) (i + 300))
            .name(eventNames[i])
            .description("Join us for " + eventNames[i])
            .coverImage("https://via.placeholder.com/200x100")
            .startDate("2025-12-" + (20 + i))
            .endDate("2025-12-" + (21 + i))
            .location("Online")
            .attendeeCount(200 + i * 50)
            .isAttending(i % 2 == 0)
            .build());
      }
    }
    return events;
  }
}
