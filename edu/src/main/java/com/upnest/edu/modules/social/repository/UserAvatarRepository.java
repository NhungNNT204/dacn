package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.UserAvatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserAvatarRepository - Quản lý lịch sử ảnh đại diện
 */
@Repository
public interface UserAvatarRepository extends JpaRepository<UserAvatar, Long> {
    
    // Lấy ảnh đại diện hiện tại
    Optional<UserAvatar> findByUserIdAndIsCurrentTrue(Long userId);
    
    // Lấy lịch sử ảnh đại diện
    @Query("SELECT ua FROM UserAvatar ua WHERE ua.userId = :userId ORDER BY ua.uploadedAt DESC")
    List<UserAvatar> findByUserIdOrderByUploadedAtDesc(@Param("userId") Long userId);
    
    // Đếm ảnh đã upload
    Long countByUserId(Long userId);
}
