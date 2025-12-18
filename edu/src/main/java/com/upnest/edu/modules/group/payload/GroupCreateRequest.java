package com.upnest.edu.modules.group.payload;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupCreateRequest {
    private String name;
    private String description;
    private String avatar;
    private String groupType;    // STUDY, SOCIAL, PROJECT, etc.
    private String category;     // Category of the group
    private String rules;        // Group rules
    private List<Long> initialMemberIds;
    private String visibility;   // PUBLIC, PRIVATE
}
