package com.upnest.edu.modules.learning.payload;

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
public class PlaylistResponse {
    private Long id;
    private Long userId;
    private Long goalId;
    private String title;
    private Integer currentIndex;
    private List<Map<String, Object>> items;
    private String currentDifficulty;
}

