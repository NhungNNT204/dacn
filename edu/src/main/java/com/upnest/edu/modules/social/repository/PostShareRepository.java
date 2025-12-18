package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PostShare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostShareRepository extends JpaRepository<PostShare, Long> {
    
    /**
     * Lấy chia sẻ của một bài đăng
     */
    @Query("SELECT ps FROM PostShare ps WHERE ps.post.id = :postId ORDER BY ps.createdAt DESC")
    Page<PostShare> findByPostId(@Param("postId") Long postId, Pageable pageable);
    
    /**
     * Đếm chia sẻ của một bài đăng
     */
    Long countByPostId(Long postId);
    
    /**
     * Lấy chia sẻ của một user
     */
    Page<PostShare> findByUserId(Long userId, Pageable pageable);
}
