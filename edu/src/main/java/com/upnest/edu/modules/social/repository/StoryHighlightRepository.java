package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.StoryHighlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * StoryHighlightRepository - Quản lý dữ liệu story highlights
 */
@Repository
public interface StoryHighlightRepository extends JpaRepository<StoryHighlight, Long> {
    
    // Lấy highlights của người dùng
    @Query("SELECT sh FROM StoryHighlight sh WHERE sh.userId = :userId ORDER BY sh.createdAt DESC")
    List<StoryHighlight> findByUserId(@Param("userId") Long userId);
    
    // Lấy highlight theo title
    Optional<StoryHighlight> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);
    
    // Lấy highlights phổ biến
    @Query("SELECT sh FROM StoryHighlight sh ORDER BY sh.viewsCount DESC LIMIT :limit")
    List<StoryHighlight> findPopularHighlights(@Param("limit") int limit);
    
    // Đếm highlights của user
    Long countByUserId(Long userId);
}
