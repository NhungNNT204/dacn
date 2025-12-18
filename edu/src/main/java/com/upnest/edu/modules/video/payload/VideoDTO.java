package com.upnest.edu.modules.video.payload;

import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoLevel;
import com.upnest.edu.modules.video.entity.VideoStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoDTO {
    private String id;
    private String title;
    private String thumbnail;
    private Long duration;
    private VideoCategory category;
    private VideoLevel level;
    private String creatorId;
    private String creatorName;
    private String creatorAvatar;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private Double rating;
    private LocalDateTime createdAt;
    private VideoStatus status;
}
