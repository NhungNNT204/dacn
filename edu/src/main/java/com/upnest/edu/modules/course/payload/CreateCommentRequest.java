package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {
    private String content;
    private Long parentId; // Optional, for replies
}

