package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: PrivacySettingsResponse
 * Response khi lấy cài đặt quyền riêng tư
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettingsResponse {
    
    @JsonProperty("settingId")
    private Long settingId;
    
    @JsonProperty("profileVisibility")
    private String profileVisibility;
    
    @JsonProperty("showEmail")
    private Boolean showEmail;
    
    @JsonProperty("showPhone")
    private Boolean showPhone;
    
    @JsonProperty("showAcademicInfo")
    private Boolean showAcademicInfo;
    
    @JsonProperty("allowContactFrom")
    private String allowContactFrom;
    
    @JsonProperty("showActivity")
    private String showActivity;
    
    @JsonProperty("showFriendsList")
    private Boolean showFriendsList;
    
    @JsonProperty("searchableByEmail")
    private Boolean searchableByEmail;
    
    @JsonProperty("searchableByUsername")
    private Boolean searchableByUsername;
    
    @JsonProperty("receiveEmailNotifications")
    private Boolean receiveEmailNotifications;
    
    @JsonProperty("notificationFrom")
    private String notificationFrom;
    
    @JsonProperty("allowFriendRequestFrom")
    private String allowFriendRequestFrom;
}
