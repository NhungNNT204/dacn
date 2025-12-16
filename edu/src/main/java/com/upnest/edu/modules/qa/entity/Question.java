package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity: Question (Câu hỏi)
 * Lưu trữ thông tin câu hỏi trong hệ thống Q&A Realtime
 * 
 * Quan hệ:
 * - 1 User tạo nhiều Questions
 * - 1 Question có nhiều Answers
 * - 1 Question có nhiều Comments
 * - 1 Question có nhiều Reactions
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_course_id", columnList = "course_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_status", columnList = "status")
})
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;
    
    /**
     * Tiêu đề câu hỏi (NOT NULL)
     */
    @Column(name = "title", nullable = false, length = 500)
    private String title;
    
    /**
     * Nội dung chi tiết của câu hỏi
     */
    @Column(name = "content", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;
    
    /**
     * Người tạo câu hỏi (User ID)
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Khóa học liên quan (nếu có)
     */
    @Column(name = "course_id")
    private Long courseId;
    
    /**
     * Chủ đề/Tag (ví dụ: "Java", "Spring Boot", "Database")
     */
    @Column(name = "tags", length = 500)
    private String tags;
    
    /**
     * Trạng thái câu hỏi: OPEN, ANSWERED, CLOSED
     */
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private QuestionStatus status = QuestionStatus.OPEN;
    
    /**
     * Số lượt view
     */
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    /**
     * Số lần được yêu thích
     */
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    /**
     * Câu trả lời được chọn làm best answer
     */
    @Column(name = "best_answer_id")
    private Long bestAnswerId;
    
    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Thời gian cập nhật
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    /**
     * Câu trả lời (1-N)
     */
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Answer> answers = new HashSet<>();
    
    /**
     * Bình luận (1-N)
     */
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<QuestionComment> comments = new HashSet<>();
    
    /**
     * Phản ứng (Like/Dislike)
     */
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<QuestionReaction> reactions = new HashSet<>();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
