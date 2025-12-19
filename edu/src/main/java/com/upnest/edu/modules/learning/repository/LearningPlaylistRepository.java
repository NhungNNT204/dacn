package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.LearningPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlaylistRepository extends JpaRepository<LearningPlaylist, Long> {
    List<LearningPlaylist> findByUserId(Long userId);
    Optional<LearningPlaylist> findByUserIdAndLearningGoalId(Long userId, Long goalId);
}

