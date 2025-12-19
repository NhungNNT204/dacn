package com.upnest.edu.modules.messaging.repository;

import com.upnest.edu.modules.messaging.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Message m " +
           "JOIN ConversationParticipant cp ON cp.conversation.id = m.conversation.id " +
           "WHERE m.conversation.id = :conversationId " +
           "AND cp.userId = :userId " +
           "AND m.createdAt > cp.lastReadAt " +
           "AND m.senderId != :userId")
    Long countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}

