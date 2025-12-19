package com.upnest.edu.modules.profile.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * UserProfileDTO - DTO cho hồ sơ người dùng đầy đủ
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    // User basic info
    private Long userId;
    private String fullName;
    private String email;
    
    // Profile info
    private String avatarUrl;
    private String jobTitle;
    private String summary;
    private String location;
    private String phone;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    
    // Gamification stats
    private Integer level;
    private Integer totalXp;
    private Integer streak;
    
    // Skills
    private List<SkillDTO> skills;
    
    // Certifications
    private List<CertificationDTO> certifications;
    
    // Projects/Achievements
    private List<ProjectDTO> projects;
    
    // AI Analysis
    private String aiAnalysis;
    private String aiRecommendation;
}


