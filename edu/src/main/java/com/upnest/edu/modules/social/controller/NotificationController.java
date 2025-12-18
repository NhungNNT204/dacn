package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.Notification;
import com.upnest.edu.modules.social.service.NotificationService;
import com.upnest.edu.modules.social.payload.NotificationPayload.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * NotificationController - REST API cho thông báo
 * Endpoints: GET, POST, PUT, DELETE notifications
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/social/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

  private final NotificationService notificationService;

  // Helper để lấy userId từ authentication
  private Long getUserId(Authentication authentication) {
    // Lấy từ SecurityContext, implement theo auth của bạn
    return 1L;  // Placeholder
  }

  // ============ GET ENDPOINTS ============

  /**
   * GET /api/v1/social/notifications
   * Lấy danh sách thông báo với phân trang
   */
  @GetMapping
  public ResponseEntity<PaginatedNotificationResponse> getNotifications(
      Authentication authentication,
      @PageableDefault(size = 20) Pageable pageable) {
    
    Long userId = getUserId(authentication);
    log.info("Getting notifications for user: {}", userId);
    
    Page<Notification> page = notificationService.getNotifications(userId, pageable);
    
    List<NotificationDTO> notifications = page.getContent().stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(PaginatedNotificationResponse.builder()
        .notifications(notifications)
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .currentPage(page.getNumber())
        .pageSize(page.getSize())
        .hasNext(page.hasNext())
        .hasPrevious(page.hasPrevious())
        .build());
  }

  /**
   * GET /api/v1/social/notifications/{id}
   * Lấy chi tiết thông báo
   */
  @GetMapping("/{id}")
  public ResponseEntity<NotificationDetailDTO> getNotificationDetail(
      Authentication authentication,
      @PathVariable Long id) {
    
    Long userId = getUserId(authentication);
    log.info("Getting notification detail: {}", id);
    
    Notification notification = notificationService.getNotificationDetail(id);
    if (notification == null) {
      return ResponseEntity.notFound().build();
    }
    
    // Verify ownership
    if (!notification.getUserId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    
    return ResponseEntity.ok(toDetailDTO(notification));
  }

  /**
   * GET /api/v1/social/notifications/unread/count
   * Đếm thông báo chưa đọc
   */
  @GetMapping("/unread/count")
  public ResponseEntity<UnreadCountResponse> getUnreadCount(Authentication authentication) {
    Long userId = getUserId(authentication);
    log.info("Getting unread count for user: {}", userId);
    
    int count = notificationService.countUnreadNotifications(userId);
    
    return ResponseEntity.ok(UnreadCountResponse.builder()
        .count(count)
        .build());
  }

  /**
   * GET /api/v1/social/notifications/unread
   * Lấy thông báo chưa đọc
   */
  @GetMapping("/unread")
  public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(Authentication authentication) {
    Long userId = getUserId(authentication);
    log.info("Getting unread notifications for user: {}", userId);
    
    List<Notification> notifications = notificationService.getUnreadNotifications(userId);
    
    List<NotificationDTO> dtos = notifications.stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(dtos);
  }

  /**
   * GET /api/v1/social/notifications/type/{type}
   * Lấy thông báo theo loại
   */
  @GetMapping("/type/{type}")
  public ResponseEntity<PaginatedNotificationResponse> getNotificationsByType(
      Authentication authentication,
      @PathVariable String type,
      @PageableDefault(size = 20) Pageable pageable) {
    
    Long userId = getUserId(authentication);
    log.info("Getting notifications by type {} for user: {}", type, userId);
    
    try {
      Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
      Page<Notification> page = notificationService.getNotificationsByType(userId, notificationType, pageable);
      
      List<NotificationDTO> notifications = page.getContent().stream()
          .map(this::toDTO)
          .collect(Collectors.toList());
      
      return ResponseEntity.ok(PaginatedNotificationResponse.builder()
          .notifications(notifications)
          .totalElements(page.getTotalElements())
          .totalPages(page.getTotalPages())
          .currentPage(page.getNumber())
          .pageSize(page.getSize())
          .hasNext(page.hasNext())
          .hasPrevious(page.hasPrevious())
          .build());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * GET /api/v1/social/notifications/search
   * Tìm kiếm thông báo
   */
  @GetMapping("/search")
  public ResponseEntity<PaginatedNotificationResponse> searchNotifications(
      Authentication authentication,
      @RequestParam String keyword,
      @PageableDefault(size = 20) Pageable pageable) {
    
    Long userId = getUserId(authentication);
    log.info("Searching notifications for user {} with keyword: {}", userId, keyword);
    
    Page<Notification> page = notificationService.searchNotifications(userId, keyword, pageable);
    
    List<NotificationDTO> notifications = page.getContent().stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(PaginatedNotificationResponse.builder()
        .notifications(notifications)
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .currentPage(page.getNumber())
        .pageSize(page.getSize())
        .hasNext(page.hasNext())
        .hasPrevious(page.hasPrevious())
        .build());
  }

  /**
   * GET /api/v1/social/notifications/recent/{limit}
   * Lấy thông báo gần nhất
   */
  @GetMapping("/recent/{limit}")
  public ResponseEntity<List<NotificationDTO>> getRecentNotifications(
      Authentication authentication,
      @PathVariable int limit) {
    
    Long userId = getUserId(authentication);
    log.info("Getting {} recent notifications for user: {}", limit, userId);
    
    List<Notification> notifications = notificationService.getRecentNotifications(userId, limit);
    
    List<NotificationDTO> dtos = notifications.stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(dtos);
  }

  // ============ POST ENDPOINTS ============

  /**
   * POST /api/v1/social/notifications
   * Tạo thông báo mới
   */
  @PostMapping
  public ResponseEntity<NotificationDTO> createNotification(
      Authentication authentication,
      @RequestBody CreateNotificationRequest request) {
    
    Long senderId = getUserId(authentication);
    log.info("Creating notification from {} to {}", senderId, request.getUserId());
    
    Notification notification = Notification.builder()
        .userId(request.getUserId())
        .senderId(senderId)
        .senderName(request.getSenderName())
        .senderAvatar(request.getSenderAvatar())
        .type(request.getType())
        .title(request.getTitle())
        .message(request.getMessage())
        .actionUrl(request.getActionUrl())
        .relatedId(request.getRelatedId())
        .relatedType(request.getRelatedType())
        .build();
    
    Notification created = notificationService.createNotification(notification);
    
    if (created == null) {
      return ResponseEntity.badRequest().build();
    }
    
    return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(created));
  }

  // ============ PUT ENDPOINTS ============

  /**
   * PUT /api/v1/social/notifications/{id}/read
   * Đánh dấu thông báo là đã đọc
   */
  @PutMapping("/{id}/read")
  public ResponseEntity<NotificationDTO> markAsRead(
      Authentication authentication,
      @PathVariable Long id) {
    
    Long userId = getUserId(authentication);
    log.info("Marking notification as read: {}", id);
    
    Notification notification = notificationService.getNotificationDetail(id);
    if (notification == null) {
      return ResponseEntity.notFound().build();
    }
    
    if (!notification.getUserId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    
    Notification updated = notificationService.markAsRead(id);
    
    return ResponseEntity.ok(toDTO(updated));
  }

  /**
   * PUT /api/v1/social/notifications/read-all
   * Đánh dấu tất cả thông báo là đã đọc
   */
  @PutMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
    Long userId = getUserId(authentication);
    log.info("Marking all notifications as read for user: {}", userId);
    
    notificationService.markAllAsRead(userId);
    
    return ResponseEntity.ok().build();
  }

  /**
   * PUT /api/v1/social/notifications/{id}/unread
   * Đánh dấu thông báo là chưa đọc
   */
  @PutMapping("/{id}/unread")
  public ResponseEntity<NotificationDTO> markAsUnread(
      Authentication authentication,
      @PathVariable Long id) {
    
    Long userId = getUserId(authentication);
    log.info("Marking notification as unread: {}", id);
    
    Notification notification = notificationService.getNotificationDetail(id);
    if (notification == null) {
      return ResponseEntity.notFound().build();
    }
    
    if (!notification.getUserId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    
    Notification updated = notificationService.markAsUnread(id);
    
    return ResponseEntity.ok(toDTO(updated));
  }

  // ============ DELETE ENDPOINTS ============

  /**
   * DELETE /api/v1/social/notifications/{id}
   * Xóa thông báo
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteNotification(
      Authentication authentication,
      @PathVariable Long id) {
    
    Long userId = getUserId(authentication);
    log.info("Deleting notification: {}", id);
    
    Notification notification = notificationService.getNotificationDetail(id);
    if (notification == null) {
      return ResponseEntity.notFound().build();
    }
    
    if (!notification.getUserId().equals(userId)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    
    notificationService.deleteNotification(id);
    
    return ResponseEntity.ok().build();
  }

  /**
   * DELETE /api/v1/social/notifications
   * Xóa tất cả thông báo
   */
  @DeleteMapping
  public ResponseEntity<Void> deleteAllNotifications(Authentication authentication) {
    Long userId = getUserId(authentication);
    log.info("Deleting all notifications for user: {}", userId);
    
    notificationService.deleteAllNotifications(userId);
    
    return ResponseEntity.ok().build();
  }

  /**
   * DELETE /api/v1/social/notifications/cleanup
   * Xóa thông báo cũ
   */
  @DeleteMapping("/cleanup")
  public ResponseEntity<Void> cleanupOldNotifications(
      Authentication authentication,
      @RequestParam(defaultValue = "30") int daysOld) {
    
    Long userId = getUserId(authentication);
    log.info("Cleaning up old notifications for user: {} (older than {} days)", userId, daysOld);
    
    notificationService.deleteOldNotifications(userId, daysOld);
    
    return ResponseEntity.ok().build();
  }

  // ============ HELPER METHODS ============

  /**
   * Convert Entity to DTO
   */
  private NotificationDTO toDTO(Notification notification) {
    return NotificationDTO.builder()
        .id(notification.getId())
        .userId(notification.getUserId())
        .senderId(notification.getSenderId())
        .senderName(notification.getSenderName())
        .senderAvatar(notification.getSenderAvatar())
        .type(notification.getType())
        .title(notification.getTitle())
        .message(notification.getMessage())
        .actionUrl(notification.getActionUrl())
        .relatedId(notification.getRelatedId())
        .relatedType(notification.getRelatedType())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .build();
  }

  /**
   * Convert Entity to Detail DTO
   */
  private NotificationDetailDTO toDetailDTO(Notification notification) {
    return NotificationDetailDTO.builder()
        .id(notification.getId())
        .userId(notification.getUserId())
        .senderId(notification.getSenderId())
        .senderName(notification.getSenderName())
        .senderAvatar(notification.getSenderAvatar())
        .type(notification.getType())
        .title(notification.getTitle())
        .message(notification.getMessage())
        .actionUrl(notification.getActionUrl())
        .relatedId(notification.getRelatedId())
        .relatedType(notification.getRelatedType())
        .relatedImage(notification.getRelatedImage())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .updatedAt(notification.getUpdatedAt())
        .readAt(notification.getReadAt())
        .build();
  }
}
