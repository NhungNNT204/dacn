package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    /**
     * Lấy bài đăng theo ID, không tính những bài bị xóa
     */
    @Query("SELECT p FROM Post p WHERE p.id = :id AND p.isDeleted = false")
    Post findByIdAndNotDeleted(@Param("id") Long id);
    
    /**
     * Lấy dòng thời gian cá nhân hoá
     * Các bài từ bạn bè, pages, groups, courses mà user theo dõi
     */
    @Query(value = "SELECT DISTINCT p.* FROM posts p " +
            "WHERE p.is_deleted = false " +
            "AND p.is_hidden = false " +
            "AND p.author_id IN (" +
            "  SELECT followed_id FROM friendships WHERE follower_id = :userId AND status = 'ACCEPTED' " +
            "  UNION " +
            "  SELECT page_id FROM page_followers WHERE user_id = :userId " +
            "  UNION " +
            "  SELECT group_id FROM group_members WHERE user_id = :userId " +
            "  UNION " +
            "  SELECT course_id FROM course_enrollments WHERE user_id = :userId" +
            ") " +
            "ORDER BY p.created_at DESC",
            countQuery = "SELECT COUNT(DISTINCT p.id) FROM posts p " +
                    "WHERE p.is_deleted = false " +
                    "AND p.is_hidden = false " +
                    "AND p.author_id IN (" +
                    "  SELECT followed_id FROM friendships WHERE follower_id = :userId AND status = 'ACCEPTED' " +
                    "  UNION " +
                    "  SELECT page_id FROM page_followers WHERE user_id = :userId " +
                    "  UNION " +
                    "  SELECT group_id FROM group_members WHERE user_id = :userId " +
                    "  UNION " +
                    "  SELECT course_id FROM course_enrollments WHERE user_id = :userId" +
                    ")",
            nativeQuery = true)
    Page<Post> findPersonalizedFeed(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * Lấy bài đăng của một user cụ thể
     */
    @Query("SELECT p FROM Post p WHERE p.authorId = :authorId AND p.isDeleted = false ORDER BY p.createdAt DESC")
    Page<Post> findByAuthorId(@Param("authorId") Long authorId, Pageable pageable);
    
    /**
     * Lấy bài đăng được lưu của một user
     */
    @Query("SELECT DISTINCT p FROM Post p " +
            "INNER JOIN PostSave ps ON p.id = ps.post.id " +
            "WHERE ps.userId = :userId AND p.isDeleted = false " +
            "ORDER BY ps.savedAt DESC")
    Page<Post> findSavedPostsByUser(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * Lấy bài đăng gần đây nhất
     */
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false ORDER BY p.createdAt DESC")
    Page<Post> findLatestPosts(Pageable pageable);
    
    /**
     * Tìm kiếm bài đăng
     */
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND " +
            "(LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.authorName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY p.createdAt DESC")
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * Lấy số lượng bài đăng của một tác giả
     */
    Long countByAuthorIdAndIsDeletedFalse(Long authorId);
    
    /**
     * Lấy bài đăng được tạo trong khoảng thời gian
     */
    List<Post> findByCreatedAtBetweenAndIsDeletedFalseOrderByCreatedAtDesc(
            LocalDateTime startDate, LocalDateTime endDate);
}
