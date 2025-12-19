package com.upnest.edu.modules.profile.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDTO {
    private String name;
    private Integer level; // 0-100
}

