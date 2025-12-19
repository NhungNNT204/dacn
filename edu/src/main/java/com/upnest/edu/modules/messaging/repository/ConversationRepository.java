package com.upnest.edu.modules.messaging.repository;

import com.upnest.edu.modules.messaging.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN ConversationParticipant cp ON cp.conversation.id = c.id " +
           "WHERE cp.userId = :userId AND cp.isActive = true " +
           "ORDER BY c.updatedAt DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c " +
           "JOIN ConversationParticipant cp1 ON cp1.conversation.id = c.id " +
           "JOIN ConversationParticipant cp2 ON cp2.conversation.id = c.id " +
           "WHERE cp1.userId = :userId1 AND cp2.userId = :userId2 " +
           "AND c.conversationType = 'INDIVIDUAL' " +
           "AND cp1.isActive = true AND cp2.isActive = true")
    Optional<Conversation> findIndividualConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}

