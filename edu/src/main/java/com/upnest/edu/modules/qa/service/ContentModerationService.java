package com.upnest.edu.modules.qa.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Service: ContentModerationService
 * Kiểm duyệt nội dung tự động
 * 
 * Chức năng:
 * - Lọc từ ngữ không phù hợp
 * - Phát hiện spam
 * - Kiểm tra độ dài nội dung
 * - Kiểm tra link độc hại
 * - Đánh giá chất lượng nội dung
 */
@Slf4j
@Service
public class ContentModerationService {
    
    // Danh sách từ khóa cấm (Vietnamese + English)
    private static final Set<String> BANNED_WORDS = new HashSet<>(Arrays.asList(
        // Thêm các từ không phù hợp vào đây
        "spam", "scam", "hack", "cheat", "đmm", "vcl", "wtf"
        // Note: Trong production, nên lưu trong database để dễ quản lý
    ));
    
    // Các pattern spam phổ biến
    private static final List<Pattern> SPAM_PATTERNS = Arrays.asList(
        Pattern.compile("(.)\\1{5,}"), // Ký tự lặp quá nhiều: "aaaaaa"
        Pattern.compile("https?://[^\\s]+\\s+https?://[^\\s]+"), // Nhiều link
        Pattern.compile("(?i)(buy|click|discount|free).{0,20}(now|here|link)") // Spam marketing
    );
    
    /**
     * Kiểm tra và lọc nội dung
     * @param content Nội dung cần kiểm tra
     * @return ModerationResult
     */
    public ModerationResult moderateContent(String content) {
        log.info("Moderating content: {} chars", content.length());
        
        ModerationResult result = ModerationResult.builder()
                .approved(true)
                .build();
        
        List<String> issues = new ArrayList<>();
        
        // 1. Kiểm tra độ dài
        if (content.length() < 10) {
            issues.add("Nội dung quá ngắn (tối thiểu 10 ký tự)");
            result.setApproved(false);
        }
        
        if (content.length() > 10000) {
            issues.add("Nội dung quá dài (tối đa 10,000 ký tự)");
            result.setApproved(false);
        }
        
        // 2. Kiểm tra từ cấm
        String contentLower = content.toLowerCase();
        List<String> foundBannedWords = new ArrayList<>();
        for (String bannedWord : BANNED_WORDS) {
            if (contentLower.contains(bannedWord)) {
                foundBannedWords.add(bannedWord);
            }
        }
        
        if (!foundBannedWords.isEmpty()) {
            issues.add("Phát hiện từ không phù hợp: " + String.join(", ", foundBannedWords));
            result.setApproved(false);
            result.setFilteredContent(filterBannedWords(content));
        }
        
        // 3. Kiểm tra spam patterns
        for (Pattern pattern : SPAM_PATTERNS) {
            if (pattern.matcher(content).find()) {
                issues.add("Phát hiện nội dung spam");
                result.setApproved(false);
                result.setSpamScore(result.getSpamScore() + 20);
            }
        }
        
        // 4. Kiểm tra ALL CAPS (viết hoa toàn bộ)
        long capsCount = content.chars().filter(Character::isUpperCase).count();
        long letterCount = content.chars().filter(Character::isLetter).count();
        if (letterCount > 20 && capsCount > letterCount * 0.7) {
            issues.add("Nội dung có quá nhiều chữ viết hoa");
            result.setSpamScore(result.getSpamScore() + 10);
        }
        
        // 5. Tính spam score
        int linkCount = countLinks(content);
        if (linkCount > 3) {
            issues.add("Quá nhiều link trong nội dung");
            result.setSpamScore(result.getSpamScore() + (linkCount * 5));
        }
        
        // Nếu spam score > 50 → Từ chối
        if (result.getSpamScore() > 50) {
            result.setApproved(false);
            issues.add("Điểm spam quá cao: " + result.getSpamScore());
        }
        
        result.setIssues(issues);
        result.setFilteredContent(result.getFilteredContent() != null ? 
                                  result.getFilteredContent() : content);
        
        log.info("Moderation result: approved={}, issues={}, spamScore={}", 
                 result.isApproved(), issues.size(), result.getSpamScore());
        
        return result;
    }
    
    /**
     * Lọc từ cấm ra khỏi nội dung
     */
    private String filterBannedWords(String content) {
        String filtered = content;
        for (String bannedWord : BANNED_WORDS) {
            filtered = filtered.replaceAll("(?i)" + Pattern.quote(bannedWord), "***");
        }
        return filtered;
    }
    
    /**
     * Đếm số lượng link trong nội dung
     */
    private int countLinks(String content) {
        Pattern linkPattern = Pattern.compile("https?://[^\\s]+");
        java.util.regex.Matcher matcher = linkPattern.matcher(content);
        int count = 0;
        while (matcher.find()) {
            count++;
        }
        return count;
    }
    
    /**
     * Data class cho kết quả kiểm duyệt
     */
    @lombok.Data
    @lombok.Builder
    public static class ModerationResult {
        /**
         * Nội dung có được phê duyệt không
         */
        private boolean approved;
        
        /**
         * Điểm spam (0-100, càng cao càng spam)
         */
        @lombok.Builder.Default
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
        @lombok.Builder.Default
        private boolean requiresManualReview = false;
    }
}

