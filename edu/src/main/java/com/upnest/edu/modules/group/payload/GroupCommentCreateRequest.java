package com.upnest.edu.modules.group.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupCommentCreateRequest {
    private String content;
    private String mediaUrl;
}
