package com.upnest.edu.modules.social.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddCommentRequest {
    private String content;
    private String imageUrl;
}
