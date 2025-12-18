package com.upnest.edu.modules.video.payload;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoCommentDTO {
    private String id;
    private String videoId;
    private String authorId;
    private String authorName;
    private String authorAvatar;
    private String content;
    private Long likeCount;
    private boolean isEdited;
    private String parentCommentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
