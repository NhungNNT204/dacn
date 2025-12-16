package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository: AnswerRepository
 * Xử lý các truy vấn CRUD và custom queries cho Answer
 */
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    /**
     * Tìm tất cả câu trả lời cho một câu hỏi
     */
    Page<Answer> findByQuestionQuestionId(Long questionId, Pageable pageable);
    
    /**
     * Tìm câu trả lời của một user
     */
    Page<Answer> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Tìm best answer của một câu hỏi
     */
    Optional<Answer> findByQuestionQuestionIdAndIsBestAnswerTrue(Long questionId);
    
    /**
     * Tìm câu trả lời được like nhiều nhất cho một câu hỏi
     */
    @Query("SELECT a FROM Answer a WHERE a.question.questionId = :questionId ORDER BY a.likeCount DESC")
    Page<Answer> findMostLikedAnswers(@Param("questionId") Long questionId, Pageable pageable);
    
    /**
     * Đếm câu trả lời cho một câu hỏi
     */
    Long countByQuestionQuestionId(Long questionId);
    
    /**
     * Đếm câu trả lời của một user
     */
    Long countByUserId(Long userId);
    
    /**
     * Tìm tất cả best answers của user
     */
    List<Answer> findByUserIdAndIsBestAnswerTrue(Long userId);
}
