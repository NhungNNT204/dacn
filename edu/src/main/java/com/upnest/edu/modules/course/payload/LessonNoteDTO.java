package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonNoteDTO {
    private Long id;
    private Long userId;
    private Long lessonId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

