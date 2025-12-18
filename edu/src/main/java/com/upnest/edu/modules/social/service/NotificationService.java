package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.Notification;
import com.upnest.edu.modules.social.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/**
 * NotificationService - Quản lý logic thông báo
 * Hỗ trợ tạo, cập nhật, xóa, tìm kiếm thông báo
 * Hỗ trợ WebSocket cho real-time notifications
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

  private final NotificationRepository notificationRepository;

  // ============ CREATE ============

  /**
   * Tạo thông báo mới
   */
  public Notification createNotification(Notification notification) {
    log.info("Creating notification from user {} to user {}: {}", 
        notification.getSenderId(), notification.getUserId(), notification.getType());
    
    if (notification.getSenderId().equals(notification.getUserId())) {
      log.warn("Cannot send notification to yourself");
      return null;
    }

    notification.setIsRead(false);
    notification.setIsDeleted(false);
    notification.setCreatedAt(LocalDateTime.now());

    Notification saved = notificationRepository.save(notification);
    log.info("Notification created with ID: {}", saved.getId());
    
    return saved;
  }

  /**
   * Tạo thông báo Like
   */
  public Notification createLikeNotification(Long userId, Long senderId, String senderName, String senderAvatar, Long postId) {
    Notification notification = Notification.builder()
        .userId(userId)
        .userName("")  // Will be populated by frontend
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.LIKE)
        .title(senderName + " đã thích bài viết của bạn")
        .message("")
        .actionUrl("/posts/" + postId)
        .relatedId(postId)
        .relatedType("POST")
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Comment
   */
  public Notification createCommentNotification(Long userId, Long senderId, String senderName, String senderAvatar, Long commentId, Long postId) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.COMMENT)
        .title(senderName + " đã bình luận trên bài viết của bạn")
        .message("")
        .actionUrl("/posts/" + postId)
        .relatedId(commentId)
        .relatedType("COMMENT")
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Follow Request
   */
  public Notification createFollowRequestNotification(Long userId, Long senderId, String senderName, String senderAvatar) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.FOLLOW_REQUEST)
        .title(senderName + " đã gửi yêu cầu follow")
        .message("Nhấp để xem hồ sơ")
        .actionUrl("/profile/" + senderId)
        .relatedId(senderId)
        .relatedType("USER")
        .relatedImage(senderAvatar)
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Follow
   */
  public Notification createFollowNotification(Long userId, Long senderId, String senderName, String senderAvatar) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.FOLLOW)
        .title(senderName + " đã follow bạn")
        .message("")
        .actionUrl("/profile/" + senderId)
        .relatedId(senderId)
        .relatedType("USER")
        .relatedImage(senderAvatar)
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Mention
   */
  public Notification createMentionNotification(Long userId, Long senderId, String senderName, String senderAvatar, Long postId, String content) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.MENTION)
        .title(senderName + " đã mention bạn")
        .message(content)
        .actionUrl("/posts/" + postId)
        .relatedId(postId)
        .relatedType("POST")
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Message
   */
  public Notification createMessageNotification(Long userId, Long senderId, String senderName, String senderAvatar, String message, Long chatGroupId) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(senderId)
        .senderName(senderName)
        .senderAvatar(senderAvatar)
        .type(Notification.NotificationType.MESSAGE)
        .title(senderName + " đã gửi tin nhắn")
        .message(message)
        .actionUrl("/chat/" + chatGroupId)
        .relatedId(chatGroupId)
        .relatedType("CHAT")
        .relatedImage(senderAvatar)
        .build();
    return createNotification(notification);
  }

  /**
   * Tạo thông báo Reminder
   */
  public Notification createReminderNotification(Long userId, String title, String message, String actionUrl) {
    Notification notification = Notification.builder()
        .userId(userId)
        .senderId(userId)  // System notification
        .type(Notification.NotificationType.REMINDER)
        .title(title)
        .message(message)
        .actionUrl(actionUrl)
        .build();
    return createNotification(notification);
  }

  // ============ READ ============

  /**
   * Lấy thông báo của người dùng
   */
  public Page<Notification> getNotifications(Long userId, Pageable pageable) {
    log.info("Getting notifications for user: {}", userId);
    return notificationRepository.findByUserId(userId, pageable);
  }

  /**
   * Lấy thông báo chưa đọc
   */
  public List<Notification> getUnreadNotifications(Long userId) {
    log.info("Getting unread notifications for user: {}", userId);
    return notificationRepository.findUnreadNotifications(userId);
  }

  /**
   * Đếm thông báo chưa đọc
   */
  public int countUnreadNotifications(Long userId) {
    int count = notificationRepository.countUnreadNotifications(userId);
    log.info("Unread notifications count for user {}: {}", userId, count);
    return count;
  }

  /**
   * Lấy thông báo theo type
   */
  public Page<Notification> getNotificationsByType(Long userId, Notification.NotificationType type, Pageable pageable) {
    log.info("Getting notifications by type {} for user: {}", type, userId);
    return notificationRepository.findByUserIdAndType(userId, type, pageable);
  }

  /**
   * Tìm kiếm thông báo
   */
  public Page<Notification> searchNotifications(Long userId, String keyword, Pageable pageable) {
    log.info("Searching notifications for user {} with keyword: {}", userId, keyword);
    return notificationRepository.searchNotifications(userId, keyword, pageable);
  }

  /**
   * Lấy thông báo gần nhất
   */
  public List<Notification> getRecentNotifications(Long userId, int limit) {
    log.info("Getting {} recent notifications for user: {}", limit, userId);
    return notificationRepository.findRecentNotifications(userId, limit);
  }

  /**
   * Lấy chi tiết thông báo
   */
  public Notification getNotificationDetail(Long notificationId) {
    log.info("Getting notification detail: {}", notificationId);
    return notificationRepository.findById(notificationId).orElse(null);
  }

  // ============ UPDATE ============

  /**
   * Đánh dấu thông báo là đã đọc
   */
  public Notification markAsRead(Long notificationId) {
    log.info("Marking notification as read: {}", notificationId);
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    
    if (notification != null) {
      notification.markAsRead();
      notificationRepository.save(notification);
    }
    
    return notification;
  }

  /**
   * Đánh dấu tất cả thông báo chưa đọc là đã đọc
   */
  public void markAllAsRead(Long userId) {
    log.info("Marking all notifications as read for user: {}", userId);
    int updated = notificationRepository.markAllAsRead(userId, LocalDateTime.now());
    log.info("Updated {} notifications", updated);
  }

  /**
   * Đánh dấu thông báo là chưa đọc
   */
  public Notification markAsUnread(Long notificationId) {
    log.info("Marking notification as unread: {}", notificationId);
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    
    if (notification != null) {
      notification.markAsUnread();
      notificationRepository.save(notification);
    }
    
    return notification;
  }

  /**
   * Cập nhật thông báo
   */
  public Notification updateNotification(Long notificationId, Notification updated) {
    log.info("Updating notification: {}", notificationId);
    
    Notification existing = notificationRepository.findById(notificationId).orElse(null);
    if (existing == null) {
      return null;
    }

    existing.setTitle(updated.getTitle());
    existing.setMessage(updated.getMessage());
    existing.setActionUrl(updated.getActionUrl());
    existing.setUpdatedAt(LocalDateTime.now());

    return notificationRepository.save(existing);
  }

  // ============ DELETE ============

  /**
   * Xóa thông báo (soft delete)
   */
  public void deleteNotification(Long notificationId) {
    log.info("Deleting notification: {}", notificationId);
    int deleted = notificationRepository.deleteNotification(notificationId, LocalDateTime.now());
    log.info("Deleted {} notification(s)", deleted);
  }

  /**
   * Xóa tất cả thông báo của người dùng
   */
  public void deleteAllNotifications(Long userId) {
    log.info("Deleting all notifications for user: {}", userId);
    int deleted = notificationRepository.deleteAllNotifications(userId, LocalDateTime.now());
    log.info("Deleted {} notification(s)", deleted);
  }

  /**
   * Xóa thông báo cũ
   */
  public void deleteOldNotifications(Long userId, int daysOld) {
    log.info("Deleting old notifications for user: {} (older than {} days)", userId, daysOld);
    LocalDateTime beforeDate = LocalDateTime.now().minusDays(daysOld);
    int deleted = notificationRepository.deleteOldNotifications(userId, beforeDate, LocalDateTime.now());
    log.info("Deleted {} old notification(s)", deleted);
  }

  // ============ HELPER METHODS ============

  /**
   * Lấy thông báo từ người dùng cụ thể
   */
  public Page<Notification> getNotificationsFromUser(Long userId, Long senderId, Pageable pageable) {
    log.info("Getting notifications from user {} to user: {}", senderId, userId);
    return notificationRepository.findByUserIdAndSenderId(userId, senderId, pageable);
  }

  /**
   * Lấy thông báo liên quan đến resource
   */
  public List<Notification> getRelatedNotifications(Long userId, Long relatedId, String relatedType) {
    log.info("Getting related notifications for resource: {} ({})", relatedId, relatedType);
    return notificationRepository.findByUserIdAndRelated(userId, relatedId, relatedType);
  }

  /**
   * Lấy thông báo trong khoảng thời gian
   */
  public Page<Notification> getNotificationsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
    log.info("Getting notifications for user {} between {} and {}", userId, startDate, endDate);
    return notificationRepository.findByUserIdAndDateRange(userId, startDate, endDate, pageable);
  }
}
