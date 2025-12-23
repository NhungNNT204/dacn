package com.upnest.edu.modules.career.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.career.entity.CareerPath;
import com.upnest.edu.modules.career.entity.RoadmapStep;
import com.upnest.edu.modules.career.entity.UserCareerPath;
import com.upnest.edu.modules.career.payload.*;
import com.upnest.edu.modules.career.repository.*;
import com.upnest.edu.modules.learning.repository.LearningStreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CareerService - Service xử lý logic cho định hướng nghề nghiệp
 * DISABLED: RoadmapStepRepository conflict (duplicate in multiple modules)
 */
@Slf4j
// @Service
@RequiredArgsConstructor
@Transactional
public class CareerService {

    private final CareerPathRepository careerPathRepository;
    private final RoadmapStepRepository roadmapStepRepository;
    private final UserCareerPathRepository userCareerPathRepository;
    private final UserRepository userRepository;
    private final LearningStreakRepository streakRepository;
    
    @Autowired(required = false)
    private ObjectMapper objectMapper;

    /**
     * Lấy danh sách tất cả career paths với match percentage
     */
    public List<CareerPathDTO> getAllCareerPaths(Long userId) {
        log.info("Getting all career paths for user: {}", userId);

        List<CareerPath> paths = careerPathRepository.findAll();
        
        return paths.stream().map(path -> {
            // Calculate match percentage based on user stats
            Integer match = calculateMatchPercentage(userId, path);
            
            return CareerPathDTO.builder()
                    .id(path.getId())
                    .code(path.getCode())
                    .title(path.getTitle())
                    .icon(path.getIcon())
                    .color(path.getColor())
                    .description(path.getDescription())
                    .marketDemand(path.getMarketDemand())
                    .avgSalary(path.getAvgSalary())
                    .difficulty(path.getDifficulty() != null ? path.getDifficulty().name() : "MODERATE")
                    .durationMonths(path.getDurationMonths())
                    .aiReason(path.getAiReason())
                    .matchPercentage(match)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết roadmap của một career path cho user
     */
    public CareerRoadmapResponse getCareerRoadmap(Long userId, String careerPathCode) {
        log.info("Getting career roadmap for user: {}, path: {}", userId, careerPathCode);

        CareerPath careerPath = careerPathRepository.findByCode(careerPathCode)
                .orElseThrow(() -> new RuntimeException("Career path not found: " + careerPathCode));

        // Get or create user career path
        UserCareerPath userCareerPath = userCareerPathRepository.findByUserId(userId)
                .orElse(UserCareerPath.builder()
                        .userId(userId)
                        .careerPath(careerPath)
                        .currentStepIndex(0)
                        .currentProgress(0)
                        .overallProgress(0)
                        .build());

        // Get all steps
        List<RoadmapStep> steps = roadmapStepRepository.findByCareerPathIdOrderByOrderIndexAsc(careerPath.getId());

        // Map steps to DTOs with status
        List<RoadmapStepDTO> stepDTOs = steps.stream().map(step -> {
            String status = determineStepStatus(step.getOrderIndex(), userCareerPath.getCurrentStepIndex());
            List<String> tasks = parseTasks(step.getTasks());

            return RoadmapStepDTO.builder()
                    .id(step.getId())
                    .orderIndex(step.getOrderIndex())
                    .title(step.getTitle())
                    .description(step.getDescription())
                    .tasks(tasks)
                    .rewardXp(step.getRewardXp())
                    .badge(step.getBadge())
                    .icon(step.getIcon())
                    .status(status)
                    .build();
        }).collect(Collectors.toList());

        // Build response
        CareerPathDTO careerPathDTO = CareerPathDTO.builder()
                .id(careerPath.getId())
                .code(careerPath.getCode())
                .title(careerPath.getTitle())
                .icon(careerPath.getIcon())
                .color(careerPath.getColor())
                .description(careerPath.getDescription())
                .marketDemand(careerPath.getMarketDemand())
                .avgSalary(careerPath.getAvgSalary())
                .difficulty(careerPath.getDifficulty() != null ? careerPath.getDifficulty().name() : "MODERATE")
                .durationMonths(careerPath.getDurationMonths())
                .aiReason(careerPath.getAiReason())
                .matchPercentage(calculateMatchPercentage(userId, careerPath))
                .build();

        return CareerRoadmapResponse.builder()
                .careerPath(careerPathDTO)
                .overallProgress(userCareerPath.getOverallProgress())
                .currentStepIndex(userCareerPath.getCurrentStepIndex())
                .currentProgress(userCareerPath.getCurrentProgress())
                .aiAnalysis(generateAIAnalysis(userId, careerPath))
                .aiRecommendation(generateAIRecommendation(userId, careerPath))
                .steps(stepDTOs)
                .build();
    }

    /**
     * User chọn một career path
     */
    public UserCareerPath selectCareerPath(Long userId, String careerPathCode) {
        log.info("User {} selecting career path: {}", userId, careerPathCode);

        CareerPath careerPath = careerPathRepository.findByCode(careerPathCode)
                .orElseThrow(() -> new RuntimeException("Career path not found: " + careerPathCode));

        UserCareerPath userCareerPath = userCareerPathRepository.findByUserId(userId)
                .orElse(UserCareerPath.builder()
                        .userId(userId)
                        .careerPath(careerPath)
                        .currentStepIndex(0)
                        .currentProgress(0)
                        .overallProgress(0)
                        .build());

        userCareerPath.setCareerPath(careerPath);
        userCareerPath.setCurrentStepIndex(0);
        userCareerPath.setCurrentProgress(0);
        userCareerPath.setOverallProgress(0);

        return userCareerPathRepository.save(userCareerPath);
    }

    /**
     * Tính toán độ phù hợp (match percentage)
     */
    private Integer calculateMatchPercentage(Long userId, CareerPath path) {
        // TODO: Implement actual AI logic based on user skills, projects, etc.
        // For now, return mock values based on path code
        switch (path.getCode().toLowerCase()) {
            case "ba":
                return 95;
            case "uiux":
                return 88;
            case "da":
                return 72;
            default:
                return 70;
        }
    }

    /**
     * Xác định trạng thái của step
     */
    private String determineStepStatus(Integer stepOrder, Integer currentStepIndex) {
        if (stepOrder < currentStepIndex) {
            return "completed";
        } else if (stepOrder.equals(currentStepIndex)) {
            return "active";
        } else {
            return "locked";
        }
    }

    /**
     * Parse tasks từ JSON string
     */
    private List<String> parseTasks(String tasksJson) {
        if (tasksJson == null || tasksJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(tasksJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse tasks JSON: {}", tasksJson);
            return new ArrayList<>();
        }
    }

    /**
     * Generate AI Analysis
     */
    private String generateAIAnalysis(Long userId, CareerPath path) {
        return String.format("Dựa trên các dự án cũ, bạn có khả năng **Tư duy Logic đạt 9.5/10** và kỹ năng **Viết tài liệu sắc bén**. Lộ trình này sẽ giúp bạn thăng tiến nhanh hơn 40%% so với lập trình thuần túy.");
    }

    /**
     * Generate AI Recommendation
     */
    private String generateAIRecommendation(Long userId, CareerPath path) {
        return String.format("Tại sao %s là lựa chọn số 1 của bạn?", path.getTitle());
    }
}

