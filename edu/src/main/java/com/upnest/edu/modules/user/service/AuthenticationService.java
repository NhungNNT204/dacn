package com.upnest.edu.modules.user.service;

import com.upnest.edu.modules.user.entity.*;
import com.upnest.edu.modules.user.payload.*;
import com.upnest.edu.modules.user.repository.*;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service: AuthenticationService
 * Xử lý logic đăng ký, đăng nhập người dùng
 */

@Slf4j
@Service
@Transactional
@SuppressWarnings("null")
public class AuthenticationService {
    
    @org.springframework.beans.factory.annotation.Autowired
    private UserRepository userRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private UserProfileRepository userProfileRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private PrivacySettingsRepository privacySettingsRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private PasswordEncoder passwordEncoder;
    @org.springframework.beans.factory.annotation.Autowired
    private JwtService jwtService;
    
    /**
     * Đăng ký tài khoản mới
     * @param request Thông tin đăng ký
     * @return AuthResponse
     */
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());
        
        // Kiểm tra username/email đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Kiểm tra mật khẩu trùng khớp
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        
        // Tạo user mới
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.valueOf(request.getRole().toUpperCase()))
                .status(UserStatus.ACTIVE)
                .isEmailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        User savedUser = userRepository.save(user);
        
        // Tạo UserProfile mặc định
        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userProfileRepository.save(profile);
        
        // Tạo PrivacySettings mặc định
        PrivacySettings privacySettings = PrivacySettings.builder()
                .user(savedUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        privacySettingsRepository.save(privacySettings);
        
        log.info("User registered successfully: {}", savedUser.getUserId());
        
        // Tạo JWT tokens
        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        
        return mapToAuthResponse(savedUser, accessToken, refreshToken);
    }
    
    /**
     * Đăng nhập
     * @param request Thông tin đăng nhập
     * @return AuthResponse
     */
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getUsername());
        
        // Tìm user theo username hoặc email
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> 
                    userRepository.findByEmail(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"))
                );
        
        // Kiểm tra tài khoản bị khóa hay không
        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("Account is banned");
        }
        
        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        // Cập nhật thời gian đăng nhập cuối
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Tạo JWT tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("User logged in successfully: {}", user.getUserId());
        
        return mapToAuthResponse(user, accessToken, refreshToken);
    }
    
    /**
     * Cnhungển đổi User thành AuthResponse
     */
    private AuthResponse mapToAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }
    
    /**
     * Đảm bảo User có PrivacySettings (tạo nếu không tồn tại)
     */
    public void ensurePrivacySettings(User user) {
        if (user.getPrivacySettings() == null) {
            PrivacySettings privacySettings = PrivacySettings.builder()
                    .user(user)
                    .profileVisibility(PrivacyLevel.PUBLIC)
                    .showEmail(false)
                    .showPhone(false)
                    .showAcademicInfo(true)
                    .allowContactFrom(PrivacyLevel.ANYONE)
                    .showActivity(PrivacyLevel.FRIENDS_ONLY)
                    .showFriendsList(true)
                    .searchableByEmail(true)
                    .searchableByUsername(true)
                    .receiveEmailNotifications(true)
                    .notificationFrom(PrivacyLevel.ANYONE)
                    .allowFriendRequestFrom(PrivacyLevel.ANYONE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            privacySettingsRepository.save(privacySettings);
        }
    }
}
