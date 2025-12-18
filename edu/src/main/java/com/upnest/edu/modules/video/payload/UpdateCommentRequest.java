package com.upnest.edu.modules.video.payload;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCommentRequest {
    private String content;
}
