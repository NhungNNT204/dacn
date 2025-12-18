package com.upnest.edu.modules.social.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserConnectionDTO - dữ liệu hiển thị trong Search/Friends/Followers list
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserConnectionDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String avatarUrl;

    private Boolean online;
    private String currentCourseTitle;

    // relationship flags (relative to current user)
    private Boolean isFollowing;
    private Boolean isFollower;
    private Boolean isFriend; // mutual follow
}






