package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: QuestionRequest
 * Dùng cho API request khi tạo hoặc cập nhật câu hỏi
 */

@Getter
@Setter
public class QuestionRequest {
    
    /**
     * Tiêu đề câu hỏi (bắt buộc, max 500 ký tự)
     */
    @JsonProperty("title")
    private String title;
    
    /**
     * Nội dung chi tiết của câu hỏi (bắt buộc)
     */
    @JsonProperty("content")
    private String content;
    
    /**
     * ID khóa học liên quan (tùy chọn)
     */
    @JsonProperty("courseId")
    private Long courseId;
    
    /**
     * Tags để phân loại (ví dụ: "Java,Spring,Database", tùy chọn)
     */
    @JsonProperty("tags")
    private String tags;
}
