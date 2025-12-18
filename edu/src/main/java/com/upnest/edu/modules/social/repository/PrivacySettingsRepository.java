package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PrivacySettingsRepository - Quản lý cài đặt quyền riêng tư
 */
@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
    
    // Lấy cài đặt riêng tư của user
    Optional<PrivacySettings> findByUserId(Long userId);
    
    // Kiểm tra user có cài đặt riêng tư nào không
    Boolean existsByUserId(Long userId);
}
