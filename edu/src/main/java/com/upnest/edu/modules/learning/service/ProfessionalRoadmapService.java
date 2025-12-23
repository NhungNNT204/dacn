package com.upnest.edu.modules.learning.service;

import com.upnest.edu.modules.learning.entity.CareerTrack;
import com.upnest.edu.modules.learning.entity.LearningRoadmap;
import com.upnest.edu.modules.learning.entity.RoadmapStep;
import com.upnest.edu.modules.learning.repository.CareerTrackRepository;
import com.upnest.edu.modules.learning.repository.LearningRoadmapRepository;
import com.upnest.edu.modules.learning.repository.RoadmapStepRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * ProfessionalRoadmapService - Service để quản lý lộ trình học tập chuyên sâu
 * Lấy cảm hứng từ roadmap.sh với cấu trúc phân tầng: Sections -> Milestones -> Topics
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessionalRoadmapService {

    private final LearningRoadmapRepository learningRoadmapRepository;
    private final CareerTrackRepository careerTrackRepository;
    private final RoadmapStepRepository roadmapStepRepository;
    // Reserved for future use
    // private final RestTemplate restTemplate = new RestTemplate();
    // private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Lấy roadmap data từ roadmap.sh structure
     * Ưu tiên lấy từ database, nếu không có thì dùng mock data
     */
    public Map<String, Object> getRoadmapData(String roadmapKey) {
        log.info("Getting roadmap data for key: {}", roadmapKey);

        // Thử lấy từ database trước
        Optional<CareerTrack> trackOpt = careerTrackRepository.findByCode(roadmapKey);
        if (trackOpt.isPresent()) {
            CareerTrack track = trackOpt.get();
            List<RoadmapStep> steps = roadmapStepRepository.findByTrackIdOrderByOrderIndex(track.getId());
            
            // Convert database entities sang Map structure
            return convertTrackToMap(track, steps);
        }

        // Fallback: dùng mock data
        log.info("Roadmap {} not found in database, using mock data", roadmapKey);
        return getMockRoadmapData(roadmapKey);
    }

    /**
     * Convert CareerTrack và RoadmapSteps từ database sang Map structure
     */
    private Map<String, Object> convertTrackToMap(CareerTrack track, List<RoadmapStep> steps) {
        Map<String, Object> roadmap = new HashMap<>();
        roadmap.put("title", track.getName());
        roadmap.put("description", track.getDescription());
        roadmap.put("code", track.getCode());
        roadmap.put("match", 90); // Default match percentage

        // Group steps by difficulty/level
        List<Map<String, Object>> sections = new ArrayList<>();
        
        // Group theo difficulty level
        Map<String, List<RoadmapStep>> stepsByLevel = new LinkedHashMap<>();
        stepsByLevel.put("Nền tảng (Fundamental)", new ArrayList<>());
        stepsByLevel.put("Kỹ năng lõi (Core)", new ArrayList<>());
        stepsByLevel.put("Chuyên sâu (Advanced)", new ArrayList<>());

        for (RoadmapStep step : steps) {
            String level;
            switch (step.getDifficulty()) {
                case BEGINNER:
                    level = "Nền tảng (Fundamental)";
                    break;
                case INTERMEDIATE:
                    level = "Kỹ năng lõi (Core)";
                    break;
                case ADVANCED:
                case EXPERT:
                    level = "Chuyên sâu (Advanced)";
                    break;
                default:
                    level = "Nền tảng (Fundamental)";
            }
            stepsByLevel.get(level).add(step);
        }

        int sectionOrder = 0;
        for (Map.Entry<String, List<RoadmapStep>> entry : stepsByLevel.entrySet()) {
            if (entry.getValue().isEmpty()) continue;

            Map<String, Object> section = new HashMap<>();
            section.put("level", entry.getKey());
            section.put("orderIndex", sectionOrder++);

            List<Map<String, Object>> milestones = new ArrayList<>();
            for (RoadmapStep step : entry.getValue()) {
                Map<String, Object> milestone = new HashMap<>();
                milestone.put("id", "step-" + step.getId());
                milestone.put("title", step.getTitle());
                
                // Parse topics từ description (format: "Topic1, Topic2, Topic3")
                List<String> topics = new ArrayList<>();
                if (step.getDescription() != null && !step.getDescription().isEmpty()) {
                    String[] topicArray = step.getDescription().split(",");
                    for (String topic : topicArray) {
                        String trimmed = topic.trim();
                        if (!trimmed.isEmpty()) {
                            topics.add(trimmed);
                        }
                    }
                }
                
                // Default topics nếu không có
                if (topics.isEmpty()) {
                    topics.add("Học " + step.getTitle());
                }
                
                milestone.put("topics", topics);
                milestone.put("status", "locked"); // Default status
                milestones.add(milestone);
            }

            section.put("milestones", milestones);
            sections.add(section);
        }

        roadmap.put("sections", sections);
        return roadmap;
    }

    /**
     * Lấy danh sách tất cả roadmaps có sẵn
     */
    public List<Map<String, Object>> getAllAvailableRoadmaps() {
        log.info("Getting all available roadmaps");

        List<Map<String, Object>> roadmaps = new ArrayList<>();
        
        // Frontend Developer Roadmap
        Map<String, Object> frontend = getRoadmapData("frontend");
        roadmaps.add(frontend);

        // Backend Developer Roadmap
        Map<String, Object> backend = getRoadmapData("backend");
        roadmaps.add(backend);

        // DevOps Roadmap
        Map<String, Object> devops = getRoadmapData("devops");
        roadmaps.add(devops);

        // Data Analyst Roadmap
        Map<String, Object> dataAnalyst = getRoadmapData("data-analyst");
        roadmaps.add(dataAnalyst);

        return roadmaps;
    }

    /**
     * Lấy roadmap data với progress của user
     */
    public Map<String, Object> getRoadmapWithProgress(String roadmapKey, Long userId) {
        Map<String, Object> roadmapData = getRoadmapData(roadmapKey);
        
        // Load user's progress nếu có
        Optional<LearningRoadmap> userRoadmap = learningRoadmapRepository.findByUserId(userId);
        int currentStepIndex = userRoadmap.map(LearningRoadmap::getCurrentStepIndex).orElse(0);
        int currentProgress = userRoadmap.map(LearningRoadmap::getCurrentProgress).orElse(0);
        
        // Update milestone status dựa trên progress và tính toán progress
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> sectionsList = (List<Map<String, Object>>) roadmapData.get("sections");
        
        int totalMilestones = 0;
        int completedMilestones = 0;
        
        if (sectionsList != null) {
            int globalStepIndex = 0;
            for (Map<String, Object> section : sectionsList) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> milestones = (List<Map<String, Object>>) section.get("milestones");
                
                if (milestones != null) {
                    for (Map<String, Object> milestone : milestones) {
                        totalMilestones++;
                        
                        // Set status dựa trên progress
                        if (globalStepIndex < currentStepIndex) {
                            milestone.put("status", "completed");
                            completedMilestones++;
                        } else if (globalStepIndex == currentStepIndex) {
                            milestone.put("status", "active");
                            // Nếu progress > 50%, có thể coi như đang hoàn thành
                            if (currentProgress >= 50) {
                                milestone.put("status", "active");
                            }
                        } else {
                            milestone.put("status", "locked");
                        }
                        globalStepIndex++;
                    }
                }
            }
        }

        int overallProgress = totalMilestones > 0 ? 
            (int) Math.round((double) completedMilestones / totalMilestones * 100) : 0;

        roadmapData.put("overallProgress", overallProgress);
        roadmapData.put("completedMilestones", completedMilestones);
        roadmapData.put("totalMilestones", totalMilestones);

        return roadmapData;
    }

    /**
     * Mock roadmap data dựa trên roadmap.sh structure
     */
    private Map<String, Object> getMockRoadmapData(String roadmapKey) {
        Map<String, Object> roadmap = new HashMap<>();

        switch (roadmapKey) {
            case "frontend":
                roadmap = createFrontendRoadmap();
                break;
            case "backend":
                roadmap = createBackendRoadmap();
                break;
            case "devops":
                roadmap = createDevOpsRoadmap();
                break;
            case "data-analyst":
                roadmap = createDataAnalystRoadmap();
                break;
            default:
                roadmap = createFrontendRoadmap(); // Default
        }

        return roadmap;
    }

    /**
     * Frontend Developer Roadmap - Dựa trên roadmap.sh
     */
    private Map<String, Object> createFrontendRoadmap() {
        Map<String, Object> roadmap = new HashMap<>();
        roadmap.put("title", "Frontend Developer");
        roadmap.put("description", "Lộ trình từ con số 0 đến chuyên gia xây dựng giao diện Web hiện đại.");
        roadmap.put("match", 92);
        roadmap.put("code", "frontend");

        List<Map<String, Object>> sections = new ArrayList<>();

        // Section 1: Nền tảng (Fundamental)
        Map<String, Object> fundamental = new HashMap<>();
        fundamental.put("level", "Nền tảng (Fundamental)");
        List<Map<String, Object>> fundamentalMilestones = new ArrayList<>();

        Map<String, Object> html = new HashMap<>();
        html.put("id", "html");
        html.put("title", "Internet & HTML");
        html.put("status", "completed");
        html.put("topics", Arrays.asList("HTTP/HTTPS", "Domain/Hosting", "Semantic HTML", "Forms & Validation"));
        fundamentalMilestones.add(html);

        Map<String, Object> css = new HashMap<>();
        css.put("id", "css");
        css.put("title", "CSS Basics");
        css.put("status", "completed");
        css.put("topics", Arrays.asList("Selectors", "Box Model", "Flexbox", "CSS Grid", "Responsive Design"));
        fundamentalMilestones.add(css);

        Map<String, Object> js = new HashMap<>();
        js.put("id", "js");
        js.put("title", "JavaScript Ecosystem");
        js.put("status", "active");
        js.put("topics", Arrays.asList("DOM Manipulation", "ES6+ Syntax", "Fetch API", "Async/Await"));
        fundamentalMilestones.add(js);

        fundamental.put("milestones", fundamentalMilestones);
        sections.add(fundamental);

        // Section 2: Kỹ năng lõi (Core)
        Map<String, Object> core = new HashMap<>();
        core.put("level", "Kỹ năng lõi (Core)");
        List<Map<String, Object>> coreMilestones = new ArrayList<>();

        Map<String, Object> git = new HashMap<>();
        git.put("id", "git");
        git.put("title", "Version Control");
        git.put("status", "locked");
        git.put("topics", Arrays.asList("Git Basics", "Branching", "Pull Requests", "GitHub Workflows"));
        coreMilestones.add(git);

        Map<String, Object> framework = new HashMap<>();
        framework.put("id", "framework");
        framework.put("title", "Frontend Frameworks");
        framework.put("status", "locked");
        framework.put("topics", Arrays.asList("React JS", "State Management", "Hooks", "Next.js", "React Router"));
        coreMilestones.add(framework);

        Map<String, Object> styling = new HashMap<>();
        styling.put("id", "styling");
        styling.put("title", "Modern Styling");
        styling.put("status", "locked");
        styling.put("topics", Arrays.asList("Tailwind CSS", "Styled Components", "Sass", "CSS Modules"));
        coreMilestones.add(styling);

        core.put("milestones", coreMilestones);
        sections.add(core);

        // Section 3: Chuyên sâu (Advanced)
        Map<String, Object> advanced = new HashMap<>();
        advanced.put("level", "Chuyên sâu (Advanced)");
        List<Map<String, Object>> advancedMilestones = new ArrayList<>();

        Map<String, Object> testing = new HashMap<>();
        testing.put("id", "testing");
        testing.put("title", "Testing & Quality");
        testing.put("status", "locked");
        testing.put("topics", Arrays.asList("Jest", "React Testing Library", "E2E Testing", "CI/CD"));
        advancedMilestones.add(testing);

        Map<String, Object> performance = new HashMap<>();
        performance.put("id", "performance");
        performance.put("title", "Performance Optimization");
        performance.put("status", "locked");
        performance.put("topics", Arrays.asList("Code Splitting", "Lazy Loading", "Bundle Optimization", "Web Vitals"));
        advancedMilestones.add(performance);

        advanced.put("milestones", advancedMilestones);
        sections.add(advanced);

        roadmap.put("sections", sections);
        return roadmap;
    }

    /**
     * Backend Developer Roadmap
     */
    private Map<String, Object> createBackendRoadmap() {
        Map<String, Object> roadmap = new HashMap<>();
        roadmap.put("title", "Backend Developer");
        roadmap.put("description", "Làm chủ máy chủ, cơ sở dữ liệu và hệ thống API quy mô lớn.");
        roadmap.put("match", 95);
        roadmap.put("code", "backend");

        List<Map<String, Object>> sections = new ArrayList<>();

        // Section 1: Cơ sở (Basics)
        Map<String, Object> basics = new HashMap<>();
        basics.put("level", "Cơ sở (Basics)");
        List<Map<String, Object>> basicMilestones = new ArrayList<>();

        Map<String, Object> os = new HashMap<>();
        os.put("id", "os");
        os.put("title", "Operating Systems");
        os.put("status", "completed");
        os.put("topics", Arrays.asList("Linux Basics", "Terminal Usage", "Process Management", "File Systems"));
        basicMilestones.add(os);

        Map<String, Object> lang = new HashMap<>();
        lang.put("id", "lang");
        lang.put("title", "Java / Spring Boot");
        lang.put("status", "active");
        lang.put("topics", Arrays.asList("OOP Principles", "Spring Boot Core", "JPA/Hibernate", "Spring Security"));
        basicMilestones.add(lang);

        Map<String, Object> db = new HashMap<>();
        db.put("id", "db");
        db.put("title", "Relational Databases");
        db.put("status", "locked");
        db.put("topics", Arrays.asList("SQL Syntax", "Indexing", "Normalization", "Transactions"));
        basicMilestones.add(db);

        basics.put("milestones", basicMilestones);
        sections.add(basics);

        roadmap.put("sections", sections);
        return roadmap;
    }

    /**
     * DevOps Roadmap
     */
    private Map<String, Object> createDevOpsRoadmap() {
        Map<String, Object> roadmap = new HashMap<>();
        roadmap.put("title", "DevOps Engineer");
        roadmap.put("description", "Tự động hóa quy trình phát triển và triển khai ứng dụng.");
        roadmap.put("match", 85);
        roadmap.put("code", "devops");

        List<Map<String, Object>> sections = new ArrayList<>();

        Map<String, Object> foundation = new HashMap<>();
        foundation.put("level", "Nền tảng");
        List<Map<String, Object>> milestones = new ArrayList<>();

        Map<String, Object> linux = new HashMap<>();
        linux.put("id", "linux");
        linux.put("title", "Linux Mastery");
        linux.put("status", "active");
        linux.put("topics", Arrays.asList("Shell Scripting", "System Administration", "Networking"));
        milestones.add(linux);

        foundation.put("milestones", milestones);
        sections.add(foundation);

        roadmap.put("sections", sections);
        return roadmap;
    }

    /**
     * Data Analyst Roadmap
     */
    private Map<String, Object> createDataAnalystRoadmap() {
        Map<String, Object> roadmap = new HashMap<>();
        roadmap.put("title", "Data Analyst");
        roadmap.put("description", "Khám phá câu chuyện đằng sau các con số để đưa ra quyết định kinh doanh.");
        roadmap.put("match", 78);
        roadmap.put("code", "data-analyst");

        List<Map<String, Object>> sections = new ArrayList<>();

        Map<String, Object> foundation = new HashMap<>();
        foundation.put("level", "Nền tảng");
        List<Map<String, Object>> milestones = new ArrayList<>();

        Map<String, Object> sql = new HashMap<>();
        sql.put("id", "sql");
        sql.put("title", "SQL Fundamentals");
        sql.put("status", "active");
        sql.put("topics", Arrays.asList("SELECT Queries", "JOINs", "Aggregations", "Window Functions"));
        milestones.add(sql);

        foundation.put("milestones", milestones);
        sections.add(foundation);

        roadmap.put("sections", sections);
        return roadmap;
    }

    /**
     * Lưu roadmap selection của user
     */
    @Transactional
    public Map<String, Object> selectRoadmap(Long userId, String roadmapKey) {
        log.info("User {} selecting roadmap: {}", userId, roadmapKey);

        // Lấy roadmap data
        Map<String, Object> roadmapData = getRoadmapData(roadmapKey);

        // Map roadmapKey sang CareerTrack code
        String trackCode = mapRoadmapKeyToTrackCode(roadmapKey);

        // Tìm CareerTrack tương ứng, nếu không có thì tạo mới
        CareerTrack careerTrack = careerTrackRepository.findByCode(trackCode)
            .orElseGet(() -> {
                // Tạo CareerTrack mới nếu chưa có
                CareerTrack newTrack = CareerTrack.builder()
                    .code(trackCode)
                    .name((String) roadmapData.get("title"))
                    .description((String) roadmapData.get("description"))
                    .icon(getIconForRoadmap(roadmapKey))
                    .color(getColorForRoadmap(roadmapKey))
                    .build();
                return careerTrackRepository.save(newTrack);
            });

        // Tìm hoặc tạo LearningRoadmap cho user
        LearningRoadmap userRoadmap = learningRoadmapRepository.findByUserId(userId)
            .orElseGet(() -> {
                // Tạo mới LearningRoadmap
                return LearningRoadmap.builder()
                    .userId(userId)
                    .careerTrack(careerTrack)
                    .currentStepIndex(0)
                    .currentProgress(0)
                    .build();
            });

        // Update CareerTrack nếu user chọn roadmap khác
        if (!userRoadmap.getCareerTrack().getCode().equals(trackCode)) {
            userRoadmap.setCareerTrack(careerTrack);
            userRoadmap.setCurrentStepIndex(0);
            userRoadmap.setCurrentProgress(0);
            // Reset AI insights khi đổi roadmap
            userRoadmap.setAiInsight(null);
            userRoadmap.setStrengthDescription(null);
            userRoadmap.setRecommendation(null);
        }

        // Lưu vào database
        learningRoadmapRepository.save(userRoadmap);
        log.info("Roadmap selection saved for user: {}, track: {}", userId, trackCode);

        // Trả về response với thông tin đã lưu
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã chọn lộ trình " + roadmapData.get("title") + " thành công!");
        response.put("roadmapKey", roadmapKey);
        response.put("roadmap", roadmapData);
        response.put("selectedAt", new Date());

        return response;
    }

    /**
     * Map roadmapKey sang CareerTrack code
     */
    private String mapRoadmapKeyToTrackCode(String roadmapKey) {
        switch (roadmapKey) {
            case "frontend":
                return "frontend";
            case "backend":
                return "backend";
            case "devops":
                return "devops";
            case "data-analyst":
                return "data-analyst";
            default:
                return roadmapKey;
        }
    }

    /**
     * Lấy icon cho roadmap
     */
    private String getIconForRoadmap(String roadmapKey) {
        switch (roadmapKey) {
            case "frontend":
                return "PenTool";
            case "backend":
                return "Code2";
            case "devops":
                return "Settings";
            case "data-analyst":
                return "BarChart3";
            default:
                return "Compass";
        }
    }

    /**
     * Lấy màu cho roadmap
     */
    private String getColorForRoadmap(String roadmapKey) {
        switch (roadmapKey) {
            case "frontend":
                return "rose";
            case "backend":
                return "indigo";
            case "devops":
                return "emerald";
            case "data-analyst":
                return "amber";
            default:
                return "slate";
        }
    }

    /**
     * Lấy roadmap đã chọn của user
     */
    public Map<String, Object> getSelectedRoadmap(Long userId) {
        log.info("Getting selected roadmap for user: {}", userId);

        Optional<LearningRoadmap> roadmapOpt = learningRoadmapRepository.findByUserIdWithTrack(userId);
        
        if (roadmapOpt.isPresent()) {
            LearningRoadmap roadmap = roadmapOpt.get();
            CareerTrack track = roadmap.getCareerTrack();
            
            // Lấy roadmap data dựa trên track code
            Map<String, Object> roadmapData = getRoadmapWithProgress(track.getCode(), userId);
            roadmapData.put("selectedAt", roadmap.getCreatedAt());
            roadmapData.put("currentStepIndex", roadmap.getCurrentStepIndex());
            roadmapData.put("currentProgress", roadmap.getCurrentProgress());
            
            return roadmapData;
        }

        return null; // Chưa có selection
    }
}

