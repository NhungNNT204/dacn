package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho Dashboard data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private String studentName;
    private Integer streak;
    private Integer level;
    private String levelTitle;
    private Integer xp;
    private Integer nextLevelXp;
    private Integer courses;
    private Integer friends;
    private Integer posts;
    private Integer badges;
    private Integer onlineTeammates;
    private List<ActivityDTO> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityDTO {
        private Long id;
        private String type;
        private String title;
        private String description;
        private String time;
        private String icon;
        private String color;
    }
}

