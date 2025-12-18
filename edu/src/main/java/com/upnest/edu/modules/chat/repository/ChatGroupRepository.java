package com.upnest.edu.modules.chat.repository;

import com.upnest.edu.modules.chat.entity.ChatGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ChatGroupRepository - Quản lý nhóm chat
 */
@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    
    // Tìm chat giữa 2 user (1-1 chat)
    @Query(value = "SELECT cg FROM ChatGroup cg WHERE cg.isGroup = false AND cg.id IN " +
           "(SELECT cm1.chatGroupId FROM ChatMember cm1 WHERE cm1.userId = :userId1 " +
           "INTERSECT SELECT cm2.chatGroupId FROM ChatMember cm2 WHERE cm2.userId = :userId2)")
    Optional<ChatGroup> findPrivateChat(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    // Lấy tất cả chats của user
    @Query("SELECT DISTINCT cg FROM ChatGroup cg JOIN cg.members cm WHERE cm.userId = :userId " +
           "AND cg.isArchived = false ORDER BY cg.lastMessageAt DESC")
    Page<ChatGroup> findUserChats(@Param("userId") Long userId, Pageable pageable);
    
    // Tìm group chats của user
    @Query("SELECT DISTINCT cg FROM ChatGroup cg JOIN cg.members cm WHERE cm.userId = :userId " +
           "AND cg.isGroup = true ORDER BY cg.lastMessageAt DESC")
    List<ChatGroup> findUserGroups(@Param("userId") Long userId);
    
    // Tìm chat được chưa đọc
    @Query("SELECT DISTINCT cg FROM ChatGroup cg JOIN cg.members cm WHERE cm.userId = :userId " +
           "AND cm.unreadCount > 0 ORDER BY cg.lastMessageAt DESC")
    List<ChatGroup> findUnreadChats(@Param("userId") Long userId);
    
    // Tìm groups theo tên
    @Query("SELECT cg FROM ChatGroup cg WHERE cg.isGroup = true AND " +
           "LOWER(cg.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY cg.lastMessageAt DESC")
    List<ChatGroup> searchGroups(@Param("keyword") String keyword);
    
    // Lấy groups của user
    @Query("SELECT DISTINCT cg FROM ChatGroup cg WHERE cg.groupOwnerId = :userId")
    List<ChatGroup> findGroupsOwnedBy(@Param("userId") Long userId);
    
    // Đếm thành viên trong group
    @Query("SELECT COUNT(cm) FROM ChatMember cm WHERE cm.chatGroupId = :chatGroupId AND cm.isActive = true")
    Long countActiveMembers(@Param("chatGroupId") Long chatGroupId);
}
