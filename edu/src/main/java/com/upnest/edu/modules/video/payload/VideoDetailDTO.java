package com.upnest.edu.modules.video.payload;

import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoLevel;
import com.upnest.edu.modules.video.entity.VideoStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoDetailDTO {
    private String id;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnail;
    private Long duration;
    private VideoCategory category;
    private VideoLevel level;
    private String language;
    private List<String> tags;
    private String creatorId;
    private String creatorName;
    private String creatorAvatar;
    private String creatorBio;
    private Long viewCount;
    private Long likeCount;
    private Long shareCount;
    private Long commentCount;
    private Double rating;
    private boolean isLiked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private VideoStatus status;
}
