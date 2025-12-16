package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.AnswerReaction;
import com.upnest.edu.modules.qa.entity.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository: AnswerReactionRepository
 * Xử lý các truy vấn CRUD cho AnswerReaction
 */
@Repository
public interface AnswerReactionRepository extends JpaRepository<AnswerReaction, Long> {
    
    /**
     * Tìm reaction của user trên một câu trả lời
     */
    Optional<AnswerReaction> findByAnswerAnswerIdAndUserId(Long answerId, Long userId);
    
    /**
     * Đếm LIKE trên một câu trả lời
     */
    Long countByAnswerAnswerIdAndReactionType(Long answerId, ReactionType reactionType);
    
    /**
     * Tìm tất cả reactions trên một câu trả lời
     */
    List<AnswerReaction> findByAnswerAnswerId(Long answerId);
}
