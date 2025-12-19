package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonCommentDTO {
    private Long id;
    private Long lessonId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Integer likeCount;
    private Boolean isLiked;
    private String timeAgo;
    private List<LessonCommentDTO> replies;
    private LocalDateTime createdAt;
}

