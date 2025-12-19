package com.upnest.edu.modules.course.controller;

import com.upnest.edu.modules.course.payload.*;
import com.upnest.edu.modules.course.service.CoursePlayerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * CoursePlayerController - API endpoints cho Course Player
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CoursePlayerController {

    private final CoursePlayerService coursePlayerService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * GET /api/v1/courses/{courseId}/play?lessonId=
     */
    @GetMapping("/{courseId}/play")
    public ResponseEntity<CoursePlayerResponse> getCoursePlayer(
            @PathVariable Long courseId,
            @RequestParam(required = false) Long lessonId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        CoursePlayerResponse response = coursePlayerService.getCoursePlayerData(userId, courseId, lessonId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/courses/{courseId}/lessons/{lessonId}/comments
     */
    @PostMapping("/{courseId}/lessons/{lessonId}/comments")
    public ResponseEntity<LessonCommentDTO> createComment(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody CreateCommentRequest request,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        LessonCommentDTO comment = coursePlayerService.createComment(userId, lessonId, request);
        return ResponseEntity.ok(comment);
    }

    /**
     * POST /api/v1/courses/{courseId}/lessons/{lessonId}/notes
     */
    @PostMapping("/{courseId}/lessons/{lessonId}/notes")
    public ResponseEntity<LessonNoteDTO> saveNote(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody SaveNoteRequest request,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        LessonNoteDTO note = coursePlayerService.saveNote(userId, lessonId, request);
        return ResponseEntity.ok(note);
    }

    /**
     * POST /api/v1/courses/{courseId}/lessons/{lessonId}/complete
     */
    @PostMapping("/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<?> completeLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        coursePlayerService.completeLesson(userId, courseId, lessonId);
        return ResponseEntity.ok().build();
    }
}

