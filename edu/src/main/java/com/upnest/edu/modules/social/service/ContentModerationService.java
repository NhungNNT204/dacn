package com.upnest.edu.modules.social.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * ContentModerationService - Kiểm tra nội dung vi phạm tiêu chuẩn cộng đồng
 * Sử dụng keyword matching và pattern detection
 * Trong production, nên tích hợp với AI/ML service như Google Cloud Vision API, AWS Rekognition
 */
@Slf4j
@Service
public class ContentModerationService {
    
    // Danh sách từ khóa vi phạm (kích động, bạo lực, 18+)
    private static final List<String> VIOLENT_KEYWORDS = Arrays.asList(
        "giết", "chết", "máu", "bạo lực", "đánh nhau", "chiến tranh", "súng", "dao",
        "bom", "nổ", "tấn công", "hành hung", "tra tấn", "hãm hiếp", "cưỡng bức",
        "kích động", "thù hận", "phân biệt đối xử", "khủng bố", "tự sát"
    );
    
    private static final List<String> ADULT_KEYWORDS = Arrays.asList(
        "sex", "tình dục", "khiêu dâm", "nude", "khỏa thân", "18+", "xxx",
        "porn", "adult", "mature", "explicit"
    );
    
    private static final List<String> SPAM_KEYWORDS = Arrays.asList(
        "click here", "free money", "get rich", "miễn phí ngay", "quảng cáo",
        "spam", "scam", "lừa đảo"
    );
    
    // Pattern để detect URL spam
    private static final Pattern URL_PATTERN = Pattern.compile(
        "(?i)\\b(https?://)?(www\\.)?[a-z0-9-]+\\.[a-z]{2,}(/[^\\s]*)?"
    );
    
    /**
     * Kiểm tra nội dung text có vi phạm không
     * @param content Nội dung text
     * @return ViolationResult với thông tin vi phạm
     */
    public ViolationResult checkTextContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return ViolationResult.safe();
        }
        
        String lowerContent = content.toLowerCase();
        
        // Kiểm tra từ khóa bạo lực/kích động
        for (String keyword : VIOLENT_KEYWORDS) {
            if (lowerContent.contains(keyword.toLowerCase())) {
                log.warn("Violent keyword detected: {}", keyword);
                String violationDetails = String.format(
                    "Từ khóa vi phạm: \"%s\"\nLoại vi phạm: Bạo lực/Kích động\nMô tả: Nội dung chứa từ ngữ kích động, bạo lực không phù hợp với tiêu chuẩn cộng đồng giáo dục.",
                    keyword
                );
                return ViolationResult.violation(
                    "Nội dung chứa từ ngữ kích động, bạo lực không phù hợp với tiêu chuẩn cộng đồng",
                    ViolationType.VIOLENCE,
                    keyword,
                    violationDetails
                );
            }
        }
        
        // Kiểm tra từ khóa 18+
        for (String keyword : ADULT_KEYWORDS) {
            if (lowerContent.contains(keyword.toLowerCase())) {
                log.warn("Adult keyword detected: {}", keyword);
                String violationDetails = String.format(
                    "Từ khóa vi phạm: \"%s\"\nLoại vi phạm: Nội dung 18+\nMô tả: Nội dung không phù hợp với độ tuổi, vi phạm tiêu chuẩn cộng đồng giáo dục. Vui lòng chỉ chia sẻ nội dung phù hợp với môi trường học tập.",
                    keyword
                );
                return ViolationResult.violation(
                    "Nội dung không phù hợp với độ tuổi, vi phạm tiêu chuẩn cộng đồng",
                    ViolationType.ADULT_CONTENT,
                    keyword,
                    violationDetails
                );
            }
        }
        
        // Kiểm tra spam
        int spamCount = 0;
        for (String keyword : SPAM_KEYWORDS) {
            if (lowerContent.contains(keyword.toLowerCase())) {
                spamCount++;
            }
        }
        if (spamCount >= 2) {
            log.warn("Spam content detected");
            return ViolationResult.violation(
                "Nội dung có dấu hiệu spam, quảng cáo không phù hợp",
                ViolationType.SPAM
            );
        }
        
        // Kiểm tra quá nhiều URL (spam)
        long urlCount = URL_PATTERN.matcher(content).results().count();
        if (urlCount > 3) {
            log.warn("Too many URLs detected: {}", urlCount);
            return ViolationResult.violation(
                "Nội dung chứa quá nhiều liên kết, có dấu hiệu spam",
                ViolationType.SPAM
            );
        }
        
        return ViolationResult.safe();
    }
    
    /**
     * Kiểm tra ảnh có vi phạm không
     * Trong production, nên sử dụng Google Cloud Vision API hoặc AWS Rekognition
     * @param imageUrl URL của ảnh
     * @return ViolationResult
     */
    public ViolationResult checkImageContent(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ViolationResult.safe();
        }
        
        // TODO: Tích hợp với AI/ML service để detect:
        // - Explicit content (nude, sexual content)
        // - Violence (blood, weapons, fighting)
        // - Inappropriate content
        
        // Hiện tại chỉ check URL pattern (tạm thời)
        String lowerUrl = imageUrl.toLowerCase();
        if (lowerUrl.contains("adult") || lowerUrl.contains("xxx") || 
            lowerUrl.contains("porn") || lowerUrl.contains("explicit")) {
            log.warn("Suspicious image URL detected: {}", imageUrl);
            return ViolationResult.violation(
                "Ảnh có dấu hiệu chứa nội dung không phù hợp",
                ViolationType.ADULT_CONTENT
            );
        }
        
        return ViolationResult.safe();
    }
    
    /**
     * Kiểm tra video có vi phạm không
     * @param videoUrl URL của video
     * @return ViolationResult
     */
    public ViolationResult checkVideoContent(String videoUrl) {
        if (videoUrl == null || videoUrl.trim().isEmpty()) {
            return ViolationResult.safe();
        }
        
        // TODO: Tích hợp với video moderation service
        // Hiện tại chỉ check URL pattern
        String lowerUrl = videoUrl.toLowerCase();
        if (lowerUrl.contains("adult") || lowerUrl.contains("xxx") || 
            lowerUrl.contains("porn") || lowerUrl.contains("explicit")) {
            log.warn("Suspicious video URL detected: {}", videoUrl);
            return ViolationResult.violation(
                "Video có dấu hiệu chứa nội dung không phù hợp",
                ViolationType.ADULT_CONTENT
            );
        }
        
        return ViolationResult.safe();
    }
    
    /**
     * Kiểm tra toàn bộ nội dung bài đăng
     * @param content Nội dung text
     * @param imageUrl URL ảnh (nếu có)
     * @param videoUrl URL video (nếu có)
     * @return ViolationResult
     */
    public ViolationResult checkPostContent(String content, String imageUrl, String videoUrl) {
        // Kiểm tra text
        ViolationResult textResult = checkTextContent(content);
        if (!textResult.isSafe()) {
            return textResult;
        }
        
        // Kiểm tra ảnh
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            ViolationResult imageResult = checkImageContent(imageUrl);
            if (!imageResult.isSafe()) {
                return imageResult;
            }
        }
        
        // Kiểm tra video
        if (videoUrl != null && !videoUrl.trim().isEmpty()) {
            ViolationResult videoResult = checkVideoContent(videoUrl);
            if (!videoResult.isSafe()) {
                return videoResult;
            }
        }
        
        return ViolationResult.safe();
    }
    
    /**
     * Inner class để trả về kết quả kiểm tra
     */
    public static class ViolationResult {
        private final boolean safe;
        private final String message;
        private final ViolationType violationType;
        private final String foundKeywords; // Từ khóa vi phạm đã tìm thấy
        private final String details; // Chi tiết vi phạm
        
        private ViolationResult(boolean safe, String message, ViolationType violationType, String foundKeywords, String details) {
            this.safe = safe;
            this.message = message;
            this.violationType = violationType;
            this.foundKeywords = foundKeywords;
            this.details = details;
        }
        
        public static ViolationResult safe() {
            return new ViolationResult(true, null, null, null, null);
        }
        
        public static ViolationResult violation(String message, ViolationType type) {
            return new ViolationResult(false, message, type, null, null);
        }
        
        public static ViolationResult violation(String message, ViolationType type, String foundKeywords, String details) {
            return new ViolationResult(false, message, type, foundKeywords, details);
        }
        
        public boolean isSafe() {
            return safe;
        }
        
        public String getMessage() {
            return message;
        }
        
        public ViolationType getViolationType() {
            return violationType;
        }
        
        public String getFoundKeywords() {
            return foundKeywords;
        }
        
        public String getDetails() {
            return details;
        }
    }
    
    /**
     * Loại vi phạm
     */
    public enum ViolationType {
        VIOLENCE,      // Bạo lực, kích động
        ADULT_CONTENT, // Nội dung 18+
        SPAM,          // Spam, quảng cáo
        HARASSMENT,    // Quấy rối
        FRAUD          // Lừa đảo
    }
}

