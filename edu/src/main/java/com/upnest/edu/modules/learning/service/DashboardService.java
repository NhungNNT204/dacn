package com.upnest.edu.modules.learning.service;

import com.upnest.edu.modules.auth.repository.UserRepository;
import com.upnest.edu.modules.learning.entity.LearningStreak;
import com.upnest.edu.modules.learning.payload.DashboardResponse;
import com.upnest.edu.modules.learning.repository.LearningStreakRepository;
import com.upnest.edu.modules.social.entity.LearningActivity;
import com.upnest.edu.modules.social.repository.LearningActivityRepository;
import com.upnest.edu.modules.social.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DashboardService - Service xử lý logic cho Dashboard
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DashboardService {

    private final LearningStreakRepository streakRepository;
    private final LearningActivityRepository activityRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Lấy dữ liệu dashboard cho user
     */
    public DashboardResponse getDashboardData(Long userId) {
        log.info("Getting dashboard data for user: {}", userId);

        // Lấy user info
        String studentName = userRepository.findById(userId)
                .map(user -> {
                    String fullName = user.getFullName();
                    if (fullName != null && !fullName.isEmpty()) {
                        String[] parts = fullName.split(" ");
                        return parts[parts.length - 1];
                    }
                    return "Học viên";
                })
                .orElse("Học viên");

        // Lấy hoặc tạo streak
        LearningStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultStreak(userId));

        // Tính toán level và XP (giả lập - cần tích hợp với GamificationService)
        int xp = 1450; // TODO: Lấy từ GamificationService
        int level = calculateLevel(xp);
        int nextLevelXp = calculateNextLevelXp(level);
        String levelTitle = getLevelTitle(level);

        // Lấy stats
        long coursesCount = 5; // TODO: Lấy từ CourseEnrollment
        long friendsCount = 124; // TODO: Lấy từ Friendship
        long postsCount = postRepository.countByAuthorIdAndIsDeletedFalse(userId);
        int badges = 12; // TODO: Lấy từ Badge system

        // Lấy recent activities
        List<DashboardResponse.ActivityDTO> activities = getRecentActivities(userId);

        return DashboardResponse.builder()
                .studentName(studentName)
                .streak(streak.getCurrentStreak())
                .level(level)
                .levelTitle(levelTitle)
                .xp(xp)
                .nextLevelXp(nextLevelXp)
                .courses((int) coursesCount)
                .friends((int) friendsCount)
                .posts((int) postsCount)
                .badges(badges)
                .onlineTeammates(124) // TODO: Lấy từ online users
                .recentActivities(activities)
                .build();
    }

    /**
     * Cập nhật streak khi user có hoạt động học tập
     */
    public void updateStreak(Long userId) {
        log.info("Updating streak for user: {}", userId);

        LearningStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultStreak(userId));

        LocalDate today = LocalDate.now();
        LocalDate lastActivity = streak.getLastActivityDate();

        if (lastActivity == null) {
            // Lần đầu học
            streak.setCurrentStreak(1);
            streak.setLastActivityDate(today);
            streak.setTotalDays(1);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastActivity, today);

            if (daysBetween == 0) {
                // Đã học hôm nay rồi, không cần cập nhật
                return;
            } else if (daysBetween == 1) {
                // Học liên tiếp
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                streak.setTotalDays(streak.getTotalDays() + 1);
            } else {
                // Bị gián đoạn, reset streak
                streak.setCurrentStreak(1);
                streak.setTotalDays(streak.getTotalDays() + 1);
            }

            // Cập nhật longest streak
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }

            streak.setLastActivityDate(today);
        }

        streakRepository.save(streak);
        log.info("Streak updated: {} days for user: {}", streak.getCurrentStreak(), userId);
    }

    /**
     * Lấy recent activities
     */
    private List<DashboardResponse.ActivityDTO> getRecentActivities(Long userId) {
        // Lấy từ LearningActivity và Notification
        List<LearningActivity> activities = activityRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 5))
                .getContent();

        return activities.stream()
                .map(activity -> {
                    String timeAgo = calculateTimeAgo(activity.getCreatedAt());
                    return DashboardResponse.ActivityDTO.builder()
                            .id(activity.getId())
                            .type(activity.getActivityType().name())
                            .title(getActivityTitle(activity))
                            .description(activity.getMessage() != null ? activity.getMessage() : "")
                            .time(timeAgo)
                            .icon(getActivityIcon(activity.getActivityType()))
                            .color(getActivityColor(activity.getActivityType()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String getActivityTitle(LearningActivity activity) {
        switch (activity.getActivityType()) {
            case COURSE_COMPLETED:
                return "Nộp bài tập thành công";
            case REVIEW:
                return "Đánh giá khóa học";
            case CHALLENGE:
                return "Hoàn thành thử thách";
            default:
                return "Hoạt động mới";
        }
    }

    private String getActivityIcon(LearningActivity.ActivityType type) {
        switch (type) {
            case COURSE_COMPLETED:
                return "CheckCircle2";
            case REVIEW:
                return "FileText";
            case CHALLENGE:
                return "Trophy";
            default:
                return "Bell";
        }
    }

    private String getActivityColor(LearningActivity.ActivityType type) {
        switch (type) {
            case COURSE_COMPLETED:
                return "#10b981";
            case REVIEW:
                return "#3b82f6";
            case CHALLENGE:
                return "#f59e0b";
            default:
                return "#6b7280";
        }
    }

    private String calculateTimeAgo(LocalDateTime dateTime) {
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

    private LearningStreak createDefaultStreak(Long userId) {
        LearningStreak streak = LearningStreak.builder()
                .userId(userId)
                .currentStreak(0)
                .longestStreak(0)
                .totalDays(0)
                .build();
        return streakRepository.save(streak);
    }

    private int calculateLevel(int xp) {
        // Công thức: Level = sqrt(XP / 100)
        return (int) Math.sqrt(xp / 100.0) + 1;
    }

    private int calculateNextLevelXp(int level) {
        // XP cần cho level tiếp theo
        return (level * level) * 100;
    }

    private String getLevelTitle(int level) {
        if (level < 3) return "Beginner";
        if (level < 5) return "Student Pro";
        if (level < 8) return "Advanced Learner";
        if (level < 12) return "Expert";
        return "Master";
    }
}

