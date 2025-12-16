package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: CommentResponse
 * Dùng cho API response khi trả về thông tin bình luận
 */

@Getter
@Setter
@Builder
public class CommentResponse {
    
    @JsonProperty("commentId")
    private Long commentId;
    
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
