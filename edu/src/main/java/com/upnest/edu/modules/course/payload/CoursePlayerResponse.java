package com.upnest.edu.modules.course.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Response DTO cho Course Player page
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePlayerResponse {
    private CourseDTO course;
    private LessonDTO currentLesson;
    private List<LessonDTO> lessons;
    private Integer totalLessons;
    private Integer completedLessons;
    private Integer overallProgress;
    private List<LessonCommentDTO> comments;
    private Long commentCount;
    private LessonNoteDTO note;
}

