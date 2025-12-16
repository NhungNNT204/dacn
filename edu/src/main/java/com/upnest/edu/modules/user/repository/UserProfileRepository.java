package com.upnest.edu.modules.user.repository;

import com.upnest.edu.modules.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository: UserProfileRepository
 * Xử lý các truy vấn CRUD cho UserProfile
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    /**
     * Tìm profile theo user ID
     */
    Optional<UserProfile> findByUserUserId(Long userId);
}
