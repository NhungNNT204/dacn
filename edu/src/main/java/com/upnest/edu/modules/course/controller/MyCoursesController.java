package com.upnest.edu.modules.course.controller;

import com.upnest.edu.modules.course.payload.MyCourseResponse;
import com.upnest.edu.modules.course.service.MyCoursesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MyCoursesController - API endpoints cho trang "Khóa học của tôi"
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/my-courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MyCoursesController {

    private final MyCoursesService myCoursesService;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * GET /api/v1/my-courses?filter=learning|all|completed|favorites
     */
    @GetMapping
    public ResponseEntity<List<MyCourseResponse>> getMyCourses(
            @RequestParam(required = false, defaultValue = "all") String filter,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        List<MyCourseResponse> courses = myCoursesService.getMyCourses(userId, filter);
        return ResponseEntity.ok(courses);
    }

    /**
     * POST /api/v1/my-courses/{courseId}/toggle-favorite
     */
    @PostMapping("/{courseId}/toggle-favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable Long courseId,
            Authentication auth) {
        Long userId = getUserIdFromAuthentication(auth);
        myCoursesService.toggleFavorite(userId, courseId);
        return ResponseEntity.ok().build();
    }
}

