package com.upnest.edu.modules.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: PrivacySettings (Cài đặt quyền riêng tư)
 * Lưu trữ các cài đặt quyền riêng tư của người dùng
 * 
 * Quan hệ: 1-1 với User
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "privacy_settings", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class PrivacySettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_id")
    private Long settingId;
    
    /**
     * User (Foreign Key)
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Hồ sơ công khai: PUBLIC, FRIENDS_ONLY, PRIVATE
     */
    @Column(name = "profile_visibility", nullable = false)
    @Enumerated(EnumType.STRING)
    private PrivacyLevel profileVisibility = PrivacyLevel.PUBLIC;
    
    /**
     * Hiển thị email công khai
     */
    @Column(name = "show_email")
    private Boolean showEmail = false;
    
    /**
     * Hiển thị số điện thoại công khai
     */
    @Column(name = "show_phone")
    private Boolean showPhone = false;
    
    /**
     * Hiển thị hồ sơ học tập công khai
     */
    @Column(name = "show_academic_info")
    private Boolean showAcademicInfo = true;
    
    /**
     * Cho phép ai liên hệ: ANYONE, FRIENDS_ONLY, NOBODY
     */
    @Column(name = "allow_contact_from")
    @Enumerated(EnumType.STRING)
    private PrivacyLevel allowContactFrom = PrivacyLevel.ANYONE;
    
    /**
     * Cho phép ai xem hoạt động: ANYONE, FRIENDS_ONLY, PRIVATE
     */
    @Column(name = "show_activity")
    @Enumerated(EnumType.STRING)
    private PrivacyLevel showActivity = PrivacyLevel.FRIENDS_ONLY;
    
    /**
     * Cho phép ai xem danh sách bạn
     */
    @Column(name = "show_friends_list")
    private Boolean showFriendsList = true;
    
    /**
     * Cho phép tìm kiếm tài khoản bằng email
     */
    @Column(name = "searchable_by_email")
    private Boolean searchableByEmail = true;
    
    /**
     * Cho phép tìm kiếm tài khoản bằng username
     */
    @Column(name = "searchable_by_username")
    private Boolean searchableByUsername = true;
    
    /**
     * Nhận thông báo email
     */
    @Column(name = "receive_email_notifications")
    private Boolean receiveEmailNotifications = true;
    
    /**
     * Nhận thông báo từ ai: ANYONE, FRIENDS_ONLY, NOBODY
     */
    @Column(name = "notification_from")
    @Enumerated(EnumType.STRING)
    private PrivacyLevel notificationFrom = PrivacyLevel.ANYONE;
    
    /**
     * Cho phép đưa vào danh sách bạn từ ai
     */
    @Column(name = "allow_friend_request_from")
    @Enumerated(EnumType.STRING)
    private PrivacyLevel allowFriendRequestFrom = PrivacyLevel.ANYONE;
    
    /**
     * Thời gian tạo cài đặt
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời gian cập nhật
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
