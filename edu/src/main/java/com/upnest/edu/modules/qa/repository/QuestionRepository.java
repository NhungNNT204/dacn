package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.Question;
import com.upnest.edu.modules.qa.entity.QuestionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository: QuestionRepository
 * Xử lý các truy vấn CRUD và custom queries cho Question
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    /**
     * Tìm tất cả câu hỏi theo status với phân trang
     */
    Page<Question> findByStatus(QuestionStatus status, Pageable pageable);
    
    /**
     * Tìm câu hỏi của một user
     */
    Page<Question> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Tìm câu hỏi trong một khóa học
     */
    Page<Question> findByCourseId(Long courseId, Pageable pageable);
    
    /**
     * Tìm câu hỏi theo tiêu đề (tìm kiếm)
     */
    Page<Question> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    /**
     * Tìm câu hỏi theo tags
     */
    @Query("SELECT q FROM Question q WHERE q.tags LIKE %:tag%")
    Page<Question> findByTag(@Param("tag") String tag, Pageable pageable);
    
    /**
     * Tìm câu hỏi nổi bật (nhiều view, nhiều like)
     */
    @Query("SELECT q FROM Question q ORDER BY q.viewCount DESC, q.likeCount DESC")
    Page<Question> findTrendingQuestions(Pageable pageable);
    
    /**
     * Đếm câu hỏi theo user
     */
    Long countByUserId(Long userId);
    
    /**
     * Đếm câu hỏi theo khóa học
     */
    Long countByCourseId(Long courseId);
    
    /**
     * Tìm câu hỏi chưa có best answer
     */
    Page<Question> findByBestAnswerIdIsNull(Pageable pageable);
}
