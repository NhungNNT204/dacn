package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.QuestionReaction;
import com.upnest.edu.modules.qa.entity.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository: QuestionReactionRepository
 * Xử lý các truy vấn CRUD cho QuestionReaction
 */
@Repository
public interface QuestionReactionRepository extends JpaRepository<QuestionReaction, Long> {
    
    /**
     * Tìm reaction của user trên một câu hỏi
     */
    Optional<QuestionReaction> findByQuestionQuestionIdAndUserId(Long questionId, Long userId);
    
    /**
     * Đếm LIKE trên một câu hỏi
     */
    Long countByQuestionQuestionIdAndReactionType(Long questionId, ReactionType reactionType);
    
    /**
     * Tìm tất cả reactions trên một câu hỏi
     */
    List<QuestionReaction> findByQuestionQuestionId(Long questionId);
}
