package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.SocialPostLite;
import com.upnest.edu.modules.social.entity.SocialReportLite;
import com.upnest.edu.modules.social.repository.SocialPostLiteRepository;
import com.upnest.edu.modules.social.repository.SocialReportLiteRepository;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ReportService - Quản lý báo cáo vi phạm nội dung
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final SocialReportLiteRepository reportRepository;
    private final SocialPostLiteRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Báo cáo bài viết
     */
    public SocialReportLite reportPost(Long targetId, Long userId, String reason, String description) {
        SocialPostLite post = postRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SocialReportLite report = SocialReportLite.builder()
                .targetId(targetId)
                .targetType("POST")
                .reporterId(userId)
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Post {} reported by user {} for reason: {}", targetId, userId, reason);
        return reportRepository.save(report);
    }

    /**
     * Lấy tất cả báo cáo
     */
    public Page<SocialReportLite> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }

    /**
     * Lấy báo cáo chưa xử lý
     */
    public Page<SocialReportLite> getPendingReports(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }

    /**
     * Lấy số báo cáo của một bài viết
     */
    public long getReportCountByPost(Long postId) {
        List<SocialReportLite> reports = reportRepository.findAll();
        return reports.stream()
                .filter(r -> r.getTargetId().equals(postId) && "POST".equals(r.getTargetType()))
                .count();
    }

    /**
     * Duyệt báo cáo (Approve)
     */
    public void approveReport(Long reportId, String adminNotes) {
        SocialReportLite report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        // Ẩn bài viết nếu báo cáo được duyệt
        if ("POST".equals(report.getTargetType())) {
            SocialPostLite post = postRepository.findById(report.getTargetId())
                    .orElse(null);
            if (post != null) {
                post.setHidden(true);
                postRepository.save(post);
            }
        }
        
        log.info("Report {} approved. Post {} hidden.", reportId, report.getTargetId());
    }

    /**
     * Từ chối báo cáo (Reject)
     */
    public void rejectReport(Long reportId, String adminNotes) {
        SocialReportLite report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        log.info("Report {} rejected.", reportId);
    }

    /**
     * Thống kê báo cáo
     */
    public long getTotalReports() {
        return reportRepository.count();
    }

    public long getPendingReportsCount() {
        return reportRepository.count();
    }

    public long getApprovedReportsCount() {
        return reportRepository.count();
    }
}
