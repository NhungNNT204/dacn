package com.upnest.edu.modules.social.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * ModerationService - Kiểm tra nhanh nội dung text theo danh sách từ khóa cấm.
 * Giữ nguyên logic từ snippet người dùng cung cấp.
 */
@Service
public class ModerationService {
    private static final List<String> BANNED_KEYWORDS = Arrays.asList(
            "18+", "sexy", "porn", "chết", "giết", "đánh nhau", "kích động",
            "quảng cáo", "mua ngay", "kiếm tiền online", "spam", "máu me"
    );

    public ModerationResult validateContent(String text) {
        if (text == null || text.isEmpty()) {
            return new ModerationResult(true, null);
        }

        String lowerText = text.toLowerCase();
        for (String word : BANNED_KEYWORDS) {
            if (lowerText.contains(word)) {
                return new ModerationResult(false, "Phát hiện nội dung vi phạm tiêu chuẩn: " + word);
            }
        }
        return new ModerationResult(true, null);
    }

    @Getter
    @AllArgsConstructor
    public static class ModerationResult {
        private final boolean valid;
        private final String reason;
    }
}

