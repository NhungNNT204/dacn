package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PostReaction;
import com.upnest.edu.modules.social.entity.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
    
    /**
     * Kiểm tra xem user đã react bài đăng này chưa
     */
    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);
    
    /**
     * Lấy tất cả reactions của một bài đăng
     */
    List<PostReaction> findByPostId(Long postId);
    
    /**
     * Lấy reactions theo loại
     */
    @Query("SELECT pr FROM PostReaction pr WHERE pr.post.id = :postId AND pr.reactionType = :reactionType")
    List<PostReaction> findByPostIdAndReactionType(@Param("postId") Long postId, @Param("reactionType") ReactionType reactionType);
    
    /**
     * Đếm reactions của một bài đăng
     */
    Long countByPostId(Long postId);
    
    /**
     * Đếm reactions theo loại
     */
    Long countByPostIdAndReactionType(Long postId, ReactionType reactionType);
    
    /**
     * Lấy reactions của một user
     */
    Page<PostReaction> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Xóa reaction
     */
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
