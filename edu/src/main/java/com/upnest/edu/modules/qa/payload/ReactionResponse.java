package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: ReactionResponse
 * Dùng cho API response khi trả về thông tin phản ứng
 */

@Getter
@Setter
@Builder
public class ReactionResponse {
    
    @JsonProperty("reactionId")
    private Long reactionId;
    
    @JsonProperty("reactionType")
    private String reactionType;
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
