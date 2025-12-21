package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: Vote (Bình chọn)
 * Lưu trữ thông tin bình chọn upvote/downvote cho Question và Answer
 * 
 * Quan hệ:
 * - 1 User có nhiều Votes
 * - 1 Question có nhiều Votes
 * - 1 Answer có nhiều Votes
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "votes", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_question_id", columnList = "question_id"),
    @Index(name = "idx_answer_id", columnList = "answer_id"),
    @Index(name = "idx_user_question", columnList = "user_id, question_id", unique = true),
    @Index(name = "idx_user_answer", columnList = "user_id, answer_id", unique = true)
})
public class Vote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Long voteId;
    
    /**
     * Người bình chọn
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Câu hỏi được bình chọn (nullable - nếu vote cho Answer thì null)
     */
    @Column(name = "question_id")
    private Long questionId;
    
    /**
     * Câu trả lời được bình chọn (nullable - nếu vote cho Question thì null)
     */
    @Column(name = "answer_id")
    private Long answerId;
    
    /**
     * Loại vote: UPVOTE (1) hoặc DOWNVOTE (-1)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "vote_type", nullable = false)
    private VoteType voteType;
    
    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Thời gian cập nhật (khi user đổi vote)
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Enum cho loại vote
     */
    public enum VoteType {
        UPVOTE(1),
        DOWNVOTE(-1);
        
        private final int value;
        
        VoteType(int value) {
            this.value = value;
        }
        
        public int getValue() {
            return value;
        }
    }
}

