package com.upnest.edu.modules.qa.repository;

import com.upnest.edu.modules.qa.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository: VoteRepository
 * Xử lý database operations cho Vote
 */
@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    /**
     * Tìm vote của user cho question
     */
    Optional<Vote> findByUserIdAndQuestionId(Long userId, Long questionId);
    
    /**
     * Tìm vote của user cho answer
     */
    Optional<Vote> findByUserIdAndAnswerId(Long userId, Long answerId);
    
    /**
     * Đếm tổng điểm vote cho question
     * UPVOTE = +1, DOWNVOTE = -1
     */
    @Query("SELECT COALESCE(SUM(CASE WHEN v.voteType = 'UPVOTE' THEN 1 ELSE -1 END), 0) " +
           "FROM Vote v WHERE v.questionId = :questionId")
    Long countVoteScoreByQuestionId(@Param("questionId") Long questionId);
    
    /**
     * Đếm tổng điểm vote cho answer
     */
    @Query("SELECT COALESCE(SUM(CASE WHEN v.voteType = 'UPVOTE' THEN 1 ELSE -1 END), 0) " +
           "FROM Vote v WHERE v.answerId = :answerId")
    Long countVoteScoreByAnswerId(@Param("answerId") Long answerId);
    
    /**
     * Đếm số upvote cho question
     */
    Long countByQuestionIdAndVoteType(Long questionId, Vote.VoteType voteType);
    
    /**
     * Đếm số upvote cho answer
     */
    Long countByAnswerIdAndVoteType(Long answerId, Vote.VoteType voteType);
    
    /**
     * Xóa tất cả votes của question
     */
    void deleteAllByQuestionId(Long questionId);
    
    /**
     * Xóa tất cả votes của answer
     */
    void deleteAllByAnswerId(Long answerId);
}

