package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserProfileRepository - Quản lý dữ liệu hồ sơ người dùng
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    // Tìm profile theo userId
    Optional<UserProfile> findByUserId(Long userId);
    
    // Tìm kiếm người dùng
    @Query("SELECT up FROM UserProfile up WHERE " +
           "(LOWER(up.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(up.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "up.isActive = true ORDER BY up.followersCount DESC")
    List<UserProfile> searchProfiles(@Param("keyword") String keyword);
    
    // Lấy danh sách người được follow nhiều nhất
    @Query("SELECT up FROM UserProfile up WHERE up.isActive = true " +
           "ORDER BY up.followersCount DESC LIMIT :limit")
    List<UserProfile> getTopFollowedUsers(@Param("limit") int limit);
    
    // Đếm profile đã verify
    Long countByIsVerifiedTrue();
    
    // Kiểm tra email tồn tại
    Boolean existsByEmail(String email);
    
    // Lấy profile đã xác minh
    @Query("SELECT up FROM UserProfile up WHERE up.isVerified = true AND up.isActive = true")
    List<UserProfile> findVerifiedProfiles();
}
