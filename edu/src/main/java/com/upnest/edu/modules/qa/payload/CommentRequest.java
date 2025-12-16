package com.upnest.edu.modules.qa.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO: CommentRequest
 * Dùng cho API request khi tạo bình luận
 */

@Getter
@Setter
public class CommentRequest {
    
    /**
     * Nội dung bình luận (bắt buộc)
     */
    @JsonProperty("content")
    private String content;
}
