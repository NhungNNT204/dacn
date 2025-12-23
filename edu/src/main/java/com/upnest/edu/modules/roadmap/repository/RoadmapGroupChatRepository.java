package com.upnest.edu.modules.roadmap.repository;

import com.upnest.edu.modules.roadmap.entity.RoadmapGroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadmapGroupChatRepository extends JpaRepository<RoadmapGroupChat, Long> {
    
    Optional<RoadmapGroupChat> findByRoadmapId(Long roadmapId);
    
    Optional<RoadmapGroupChat> findByChatRoomId(String chatRoomId);
    
    boolean existsByRoadmapId(Long roadmapId);
}

