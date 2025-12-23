package com.upnest.edu.modules.chat.repository;

import com.upnest.edu.modules.chat.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MessageRepository - Quản lý tin nhắn
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Lấy tin nhắn của nhóm chat
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND m.isDeleted = false " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findByChatGroupId(@Param("chatGroupId") Long chatGroupId, Pageable pageable);
    
    // Tìm tin nhắn gần đây nhất
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND m.isDeleted = false " +
           "ORDER BY m.createdAt DESC LIMIT 1")
    Message findLatestMessage(@Param("chatGroupId") Long chatGroupId);
    
    // Tìm tin nhắn đã pin
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND m.isPinned = true " +
           "AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> findPinnedMessages(@Param("chatGroupId") Long chatGroupId);
    
    // Tìm tin nhắn chứa keyword
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND " +
           "LOWER(m.content) LIKE LOWER(CONCAT('%', :keyword, '%')) AND m.isDeleted = false " +
           "ORDER BY m.createdAt DESC")
    List<Message> searchMessages(@Param("chatGroupId") Long chatGroupId, @Param("keyword") String keyword);
    
    // Tìm tin nhắn từ người cụ thể
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND m.senderId = :senderId " +
           "AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> findByUserInGroup(@Param("chatGroupId") Long chatGroupId, @Param("senderId") Long senderId);
    
    // Tính số tin nhắn chưa đọc
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND m.createdAt > :lastReadAt")
    Long countUnreadMessages(@Param("chatGroupId") Long chatGroupId, @Param("lastReadAt") LocalDateTime lastReadAt);
    
    // Lấy tin nhắn trong khoảng thời gian
    @Query("SELECT m FROM ChatMessage m WHERE m.chatGroupId = :chatGroupId AND " +
           "m.createdAt BETWEEN :startDate AND :endDate AND m.isDeleted = false " +
           "ORDER BY m.createdAt DESC")
    List<Message> findMessagesInDateRange(@Param("chatGroupId") Long chatGroupId, 
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
}
