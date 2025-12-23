package com.upnest.edu.modules.learning.service;

import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.learning.entity.*;
import com.upnest.edu.modules.learning.payload.*;
import com.upnest.edu.modules.learning.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * RoadmapService - Service xử lý logic lộ trình học tập cá nhân hóa
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RoadmapService {

    private final CareerTrackRepository careerTrackRepository;
    private final RoadmapStepRepository roadmapStepRepository;
    private final LearningRoadmapRepository learningRoadmapRepository;
    private final UserRepository userRepository;

    /**
     * Lấy lộ trình học tập của user
     */
    public LearningRoadmapResponse getRoadmap(Long userId) {
        log.info("Getting roadmap for user: {}", userId);

        LearningRoadmap roadmap = learningRoadmapRepository.findByUserIdWithTrack(userId)
                .orElseGet(() -> createDefaultRoadmap(userId));

        CareerTrack track = roadmap.getCareerTrack();
        List<RoadmapStep> steps = roadmapStepRepository.findByTrackIdOrderByOrderIndex(track.getId());

        // Tính toán trạng thái cho từng step
        List<RoadmapStepDTO> stepDTOs = steps.stream()
                .map(step -> {
                    String status = calculateStepStatus(step, roadmap);
                    Integer progress = calculateStepProgress(step, roadmap);
                    return RoadmapStepDTO.fromEntity(step, status, progress);
                })
                .collect(Collectors.toList());

        // Generate AI Insight
        LearningRoadmapResponse.AIInsightDTO aiInsight = generateAIInsight(userId, roadmap);

        // Lấy tên user
        String studentName = userRepository.findById(userId)
                .map(user -> user.getFullName() != null ? user.getFullName().split(" ")[user.getFullName().split(" ").length - 1] : "Học viên")
                .orElse("Học viên");

        return LearningRoadmapResponse.builder()
                .roadmapId(roadmap.getId())
                .studentName(studentName)
                .targetCareer(track.getName())
                .careerTrackCode(track.getCode())
                .currentStepIndex(roadmap.getCurrentStepIndex())
                .currentProgress(roadmap.getCurrentProgress())
                .aiInsight(aiInsight)
                .milestones(stepDTOs)
                .build();
    }

    /**
     * Cập nhật Career Track cho user
     */
    public LearningRoadmapResponse updateCareerTrack(Long userId, String trackCode) {
        log.info("Updating career track for user {} to track: {}", userId, trackCode);

        CareerTrack newTrack = careerTrackRepository.findByCode(trackCode)
                .orElseThrow(() -> new RuntimeException("Career track not found: " + trackCode));

        LearningRoadmap roadmap = learningRoadmapRepository.findByUserId(userId)
                .orElseGet(() -> {
                    LearningRoadmap newRoadmap = LearningRoadmap.builder()
                            .userId(userId)
                            .careerTrack(newTrack)
                            .currentStepIndex(0)
                            .currentProgress(0)
                            .build();
                    return learningRoadmapRepository.save(newRoadmap);
                });

        // Cập nhật track
        roadmap.setCareerTrack(newTrack);
        
        // Reset về bước đầu tiên (giữ nguyên XP đã tích lũy)
        roadmap.setCurrentStepIndex(0);
        roadmap.setCurrentProgress(0);
        
        // Generate AI insight mới
        roadmap.setAiInsight(null);
        roadmap.setStrengthDescription(null);
        roadmap.setRecommendation(null);

        roadmap = learningRoadmapRepository.save(roadmap);

        log.info("Career track updated successfully for user: {}", userId);

        return getRoadmap(userId);
    }

    /**
     * Lấy danh sách tất cả Career Tracks
     */
    public List<CareerTrackDTO> getAllCareerTracks() {
        log.info("Getting all career tracks");
        
        return careerTrackRepository.findAll().stream()
                .map(track -> {
                    List<RoadmapStep> steps = roadmapStepRepository.findByTrackIdOrderByOrderIndex(track.getId());
                    List<RoadmapStepDTO> stepDTOs = steps.stream()
                            .map(step -> RoadmapStepDTO.fromEntity(step, "locked", 0))
                            .collect(Collectors.toList());
                    return CareerTrackDTO.fromEntity(track, stepDTOs);
                })
                .collect(Collectors.toList());
    }

    /**
     * Tạo roadmap mặc định cho user mới
     */
    private LearningRoadmap createDefaultRoadmap(Long userId) {
        log.info("Creating default roadmap for user: {}", userId);

        CareerTrack defaultTrack = careerTrackRepository.findByCode("fullstack-java")
                .orElseThrow(() -> new RuntimeException("Default career track not found"));

        LearningRoadmap roadmap = LearningRoadmap.builder()
                .userId(userId)
                .careerTrack(defaultTrack)
                .currentStepIndex(0)
                .currentProgress(0)
                .build();

        return learningRoadmapRepository.save(roadmap);
    }

    /**
     * Tính toán trạng thái của step
     */
    private String calculateStepStatus(RoadmapStep step, LearningRoadmap roadmap) {
        int stepIndex = step.getOrderIndex();
        int currentIndex = roadmap.getCurrentStepIndex();

        if (stepIndex < currentIndex) {
            return "completed";
        } else if (stepIndex == currentIndex) {
            return "active";
        } else {
            // Kiểm tra prerequisites: step trước đó phải completed
            if (stepIndex == 0) {
                return "active"; // Step đầu tiên luôn active nếu chưa có step nào completed
            }
            return "locked";
        }
    }

    /**
     * Tính toán progress của step
     */
    private Integer calculateStepProgress(RoadmapStep step, LearningRoadmap roadmap) {
        int stepIndex = step.getOrderIndex();
        int currentIndex = roadmap.getCurrentStepIndex();

        if (stepIndex < currentIndex) {
            return 100; // Completed
        } else if (stepIndex == currentIndex) {
            return roadmap.getCurrentProgress(); // Progress của step hiện tại
        } else {
            return 0; // Locked
        }
    }

    /**
     * Generate AI Insight dựa trên XP và lịch sử học tập
     * Logic giả lập: Nếu XP cao -> knhungên nâng cao, XP thấp -> knhungên duy trì streak
     */
    private LearningRoadmapResponse.AIInsightDTO generateAIInsight(Long userId, LearningRoadmap roadmap) {
        log.info("Generating AI insight for user: {}", userId);

        // TODO: Tích hợp với GamificationService để lấy XP thực tế
        // Hiện tại giả lập với giá trị mặc định
        int userXP = 0; // Sẽ lấy từ GamificationService hoặc User stats
        
        // Logic AI giả lập
        String testResult = "Java Core";
        String score = "8.0/10";
        String recommendation;
        String strength;
        String suggestion;

        if (userXP > 2000) {
            // XP cao -> Học viên có kinh nghiệm
            recommendation = "Microservices";
            strength = "Nền tảng vững chắc";
            suggestion = "Với điểm số và XP tích lũy cao, AI đề xuất bạn tập trung vào phần Microservices để tối ưu hóa lộ trình sự nghiệp và đạt được vị trí Expert.";
        } else if (userXP > 1000) {
            // XP trung bình
            recommendation = "REST API Development";
            strength = "Kiến thức cơ bản tốt";
            suggestion = "Bạn đang đi đúng hướng! Tiếp tục phát triển kỹ năng Backend với Spring Boot để xây dựng ứng dụng thực tế.";
        } else {
            // XP thấp -> Học viên mới
            recommendation = "Fundamentals Mastery";
            strength = "Đang xây dựng nền tảng";
            suggestion = "Hãy củng cố kiến thức nền tảng trước khi cnhungển sang phần nâng cao. Duy trì streak học tập để tích lũy XP hiệu quả!";
        }

        return LearningRoadmapResponse.AIInsightDTO.builder()
                .testResult(testResult)
                .score(score)
                .recommendation(recommendation)
                .strength(strength)
                .suggestion(suggestion)
                .build();
    }
}

