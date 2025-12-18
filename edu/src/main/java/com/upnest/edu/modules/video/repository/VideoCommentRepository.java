package com.upnest.edu.modules.video.repository;

import com.upnest.edu.modules.video.entity.VideoComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho VideoComment Entity
 */
@Repository
public interface VideoCommentRepository extends JpaRepository<VideoComment, String> {

    /**
     * Tìm comment của video
     */
    Page<VideoComment> findByVideoIdAndIsDeletedFalseOrderByCreatedAtDesc(
        String videoId, Pageable pageable);

    /**
     * Tìm reply của comment
     */
    Page<VideoComment> findByParentCommentIdAndIsDeletedFalseOrderByCreatedAtAsc(
        String parentCommentId, Pageable pageable);

    /**
     * Tìm comment của user
     */
    Page<VideoComment> findByAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(
        String userId, Pageable pageable);

    /**
     * Đếm comment của video
     */
    Long countByVideoIdAndIsDeletedFalse(String videoId);

    /**
     * Xóa comment của video
     */
    void deleteByVideoId(String videoId);
}
