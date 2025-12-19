package com.upnest.edu.modules.messaging.repository;

import com.upnest.edu.modules.messaging.entity.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {
    Optional<ConversationParticipant> findByConversationIdAndUserId(Long conversationId, Long userId);
}

