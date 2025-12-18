package com.upnest.edu.modules.group.payload;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupUpdateRequest {
    private String name;
    private String description;
    private String coverImage;
    private String rules;
    private String category;
    private String visibility;    // PUBLIC, PRIVATE
}
