package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: AnswerReaction (Phản ứng trên Câu trả lời - Like/Dislike)
 * Lưu trữ phản ứng (like/dislike) của user trên một câu trả lời
 * 
 * Constraint: Mỗi user chỉ có tối đa 1 reaction cho mỗi answer
 * Quan hệ:
 * - N AnswerReactions thuộc về 1 Answer
 * - 1 User tạo nhiều AnswerReactions
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answer_reactions", indexes = {
    @Index(name = "idx_answer_id", columnList = "answer_id"),
    @Index(name = "idx_user_id", columnList = "user_id")
},
uniqueConstraints = {
    @UniqueConstraint(name = "uc_answer_user_reaction", columnNames = {"answer_id", "user_id"})
})
public class AnswerReaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reaction_id")
    private Long reactionId;
    
    /**
     * Loại phản ứng: LIKE, DISLIKE
     */
    @Column(name = "reaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReactionType reactionType;
    
    /**
     * Người phản ứng
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Câu trả lời được phản ứng
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;
    
    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
