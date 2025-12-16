package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: AnswerRequest
 * Dùng cho API request khi tạo hoặc cập nhật câu trả lời
 */

@Getter
@Setter
public class AnswerRequest {
    
    /**
     * Nội dung câu trả lời (bắt buộc)
     */
    @JsonProperty("content")
    private String content;
}
