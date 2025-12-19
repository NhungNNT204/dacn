package com.upnest.edu.modules.course.service;

import com.upnest.edu.modules.course.entity.*;
import com.upnest.edu.modules.course.payload.CourseDTO;
import com.upnest.edu.modules.course.payload.MyCourseResponse;
import com.upnest.edu.modules.course.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * MyCoursesService - Service xử lý logic cho trang "Khóa học của tôi"
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MyCoursesService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseProgressRepository progressRepository;

    /**
     * Lấy danh sách khóa học của user theo filter
     */
    public List<MyCourseResponse> getMyCourses(Long userId, String filter) {
        log.info("Getting courses for user: {}, filter: {}", userId, filter);

        List<CourseEnrollment> enrollments;

        switch (filter != null ? filter.toUpperCase() : "ALL") {
            case "LEARNING":
            case "IN_PROGRESS":
                enrollments = enrollmentRepository.findByUserIdAndStatus(
                    userId, CourseEnrollment.EnrollmentStatus.IN_PROGRESS);
                break;
            case "COMPLETED":
                enrollments = enrollmentRepository.findByUserIdAndStatus(
                    userId, CourseEnrollment.EnrollmentStatus.COMPLETED);
                break;
            case "FAVORITES":
            case "FAVORITE":
                enrollments = enrollmentRepository.findByUserIdAndIsFavoriteTrue(userId);
                break;
            default:
                enrollments = enrollmentRepository.findByUserId(userId);
        }

        return enrollments.stream()
                .map(this::mapToMyCourseResponse)
                .collect(Collectors.toList());
    }

    /**
     * Toggle favorite status
     */
    public void toggleFavorite(Long userId, Long courseId) {
        log.info("Toggling favorite for user: {}, course: {}", userId, courseId);

        CourseEnrollment enrollment = enrollmentRepository
                .findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setIsFavorite(!enrollment.getIsFavorite());
        enrollmentRepository.save(enrollment);
    }

    /**
     * Map CourseEnrollment to MyCourseResponse
     */
    private MyCourseResponse mapToMyCourseResponse(CourseEnrollment enrollment) {
        Course course = enrollment.getCourse();
        CourseProgress progress = progressRepository
                .findByUserIdAndCourseId(enrollment.getUserId(), course.getId())
                .orElse(null);

        CourseDTO courseDTO = CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .instructorId(course.getInstructorId())
                .instructorName(course.getInstructorName())
                .category(course.getCategory())
                .durationMinutes(course.getDurationMinutes())
                .durationFormatted(formatDuration(course.getDurationMinutes()))
                .totalLessons(course.getTotalLessons())
                .rating(course.getRating())
                .ratingCount(course.getRatingCount())
                .thumbnailUrl(course.getThumbnailUrl())
                .status(course.getStatus().name())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();

        int completedLessons = progress != null ? progress.getCompletedLessons() : 0;
        int progressPercentage = progress != null ? progress.getProgressPercentage() : 0;
        LocalDateTime lastAccessed = progress != null ? progress.getLastAccessedAt() : enrollment.getEnrolledAt();

        return MyCourseResponse.builder()
                .enrollmentId(enrollment.getId())
                .course(courseDTO)
                .status(enrollment.getStatus().name())
                .isFavorite(enrollment.getIsFavorite())
                .completedLessons(completedLessons)
                .totalLessons(course.getTotalLessons())
                .progressPercentage(progressPercentage)
                .enrolledAt(enrollment.getEnrolledAt())
                .lastAccessedAt(lastAccessed)
                .lastAccessedFormatted(formatTimeAgo(lastAccessed))
                .build();
    }

    /**
     * Format duration từ phút sang "X giờ Y phút"
     */
    private String formatDuration(Integer minutes) {
        if (minutes == null || minutes == 0) return "0 phút";
        
        int hours = minutes / 60;
        int mins = minutes % 60;
        
        if (hours > 0 && mins > 0) {
            return hours + " giờ " + mins + " phút";
        } else if (hours > 0) {
            return hours + " giờ";
        } else {
            return mins + " phút";
        }
    }

    /**
     * Format time ago: "2 giờ trước", "3 ngày trước"
     */
    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Chưa truy cập";
        
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 60) {
            return minutes + " phút trước";
        }
        
        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24) {
            return hours + " giờ trước";
        }
        
        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        return days + " ngày trước";
    }
}

