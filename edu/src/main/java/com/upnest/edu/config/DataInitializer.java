package com.upnest.edu.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.upnest.edu.modules.user.entity.PrivacyLevel;
import com.upnest.edu.modules.user.entity.PrivacySettings;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.entity.UserProfile;
import com.upnest.edu.modules.user.entity.UserRole;
import com.upnest.edu.modules.user.entity.UserStatus;
import com.upnest.edu.modules.user.repository.PrivacySettingsRepository;
import com.upnest.edu.modules.user.repository.UserProfileRepository;
import com.upnest.edu.modules.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * DataInitializer - Khởi tạo dữ liệu test khi ứng dụng start
 */
@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PrivacySettingsRepository privacySettingsRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Only initialize if no users exist
            if (userRepository.count() > 0) {
                log.info("Users already exist, skipping initialization");
                return;
            }
            
            log.info("Initializing test data...");

            // Tạo user test #1 - Student
            User student = User.builder()
                    .username("student")
                    .email("student@upnest.edu")
                    .password(passwordEncoder.encode("password123"))
                    .fullName("Nguyễn Văn A (Student)")
                    .phone("0901234567")
                    .role(UserRole.STUDENT)
                    .status(UserStatus.ACTIVE)
                    .isEmailVerified(true)
                    .twoFactorEnabled(false)
                    .avatarUrl("https://api.example.com/avatars/student.jpg")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User savedStudent = userRepository.save(student);

            // Tạo UserProfile cho student
            UserProfile studentProfile = UserProfile.builder()
                    .user(savedStudent)
                    .bio("Sinh viên khoa Công Nghệ Thông Tin")
                    .institution("Đại học FPT")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userProfileRepository.save(studentProfile);

            // Tạo PrivacySettings cho student
            PrivacySettings studentPrivacy = PrivacySettings.builder()
                    .user(savedStudent)
                    .profileVisibility(PrivacyLevel.PUBLIC)
                    .showEmail(true)
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
            privacySettingsRepository.save(studentPrivacy);

            log.info("✓ Created student account: student@upnest.edu / password123");

            // Tạo user test #2 - Teacher
            User teacher = User.builder()
                    .username("teacher")
                    .email("teacher@upnest.edu")
                    .password(passwordEncoder.encode("password123"))
                    .fullName("Trần Thị B (Teacher)")
                    .phone("0912345678")
                    .role(UserRole.TEACHER)
                    .status(UserStatus.ACTIVE)
                    .isEmailVerified(true)
                    .twoFactorEnabled(false)
                    .avatarUrl("https://api.example.com/avatars/teacher.jpg")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User savedTeacher = userRepository.save(teacher);

            // Tạo UserProfile cho teacher
            UserProfile teacherProfile = UserProfile.builder()
                    .user(savedTeacher)
                    .bio("Giảng viên Công Nghệ Phần Mềm")
                    .institution("Đại học FPT")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userProfileRepository.save(teacherProfile);

            // Tạo PrivacySettings cho teacher
            PrivacySettings teacherPrivacy = PrivacySettings.builder()
                    .user(savedTeacher)
                    .profileVisibility(PrivacyLevel.PUBLIC)
                    .showEmail(true)
                    .showPhone(false)
                    .showAcademicInfo(true)
                    .allowContactFrom(PrivacyLevel.ANYONE)
                    .showActivity(PrivacyLevel.PUBLIC)
                    .showFriendsList(true)
                    .searchableByEmail(true)
                    .searchableByUsername(true)
                    .receiveEmailNotifications(true)
                    .notificationFrom(PrivacyLevel.ANYONE)
                    .allowFriendRequestFrom(PrivacyLevel.ANYONE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            privacySettingsRepository.save(teacherPrivacy);

            log.info("✓ Created teacher account: teacher@upnest.edu / password123");

            // Tạo user test #3 - Admin
            User admin = User.builder()
                    .username("admin")
                    .email("admin@upnest.edu")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Lê Hoàng C (Admin)")
                    .phone("0923456789")
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .isEmailVerified(true)
                    .twoFactorEnabled(false)
                    .avatarUrl("https://api.example.com/avatars/admin.jpg")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User savedAdmin = userRepository.save(admin);

            // Tạo UserProfile cho admin
            UserProfile adminProfile = UserProfile.builder()
                    .user(savedAdmin)
                    .bio("Quản trị viên hệ thống")
                    .institution("UpNest Education")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userProfileRepository.save(adminProfile);

            // Tạo PrivacySettings cho admin
            PrivacySettings adminPrivacy = PrivacySettings.builder()
                    .user(savedAdmin)
                    .profileVisibility(PrivacyLevel.PUBLIC)
                    .showEmail(true)
                    .showPhone(false)
                    .showAcademicInfo(true)
                    .allowContactFrom(PrivacyLevel.ANYONE)
                    .showActivity(PrivacyLevel.PUBLIC)
                    .showFriendsList(true)
                    .searchableByEmail(true)
                    .searchableByUsername(true)
                    .receiveEmailNotifications(true)
                    .notificationFrom(PrivacyLevel.ANYONE)
                    .allowFriendRequestFrom(PrivacyLevel.ANYONE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            privacySettingsRepository.save(adminPrivacy);

            log.info("✓ Created admin account: admin@upnest.edu / admin123");

            log.info("✅ Test data initialization completed!");
            log.info("\n=== TEST ACCOUNTS ===");
            log.info("1️⃣  Student: student@upnest.edu / password123");
            log.info("2️⃣  Teacher: teacher@upnest.edu / password123");
            log.info("3️⃣  Admin: admin@upnest.edu / admin123");
            log.info("====================\n");
        };
    }
}
