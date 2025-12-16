package com.upnest.edu.modules.qa.entity;

/**
 * Enum: ReactionType
 * Các loại phản ứng có thể trên Question/Answer
 */
public enum ReactionType {
    /**
     * Like - Thích
     */
    LIKE("Thích"),
    
    /**
     * Dislike - Không thích
     */
    DISLIKE("Không thích");
    
    private final String description;
    
    ReactionType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
