package com.upnest.edu.modules.video.repository;

import com.upnest.edu.modules.video.entity.Video;
import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho Video Entity
 */
@Repository
public interface VideoRepository extends JpaRepository<Video, String> {

    /**
     * Tìm video theo tên (like search)
     */
    Page<Video> findByTitleContainingIgnoreCaseAndStatusAndIsDeletedFalse(
        String title, VideoStatus status, Pageable pageable);

    /**
     * Tìm video theo category
     */
    Page<Video> findByCategoryAndStatusAndIsDeletedFalseOrderByViewCountDesc(
        VideoCategory category, VideoStatus status, Pageable pageable);

    /**
     * Tìm video của creator
     */
    Page<Video> findByCreatorIdAndIsDeletedFalseOrderByCreatedAtDesc(
        String creatorId, Pageable pageable);

    /**
     * Lấy video trending (order by viewCount)
     */
    @Query("SELECT v FROM Video v WHERE v.status = 'PUBLISHED' AND v.isDeleted = false ORDER BY v.viewCount DESC")
    Page<Video> findTrendingVideos(Pageable pageable);

    /**
     * Lấy video popular (order by likeCount)
     */
    @Query("SELECT v FROM Video v WHERE v.status = 'PUBLISHED' AND v.isDeleted = false ORDER BY v.likeCount DESC")
    Page<Video> findPopularVideos(Pageable pageable);

    /**
     * Lấy video recommendations (random)
     */
    @Query("SELECT v FROM Video v WHERE v.status = 'PUBLISHED' AND v.isDeleted = false AND v.id != :currentVideoId ORDER BY RAND() DESC")
    Page<Video> findRecommendations(@Param("currentVideoId") String currentVideoId, Pageable pageable);

    /**
     * Tìm video theo category và trending
     */
    @Query("SELECT v FROM Video v WHERE v.category = :category AND v.status = 'PUBLISHED' AND v.isDeleted = false ORDER BY v.viewCount DESC")
    Page<Video> findByCategoryTrending(@Param("category") VideoCategory category, Pageable pageable);

    /**
     * Tìm video có mức độ
     */
    Page<Video> findByLevelAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
        com.upnest.edu.modules.video.entity.VideoLevel level, VideoStatus status, Pageable pageable);

    /**
     * Đếm video của creator
     */
    Long countByCreatorIdAndIsDeletedFalse(String creatorId);

    /**
     * Tìm video gần đây
     */
    @Query("SELECT v FROM Video v WHERE v.status = 'PUBLISHED' AND v.isDeleted = false ORDER BY v.createdAt DESC")
    Page<Video> findRecentVideos(Pageable pageable);
}
