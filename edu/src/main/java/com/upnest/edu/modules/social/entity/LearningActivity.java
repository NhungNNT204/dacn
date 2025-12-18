package com.upnest.edu.modules.social.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_activity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningActivity {

    public enum ActivityType {
        COURSE_COMPLETED,
        REVIEW,
        CHALLENGE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    @Column
    private String userAvatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ActivityType activityType;

    @Column
    private Long courseId;

    @Column
    private String courseTitle;

    /**
     * Optional short message / metadata (e.g., review text, score, streak).
     */
    @Column(length = 1000)
    private String message;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}






