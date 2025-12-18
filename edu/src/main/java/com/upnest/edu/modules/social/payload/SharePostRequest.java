package com.upnest.edu.modules.social.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharePostRequest {
    private String shareType;    // SHARE, REPOST, etc.
    private String shareMessage;
}
