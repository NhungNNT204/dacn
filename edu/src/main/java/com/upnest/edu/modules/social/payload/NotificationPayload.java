package com.upnest.edu.modules.social.payload;

import com.upnest.edu.modules.social.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * NotificationPayload - Tất cả DTOs cho Notification API
 */
public class NotificationPayload {

  /**
   * NotificationDTO - DTO cơ bản cho thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationDTO {
    private Long id;
    private Long userId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Notification.NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Long relatedId;
    private String relatedType;
    private Boolean isRead;
    private LocalDateTime createdAt;
  }

  /**
   * NotificationDetailDTO - DTO chi tiết cho thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationDetailDTO {
    private Long id;
    private Long userId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Notification.NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Long relatedId;
    private String relatedType;
    private String relatedImage;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime readAt;
  }

  /**
   * CreateNotificationRequest - Request tạo thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class CreateNotificationRequest {
    private Long userId;
    private String senderName;
    private String senderAvatar;
    private Notification.NotificationType type;
    private String title;
    private String message;
    private String actionUrl;
    private Long relatedId;
    private String relatedType;
  }

  /**
   * UpdateNotificationRequest - Request cập nhật thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class UpdateNotificationRequest {
    private String title;
    private String message;
    private String actionUrl;
  }

  /**
   * NotificationFilterRequest - Request filter thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationFilterRequest {
    private Notification.NotificationType type;
    private Boolean isRead;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
  }

  /**
   * SearchNotificationRequest - Request tìm kiếm thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SearchNotificationRequest {
    private String keyword;
    private Notification.NotificationType type;
    private int page = 0;
    private int size = 20;
  }

  /**
   * NotificationResponse - Response cho thông báo đơn lẻ
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationResponse {
    private Long id;
    private NotificationDTO data;
    private String message;
    private Long timestamp;
  }

  /**
   * PaginatedNotificationResponse - Response phân trang cho thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class PaginatedNotificationResponse {
    private List<NotificationDTO> notifications;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
    private String message;
    private Long timestamp;

    // Constructor mặc định
    public PaginatedNotificationResponse(List<NotificationDTO> notifications, 
                                        long totalElements, int totalPages, 
                                        int currentPage, int pageSize,
                                        boolean hasNext, boolean hasPrevious) {
      this.notifications = notifications;
      this.totalElements = totalElements;
      this.totalPages = totalPages;
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.hasNext = hasNext;
      this.hasPrevious = hasPrevious;
      this.timestamp = System.currentTimeMillis();
    }
  }

  /**
   * UnreadCountResponse - Response đếm thông báo chưa đọc
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class UnreadCountResponse {
    private int count;
    private Long timestamp;

    public UnreadCountResponse(int count) {
      this.count = count;
      this.timestamp = System.currentTimeMillis();
    }
  }

  /**
   * BulkNotificationRequest - Request hàng loạt
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class BulkNotificationRequest {
    private List<Long> notificationIds;
    private String action;  // read, unread, delete
  }

  /**
   * BulkNotificationResponse - Response hàng loạt
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class BulkNotificationResponse {
    private int successCount;
    private int failureCount;
    private String message;
    private Long timestamp;
  }

  /**
   * NotificationStatsDTO - Thống kê thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationStatsDTO {
    private int totalCount;
    private int unreadCount;
    private int readCount;
    private int likeCount;
    private int commentCount;
    private int followCount;
    private int messageCount;
    private Long timestamp;
  }

  /**
   * NotificationTypeResponse - Response cho các loại thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationTypeResponse {
    private List<String> types;
    private Long timestamp;
  }

  /**
   * NotificationPreferenceDTO - Preference cho thông báo
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class NotificationPreferenceDTO {
    private Long userId;
    private boolean likeNotifications = true;
    private boolean commentNotifications = true;
    private boolean followNotifications = true;
    private boolean messageNotifications = true;
    private boolean reminderNotifications = true;
    private boolean systemNotifications = true;
    private String soundEnabled;
    private String emailNotifications;
  }
}
