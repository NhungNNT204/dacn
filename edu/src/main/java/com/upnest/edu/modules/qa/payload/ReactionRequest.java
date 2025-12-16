package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO: ReactionRequest
 * Dùng cho API request khi tạo hoặc cập nhật phản ứng (Like/Dislike)
 */

@Getter
@Setter
public class ReactionRequest {
    
    /**
     * Loại phản ứng: LIKE, DISLIKE (bắt buộc)
     */
    @JsonProperty("reactionType")
    private String reactionType;
}
