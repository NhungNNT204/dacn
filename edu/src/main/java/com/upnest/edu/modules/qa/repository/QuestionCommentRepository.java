package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.QuestionComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository: QuestionCommentRepository
 * Xử lý các truy vấn CRUD cho QuestionComment
 */
@Repository
public interface QuestionCommentRepository extends JpaRepository<QuestionComment, Long> {
    
    /**
     * Tìm tất cả bình luận trên một câu hỏi
     */
    Page<QuestionComment> findByQuestionQuestionId(Long questionId, Pageable pageable);
    
    /**
     * Tìm bình luận của một user
     */
    Page<QuestionComment> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Đếm bình luận trên một câu hỏi
     */
    Long countByQuestionQuestionId(Long questionId);
}
