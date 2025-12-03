package com.upnest.edu.modules.auth.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phoneNumber;
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_2fa_enabled")
    private boolean isTwoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    private boolean enabled = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // --- 1. CONSTRUCTORS (Thủ công) ---
    public User() {}

    public User(Long id, String email, String password, String fullName, String phoneNumber, String avatarUrl, Role role, boolean isTwoFactorEnabled, String twoFactorSecret, boolean enabled, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.isTwoFactorEnabled = isTwoFactorEnabled;
        this.twoFactorSecret = twoFactorSecret;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- 2. BUILDER PATTERN (Thủ công - Để tương thích với code cũ) ---
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String fullName;
        private String phoneNumber;
        private String avatarUrl;
        private Role role;
        private boolean isTwoFactorEnabled;
        private String twoFactorSecret;
        private boolean enabled = true; // Mặc định là true

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder isTwoFactorEnabled(boolean isTwoFactorEnabled) { this.isTwoFactorEnabled = isTwoFactorEnabled; return this; }
        public UserBuilder twoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; return this; }
        public UserBuilder enabled(boolean enabled) { this.enabled = enabled; return this; }

        public User build() {
            return new User(id, email, password, fullName, phoneNumber, avatarUrl, role, isTwoFactorEnabled, twoFactorSecret, enabled, null, null);
        }
    }

    // --- 3. GETTERS & SETTERS (Thủ công) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Lưu ý: Setter cho password ở dưới (ghi đè) hoặc viết ở đây cũng được
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isTwoFactorEnabled() { return isTwoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { isTwoFactorEnabled = twoFactorEnabled; }

    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }

    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // --- 4. OVERRIDE USER DETAILS (Bắt buộc cho Spring Security) ---
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() { 
        return password; 
    }

    @Override
    public String getUsername() { 
        return email; 
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return enabled; }
}