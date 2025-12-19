package com.upnest.edu.modules.learning.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningGoalRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Deadline is required")
    private LocalDate deadline;
    
    private Long trackId;
}

