package com.upnest.edu.modules.qa.service;

import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * Data class cho kết quả kiểm duyệt
 */
@Data
@Builder
public class ModerationResult {
    /**
     * Nội dung có được phê duyệt không
     */
    private boolean approved;

    /**
     * Điểm spam (0-100, càng cao càng spam)
     */
    @Builder.Default
    private int spamScore = 0;

    /**
     * Danh sách vấn đề phát hiện
     */
    private List<String> issues;

    /**
     * Nội dung đã được lọc (nếu có từ cấm)
     */
    private String filteredContent;

    /**
     * Yêu cầu kiểm duyệt thủ công
     */
    @Builder.Default
    private boolean requiresManualReview = false;
}
// Deprecated - use QAContentModerationService instead 
