package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: QuestionResponse
 * Dùng cho API response khi trả về thông tin câu hỏi
 */

@Getter
@Setter
@Builder
public class QuestionResponse {
    
    @JsonProperty("questionId")
    private Long questionId;
    
    @JsonProperty("title")
    private String title;
    
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("courseId")
    private Long courseId;
    
    @JsonProperty("tags")
    private String tags;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("viewCount")
    private Integer viewCount;
    
    @JsonProperty("likeCount")
    private Integer likeCount;
    
    @JsonProperty("answerCount")
    private Long answerCount;
    
    @JsonProperty("commentCount")
    private Long commentCount;
    
    @JsonProperty("bestAnswerId")
    private Long bestAnswerId;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
