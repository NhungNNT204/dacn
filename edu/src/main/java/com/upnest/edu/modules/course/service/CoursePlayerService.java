package com.upnest.edu.modules.course.service;

import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.course.entity.*;
import com.upnest.edu.modules.course.payload.*;
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
 * CoursePlayerService - Service xử lý logic cho Course Player
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CoursePlayerService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonCommentRepository commentRepository;
    private final LessonNoteRepository noteRepository;
    private final CourseProgressRepository progressRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    /**
     * Lấy dữ liệu cho Course Player
     */
    public CoursePlayerResponse getCoursePlayerData(Long userId, Long courseId, Long lessonId) {
        log.info("Getting course player data for user: {}, course: {}, lesson: {}", userId, courseId, lessonId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Lesson> allLessons = lessonRepository.findByCourseIdOrderByOrderIndex(courseId);
        
        Lesson currentLesson;
        if (lessonId != null) {
            currentLesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
        } else {
            // Lấy lesson đầu tiên hoặc lesson hiện tại của user
            CourseProgress progress = progressRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
            if (progress != null && progress.getCurrentLessonIndex() != null) {
                currentLesson = allLessons.stream()
                        .filter(l -> l.getOrderIndex().equals(progress.getCurrentLessonIndex()))
                        .findFirst()
                        .orElse(allLessons.isEmpty() ? null : allLessons.get(0));
            } else {
                currentLesson = allLessons.isEmpty() ? null : allLessons.get(0);
            }
        }

        if (currentLesson == null) {
            throw new RuntimeException("No lessons found in course");
        }

        // Map lessons to DTOs
        List<LessonDTO> lessonDTOs = allLessons.stream()
                .map(lesson -> mapToLessonDTO(lesson, userId))
                .collect(Collectors.toList());

        // Get comments
        List<LessonComment> comments = commentRepository.findByLessonIdAndParentIdIsNullOrderByCreatedAtDesc(currentLesson.getId());
        List<LessonCommentDTO> commentDTOs = comments.stream()
                .map(comment -> mapToCommentDTO(comment, userId))
                .collect(Collectors.toList());

        Long commentCount = commentRepository.countByLessonId(currentLesson.getId());

        // Get note
        LessonNote note = noteRepository.findByUserIdAndLessonId(userId, currentLesson.getId()).orElse(null);
        LessonNoteDTO noteDTO = note != null ? mapToNoteDTO(note) : null;

        // Calculate progress
        CourseProgress progress = progressRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
        int completedLessons = progress != null ? progress.getCompletedLessons() : 0;
        int overallProgress = allLessons.isEmpty() ? 0 : (completedLessons * 100) / allLessons.size();

        CourseDTO courseDTO = CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .category(course.getCategory())
                .instructorName(course.getInstructorName())
                .build();

        return CoursePlayerResponse.builder()
                .course(courseDTO)
                .currentLesson(mapToLessonDTO(currentLesson, userId))
                .lessons(lessonDTOs)
                .totalLessons(allLessons.size())
                .completedLessons(completedLessons)
                .overallProgress(overallProgress)
                .comments(commentDTOs)
                .commentCount(commentCount)
                .note(noteDTO)
                .build();
    }

    /**
     * Tạo comment mới
     */
    public LessonCommentDTO createComment(Long userId, Long lessonId, CreateCommentRequest request) {
        log.info("Creating comment for user: {}, lesson: {}", userId, lessonId);

        LessonComment comment = LessonComment.builder()
                .lessonId(lessonId)
                .userId(userId)
                .parentId(request.getParentId())
                .content(request.getContent())
                .likeCount(0)
                .status(LessonComment.CommentStatus.ACTIVE)
                .build();

        comment = commentRepository.save(comment);
        return mapToCommentDTO(comment, userId);
    }

    /**
     * Like/Unlike comment
     */
    public void toggleCommentLike(Long userId, Long commentId) {
        // TODO: Implement like/unlike logic with UserCommentLike table
        log.info("Toggling like for comment: {} by user: {}", commentId, userId);
    }

    /**
     * Lưu/Update note
     */
    public LessonNoteDTO saveNote(Long userId, Long lessonId, SaveNoteRequest request) {
        log.info("Saving note for user: {}, lesson: {}", userId, lessonId);

        LessonNote note = noteRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElse(LessonNote.builder()
                        .userId(userId)
                        .lessonId(lessonId)
                        .content("")
                        .build());

        note.setContent(request.getContent());
        note = noteRepository.save(note);

        return mapToNoteDTO(note);
    }

    /**
     * Đánh dấu lesson đã hoàn thành
     */
    public void completeLesson(Long userId, Long courseId, Long lessonId) {
        log.info("Completing lesson: {} for user: {}", lessonId, userId);

        lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseEnrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        CourseProgress progress = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElse(CourseProgress.builder()
                        .userId(userId)
                        .course(course)
                        .enrollment(enrollment)
                        .completedLessons(0)
                        .progressPercentage(0)
                        .build());

        // Kiểm tra xem lesson này đã hoàn thành chưa
        // TODO: Implement logic to check if lesson is already completed
        // For now, just increment completed lessons

        progress.setCompletedLessons(progress.getCompletedLessons() + 1);
        progress.setProgressPercentage(calculateProgressPercentage(progress));
        progressRepository.save(progress);
    }

    // ========== MAPPING METHODS ==========

    private LessonDTO mapToLessonDTO(Lesson lesson, Long userId) {
        // TODO: Check if user completed this lesson
        boolean isCompleted = false;
        int progressPercentage = 0;

        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .orderIndex(lesson.getOrderIndex())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .lessonType(lesson.getLessonType())
                .videoUrl(lesson.getVideoUrl())
                .durationSeconds(lesson.getDurationSeconds())
                .durationFormatted(formatDuration(lesson.getDurationSeconds()))
                .content(lesson.getContent())
                .status(lesson.getStatus().name())
                .isCompleted(isCompleted)
                .progressPercentage(progressPercentage)
                .createdAt(lesson.getCreatedAt())
                .build();
    }

    private LessonCommentDTO mapToCommentDTO(LessonComment comment, Long userId) {
        // Get user info
        String userName = userRepository.findById(comment.getUserId())
                .map(user -> user.getFullName() != null ? user.getFullName() : "User")
                .orElse("User");

        // Get replies
        List<LessonComment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(comment.getId());
        List<LessonCommentDTO> replyDTOs = replies.stream()
                .map(reply -> mapToCommentDTO(reply, userId))
                .collect(Collectors.toList());

        return LessonCommentDTO.builder()
                .id(comment.getId())
                .lessonId(comment.getLessonId())
                .userId(comment.getUserId())
                .userName(userName)
                .userAvatar(null) // TODO: Get avatar from user
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .isLiked(false) // TODO: Check if user liked this comment
                .timeAgo(formatTimeAgo(comment.getCreatedAt()))
                .replies(replyDTOs)
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private LessonNoteDTO mapToNoteDTO(LessonNote note) {
        return LessonNoteDTO.builder()
                .id(note.getId())
                .userId(note.getUserId())
                .lessonId(note.getLessonId())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }

    private String formatDuration(Integer seconds) {
        if (seconds == null || seconds == 0) return "00:00";
        int minutes = seconds / 60;
        int secs = seconds % 60;
        return String.format("%02d:%02d", minutes, secs);
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 60) {
            return minutes + " PHÚT TRƯỚC";
        }
        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24) {
            return hours + " GIỜ TRƯỚC";
        }
        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        if (days == 1) return "HÔM QUA";
        return days + " NGÀY TRƯỚC";
    }

    private int calculateProgressPercentage(CourseProgress progress) {
        Course course = progress.getCourse();
        if (course.getTotalLessons() == 0) return 0;
        return (progress.getCompletedLessons() * 100) / course.getTotalLessons();
    }
}

