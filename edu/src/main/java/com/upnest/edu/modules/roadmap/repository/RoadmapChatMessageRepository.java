package com.upnest.edu.modules.roadmap.repository;

import com.upnest.edu.modules.roadmap.entity.RoadmapChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapChatMessageRepository extends JpaRepository<RoadmapChatMessage, Long> {
    
    Page<RoadmapChatMessage> findByChatRoomIdAndIsDeletedFalse(String chatRoomId, Pageable pageable);
    
    List<RoadmapChatMessage> findTop50ByChatRoomIdAndIsDeletedFalseOrderByCreatedAtDesc(String chatRoomId);
    
    @Query("SELECT m FROM RoadmapChatMessage m WHERE m.chatRoomId = :chatRoomId AND m.isPinned = true AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<RoadmapChatMessage> findPinnedMessages(String chatRoomId);
    
    long countByChatRoomIdAndIsDeletedFalse(String chatRoomId);
}

