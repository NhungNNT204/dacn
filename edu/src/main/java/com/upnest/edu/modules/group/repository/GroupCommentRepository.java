package com.upnest.edu.modules.group.repository;

import com.upnest.edu.modules.group.entity.GroupComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho GroupComment Entity
 * Quản lý database queries cho comment trong nhóm
 */
@Repository
public interface GroupCommentRepository extends JpaRepository<GroupComment, String> {

    /**
     * Tìm tất cả active comment của post
     */
    Page<GroupComment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(
        String postId, Pageable pageable);

    /**
     * Đếm active comment
     */
    Long countByPostIdAndIsDeletedFalse(String postId);

    /**
     * Xóa tất cả comment của post
     */
    void deleteByPostId(String postId);
}
