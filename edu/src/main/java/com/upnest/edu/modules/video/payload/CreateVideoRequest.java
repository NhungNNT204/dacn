package com.upnest.edu.modules.video.payload;

import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoLevel;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVideoRequest {
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnail;
    private Long duration;
    private VideoCategory category;
    private VideoLevel level;
    private String language;
    private List<String> tags;
}
