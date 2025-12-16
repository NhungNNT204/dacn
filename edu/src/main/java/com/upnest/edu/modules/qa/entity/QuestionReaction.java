package com.upnest.edu.modules.qa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity: QuestionReaction (Phản ứng trên Câu hỏi - Like/Dislike)
 * Lưu trữ phản ứng (like/dislike) của user trên một câu hỏi
 * 
 * Constraint: Mỗi user chỉ có tối đa 1 reaction cho mỗi question
 * Quan hệ:
 * - N QuestionReactions thuộc về 1 Question
 * - 1 User tạo nhiều QuestionReactions
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question_reactions", indexes = {
    @Index(name = "idx_question_id", columnList = "question_id"),
    @Index(name = "idx_user_id", columnList = "user_id")
},
uniqueConstraints = {
    @UniqueConstraint(name = "uc_question_user_reaction", columnNames = {"question_id", "user_id"})
})
public class QuestionReaction {
    
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
     * Câu hỏi được phản ứng
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    /**
     * Thời gian tạo
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
