package com.upnest.edu.modules.social.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Báo cáo nội dung đơn giản cho SocialPostLite và SocialCommentLite.
 */
@Entity
@Table(name = "social_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialReportLite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long targetId; // ID Post/Comment

    @Column(nullable = false)
    private String targetType; // POST, COMMENT

    private Long reporterId;

    private String reason; // INAPPROPRIATE, VIOLENCE, ADULT_CONTENT, SPAM

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

