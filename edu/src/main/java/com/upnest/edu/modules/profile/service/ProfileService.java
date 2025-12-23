package com.upnest.edu.modules.profile.service;

import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.learning.entity.LearningStreak;
import com.upnest.edu.modules.learning.repository.LearningStreakRepository;
import com.upnest.edu.modules.profile.entity.Certification;
import com.upnest.edu.modules.profile.entity.UserProfile;
import com.upnest.edu.modules.profile.payload.*;
import com.upnest.edu.modules.profile.repository.CertificationRepository;
import com.upnest.edu.modules.profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ProfileService - Service xử lý logic cho user profile
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final UserProfileRepository profileRepository;
    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;
    private final LearningStreakRepository streakRepository;

    /**
     * Lấy hồ sơ đầy đủ của user
     */
    public UserProfileDTO getUserProfile(Long userId) {
        log.info("Getting user profile for user: {}", userId);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(userId)
                .orElse(UserProfile.builder()
                        .userId(userId)
                        .avatarUrl(null)
                        .jobTitle("Student")
                        .summary("")
                        .build());

        // Get gamification stats
        LearningStreak streak = streakRepository.findByUserId(userId).orElse(null);
        Integer streakDays = streak != null ? streak.getCurrentStreak() : 0;
        
        // Calculate level and XP (similar to DashboardService)
        // TODO: Calculate from actual activities/XP records
        int xp = 1450;
        Integer level = calculateLevel(xp);

        // Get certifications
        List<Certification> certifications = certificationRepository.findByUserIdOrderByIssueDateDesc(userId);

        // Build DTO
        UserProfileDTO dto = UserProfileDTO.builder()
                .userId(userId)
                .fullName(user.getFullName() != null ? user.getFullName() : user.getEmail())
                .email(user.getEmail())
                .avatarUrl(profile.getAvatarUrl())
                .jobTitle(profile.getJobTitle())
                .summary(profile.getSummary())
                .location(profile.getLocation())
                .phone(profile.getPhone())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .level(level)
                .totalXp(xp)
                .streak(streakDays)
                .skills(getDefaultSkills()) // TODO: Get from skills table
                .certifications(mapCertifications(certifications))
                .projects(new ArrayList<>()) // TODO: Get from projects table
                .aiAnalysis(generateAIAnalysis(level, xp))
                .aiRecommendation(generateAIRecommendation(level, xp))
                .build();

        return dto;
    }

    /**
     * Generate AI Analysis based on user stats
     */
    private String generateAIAnalysis(Integer level, Integer xp) {
        if (xp > 1400) {
            return String.format("Học viên sở hữu khả năng phân tích nghiệp vụ sắc bén Top 5%% học viên xuất sắc mảng BA/UI năm 2024.", level);
        } else if (xp > 1000) {
            return String.format("Học viên có năng lực tốt với trình độ Cấp %d và %d XP, đang trên đường phát triển cnhungên môn.", level, xp);
        } else {
            return String.format("Học viên đang trong quá trình xây dựng nền tảng kiến thức vững chắc với trình độ Cấp %d.", level);
        }
    }

    /**
     * Generate AI Recommendation
     */
    private String generateAIRecommendation(Integer level, Integer xp) {
        if (xp > 1400) {
            return "Hồ sơ này thể hiện sự nhạy bén vượt trội trong việc phân tích yêu cầu kinh doanh phức tạp và cnhungển đổi chúng thành các thiết kế giao diện trực quan. Đề xuất: Phù hợp cho vị trí Associate Product Owner hoặc UX Lead.";
        } else if (xp > 1000) {
            return "Đề xuất: Phù hợp cho vị trí Mid-level Developer hoặc Associate Tech Lead.";
        } else {
            return "Đề xuất: Tiếp tục học tập và tích lũy kinh nghiệm để phát triển sự nghiệp.";
        }
    }

    private List<SkillDTO> getDefaultSkills() {
        // TODO: Get from database
        return List.of(
                SkillDTO.builder().name("Business Requirement Analysis & User Story").level(90).build(),
                SkillDTO.builder().name("UI/UX Design (Figma / Adobe XD)").level(85).build(),
                SkillDTO.builder().name("Data Visualization (Power BI / Tableau)").level(75).build(),
                SkillDTO.builder().name("Process Modeling (BPMN / UML)").level(80).build()
        );
    }

    private List<CertificationDTO> mapCertifications(List<Certification> certifications) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy - MMMM");
        return certifications.stream().map(cert -> CertificationDTO.builder()
                .id(cert.getId())
                .issuer(cert.getIssuer())
                .name(cert.getName())
                .description(cert.getDescription())
                .issueDate(cert.getIssueDate() != null ? cert.getIssueDate().format(formatter) : null)
                .expiryDate(cert.getExpiryDate() != null ? cert.getExpiryDate().format(formatter) : null)
                .grade(cert.getGrade())
                .score(cert.getScore())
                .certificateUrl(cert.getCertificateUrl())
                .build()).collect(Collectors.toList());
    }

    private int calculateLevel(int xp) {
        // Công thức: Level = sqrt(XP / 100)
        return (int) Math.sqrt(xp / 100.0) + 1;
    }
}

