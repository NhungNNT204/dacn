package com.upnest.edu.modules.user.repository;

import com.upnest.edu.modules.user.entity.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository: PrivacySettingsRepository
 * Xử lý các truy vấn CRUD cho PrivacySettings
 */
@Repository("userPrivacySettingsRepository")
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
    
    /**
     * Tìm privacy settings theo user ID
     */
    Optional<PrivacySettings> findByUserUserId(Long userId);
}
