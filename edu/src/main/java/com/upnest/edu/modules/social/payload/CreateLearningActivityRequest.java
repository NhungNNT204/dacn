package com.upnest.edu.modules.social.payload;

import lombok.Data;

@Data
public class CreateLearningActivityRequest {
    private String activityType; // COURSE_COMPLETED | REVIEW | CHALLENGE
    private Long courseId;
    private String courseTitle;
    private String message;
}






