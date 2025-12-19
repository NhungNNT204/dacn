package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EarlyAlertResponse {
    private Long id;
    private Long userId;
    private String alertType;
    private String severity;
    private String title;
    private String description;
    private String suggestedAction;
    private String status;
    private LocalDateTime createdAt;
}

