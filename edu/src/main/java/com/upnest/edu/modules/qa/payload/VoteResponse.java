package com.upnest.edu.modules.qa.payload;

import lombok.*;

/**
 * Response payload cho vote
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    
    private Long questionId;
    private Long answerId;
    private Long voteScore;
    private String userVoteType; // "UPVOTE", "DOWNVOTE", or null
    private String message;
}

