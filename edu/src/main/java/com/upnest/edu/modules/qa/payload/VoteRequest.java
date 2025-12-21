package com.upnest.edu.modules.qa.payload;

import lombok.*;

/**
 * Request payload cho bình chọn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {
    
    /**
     * Loại vote: "UPVOTE" hoặc "DOWNVOTE"
     */
    private String voteType;
    
    /**
     * ID câu hỏi (nếu vote cho question)
     */
    private Long questionId;
    
    /**
     * ID câu trả lời (nếu vote cho answer)
     */
    private Long answerId;
}

