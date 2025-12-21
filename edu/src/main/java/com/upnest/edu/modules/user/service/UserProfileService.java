package com.upnest.edu.modules.user.service;

import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.entity.UserProfile;
import com.upnest.edu.modules.user.payload.*;
import com.upnest.edu.modules.user.repository.UserProfileRepository;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service: UserProfileService
 * Xử lý logic hồ sơ cá nhân người dùng
 */

@Slf4j
@Service
@Transactional
@SuppressWarnings("null")
public class UserProfileService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private UserRepository userRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private UserProfileRepository userProfileRepository;
    
    /**
     * Lấy hồ sơ cá nhân theo user ID
     * @param userId ID người dùng
     * @return UserProfileResponse
     */
    public UserProfileResponse getProfile(Long userId) {
        log.info("Getting profile for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToProfileResponse(user);
    }
    
    /**
     * Cập nhật hồ sơ cá nhân
     * @param userId ID người dùng
     * @param request Thông tin cập nhật
     * @return UserProfileResponse
     */
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Cập nhật thông tin User
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        // Lấy hoặc tạo UserProfile
        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = UserProfile.builder()
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        // Cập nhật profile fields
        if (request.getDateOfBirth() != null) {
            profile.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            profile.setGender(com.upnest.edu.modules.user.entity.Gender.valueOf(request.getGender().toUpperCase()));
        }
        if (request.getAddress() != null) {
            profile.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            profile.setCity(request.getCity());
        }
        if (request.getCountry() != null) {
            profile.setCountry(request.getCountry());
        }
        if (request.getSpecialization() != null) {
            profile.setSpecialization(request.getSpecialization());
        }
        if (request.getInstitution() != null) {
            profile.setInstitution(request.getInstitution());
        }
        if (request.getAcademicYear() != null) {
            profile.setAcademicYear(request.getAcademicYear());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }
        if (request.getGithubUrl() != null) {
            profile.setGithubUrl(request.getGithubUrl());
        }
        if (request.getLinkedinUrl() != null) {
            profile.setLinkedinUrl(request.getLinkedinUrl());
        }
        
        profile.setUpdatedAt(LocalDateTime.now());
        
        // Lưu
        userProfileRepository.save(profile);
        user.setUserProfile(profile);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("Profile updated successfully for user: {}", userId);
        
        return mapToProfileResponse(user);
    }
    
    /**
     * Cập nhật ảnh đại diện
     * @param userId ID người dùng
     * @param avatarUrl URL ảnh đại diện
     * @return UserProfileResponse
     */
    public UserProfileResponse updateAvatar(Long userId, String avatarUrl) {
        log.info("Updating avatar for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = UserProfile.builder()
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        profile.setAvatarUrl(avatarUrl);
        profile.setUpdatedAt(LocalDateTime.now());
        
        userProfileRepository.save(profile);
        user.setUserProfile(profile);
        userRepository.save(user);
        
        log.info("Avatar updated successfully for user: {}", userId);
        
        return mapToProfileResponse(user);
    }
    
    /**
     * Cnhungển đổi User thành UserProfileResponse
     */
    private UserProfileResponse mapToProfileResponse(User user) {
        UserProfile profile = user.getUserProfile();
        
        String gender = profile != null && profile.getGender() != null 
                ? profile.getGender().name() 
                : null;
        
        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                .dateOfBirth(profile != null ? profile.getDateOfBirth() : null)
                .gender(gender)
                .address(profile != null ? profile.getAddress() : null)
                .city(profile != null ? profile.getCity() : null)
                .country(profile != null ? profile.getCountry() : null)
                .specialization(profile != null ? profile.getSpecialization() : null)
                .institution(profile != null ? profile.getInstitution() : null)
                .academicYear(profile != null ? profile.getAcademicYear() : null)
                .bio(profile != null ? profile.getBio() : null)
                .website(profile != null ? profile.getWebsite() : null)
                .githubUrl(profile != null ? profile.getGithubUrl() : null)
                .linkedinUrl(profile != null ? profile.getLinkedinUrl() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
