package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.AnswerComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository: AnswerCommentRepository
 * Xử lý các truy vấn CRUD cho AnswerComment
 */
@Repository
public interface AnswerCommentRepository extends JpaRepository<AnswerComment, Long> {
    
    /**
     * Tìm tất cả bình luận trên một câu trả lời
     */
    Page<AnswerComment> findByAnswerAnswerId(Long answerId, Pageable pageable);
    
    /**
     * Tìm bình luận của một user
     */
    Page<AnswerComment> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Đếm bình luận trên một câu trả lời
     */
    Long countByAnswerAnswerId(Long answerId);
}
