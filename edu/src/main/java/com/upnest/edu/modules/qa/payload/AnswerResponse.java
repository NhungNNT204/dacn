package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: AnswerResponse
 * Dùng cho API response khi trả về thông tin câu trả lời
 */

@Getter
@Setter
@Builder
public class AnswerResponse {
    
    @JsonProperty("answerId")
    private Long answerId;
    
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("questionId")
    private Long questionId;
    
    @JsonProperty("isBestAnswer")
    private Boolean isBestAnswer;
    
    @JsonProperty("likeCount")
    private Integer likeCount;
    
    @JsonProperty("commentCount")
    private Long commentCount;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
