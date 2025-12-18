package com.upnest.edu.modules.chat.repository;

import com.upnest.edu.modules.chat.entity.CallRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * CallRecordRepository - Quản lý lịch sử cuộc gọi
 */
@Repository
public interface CallRecordRepository extends JpaRepository<CallRecord, Long> {
    
    // Lấy lịch sử gọi của group chat
    @Query("SELECT cr FROM CallRecord cr WHERE cr.chatGroupId = :chatGroupId " +
           "ORDER BY cr.createdAt DESC")
    Page<CallRecord> findByChatGroupId(@Param("chatGroupId") Long chatGroupId, Pageable pageable);
    
    // Lấy các cuộc gọi của user
    @Query("SELECT cr FROM CallRecord cr WHERE cr.callerId = :userId OR cr.receiverId = :userId " +
           "ORDER BY cr.createdAt DESC")
    List<CallRecord> findCallsByUser(@Param("userId") Long userId);
    
    // Lấy cuộc gọi missed
    @Query("SELECT cr FROM CallRecord cr WHERE (cr.receiverId = :userId AND cr.isMissed = true) " +
           "ORDER BY cr.createdAt DESC")
    List<CallRecord> findMissedCalls(@Param("userId") Long userId);
    
    // Lấy cuộc gọi trong khoảng thời gian
    @Query("SELECT cr FROM CallRecord cr WHERE cr.callerId = :userId " +
           "AND cr.createdAt BETWEEN :startDate AND :endDate ORDER BY cr.createdAt DESC")
    List<CallRecord> findCallsInDateRange(@Param("userId") Long userId, 
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    // Tính tổng thời gian gọi
    @Query("SELECT SUM(cr.durationSeconds) FROM CallRecord cr WHERE cr.callerId = :userId " +
           "AND cr.status = 'ENDED'")
    Long getTotalCallDuration(@Param("userId") Long userId);
}
