package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: UpdatePrivacySettingsRequest
 * Request khi cập nhật cài đặt quyền riêng tư
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePrivacySettingsRequest {
    
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
