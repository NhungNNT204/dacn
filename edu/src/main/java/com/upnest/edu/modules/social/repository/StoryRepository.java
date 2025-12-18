package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * StoryRepository - Quản lý dữ liệu stories
 */
@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    // Lấy stories của người dùng
    @Query("SELECT s FROM Story s WHERE s.userId = :userId AND s.isDeleted = false " +
           "ORDER BY s.createdAt DESC")
    Page<Story> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Lấy stories chưa hết hạn
    @Query("SELECT s FROM Story s WHERE s.expiresAt > :now AND s.isDeleted = false " +
           "ORDER BY s.createdAt DESC")
    List<Story> findActiveStories(@Param("now") LocalDateTime now);
    
    // Lấy stories của một danh sách users
    @Query("SELECT s FROM Story s WHERE s.userId IN :userIds AND s.expiresAt > :now " +
           "AND s.isDeleted = false ORDER BY s.createdAt DESC")
    List<Story> findStoriesByUserIds(@Param("userIds") List<Long> userIds, @Param("now") LocalDateTime now);
    
    // Đếm stories chưa xem
    @Query("SELECT COUNT(s) FROM Story s WHERE s.userId = :userId AND s.isDeleted = false")
    Long countByUserIdAndNotDeleted(@Param("userId") Long userId);
    
    // Lấy story phổ biến nhất
    @Query("SELECT s FROM Story s WHERE s.isDeleted = false " +
           "ORDER BY s.viewsCount DESC LIMIT :limit")
    List<Story> findPopularStories(@Param("limit") int limit);
    
    // Xóa stories hết hạn
    @Query("UPDATE Story s SET s.isDeleted = true WHERE s.expiresAt <= :now")
    void deleteExpiredStories(@Param("now") LocalDateTime now);
}
