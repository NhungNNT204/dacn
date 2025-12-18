package com.upnest.edu.modules.group.payload;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupPostCreateRequest {
    private String content;
    private List<Long> mediaIds;
}
