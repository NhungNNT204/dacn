package com.upnest.edu.modules.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

/**
 * User - Người dùng hệ thống
 * NOTE: This entity is deprecated - use com.upnest.edu.modules.user.entity.User
 * This entity is kept for backward compatibility with references from Group and other entities
 * WARNING: Do NOT persist through this entity, use user module's User instead
 */
@Entity(name = "AuthLegacyUser")
@Table(name = "users", indexes = {
    @Index(name = "idx_legacy_email", columnList = "email", unique = true),
    @Index(name = "idx_legacy_username", columnList = "username", unique = true),
    @Index(name = "idx_legacy_created_at", columnList = "created_at DESC")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(length = 255)
    private String fullName;

    @Column(length = 500)
    private String bio;

    @Column(length = 255)
    private String avatar;

    @Column(length = 255)
    private String cover;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(name = "two_factor_enabled", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean twoFactorEnabled = false;

    @Column(length = 255)
    private String twoFactorSecret;
    
    // Getter method for AuthController compatibility
    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled != null && twoFactorEnabled;
    }

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
        isVerified = false;
        twoFactorEnabled = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
