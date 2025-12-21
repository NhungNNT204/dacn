package com.upnest.edu.modules.user.service;

import com.upnest.edu.modules.user.entity.PrivacyLevel;
import com.upnest.edu.modules.user.entity.PrivacySettings;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.payload.PrivacySettingsResponse;
import com.upnest.edu.modules.user.payload.UpdatePrivacySettingsRequest;
import com.upnest.edu.modules.user.repository.PrivacySettingsRepository;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service: PrivacySettingsService
 * Xử lý logic cài đặt quyền riêng tư
 */

@Slf4j
@Service
@Transactional
@lombok.RequiredArgsConstructor
@SuppressWarnings("null")
public class PrivacySettingsService {
    
    private final UserRepository userRepository;
    private final PrivacySettingsRepository privacySettingsRepository;
    
    /**
     * Lấy cài đặt quyền riêng tư của user
     * @param userId ID người dùng
     * @return PrivacySettingsResponse
     */
    public PrivacySettingsResponse getPrivacySettings(Long userId) {
        log.info("Getting privacy settings for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PrivacySettings settings = user.getPrivacySettings();
        if (settings == null) {
            // Tạo cài đặt mặc định nếu chưa có
            settings = PrivacySettings.builder()
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build();
            privacySettingsRepository.save(settings);
        }
        
        return mapToResponse(settings);
    }
    
    /**
     * Cập nhật cài đặt quyền riêng tư
     * @param userId ID người dùng
     * @param request Cài đặt mới
     * @return PrivacySettingsResponse
     */
    public PrivacySettingsResponse updatePrivacySettings(Long userId, UpdatePrivacySettingsRequest request) {
        log.info("Updating privacy settings for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PrivacySettings settings = user.getPrivacySettings();
        if (settings == null) {
            settings = PrivacySettings.builder()
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        // Cập nhật các trường
        if (request.getProfileVisibility() != null) {
            settings.setProfileVisibility(PrivacyLevel.valueOf(request.getProfileVisibility().toUpperCase()));
        }
        if (request.getShowEmail() != null) {
            settings.setShowEmail(request.getShowEmail());
        }
        if (request.getShowPhone() != null) {
            settings.setShowPhone(request.getShowPhone());
        }
        if (request.getShowAcademicInfo() != null) {
            settings.setShowAcademicInfo(request.getShowAcademicInfo());
        }
        if (request.getAllowContactFrom() != null) {
            settings.setAllowContactFrom(PrivacyLevel.valueOf(request.getAllowContactFrom().toUpperCase()));
        }
        if (request.getShowActivity() != null) {
            settings.setShowActivity(PrivacyLevel.valueOf(request.getShowActivity().toUpperCase()));
        }
        if (request.getShowFriendsList() != null) {
            settings.setShowFriendsList(request.getShowFriendsList());
        }
        if (request.getSearchableByEmail() != null) {
            settings.setSearchableByEmail(request.getSearchableByEmail());
        }
        if (request.getSearchableByUsername() != null) {
            settings.setSearchableByUsername(request.getSearchableByUsername());
        }
        if (request.getReceiveEmailNotifications() != null) {
            settings.setReceiveEmailNotifications(request.getReceiveEmailNotifications());
        }
        if (request.getNotificationFrom() != null) {
            settings.setNotificationFrom(PrivacyLevel.valueOf(request.getNotificationFrom().toUpperCase()));
        }
        if (request.getAllowFriendRequestFrom() != null) {
            settings.setAllowFriendRequestFrom(PrivacyLevel.valueOf(request.getAllowFriendRequestFrom().toUpperCase()));
        }
        
        settings.setUpdatedAt(LocalDateTime.now());
        
        PrivacySettings saved = privacySettingsRepository.save(settings);
        
        log.info("Privacy settings updated successfully for user: {}", userId);
        
        return mapToResponse(saved);
    }
    
    /**
     * Reset cài đặt quyền riêng tư về mặc định
     * @param userId ID người dùng
     * @return PrivacySettingsResponse
     */
    public PrivacySettingsResponse resetPrivacySettings(Long userId) {
        log.info("Resetting privacy settings for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PrivacySettings settings = PrivacySettings.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        PrivacySettings saved = privacySettingsRepository.save(settings);
        
        return mapToResponse(saved);
    }
    
    /**
     * Cnhungển đổi PrivacySettings thành Response
     */
    private PrivacySettingsResponse mapToResponse(PrivacySettings settings) {
        return PrivacySettingsResponse.builder()
                .settingId(settings.getSettingId())
                .profileVisibility(settings.getProfileVisibility().name())
                .showEmail(settings.getShowEmail())
                .showPhone(settings.getShowPhone())
                .showAcademicInfo(settings.getShowAcademicInfo())
                .allowContactFrom(settings.getAllowContactFrom().name())
                .showActivity(settings.getShowActivity().name())
                .showFriendsList(settings.getShowFriendsList())
                .searchableByEmail(settings.getSearchableByEmail())
                .searchableByUsername(settings.getSearchableByUsername())
                .receiveEmailNotifications(settings.getReceiveEmailNotifications())
                .notificationFrom(settings.getNotificationFrom().name())
                .allowFriendRequestFrom(settings.getAllowFriendRequestFrom().name())
                .build();
    }
}
