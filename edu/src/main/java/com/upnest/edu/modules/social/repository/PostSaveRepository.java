package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PostSave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostSaveRepository extends JpaRepository<PostSave, Long> {
    
    /**
     * Kiểm tra xem user đã lưu bài đăng này chưa
     */
    Optional<PostSave> findByPostIdAndUserId(Long postId, Long userId);
    
    /**
     * Đếm số lần lưu của một bài đăng
     */
    Long countByPostId(Long postId);
    
    /**
     * Xóa lưu bài đăng
     */
    void deleteByPostIdAndUserId(Long postId, Long userId);
    
    /**
     * Kiểm tra tồn tại
     */
    @Query("SELECT COUNT(ps) > 0 FROM PostSave ps WHERE ps.post.id = :postId AND ps.userId = :userId")
    Boolean existsByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);
}
