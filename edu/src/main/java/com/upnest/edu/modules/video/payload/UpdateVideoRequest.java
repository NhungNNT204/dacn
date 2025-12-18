package com.upnest.edu.modules.video.payload;

import com.upnest.edu.modules.video.entity.VideoCategory;
import com.upnest.edu.modules.video.entity.VideoLevel;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateVideoRequest {
    private String title;
    private String description;
    private VideoCategory category;
    private VideoLevel level;
    private String language;
    private List<String> tags;
}
