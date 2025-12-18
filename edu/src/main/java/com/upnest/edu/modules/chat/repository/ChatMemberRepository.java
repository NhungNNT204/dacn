package com.upnest.edu.modules.chat.repository;

import com.upnest.edu.modules.chat.entity.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ChatMemberRepository - Quản lý thành viên chat
 */
@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    
    // Tìm thành viên trong group
    Optional<ChatMember> findByChatGroupIdAndUserId(Long chatGroupId, Long userId);
    
    // Lấy tất cả thành viên của group
    @Query("SELECT cm FROM ChatMember cm WHERE cm.chatGroupId = :chatGroupId " +
           "AND cm.isActive = true ORDER BY cm.joinedAt DESC")
    List<ChatMember> findByChatGroupId(@Param("chatGroupId") Long chatGroupId);
    
    // Lấy admin và owner
    @Query("SELECT cm FROM ChatMember cm WHERE cm.chatGroupId = :chatGroupId " +
           "AND (cm.role = 'ADMIN' OR cm.role = 'OWNER')")
    List<ChatMember> findAdmins(@Param("chatGroupId") Long chatGroupId);
    
    // Kiểm tra user là thành viên
    Boolean existsByChatGroupIdAndUserId(Long chatGroupId, Long userId);
    
    // Lấy groups của user
    @Query("SELECT DISTINCT cm.chatGroupId FROM ChatMember cm WHERE cm.userId = :userId")
    List<Long> findChatGroupIdsByUserId(@Param("userId") Long userId);
    
    // Đếm thành viên hoạt động
    @Query("SELECT COUNT(cm) FROM ChatMember cm WHERE cm.chatGroupId = :chatGroupId " +
           "AND cm.isActive = true")
    Long countActiveMembers(@Param("chatGroupId") Long chatGroupId);
    
    // Tìm thành viên muted
    @Query("SELECT cm FROM ChatMember cm WHERE cm.chatGroupId = :chatGroupId " +
           "AND cm.isMuted = true")
    List<ChatMember> findMutedMembers(@Param("chatGroupId") Long chatGroupId);
}
