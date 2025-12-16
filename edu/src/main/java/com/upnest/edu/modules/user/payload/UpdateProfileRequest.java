package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: UpdateProfileRequest
 * Request khi cập nhật hồ sơ cá nhân
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("phone")
    private String phone;
    
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
}
