package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO: UserProfileResponse
 * Response khi lấy hồ sơ cá nhân
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("phone")
    private String phone;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("avatarUrl")
    private String avatarUrl;
    
    @JsonProperty("dateOfBirth")
    private String dateOfBirth;
    
    @JsonProperty("gender")
    private String gender;
    
    @JsonProperty("address")
    private String address;
    
    @JsonProperty("city")
    private String city;
    
    @JsonProperty("country")
    private String country;
    
    @JsonProperty("specialization")
    private String specialization;
    
    @JsonProperty("institution")
    private String institution;
    
    @JsonProperty("academicYear")
    private String academicYear;
    
    @JsonProperty("bio")
    private String bio;
    
    @JsonProperty("website")
    private String website;
    
    @JsonProperty("githubUrl")
    private String githubUrl;
    
    @JsonProperty("linkedinUrl")
    private String linkedinUrl;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
