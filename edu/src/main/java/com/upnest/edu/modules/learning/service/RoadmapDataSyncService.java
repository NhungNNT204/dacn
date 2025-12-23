package com.upnest.edu.modules.learning.service;

// Removed unused imports
import com.upnest.edu.modules.learning.entity.CareerTrack;
import com.upnest.edu.modules.learning.entity.RoadmapStep;
import com.upnest.edu.modules.learning.repository.CareerTrackRepository;
import com.upnest.edu.modules.learning.repository.RoadmapStepRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

/**
 * RoadmapDataSyncService - Service để fetch và sync dữ liệu từ roadmap.sh
 * Transform data từ roadmap.sh structure sang UpNest format và lưu vào database
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapDataSyncService {

    private final CareerTrackRepository careerTrackRepository;
    private final RoadmapStepRepository roadmapStepRepository;

    /**
     * Mapping các roadmap keys từ roadmap.sh
     */
    private static final Map<String, String> ROADMAP_URLS;
    
    static {
        Map<String, String> urls = new LinkedHashMap<>();
        urls.put("frontend", "https://roadmap.sh/frontend");
        urls.put("backend", "https://roadmap.sh/backend");
        urls.put("devops", "https://roadmap.sh/devops");
        urls.put("fullstack", "https://roadmap.sh/full-stack");
        urls.put("android", "https://roadmap.sh/android");
        urls.put("qa", "https://roadmap.sh/qa");
        urls.put("python", "https://roadmap.sh/python");
        urls.put("java", "https://roadmap.sh/java");
        urls.put("nodejs", "https://roadmap.sh/nodejs");
        urls.put("react", "https://roadmap.sh/react");
        urls.put("vue", "https://roadmap.sh/vue");
        urls.put("angular", "https://roadmap.sh/angular");
        urls.put("javascript", "https://roadmap.sh/javascript");
        urls.put("typescript", "https://roadmap.sh/typescript");
        urls.put("golang", "https://roadmap.sh/golang");
        urls.put("rust", "https://roadmap.sh/rust");
        urls.put("sql", "https://roadmap.sh/sql");
        urls.put("postgresql", "https://roadmap.sh/postgresql-dba");
        urls.put("mongodb", "https://roadmap.sh/mongodb");
        urls.put("kubernetes", "https://roadmap.sh/kubernetes");
        urls.put("docker", "https://roadmap.sh/docker");
        urls.put("aws", "https://roadmap.sh/aws");
        urls.put("azure", "https://roadmap.sh/azure");
        urls.put("blockchain", "https://roadmap.sh/blockchain");
        urls.put("cyber-security", "https://roadmap.sh/cyber-security");
        urls.put("ml-engineer", "https://roadmap.sh/ml-engineer");
        urls.put("data-engineer", "https://roadmap.sh/data-engineer");
        urls.put("system-design", "https://roadmap.sh/system-design");
        urls.put("api-design", "https://roadmap.sh/api-design");
        urls.put("git", "https://roadmap.sh/git");
        ROADMAP_URLS = Collections.unmodifiableMap(urls);
    }

    /**
     * Sync tất cả roadmaps từ roadmap.sh vào database
     */
    @Transactional
    public Map<String, Object> syncAllRoadmaps() {
        log.info("Starting sync all roadmaps from roadmap.sh");
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (Map.Entry<String, String> entry : ROADMAP_URLS.entrySet()) {
            try {
                syncRoadmap(entry.getKey(), entry.getValue());
                successCount++;
                log.info("Successfully synced roadmap: {}", entry.getKey());
            } catch (Exception e) {
                failCount++;
                String error = String.format("Failed to sync %s: %s", entry.getKey(), e.getMessage());
                errors.add(error);
                log.error(error, e);
            }
        }

        result.put("success", true);
        result.put("total", ROADMAP_URLS.size());
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("errors", errors);
        result.put("message", String.format("Synced %d/%d roadmaps successfully", successCount, ROADMAP_URLS.size()));

        return result;
    }

    /**
     * Sync một roadmap cụ thể từ roadmap.sh
     */
    @Transactional
    public Map<String, Object> syncRoadmap(String roadmapKey, String url) {
        log.info("Syncing roadmap: {} from URL: {}", roadmapKey, url);

        try {
            // Fetch HTML từ roadmap.sh
            Document doc = fetchRoadmapHTML(url);
            
            // Parse roadmap structure
            RoadmapParsedData parsedData = parseRoadmapHTML(doc, roadmapKey);
            
            // Lưu vào database
            CareerTrack track = saveRoadmapToDatabase(roadmapKey, parsedData);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("roadmapKey", roadmapKey);
            result.put("trackId", track.getId());
            result.put("stepsCount", parsedData.getTotalStepsCount());
            result.put("message", "Roadmap synced successfully");
            
            return result;
        } catch (IOException e) {
            log.error("Error fetching roadmap from {}", url, e);
            // Fallback: sử dụng structured data từ code
            return syncRoadmapFromStructuredData(roadmapKey);
        } catch (Exception e) {
            log.error("Error syncing roadmap: {}", roadmapKey, e);
            throw new RuntimeException("Failed to sync roadmap: " + roadmapKey, e);
        }
    }

    /**
     * Fetch HTML từ roadmap.sh
     */
    private Document fetchRoadmapHTML(String url) throws IOException {
        log.info("Fetching HTML from: {}", url);
        
        // Roadmap.sh có thể chặn bots, nên set user agent
        return Jsoup.connect(url)
            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            .timeout(10000)
            .get();
    }

    /**
     * Parse HTML structure từ roadmap.sh
     * Roadmap.sh có structure: Groups -> Items -> Topics
     */
    private RoadmapParsedData parseRoadmapHTML(Document doc, String roadmapKey) {
        RoadmapParsedData data = new RoadmapParsedData();
        data.setRoadmapKey(roadmapKey);
        
        // Parse title
        Element titleElement = doc.selectFirst("h1, .roadmap-title, .title");
        if (titleElement != null) {
            data.setTitle(titleElement.text().trim());
        } else {
            data.setTitle(capitalizeRoadmapName(roadmapKey));
        }

        // Parse description
        Element descElement = doc.selectFirst(".roadmap-description, .description, p.lead");
        if (descElement != null) {
            data.setDescription(descElement.text().trim());
        }

        // Parse roadmap structure (groups and items)
        Elements groups = doc.select(".roadmap-group, .group, section");
        
        List<RoadmapSection> sections = new ArrayList<>();
        int sectionOrder = 0;

        for (Element group : groups) {
            RoadmapSection section = new RoadmapSection();
            
            // Section title/level
            Element sectionTitle = group.selectFirst("h2, h3, .group-title, .section-title");
            if (sectionTitle != null) {
                section.setLevel(sectionTitle.text().trim());
            } else {
                section.setLevel("Level " + (sectionOrder + 1));
            }

            // Parse items/milestones trong group
            Elements items = group.select(".roadmap-item, .item, li.item, .milestone");
            List<RoadmapMilestone> milestones = new ArrayList<>();
            int milestoneOrder = 0;

            for (Element item : items) {
                RoadmapMilestone milestone = new RoadmapMilestone();
                
                // Milestone title
                Element itemTitle = item.selectFirst("h3, h4, .item-title, .title, a");
                if (itemTitle != null) {
                    milestone.setTitle(itemTitle.text().trim());
                } else {
                    milestone.setTitle(item.text().trim());
                }

                // Parse topics/sub-items
                Elements topics = item.select(".topic, .sub-item, ul li, .checklist-item");
                List<String> topicsList = new ArrayList<>();
                
                for (Element topic : topics) {
                    String topicText = topic.text().trim();
                    if (!topicText.isEmpty() && !topicsList.contains(topicText)) {
                        topicsList.add(topicText);
                    }
                }

                milestone.setTopics(topicsList);
                milestone.setOrderIndex(milestoneOrder++);
                milestones.add(milestone);
            }

            section.setMilestones(milestones);
            section.setOrderIndex(sectionOrder++);
            sections.add(section);
        }

        data.setSections(sections);
        
        // Nếu không parse được từ HTML, dùng fallback data
        if (sections.isEmpty()) {
            log.warn("No sections parsed from HTML for {}, using fallback", roadmapKey);
            data = getFallbackRoadmapData(roadmapKey);
        }

        return data;
    }

    /**
     * Lưu roadmap vào database
     */
    private CareerTrack saveRoadmapToDatabase(String roadmapKey, RoadmapParsedData data) {
        // Tìm hoặc tạo CareerTrack
        CareerTrack track = careerTrackRepository.findByCode(roadmapKey)
            .orElseGet(() -> {
                CareerTrack newTrack = CareerTrack.builder()
                    .code(roadmapKey)
                    .name(data.getTitle())
                    .description(data.getDescription())
                    .icon(getIconForRoadmap(roadmapKey))
                    .color(getColorForRoadmap(roadmapKey))
                    .build();
                return careerTrackRepository.save(newTrack);
            });

        // Update track info nếu cần
        if (!track.getName().equals(data.getTitle())) {
            track.setName(data.getTitle());
        }
        if (data.getDescription() != null && !data.getDescription().isEmpty()) {
            track.setDescription(data.getDescription());
        }
        track = careerTrackRepository.save(track);

        // Xóa các steps cũ (nếu sync lại)
        roadmapStepRepository.findByTrackIdOrderByOrderIndex(track.getId())
            .forEach(step -> roadmapStepRepository.delete(step));

        // Tạo RoadmapSteps từ parsed data
        int globalOrderIndex = 0;
        for (RoadmapSection section : data.getSections()) {
            for (RoadmapMilestone milestone : section.getMilestones()) {
                RoadmapStep step = RoadmapStep.builder()
                    .careerTrack(track)
                    .orderIndex(globalOrderIndex++)
                    .title(milestone.getTitle())
                    .description(String.join(", ", milestone.getTopics()))
                    .durationWeeks(estimateDuration(milestone.getTopics().size()))
                    .difficulty(determineDifficulty(section.getLevel(), globalOrderIndex))
                    .rewardXp(calculateRewardXp(globalOrderIndex, milestone.getTopics().size()))
                    .icon(getIconForMilestone(milestone.getTitle()))
                    .build();
                
                roadmapStepRepository.save(step);
            }
        }

        log.info("Saved roadmap {} with {} steps", roadmapKey, globalOrderIndex);
        return track;
    }

    /**
     * Sync roadmap từ structured data (fallback khi không fetch được từ web)
     */
    @Transactional
    private Map<String, Object> syncRoadmapFromStructuredData(String roadmapKey) {
        log.info("Syncing roadmap {} from structured data (fallback)", roadmapKey);
        
        RoadmapParsedData data = getFallbackRoadmapData(roadmapKey);
        CareerTrack track = saveRoadmapToDatabase(roadmapKey, data);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("roadmapKey", roadmapKey);
        result.put("trackId", track.getId());
        result.put("stepsCount", data.getTotalStepsCount());
        result.put("message", "Roadmap synced from structured data");
        result.put("source", "fallback");
        
        return result;
    }

    /**
     * Get fallback roadmap data (structured data từ code)
     */
    private RoadmapParsedData getFallbackRoadmapData(String roadmapKey) {
        RoadmapParsedData data = new RoadmapParsedData();
        data.setRoadmapKey(roadmapKey);

        // Tạo structured data dựa trên roadmap key
        switch (roadmapKey) {
            case "frontend":
                data.setTitle("Frontend Developer");
                data.setDescription("Lộ trình từ con số 0 đến chuyên gia xây dựng giao diện Web hiện đại.");
                data.setSections(createFrontendSections());
                break;
            case "backend":
                data.setTitle("Backend Developer");
                data.setDescription("Làm chủ máy chủ, cơ sở dữ liệu và hệ thống API quy mô lớn.");
                data.setSections(createBackendSections());
                break;
            case "devops":
                data.setTitle("DevOps Engineer");
                data.setDescription("Tự động hóa quy trình phát triển và triển khai ứng dụng.");
                data.setSections(createDevOpsSections());
                break;
            case "data-analyst":
            case "data-engineer":
                data.setTitle("Data Analyst");
                data.setDescription("Khám phá câu chuyện đằng sau các con số để đưa ra quyết định kinh doanh.");
                data.setSections(createDataAnalystSections());
                break;
            default:
                data.setTitle(capitalizeRoadmapName(roadmapKey));
                data.setDescription("Lộ trình học tập chuyên sâu cho " + capitalizeRoadmapName(roadmapKey));
                data.setSections(createDefaultSections());
        }

        return data;
    }

    // Helper methods
    private List<RoadmapSection> createFrontendSections() {
        List<RoadmapSection> sections = new ArrayList<>();
        
        RoadmapSection fundamental = new RoadmapSection();
        fundamental.setLevel("Nền tảng (Fundamental)");
        fundamental.setOrderIndex(0);
        fundamental.setMilestones(Arrays.asList(
            createMilestone("Internet & HTML", Arrays.asList("HTTP/HTTPS", "Domain/Hosting", "Semantic HTML", "Forms & Validation"), 0),
            createMilestone("CSS Basics", Arrays.asList("Selectors", "Box Model", "Flexbox", "CSS Grid", "Responsive Design"), 1),
            createMilestone("JavaScript Ecosystem", Arrays.asList("DOM Manipulation", "ES6+ Syntax", "Fetch API", "Async/Await"), 2)
        ));
        sections.add(fundamental);

        RoadmapSection core = new RoadmapSection();
        core.setLevel("Kỹ năng lõi (Core)");
        core.setOrderIndex(1);
        core.setMilestones(Arrays.asList(
            createMilestone("Version Control", Arrays.asList("Git Basics", "Branching", "Pull Requests", "GitHub Workflows"), 0),
            createMilestone("Frontend Frameworks", Arrays.asList("React JS", "State Management", "Hooks", "Next.js", "React Router"), 1),
            createMilestone("Modern Styling", Arrays.asList("Tailwind CSS", "Styled Components", "Sass", "CSS Modules"), 2)
        ));
        sections.add(core);

        RoadmapSection advanced = new RoadmapSection();
        advanced.setLevel("Chuyên sâu (Advanced)");
        advanced.setOrderIndex(2);
        advanced.setMilestones(Arrays.asList(
            createMilestone("Testing & Quality", Arrays.asList("Jest", "React Testing Library", "E2E Testing", "CI/CD"), 0),
            createMilestone("Performance Optimization", Arrays.asList("Code Splitting", "Lazy Loading", "Bundle Optimization", "Web Vitals"), 1)
        ));
        sections.add(advanced);

        return sections;
    }

    private List<RoadmapSection> createBackendSections() {
        List<RoadmapSection> sections = new ArrayList<>();
        
        RoadmapSection basics = new RoadmapSection();
        basics.setLevel("Cơ sở (Basics)");
        basics.setOrderIndex(0);
        basics.setMilestones(Arrays.asList(
            createMilestone("Operating Systems", Arrays.asList("Linux Basics", "Terminal Usage", "Process Management", "File Systems"), 0),
            createMilestone("Java / Spring Boot", Arrays.asList("OOP Principles", "Spring Boot Core", "JPA/Hibernate", "Spring Security"), 1),
            createMilestone("Relational Databases", Arrays.asList("SQL Syntax", "Indexing", "Normalization", "Transactions"), 2)
        ));
        sections.add(basics);

        return sections;
    }

    private List<RoadmapSection> createDevOpsSections() {
        List<RoadmapSection> sections = new ArrayList<>();
        
        RoadmapSection foundation = new RoadmapSection();
        foundation.setLevel("Nền tảng");
        foundation.setOrderIndex(0);
        foundation.setMilestones(Arrays.asList(
            createMilestone("Linux Mastery", Arrays.asList("Shell Scripting", "System Administration", "Networking"), 0)
        ));
        sections.add(foundation);

        return sections;
    }

    private List<RoadmapSection> createDataAnalystSections() {
        List<RoadmapSection> sections = new ArrayList<>();
        
        RoadmapSection foundation = new RoadmapSection();
        foundation.setLevel("Nền tảng");
        foundation.setOrderIndex(0);
        foundation.setMilestones(Arrays.asList(
            createMilestone("SQL Fundamentals", Arrays.asList("SELECT Queries", "JOINs", "Aggregations", "Window Functions"), 0)
        ));
        sections.add(foundation);

        return sections;
    }

    private List<RoadmapSection> createDefaultSections() {
        List<RoadmapSection> sections = new ArrayList<>();
        
        RoadmapSection foundation = new RoadmapSection();
        foundation.setLevel("Nền tảng");
        foundation.setOrderIndex(0);
        foundation.setMilestones(Arrays.asList(
            createMilestone("Fundamentals", Arrays.asList("Core Concepts", "Basic Tools", "Getting Started"), 0)
        ));
        sections.add(foundation);

        return sections;
    }

    private RoadmapMilestone createMilestone(String title, List<String> topics, int order) {
        RoadmapMilestone milestone = new RoadmapMilestone();
        milestone.setTitle(title);
        milestone.setTopics(topics);
        milestone.setOrderIndex(order);
        return milestone;
    }

    private String capitalizeRoadmapName(String key) {
        return Arrays.stream(key.split("-"))
            .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
            .reduce((a, b) -> a + " " + b)
            .orElse(key);
    }

    private RoadmapStep.DifficultyLevel determineDifficulty(String sectionLevel, int orderIndex) {
        if (sectionLevel != null) {
            String lower = sectionLevel.toLowerCase();
            if (lower.contains("advanced") || lower.contains("chuyên sâu")) {
                return RoadmapStep.DifficultyLevel.ADVANCED;
            } else if (lower.contains("core") || lower.contains("lõi")) {
                return RoadmapStep.DifficultyLevel.INTERMEDIATE;
            }
        }
        if (orderIndex < 3) {
            return RoadmapStep.DifficultyLevel.BEGINNER;
        } else if (orderIndex < 6) {
            return RoadmapStep.DifficultyLevel.INTERMEDIATE;
        } else {
            return RoadmapStep.DifficultyLevel.ADVANCED;
        }
    }

    private Integer estimateDuration(int topicsCount) {
        // Ước tính: mỗi topic ~ 1-2 tuần
        return Math.max(1, topicsCount / 2);
    }

    private Integer calculateRewardXp(int orderIndex, int topicsCount) {
        // XP tăng dần theo order, và theo số topics
        return 200 + (orderIndex * 100) + (topicsCount * 50);
    }

    private String getIconForRoadmap(String roadmapKey) {
        Map<String, String> iconMap = Map.of(
            "frontend", "PenTool",
            "backend", "Code2",
            "devops", "Settings",
            "data-analyst", "BarChart3",
            "data-engineer", "Database"
        );
        return iconMap.getOrDefault(roadmapKey, "Compass");
    }

    private String getColorForRoadmap(String roadmapKey) {
        Map<String, String> colorMap = Map.of(
            "frontend", "rose",
            "backend", "indigo",
            "devops", "emerald",
            "data-analyst", "amber"
        );
        return colorMap.getOrDefault(roadmapKey, "slate");
    }

    private String getIconForMilestone(String title) {
        if (title.toLowerCase().contains("html")) return "Html";
        if (title.toLowerCase().contains("css")) return "Css";
        if (title.toLowerCase().contains("javascript") || title.toLowerCase().contains("js")) return "Javascript";
        if (title.toLowerCase().contains("react")) return "React";
        if (title.toLowerCase().contains("git")) return "Git";
        if (title.toLowerCase().contains("database") || title.toLowerCase().contains("sql")) return "Database";
        return "CheckCircle";
    }

    // Inner classes for parsed data structure
    private static class RoadmapParsedData {
        private String roadmapKey;
        private String title;
        private String description;
        private List<RoadmapSection> sections = new ArrayList<>();

        public int getTotalStepsCount() {
            return sections.stream()
                .mapToInt(section -> section.getMilestones().size())
                .sum();
        }

        // Getters and setters
        public String getRoadmapKey() { return roadmapKey; }
        public void setRoadmapKey(String roadmapKey) { this.roadmapKey = roadmapKey; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<RoadmapSection> getSections() { return sections; }
        public void setSections(List<RoadmapSection> sections) { this.sections = sections; }
    }

    private static class RoadmapSection {
        private String level;
        private int orderIndex;
        private List<RoadmapMilestone> milestones = new ArrayList<>();

        // Getters and setters
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public int getOrderIndex() { return orderIndex; }
        public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
        public List<RoadmapMilestone> getMilestones() { return milestones; }
        public void setMilestones(List<RoadmapMilestone> milestones) { this.milestones = milestones; }
    }

    private static class RoadmapMilestone {
        private String title;
        private List<String> topics = new ArrayList<>();
        private int orderIndex;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public List<String> getTopics() { return topics; }
        public void setTopics(List<String> topics) { this.topics = topics; }
        public int getOrderIndex() { return orderIndex; }
        public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    }
}

