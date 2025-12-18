package com.upnest.edu.modules.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * PostReport Entity - Báo cáo nội dung vi phạm
 */
@Entity
@Table(name = "post_reports", indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_reporter_id", columnList = "reporter_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("reports")
    private Post post;
    
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;
    
    @Column(name = "reporter_name")
    private String reporterName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "report_type")
    private ReportType reportType;
    
    @Column(columnDefinition = "LONGTEXT")
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReportStatus status = ReportStatus.PENDING;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
