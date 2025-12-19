package com.upnest.edu.modules.learning.payload;

import com.upnest.edu.modules.learning.entity.SkillsAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillsAuditResponse {
    private Long id;
    private Long userId;
    private String personaType;
    private Integer overallScore;
    private Map<String, Integer> skillScores;
    private List<String> strengths;
    private List<String> knowledgeGaps;
    private List<String> recommendations;
}

