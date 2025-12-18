package com.upnest.edu.modules.social.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * PostDTO - Data Transfer Object cho Post
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorAvatar;
    private String authorType;
    
    private String content;
    private String postType;
    private String imageUrl;
    private String videoUrl;
    private String videoThumbnail;
    
    private Integer likeCount;
    private Integer commentCount;
    private Integer shareCount;
    private Integer viewCount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private Boolean isSaved;
    private Boolean isLiked;
    private String userReactionType;
    
    private List<PostCommentDTO> recentComments;
    private List<String> reactionTypes;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class PostCommentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private String imageUrl;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private Boolean isReply;
    private Long parentCommentId;
    private List<PostCommentDTO> replies;
}
