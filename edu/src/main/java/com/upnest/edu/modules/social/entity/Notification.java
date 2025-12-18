package com.upnest.edu.modules.social.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Notification Entity - Quản lý thông báo cho người dùng
 * Hỗ trợ các loại: LIKE, COMMENT, TAG, FOLLOW_REQUEST, FOLLOW, MENTION, REMINDER, MESSAGE
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_user_created", columnList = "user_id, created_at DESC"),
    @Index(name = "idx_user_read", columnList = "user_id, is_read"),
    @Index(name = "idx_created", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // ============ User Info ============
  @Column(nullable = false)
  private Long userId;              // Người nhận thông báo

  @Column(length = 100)
  private String userName;          // Tên người nhận

  // ============ Sender Info ============
  @Column(nullable = false)
  private Long senderId;            // Người gửi thông báo

  @Column(length = 100)
  private String senderName;        // Tên người gửi

  @Column(length = 255)
  private String senderAvatar;      // Avatar người gửi

  // ============ Notification Type ============
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private NotificationType type;    // LIKE, COMMENT, TAG, FOLLOW_REQUEST, FOLLOW, MENTION, REMINDER, MESSAGE

  // ============ Content ============
  @Column(length = 500)
  private String title;             // Tiêu đề thông báo

  @Column(columnDefinition = "TEXT")
  private String message;           // Nội dung thông báo

  @Column(length = 255)
  private String actionUrl;         // URL điều hướng

  // ============ Related Resources ============
  @Column
  private Long relatedId;           // ID của resource liên quan (post, comment, user, etc.)

  @Column(length = 50)
  private String relatedType;       // Loại resource: POST, COMMENT, USER, DISCUSSION, STORY, etc.

  @Column(length = 255)
  private String relatedImage;      // Ảnh liên quan

  // ============ Status ============
  @Column(nullable = false)
  private Boolean isRead = false;   // Đã đọc?

  @Column
  private LocalDateTime readAt;     // Thời gian đọc

  @Column(nullable = false)
  private Boolean isDeleted = false; // Đã xóa?

  @Column
  private LocalDateTime deletedAt;  // Thời gian xóa

  // ============ Timestamps ============
  @CreationTimestamp
  @Column(nullable = false)
  private LocalDateTime createdAt;  // Thời gian tạo

  @Column
  private LocalDateTime updatedAt;  // Thời gian cập nhật

  // ============ Enum ============
  public enum NotificationType {
    LIKE,              // Thích bài viết/comment
    COMMENT,           // Bình luận
    TAG,               // Được tag trong bài viết
    FOLLOW_REQUEST,    // Yêu cầu follow
    FOLLOW,            // Được follow
    MENTION,           // Được mention (@user)
    REMINDER,          // Nhắc nhở
    MESSAGE,           // Tin nhắn riêng
    GROUP_INVITE,      // Lời mời nhóm
    DISCUSSION_REPLY,  // Trả lời thảo luận
    STORY_VIEW,        // Xem story
    ACHIEVEMENT        // Đạt thành tích
  }

  // ============ Methods ============
  public void markAsRead() {
    this.isRead = true;
    this.readAt = LocalDateTime.now();
  }

  public void markAsUnread() {
    this.isRead = false;
    this.readAt = null;
  }

  public void softDelete() {
    this.isDeleted = true;
    this.deletedAt = LocalDateTime.now();
  }

  public String getNotificationText() {
    return switch (this.type) {
      case LIKE -> senderName + " đã thích bài viết của bạn";
      case COMMENT -> senderName + " đã bình luận trên bài viết của bạn";
      case TAG -> senderName + " đã tag bạn trong một bài viết";
      case FOLLOW_REQUEST -> senderName + " đã gửi yêu cầu follow";
      case FOLLOW -> senderName + " đã follow bạn";
      case MENTION -> senderName + " đã mention bạn";
      case REMINDER -> this.message != null ? this.message : "Bạn có một nhắc nhở";
      case MESSAGE -> senderName + " đã gửi tin nhắn cho bạn";
      case GROUP_INVITE -> senderName + " đã mời bạn tham gia nhóm";
      case DISCUSSION_REPLY -> senderName + " đã trả lời thảo luận của bạn";
      case STORY_VIEW -> senderName + " đã xem story của bạn";
      case ACHIEVEMENT -> "Bạn đạt được thành tích mới: " + this.message;
    };
  }
}
