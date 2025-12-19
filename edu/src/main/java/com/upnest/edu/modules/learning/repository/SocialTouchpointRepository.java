package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.SocialTouchpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialTouchpointRepository extends JpaRepository<SocialTouchpoint, Long> {
    List<SocialTouchpoint> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SocialTouchpoint> findByUserIdAndStatus(Long userId, SocialTouchpoint.TouchpointStatus status);
    List<SocialTouchpoint> findByPlaylistId(Long playlistId);
}

