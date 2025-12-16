package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: QuestionComment (Bình luận trên Câu hỏi)
 * Lưu trữ bình luận chi tiết dưới một câu hỏi
 * 
 * Quan hệ:
 * - N QuestionComments thuộc về 1 Question
 * - 1 User tạo nhiều QuestionComments
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question_comments", indexes = {
    @Index(name = "idx_question_id", columnList = "question_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class QuestionComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;
    
    /**
     * Nội dung bình luận
     */
    @Column(name = "content", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;
    
    /**
     * Người bình luận
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Câu hỏi được bình luận
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
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
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
