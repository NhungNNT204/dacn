package com.upnest.edu.modules.profile.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationDTO {
    private Long id;
    private String issuer;
    private String name;
    private String description;
    private String issueDate;
    private String expiryDate;
    private String grade;
    private String score;
    private String certificateUrl;
}

