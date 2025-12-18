package com.upnest.edu.modules.social.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddReplyRequest {
    private String content;
    private String mediaUrl;
}
