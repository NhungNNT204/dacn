package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.PostReport;
import com.upnest.edu.modules.social.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostReportRepository extends JpaRepository<PostReport, Long> {
    
    /**
     * Lấy các báo cáo của một bài đăng
     */
    @Query("SELECT pr FROM PostReport pr WHERE pr.post.id = :postId ORDER BY pr.createdAt DESC")
    List<PostReport> findByPostId(@Param("postId") Long postId);
    
    /**
     * Lấy các báo cáo cần xử lý
     */
    @Query("SELECT pr FROM PostReport pr WHERE pr.status = :status ORDER BY pr.createdAt ASC")
    Page<PostReport> findByStatus(@Param("status") ReportStatus status, Pageable pageable);
    
    /**
     * Kiểm tra xem user đã báo cáo bài đăng này chưa
     */
    @Query("SELECT COUNT(pr) > 0 FROM PostReport pr WHERE pr.post.id = :postId AND pr.reporterId = :reporterId")
    Boolean hasUserReportedPost(@Param("postId") Long postId, @Param("reporterId") Long reporterId);
    
    /**
     * Lấy báo cáo của một user
     */
    @Query("SELECT pr FROM PostReport pr WHERE pr.reporterId = :userId ORDER BY pr.createdAt DESC")
    Page<PostReport> findByReporterId(@Param("userId") Long userId, Pageable pageable);
}
