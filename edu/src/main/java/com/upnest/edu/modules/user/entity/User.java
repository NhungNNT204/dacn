package com.upnest.edu.modules.user.entity;

import jakarta.persistence.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entity: User (Người dùng)
 * Lưu trữ thông tin đăng nhập và cơ bản của người dùng
 * 
 * Thực hiện UserDetails interface của Spring Security
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_username", columnList = "username", unique = true),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    /**
     * Tên đăng nhập (unique)
     */
    @Column(name = "username", nullable = false, length = 100, unique = true)
    private String username;
    
    /**
     * Email (unique)
     */
    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;
    
    /**
     * Mật khẩu (đã mã hóa)
     */
    @Column(name = "password", nullable = false)
    private String password;
    
    /**
     * Họ tên đầy đủ
     */
    @Column(name = "full_name", length = 200)
    private String fullName;
    
    /**
     * Số điện thoại
     */
    @Column(name = "phone", length = 20)
    private String phone;
    
    /**
     * Vai trò: STUDENT, TEACHER, ADMIN
     */
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.STUDENT;
    
    /**
     * Trạng thái tài khoản: ACTIVE, INACTIVE, BANNED
     */
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;
    
    /**
     * Email được xác thực hay không
     */
    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;
    
    /**
     * Thời gian tạo tài khoản
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời gian cập nhật
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    /**
     * Thời gian lần cuối đăng nhập
     */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    /**
     * Bảo mật 2 lớp: Có bật hay không
     */
    @Column(name = "is_two_factor_enabled")
    private Boolean twoFactorEnabled = false;
    
    /**
     * Secret key cho 2FA (TOTP)
     */
    @Column(name = "two_factor_secret")
    private String twoFactorSecret;
    
    /**
     * Avatar URL
     */
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    /**
     * Hồ sơ người dùng (1-1 relationship)
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserProfile userProfile;
    
    /**
     * Cài đặt quyền riêng tư (1-1 relationship)
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private PrivacySettings privacySettings;
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // ===== UserDetails Implementation =====
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }
    
    @Override
    public String getUsername() {
        return this.username;
    }
    
    @Override
    public String getPassword() {
        return this.password;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return this.status != UserStatus.BANNED;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return this.status == UserStatus.ACTIVE;
    }
    
    /**
     * Getter cho ID (userId)
     */
    public Long getId() {
        return this.userId;
    }
    
    /**
     * Getter cho phone number
     */
    public String getPhoneNumber() {
        return this.phone;
    }
    
    /**
     * Getter cho two factor enabled
     */
    public Boolean isTwoFactorEnabled() {
        return this.twoFactorEnabled != null && this.twoFactorEnabled;
    }
    
    /**
     * Getter cho two factor secret
     */
    public String getTwoFactorSecret() {
        return this.twoFactorSecret;
    }
    
    /**
     * Getter cho avatar URL
     */
    public String getAvatarUrl() {
        return this.avatarUrl;
    }
}
