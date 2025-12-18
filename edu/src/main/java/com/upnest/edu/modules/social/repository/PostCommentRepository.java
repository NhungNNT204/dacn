package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    
    /**
     * Lấy bình luận chính (không phải reply) của một bài đăng
     */
    @Query("SELECT pc FROM PostComment pc WHERE pc.post.id = :postId AND pc.parentComment IS NULL AND pc.isDeleted = false ORDER BY pc.createdAt DESC")
    Page<PostComment> findMainCommentsByPostId(@Param("postId") Long postId, Pageable pageable);
    
    /**
     * Lấy reply của một bình luận
     */
    @Query("SELECT pc FROM PostComment pc WHERE pc.parentComment.id = :parentCommentId AND pc.isDeleted = false ORDER BY pc.createdAt ASC")
    List<PostComment> findRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
    
    /**
     * Đếm bình luận của một bài đăng (không tính những bình luận bị xóa)
     */
    @Query("SELECT COUNT(pc) FROM PostComment pc WHERE pc.post.id = :postId AND pc.isDeleted = false")
    Long countByPostId(@Param("postId") Long postId);
    
    /**
     * Lấy bình luận của một user
     */
    @Query("SELECT pc FROM PostComment pc WHERE pc.userId = :userId AND pc.isDeleted = false ORDER BY pc.createdAt DESC")
    Page<PostComment> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * Tìm kiếm bình luận
     */
    @Query("SELECT pc FROM PostComment pc WHERE pc.isDeleted = false AND LOWER(pc.content) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY pc.createdAt DESC")
    Page<PostComment> searchComments(@Param("keyword") String keyword, Pageable pageable);
}
