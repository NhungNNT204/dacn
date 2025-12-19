package com.upnest.edu.modules.learning.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upnest.edu.modules.learning.entity.*;
import com.upnest.edu.modules.learning.repository.*;
import com.upnest.edu.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PersonalizedLearningService - Service xử lý quy trình 6 bước cho lộ trình cá nhân hóa
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PersonalizedLearningService {

    private final SkillsAuditRepository skillsAuditRepository;
    private final LearningGoalRepository learningGoalRepository;
    private final LearningPlaylistRepository playlistRepository;
    private final SocialTouchpointRepository touchpointRepository;
    private final EarlyAlertRepository alertRepository;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final RoadmapService roadmapService;
    private final DashboardService dashboardService;
    private final ObjectMapper objectMapper;

    // ========== BƯỚC 1: ĐÁNH GIÁ NỀN TẢNG VÀ PHÂN KHÚC NGƯỜI HỌC ==========

    /**
     * Thực hiện Skills Audit và phân loại Persona
     */
    public SkillsAudit performSkillsAudit(Long userId) {
        log.info("Performing skills audit for user: {}", userId);

        // Kiểm tra xem đã có audit chưa
        Optional<SkillsAudit> existing = skillsAuditRepository.findByUserId(userId);
        if (existing.isPresent()) {
            log.info("Skills audit already exists for user: {}", userId);
            return existing.get();
        }

        // Thu thập dữ liệu từ các nguồn
        Map<String, Integer> skillScores = collectSkillScores(userId);
        int overallScore = calculateOverallScore(skillScores);
        SkillsAudit.PersonaType personaType = classifyPersona(overallScore, skillScores);
        List<String> strengths = identifyStrengths(skillScores);
        List<String> gaps = identifyKnowledgeGaps(skillScores);
        List<String> recommendations = generateRecommendations(personaType, strengths, gaps);

        SkillsAudit audit = SkillsAudit.builder()
                .userId(userId)
                .personaType(personaType)
                .overallScore(overallScore)
                .skillScores(convertToJson(skillScores))
                .strengths(convertToJson(strengths))
                .knowledgeGaps(convertToJson(gaps))
                .recommendations(convertToJson(recommendations))
                .build();

        return skillsAuditRepository.save(audit);
    }

    /**
     * Thu thập điểm số kỹ năng từ các nguồn (exam results, completed courses, etc.)
     */
    private Map<String, Integer> collectSkillScores(Long userId) {
        Map<String, Integer> scores = new HashMap<>();
        
        // TODO: Tích hợp với ExamService để lấy điểm thi
        // TODO: Tích hợp với CourseService để lấy tiến độ khóa học
        // Giả lập dữ liệu
        scores.put("Java", 75);
        scores.put("Spring Boot", 60);
        scores.put("React", 40);
        scores.put("Database", 70);
        scores.put("Algorithms", 55);
        
        return scores;
    }

    private int calculateOverallScore(Map<String, Integer> skillScores) {
        if (skillScores.isEmpty()) return 0;
        int sum = skillScores.values().stream().mapToInt(Integer::intValue).sum();
        return sum / skillScores.size();
    }

    private SkillsAudit.PersonaType classifyPersona(int overallScore, Map<String, Integer> skillScores) {
        if (overallScore < 40) {
            return SkillsAudit.PersonaType.BEGINNER;
        } else if (overallScore < 70) {
            return SkillsAudit.PersonaType.INTERMEDIATE;
        } else {
            return SkillsAudit.PersonaType.ADVANCED;
        }
    }

    private List<String> identifyStrengths(Map<String, Integer> skillScores) {
        return skillScores.entrySet().stream()
                .filter(entry -> entry.getValue() >= 70)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<String> identifyKnowledgeGaps(Map<String, Integer> skillScores) {
        return skillScores.entrySet().stream()
                .filter(entry -> entry.getValue() < 50)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<String> generateRecommendations(SkillsAudit.PersonaType persona, 
                                                 List<String> strengths, 
                                                 List<String> gaps) {
        List<String> recommendations = new ArrayList<>();
        
        switch (persona) {
            case BEGINNER:
                recommendations.add("Bắt đầu với các khóa học cơ bản có cấu trúc chặt chẽ");
                recommendations.add("Tham gia nhóm học tập để nhận hỗ trợ");
                break;
            case INTERMEDIATE:
                recommendations.add("Tập trung vào việc lấp đầy lỗ hổng kiến thức");
                recommendations.add("Thực hành các dự án thực tế");
                break;
            case ADVANCED:
                recommendations.add("Tham gia các thử thách tối ưu hóa");
                recommendations.add("Phát triển kỹ năng lãnh đạo và mentoring");
                break;
        }
        
        if (!gaps.isEmpty()) {
            recommendations.add("Ưu tiên học các kỹ năng: " + String.join(", ", gaps));
        }
        
        return recommendations;
    }

    // ========== BƯỚC 2: THIẾT LẬP MỤC TIÊU SMART ==========

    /**
     * Tạo mục tiêu SMART dựa trên Skills Audit và Career Track
     */
    public LearningGoal createSMARTGoal(Long userId, String title, String description, 
                                       LocalDate deadline, Long trackId) {
        log.info("Creating SMART goal for user: {}", userId);

        SkillsAudit audit = skillsAuditRepository.findByUserId(userId)
                .orElseGet(() -> performSkillsAudit(userId));

        // Tính toán các tiêu chí SMART
        String successCriteria = generateSuccessCriteria(title, audit);
        int feasibilityScore = calculateFeasibility(audit, deadline);
        int relevanceScore = calculateRelevance(audit, trackId);

        LearningGoal goal = LearningGoal.builder()
                .userId(userId)
                .title(title)
                .description(description)
                .successCriteria(successCriteria)
                .feasibilityScore(feasibilityScore)
                .relevanceScore(relevanceScore)
                .deadline(deadline)
                .status(LearningGoal.GoalStatus.ACTIVE)
                .progress(0)
                .build();

        return learningGoalRepository.save(goal);
    }

    private String generateSuccessCriteria(String title, SkillsAudit audit) {
        // Tạo tiêu chí đo lường cụ thể dựa trên title và audit
        return "Hoàn thành ít nhất 80% các bài học trong lộ trình và đạt điểm trung bình >= 7.0";
    }

    private int calculateFeasibility(SkillsAudit audit, LocalDate deadline) {
        long daysUntilDeadline = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), deadline);
        
        // Nếu deadline quá gần và persona là BEGINNER -> feasibility thấp
        if (audit.getPersonaType() == SkillsAudit.PersonaType.BEGINNER && daysUntilDeadline < 30) {
            return 40;
        }
        
        // Tính toán dựa trên overall score và thời gian
        int baseScore = audit.getOverallScore();
        if (daysUntilDeadline >= 90) return Math.min(100, baseScore + 20);
        if (daysUntilDeadline >= 60) return baseScore;
        return Math.max(30, baseScore - 20);
    }

    private int calculateRelevance(SkillsAudit audit, Long trackId) {
        // TODO: So sánh track requirements với skills hiện tại
        // Giả lập: nếu có skills liên quan thì relevance cao
        return 75;
    }

    // ========== BƯỚC 3: THIẾT KẾ TRÌNH TỰ HỌC TẬP THÍCH ỨNG ==========

    /**
     * Tạo Learning Playlist thích ứng dựa trên Goal
     */
    public LearningPlaylist createAdaptivePlaylist(Long userId, Long goalId) {
        log.info("Creating adaptive playlist for user: {}, goal: {}", userId, goalId);

        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        SkillsAudit audit = skillsAuditRepository.findByUserId(userId)
                .orElseGet(() -> performSkillsAudit(userId));

        // Tạo danh sách items thích ứng
        List<Map<String, Object>> items = generatePlaylistItems(goal, audit);
        String itemsJson = convertToJson(items);

        LearningPlaylist playlist = LearningPlaylist.builder()
                .userId(userId)
                .learningGoal(goal)
                .title("Lộ trình học tập: " + goal.getTitle())
                .currentIndex(0)
                .items(itemsJson)
                .currentDifficulty(determineInitialDifficulty(audit))
                .build();

        return playlistRepository.save(playlist);
    }

    private List<Map<String, Object>> generatePlaylistItems(LearningGoal goal, SkillsAudit audit) {
        List<Map<String, Object>> items = new ArrayList<>();
        
        // TODO: Tích hợp với CourseService để lấy các bài học thực tế
        // Giả lập items
        for (int i = 0; i < 10; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("order", i);
            item.put("type", i % 3 == 0 ? "video" : (i % 3 == 1 ? "reading" : "project"));
            item.put("contentId", 1000L + i);
            item.put("title", "Bài học " + (i + 1));
            item.put("completed", false);
            items.add(item);
        }
        
        return items;
    }

    private LearningPlaylist.DifficultyLevel determineInitialDifficulty(SkillsAudit audit) {
        switch (audit.getPersonaType()) {
            case BEGINNER: return LearningPlaylist.DifficultyLevel.EASY;
            case INTERMEDIATE: return LearningPlaylist.DifficultyLevel.MEDIUM;
            case ADVANCED: return LearningPlaylist.DifficultyLevel.HARD;
            default: return LearningPlaylist.DifficultyLevel.MEDIUM;
        }
    }

    /**
     * Điều chỉnh độ khó playlist dựa trên performance
     */
    public void adjustPlaylistDifficulty(Long playlistId, boolean isPerformingWell) {
        LearningPlaylist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        LearningPlaylist.DifficultyLevel current = playlist.getCurrentDifficulty();
        LearningPlaylist.DifficultyLevel newLevel = current;

        if (isPerformingWell) {
            // Tăng độ khó
            switch (current) {
                case EASY: newLevel = LearningPlaylist.DifficultyLevel.MEDIUM; break;
                case MEDIUM: newLevel = LearningPlaylist.DifficultyLevel.HARD; break;
                case HARD: newLevel = LearningPlaylist.DifficultyLevel.EXPERT; break;
                case EXPERT: newLevel = LearningPlaylist.DifficultyLevel.EXPERT; break; // Giữ nguyên
            }
        } else {
            // Giảm độ khó
            switch (current) {
                case EXPERT: newLevel = LearningPlaylist.DifficultyLevel.HARD; break;
                case HARD: newLevel = LearningPlaylist.DifficultyLevel.MEDIUM; break;
                case MEDIUM: newLevel = LearningPlaylist.DifficultyLevel.EASY; break;
                case EASY: newLevel = LearningPlaylist.DifficultyLevel.EASY; break; // Giữ nguyên
            }
        }

        playlist.setCurrentDifficulty(newLevel);
        playlistRepository.save(playlist);
        log.info("Adjusted playlist difficulty from {} to {}", current, newLevel);
    }

    // ========== BƯỚC 4: TÍCH HỢP TƯƠNG TÁC XÃ HỘI ==========

    /**
     * Tạo Social Touchpoints sau mỗi module
     */
    public SocialTouchpoint createSocialTouchpoint(Long userId, Long playlistId, 
                                                   SocialTouchpoint.TouchpointType type) {
        log.info("Creating social touchpoint for user: {}, type: {}", userId, type);

        LearningPlaylist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        String title = generateTouchpointTitle(type);
        String description = generateTouchpointDescription(type);

        SocialTouchpoint touchpoint = SocialTouchpoint.builder()
                .userId(userId)
                .playlist(playlist)
                .touchpointType(type)
                .title(title)
                .description(description)
                .status(SocialTouchpoint.TouchpointStatus.PENDING)
                .build();

        return touchpointRepository.save(touchpoint);
    }

    private String generateTouchpointTitle(SocialTouchpoint.TouchpointType type) {
        switch (type) {
            case DISCUSSION_GROUP: return "Tham gia nhóm thảo luận";
            case PEER_REVIEW: return "Bình duyệt bài tập của bạn";
            case MENTOR_MATCH: return "Kết nối với mentor";
            case FORUM_QUESTION: return "Đặt câu hỏi trong diễn đàn";
            default: return "Tương tác xã hội";
        }
    }

    private String generateTouchpointDescription(SocialTouchpoint.TouchpointType type) {
        switch (type) {
            case DISCUSSION_GROUP: return "Tham gia nhóm thảo luận với những người cùng tiến độ";
            case PEER_REVIEW: return "Xem và đánh giá bài tập của các bạn học viên khác";
            case MENTOR_MATCH: return "Kết nối với mentor đã hoàn thành lộ trình này";
            case FORUM_QUESTION: return "Đặt câu hỏi và nhận phản hồi từ cộng đồng";
            default: return "";
        }
    }

    // ========== BƯỚC 5: GIÁM SÁT VÀ ĐIỀU CHỈNH THÔNG MINH ==========

    /**
     * Kiểm tra và tạo Early Alerts nếu cần
     */
    public void checkAndCreateAlerts(Long userId) {
        log.info("Checking for early alerts for user: {}", userId);

        LearningPlaylist playlist = playlistRepository.findByUserId(userId).stream()
                .findFirst()
                .orElse(null);

        if (playlist == null) return;

        // Kiểm tra tiến độ
        checkProgressLag(userId, playlist);
        
        // Kiểm tra engagement
        checkLowEngagement(userId);
        
        // Kiểm tra difficulty spike
        checkDifficultySpike(userId, playlist);
        
        // Predictive analytics
        checkPredictedFailure(userId, playlist);
    }

    private void checkProgressLag(Long userId, LearningPlaylist playlist) {
        // TODO: So sánh tiến độ thực tế với kế hoạch
        // Giả lập: nếu currentIndex < expectedIndex -> tạo alert
        
        int expectedProgress = calculateExpectedProgress(playlist);
        int actualProgress = playlist.getCurrentIndex();
        
        if (actualProgress < expectedProgress * 0.7) {
            createAlert(userId, EarlyAlert.AlertType.PROGRESS_LAG, 
                       EarlyAlert.AlertSeverity.MEDIUM,
                       "Bạn đang chậm tiến độ so với kế hoạch",
                       "Hãy dành thêm thời gian để bắt kịp lộ trình");
        }
    }

    private void checkLowEngagement(Long userId) {
        // TODO: Kiểm tra số lần login, thời gian học, tương tác
        // Giả lập
    }

    private void checkDifficultySpike(Long userId, LearningPlaylist playlist) {
        // TODO: Phân tích performance trong các bài gần đây
        // Nếu điểm số giảm đột ngột -> tạo alert
    }

    private void checkPredictedFailure(Long userId, LearningPlaylist playlist) {
        // TODO: Sử dụng predictive analytics để dự đoán
        // Dựa trên: tiến độ, điểm số, engagement
    }

    private int calculateExpectedProgress(LearningPlaylist playlist) {
        // TODO: Tính toán dựa trên deadline của goal
        return 5; // Giả lập
    }

    private void createAlert(Long userId, EarlyAlert.AlertType type, 
                           EarlyAlert.AlertSeverity severity,
                           String title, String description) {
        EarlyAlert alert = EarlyAlert.builder()
                .userId(userId)
                .alertType(type)
                .severity(severity)
                .title(title)
                .description(description)
                .status(EarlyAlert.AlertStatus.ACTIVE)
                .build();
        
        alertRepository.save(alert);
        log.info("Created alert: {} for user: {}", type, userId);
    }

    // ========== BƯỚC 6: ĐÁNH GIÁ TỔNG KẾT ==========

    /**
     * Tạo Assessment tổng kết khi hoàn thành goal
     */
    public Assessment createFinalAssessment(Long userId, Long goalId) {
        log.info("Creating final assessment for user: {}, goal: {}", userId, goalId);

        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        Assessment assessment = Assessment.builder()
                .userId(userId)
                .learningGoal(goal)
                .assessmentType(Assessment.AssessmentType.CAPSTONE_PROJECT)
                .title("Đánh giá tổng kết: " + goal.getTitle())
                .description("Hoàn thành dự án tổng hợp để đánh giá năng lực")
                .status(Assessment.AssessmentStatus.PENDING)
                .build();

        return assessmentRepository.save(assessment);
    }

    /**
     * Hoàn thành assessment và tạo phản hồi
     */
    public Assessment completeAssessment(Long assessmentId, Integer score, 
                                         Map<String, Integer> competencyScores,
                                         List<String> nextSteps) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        Map<String, Object> feedback = new HashMap<>();
        feedback.put("score", score);
        feedback.put("competencies", competencyScores);
        feedback.put("overallFeedback", generateOverallFeedback(score, competencyScores));

        assessment.setScore(score);
        assessment.setFeedback(convertToJson(feedback));
        assessment.setNextSteps(convertToJson(nextSteps));
        assessment.setStatus(Assessment.AssessmentStatus.COMPLETED);
        assessment.setCompletedAt(LocalDateTime.now());

        return assessmentRepository.save(assessment);
    }

    private String generateOverallFeedback(Integer score, Map<String, Integer> competencies) {
        if (score >= 80) {
            return "Xuất sắc! Bạn đã nắm vững các kỹ năng cần thiết.";
        } else if (score >= 60) {
            return "Tốt! Bạn đã đạt được mục tiêu cơ bản, hãy tiếp tục phát triển.";
        } else {
            return "Cần cải thiện. Hãy xem lại các phần chưa nắm vững và thực hành thêm.";
        }
    }

    // ========== UTILITY METHODS ==========

    private String convertToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("Error converting to JSON", e);
            return "{}";
        }
    }

    private <T> T parseJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            log.error("Error parsing JSON", e);
            return null;
        }
    }
}

