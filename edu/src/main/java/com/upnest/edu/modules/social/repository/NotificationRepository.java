package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * NotificationRepository - Quản lý truy vấn thông báo
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  /**
   * Lấy thông báo của người dùng (phân trang, sắp xếp theo thời gian)
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isDeleted = false ORDER BY n.createdAt DESC")
  Page<Notification> findByUserId(@Param("userId") Long userId, Pageable pageable);

  /**
   * Lấy thông báo chưa đọc của người dùng
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isRead = false AND n.isDeleted = false")
  List<Notification> findUnreadNotifications(@Param("userId") Long userId);

  /**
   * Đếm thông báo chưa đọc
   */
  @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false AND n.isDeleted = false")
  int countUnreadNotifications(@Param("userId") Long userId);

  /**
   * Lấy thông báo theo type
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.type = :type AND n.isDeleted = false ORDER BY n.createdAt DESC")
  Page<Notification> findByUserIdAndType(@Param("userId") Long userId, @Param("type") Notification.NotificationType type, Pageable pageable);

  /**
   * Lấy thông báo liên quan đến resource
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.relatedId = :relatedId AND n.relatedType = :relatedType AND n.isDeleted = false")
  List<Notification> findByUserIdAndRelated(@Param("userId") Long userId, @Param("relatedId") Long relatedId, @Param("relatedType") String relatedType);

  /**
   * Lấy thông báo từ một người dùng cụ thể
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.senderId = :senderId AND n.isDeleted = false ORDER BY n.createdAt DESC")
  Page<Notification> findByUserIdAndSenderId(@Param("userId") Long userId, @Param("senderId") Long senderId, Pageable pageable);

  /**
   * Lấy thông báo trong khoảng thời gian
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.createdAt BETWEEN :startDate AND :endDate AND n.isDeleted = false ORDER BY n.createdAt DESC")
  Page<Notification> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

  /**
   * Tìm kiếm thông báo
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND (n.title LIKE %:keyword% OR n.message LIKE %:keyword% OR n.senderName LIKE %:keyword%) AND n.isDeleted = false ORDER BY n.createdAt DESC")
  Page<Notification> searchNotifications(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);

  /**
   * Đánh dấu thông báo là đã đọc
   */
  @Modifying
  @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.id = :id")
  int markAsRead(@Param("id") Long id, @Param("readAt") LocalDateTime readAt);

  /**
   * Đánh dấu tất cả thông báo chưa đọc là đã đọc
   */
  @Modifying
  @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.userId = :userId AND n.isRead = false AND n.isDeleted = false")
  int markAllAsRead(@Param("userId") Long userId, @Param("readAt") LocalDateTime readAt);

  /**
   * Xóa thông báo (soft delete)
   */
  @Modifying
  @Query("UPDATE Notification n SET n.isDeleted = true, n.deletedAt = :deletedAt WHERE n.id = :id")
  int deleteNotification(@Param("id") Long id, @Param("deletedAt") LocalDateTime deletedAt);

  /**
   * Xóa tất cả thông báo của người dùng
   */
  @Modifying
  @Query("UPDATE Notification n SET n.isDeleted = true, n.deletedAt = :deletedAt WHERE n.userId = :userId AND n.isDeleted = false")
  int deleteAllNotifications(@Param("userId") Long userId, @Param("deletedAt") LocalDateTime deletedAt);

  /**
   * Xóa thông báo cũ hơn (cleanup)
   */
  @Modifying
  @Query("UPDATE Notification n SET n.isDeleted = true, n.deletedAt = :now WHERE n.userId = :userId AND n.createdAt < :beforeDate AND n.isDeleted = false")
  int deleteOldNotifications(@Param("userId") Long userId, @Param("beforeDate") LocalDateTime beforeDate, @Param("now") LocalDateTime now);

  /**
   * Lấy thông báo gần nhất
   */
  @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isDeleted = false ORDER BY n.createdAt DESC LIMIT :limit")
  List<Notification> findRecentNotifications(@Param("userId") Long userId, @Param("limit") int limit);
}
