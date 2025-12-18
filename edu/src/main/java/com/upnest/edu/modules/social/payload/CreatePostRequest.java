package com.upnest.edu.modules.social.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    private String content;
    private String postType;     // TEXT, IMAGE, VIDEO
    private String imageUrl;
    private String videoUrl;
    private String videoThumbnail;
}
