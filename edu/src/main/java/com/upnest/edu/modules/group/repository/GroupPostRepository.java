package com.upnest.edu.modules.group.repository;

import com.upnest.edu.modules.group.entity.GroupPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho GroupPost Entity
 * Quản lý database queries cho bài viết trong nhóm
 */
@Repository
public interface GroupPostRepository extends JpaRepository<GroupPost, String> {

    /**
     * Tìm tất cả approved post của nhóm
     */
    Page<GroupPost> findByGroupIdAndIsApprovedTrueAndIsDeletedFalseOrderByCreatedAtDesc(
        String groupId, Pageable pageable);

    /**
     * Tìm tất cả post của nhóm (bao gồm pending approval)
     */
    Page<GroupPost> findByGroupIdAndIsDeletedFalseOrderByCreatedAtDesc(
        String groupId, Pageable pageable);

    /**
     * Tìm post cần phê duyệt
     */
    Page<GroupPost> findByGroupIdAndNeedsApprovalTrueAndIsApprovedFalseAndIsDeletedFalseOrderByCreatedAtAsc(
        String groupId, Pageable pageable);

    /**
     * Tìm post của user trong nhóm
     */
    Page<GroupPost> findByGroupIdAndAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(
        String groupId, String authorId, Pageable pageable);

    /**
     * Đếm pending approval post
     */
    Long countByGroupIdAndNeedsApprovalTrueAndIsApprovedFalseAndIsDeletedFalse(String groupId);

    /**
     * Tìm post theo keyword
     */
    @Query("SELECT p FROM GroupPost p WHERE p.group.id = :groupId AND p.isDeleted = false " +
           "AND p.isApproved = true AND LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY p.createdAt DESC")
    Page<GroupPost> searchPosts(@Param("groupId") String groupId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * Xóa tất cả post của nhóm
     */
    void deleteByGroupId(String groupId);

    /**
     * Kiểm tra user đã post trong nhóm hay chưa hôm nay
     */
    @Query("SELECT COUNT(p) FROM GroupPost p WHERE p.group.id = :groupId AND p.author.id = :userId " +
           "AND DATE(p.createdAt) = CURRENT_DATE AND p.isDeleted = false")
    Long countUserPostsToday(@Param("groupId") String groupId, @Param("userId") String userId);
}
