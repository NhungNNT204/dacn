package com.upnest.edu.modules.qa.entity;

/**
 * Enum: QuestionStatus
 * Các trạng thái có thể của một câu hỏi
 */
public enum QuestionStatus {
    /**
     * Câu hỏi mới được tạo, chờ câu trả lời
     */
    OPEN("Mở"),
    
    /**
     * Có ít nhất một câu trả lời
     */
    ANSWERED("Có câu trả lời"),
    
    /**
     * Câu hỏi đã được đóng, không nhận thêm câu trả lời
     */
    CLOSED("Đóng");
    
    private final String description;
    
    QuestionStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
