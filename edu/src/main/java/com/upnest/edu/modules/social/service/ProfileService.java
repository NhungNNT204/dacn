package com.upnest.edu.modules.social.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.upnest.edu.modules.social.entity.PrivacySettings;
import com.upnest.edu.modules.social.entity.Story;
import com.upnest.edu.modules.social.entity.StoryHighlight;
import com.upnest.edu.modules.social.entity.UserAvatar;
import com.upnest.edu.modules.social.entity.UserProfile;
import com.upnest.edu.modules.social.repository.PrivacySettingsRepository;
import com.upnest.edu.modules.social.repository.StoryHighlightRepository;
import com.upnest.edu.modules.social.repository.StoryRepository;
import com.upnest.edu.modules.social.repository.UserAvatarRepository;
import com.upnest.edu.modules.social.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ProfileService - Xử lý logic hồ sơ cá nhân người dùng
 * Bao gồm: lấy profile, cập nhật, upload ảnh, stories, follow, v.v.
 */
@Service("socialProfileService")
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfileService {
    
    private final UserProfileRepository userProfileRepository;
    private final StoryRepository storyRepository;
    private final StoryHighlightRepository storyHighlightRepository;
    private final UserAvatarRepository userAvatarRepository;
    private final PrivacySettingsRepository privacySettingsRepository;
    
    // ==================== PROFILE OPERATIONS ====================
    
    /**
     * Lấy hồ sơ của một người dùng
     */
    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Hồ sơ không tồn tại"));
    }
    
    /**
     * Tạo hồ sơ mới cho người dùng
     */
    public UserProfile createProfile(Long userId, String firstName, String lastName, String email) {
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .isVerified(false)
                .isPrivate(false)
                .isActive(true)
                .followersCount(0)
                .followingCount(0)
                .postsCount(0)
                .friendsCount(0)
                .build();
        
        UserProfile saved = userProfileRepository.save(profile);
        
        // Tạo cài đặt riêng tư mặc định
        PrivacySettings settings = PrivacySettings.builder()
                .userProfile(saved)
                .userId(userId)
                .postVisibility(PrivacySettings.PostVisibility.PUBLIC)
                .commentPermission(PrivacySettings.CommentPermission.EVERYONE)
                .reactionPermission(PrivacySettings.ReactionPermission.EVERYONE)
                .allowTag(true)
                .allowNotifications(true)
                .build();
        privacySettingsRepository.save(settings);
        
        log.info("Tạo hồ sơ mới cho user: {}", userId);
        return saved;
    }
    
    /**
     * Cập nhật thông tin profile
     */
    public UserProfile updateProfile(Long userId, UpdateProfileRequest request) {
        UserProfile profile = getProfile(userId);
        
        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) {
            try {
                // Avoid compile issues if Gender visibility differs across modules/build tools
                Class<?> genderEnum = Class.forName("com.upnest.edu.modules.social.entity.UserProfile$Gender");
                @SuppressWarnings({"rawtypes", "unchecked"})
                Object genderValue = Enum.valueOf((Class<? extends Enum>) genderEnum, request.getGender().trim().toUpperCase());
                UserProfile.class.getMethod("setGender", genderEnum).invoke(profile, genderValue);
            } catch (Exception ignored) {
                // ignore invalid gender values
            }
        }
        if (request.getIsPrivate() != null) profile.setIsPrivate(request.getIsPrivate());
        
        UserProfile updated = userProfileRepository.save(profile);
        log.info("Cập nhật hồ sơ cho user: {}", userId);
        return updated;
    }
    
    /**
     * Upload ảnh bìa
     */
    public UserProfile uploadCover(Long userId, String coverUrl) {
        UserProfile profile = getProfile(userId);
        profile.setCoverUrl(coverUrl);
        return userProfileRepository.save(profile);
    }
    
    /**
     * Upload ảnh đại diện
     */
    public UserProfile uploadAvatar(Long userId, String avatarUrl) {
        UserProfile profile = getProfile(userId);
        
        // Đánh dấu avatar cũ không phải hiện tại
        userAvatarRepository.findByUserIdAndIsCurrentTrue(userId)
                .ifPresent(old -> {
                    old.setIsCurrent(false);
                    userAvatarRepository.save(old);
                });
        
        // Tạo avatar mới
        UserAvatar newAvatar = UserAvatar.builder()
                .userProfile(profile)
                .userId(userId)
                .avatarUrl(avatarUrl)
                .isCurrent(true)
                .build();
        userAvatarRepository.save(newAvatar);
        
        // Cập nhật profile
        profile.setAvatarUrl(avatarUrl);
        return userProfileRepository.save(profile);
    }
    
    // ==================== STORY OPERATIONS ====================
    
    /**
     * Thêm story mới
     */
    public Story addStory(Long userId, String mediaUrl, String mediaType, String caption) {
        UserProfile profile = getProfile(userId);
        
        Story story = Story.builder()
                .userProfile(profile)
                .userId(userId)
                .userName(profile.getFirstName() + " " + profile.getLastName())
                .userAvatar(profile.getAvatarUrl())
                .mediaUrl(mediaUrl)
                .mediaType(Story.MediaType.valueOf(mediaType))
                .caption(caption)
                .viewsCount(0)
                .isDeleted(false)
                .build();
        
        return storyRepository.save(story);
    }
    
    /**
     * Lấy stories của người dùng
     */
    public List<Story> getUserStories(Long userId) {
        Pageable pageable = PageRequest.of(0, 20);
        return storyRepository.findByUserId(userId, pageable).getContent();
    }
    
    /**
     * Lấy tất cả stories còn hoạt động
     */
    public List<Story> getActiveStories() {
        return storyRepository.findActiveStories(LocalDateTime.now());
    }
    
    // ==================== STORY HIGHLIGHT OPERATIONS ====================
    
    /**
     * Tạo story highlight mới
     */
    public StoryHighlight createHighlight(Long userId, String title, String description, String thumbnailUrl) {
        UserProfile profile = getProfile(userId);
        
        StoryHighlight highlight = StoryHighlight.builder()
                .userProfile(profile)
                .userId(userId)
                .title(title)
                .description(description)
                .thumbnailUrl(thumbnailUrl)
                .storyIds(new ArrayList<>())
                .viewsCount(0)
                .build();
        
        return storyHighlightRepository.save(highlight);
    }
    
    /**
     * Lấy highlights của người dùng
     */
    public List<StoryHighlight> getUserHighlights(Long userId) {
        return storyHighlightRepository.findByUserId(userId);
    }
    
    /**
     * Thêm story vào highlight
     */
    public StoryHighlight addStoryToHighlight(Long highlightId, Long storyId) {
        StoryHighlight highlight = storyHighlightRepository.findById(highlightId)
                .orElseThrow(() -> new RuntimeException("Highlight không tồn tại"));
        
        if (!highlight.getStoryIds().contains(storyId)) {
            highlight.getStoryIds().add(storyId);
        }
        
        return storyHighlightRepository.save(highlight);
    }
    
    /**
     * Xóa highlight
     */
    public void deleteHighlight(Long highlightId) {
        storyHighlightRepository.deleteById(highlightId);
    }
    
    // ==================== FOLLOW OPERATIONS ====================
    
    /**
     * Follow người dùng
     */
    public void followUser(Long fromUserId, Long toUserId) {
        UserProfile fromProfile = getProfile(fromUserId);
        UserProfile toProfile = getProfile(toUserId);
        
        fromProfile.setFollowingCount(fromProfile.getFollowingCount() + 1);
        toProfile.setFollowersCount(toProfile.getFollowersCount() + 1);
        
        userProfileRepository.save(fromProfile);
        userProfileRepository.save(toProfile);
        
        log.info("User {} follow user {}", fromUserId, toUserId);
    }
    
    /**
     * Unfollow người dùng
     */
    public void unfollowUser(Long fromUserId, Long toUserId) {
        UserProfile fromProfile = getProfile(fromUserId);
        UserProfile toProfile = getProfile(toUserId);
        
        fromProfile.setFollowingCount(Math.max(0, fromProfile.getFollowingCount() - 1));
        toProfile.setFollowersCount(Math.max(0, toProfile.getFollowersCount() - 1));
        
        userProfileRepository.save(fromProfile);
        userProfileRepository.save(toProfile);
        
        log.info("User {} unfollow user {}", fromUserId, toUserId);
    }
    
    // ==================== PRIVACY SETTINGS ====================
    
    /**
     * Cập nhật cài đặt riêng tư
     */
    public PrivacySettings updatePrivacySettings(Long userId, PrivacySettingsRequest request) {
        PrivacySettings settings = privacySettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cài đặt riêng tư không tồn tại"));
        
        if (request.getPostVisibility() != null) 
            settings.setPostVisibility(request.getPostVisibility());
        if (request.getCommentPermission() != null) 
            settings.setCommentPermission(request.getCommentPermission());
        if (request.getReactionPermission() != null) 
            settings.setReactionPermission(request.getReactionPermission());
        if (request.getAllowTag() != null) 
            settings.setAllowTag(request.getAllowTag());
        if (request.getAllowNotifications() != null) 
            settings.setAllowNotifications(request.getAllowNotifications());
        
        return privacySettingsRepository.save(settings);
    }
    
    /**
     * Lấy cài đặt riêng tư
     */
    public PrivacySettings getPrivacySettings(Long userId) {
        return privacySettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cài đặt riêng tư không tồn tại"));
    }
    
    // ==================== STATISTICS ====================
    
    /**
     * Cập nhật số posts
     */
    public void incrementPostCount(Long userId) {
        UserProfile profile = getProfile(userId);
        profile.setPostsCount(profile.getPostsCount() + 1);
        userProfileRepository.save(profile);
    }
    
    /**
     * Giảm số posts
     */
    public void decrementPostCount(Long userId) {
        UserProfile profile = getProfile(userId);
        profile.setPostsCount(Math.max(0, profile.getPostsCount() - 1));
        userProfileRepository.save(profile);
    }
    
    /**
     * Cập nhật số bạn bè
     */
    public void updateFriendsCount(Long userId, Integer count) {
        UserProfile profile = getProfile(userId);
        profile.setFriendsCount(count);
        userProfileRepository.save(profile);
    }
    
    /**
     * Tìm kiếm profile
     */
    public List<UserProfile> searchProfiles(String keyword) {
        return userProfileRepository.searchProfiles(keyword);
    }
    
    /**
     * Lấy người dùng được follow nhiều nhất
     */
    public List<UserProfile> getTopFollowedUsers(int limit) {
        return userProfileRepository.getTopFollowedUsers(limit);
    }
    
    // ==================== REQUEST/RESPONSE CLASSES ====================
    
    public static class UpdateProfileRequest {
        public String firstName;
        public String lastName;
        public String bio;
        public String phone;
        public String website;
        public String location;
        public LocalDateTime dateOfBirth;
        public String gender;
        public Boolean isPrivate;
        
        // Getters and setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public LocalDateTime getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDateTime dateOfBirth) { this.dateOfBirth = dateOfBirth; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public Boolean getIsPrivate() { return isPrivate; }
        public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }
    }
    
    public static class PrivacySettingsRequest {
        public PrivacySettings.PostVisibility postVisibility;
        public PrivacySettings.CommentPermission commentPermission;
        public PrivacySettings.ReactionPermission reactionPermission;
        public Boolean allowTag;
        public Boolean allowNotifications;
        
        // Getters and setters
        public PrivacySettings.PostVisibility getPostVisibility() { return postVisibility; }
        public void setPostVisibility(PrivacySettings.PostVisibility postVisibility) { this.postVisibility = postVisibility; }
        public PrivacySettings.CommentPermission getCommentPermission() { return commentPermission; }
        public void setCommentPermission(PrivacySettings.CommentPermission commentPermission) { this.commentPermission = commentPermission; }
        public PrivacySettings.ReactionPermission getReactionPermission() { return reactionPermission; }
        public void setReactionPermission(PrivacySettings.ReactionPermission reactionPermission) { this.reactionPermission = reactionPermission; }
        public Boolean getAllowTag() { return allowTag; }
        public void setAllowTag(Boolean allowTag) { this.allowTag = allowTag; }
        public Boolean getAllowNotifications() { return allowNotifications; }
        public void setAllowNotifications(Boolean allowNotifications) { this.allowNotifications = allowNotifications; }
    }
}
