package com.upnest.edu.modules.social.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AddReactionRequest - Request thêm reaction vào bài viết hoặc tin nhắn
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddReactionRequest {
    private Long itemId;         // ID bài viết hoặc tin nhắn
    private String emoji;        // Emoji reaction (😂, ❤️, etc.)
    private String reactionType; // LIKE, LOVE, HAHA, etc.
}
