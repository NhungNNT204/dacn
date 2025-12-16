package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity: Answer (Câu trả lời)
 * Lưu trữ thông tin câu trả lời cho một câu hỏi
 * 
 * Quan hệ:
 * - 1 User có nhiều Answers
 * - N Answers thuộc về 1 Question
 * - 1 Answer có nhiều Comments
 * - 1 Answer có nhiều Reactions
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answers", indexes = {
    @Index(name = "idx_question_id", columnList = "question_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_is_best", columnList = "is_best_answer")
})
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;
    
    /**
     * Nội dung câu trả lời
     */
    @Column(name = "content", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;
    
    /**
     * Người trả lời
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Câu hỏi mà đây là câu trả lời (Foreign Key)
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    /**
     * Flag: Đây có phải Best Answer không?
     */
    @Column(name = "is_best_answer")
    private Boolean isBestAnswer = false;
    
    /**
     * Số lượt like
     */
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
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
     * Bình luận trên câu trả lời (1-N)
     */
    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<AnswerComment> comments = new HashSet<>();
    
    /**
     * Phản ứng trên câu trả lời
     */
    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<AnswerReaction> reactions = new HashSet<>();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
