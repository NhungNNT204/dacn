package com.upnest.edu.modules.career.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.upnest.edu.modules.career.entity.CareerPath;
import com.upnest.edu.modules.career.entity.RoadmapStep;
import com.upnest.edu.modules.career.repository.CareerPathRepository;
import com.upnest.edu.modules.career.repository.RoadmapStepRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

/**
 * CareerDataSeeder - Seed dữ liệu cho career paths và roadmap steps
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CareerDataSeeder implements CommandLineRunner {

    private final CareerPathRepository careerPathRepository;
    private final RoadmapStepRepository roadmapStepRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        if (careerPathRepository.count() > 0) {
            log.info("Career paths already exist, skipping seed");
            return;
        }

        log.info("Seeding career paths data...");

        // Business Analyst
        CareerPath ba = createCareerPath(
            "ba",
            "Business Analyst (BA)",
            "BarChart3",
            "indigo",
            "Cầu nối giữa kinh doanh và công nghệ. Phân tích yêu cầu và tối ưu quy trình.",
            "Rất cao",
            "15M - 45M VNĐ",
            CareerPath.DifficultyLevel.MODERATE,
            8,
            "Dựa trên các dự án cũ, bạn có khả năng Tư duy Logic đạt 9.5/10 và kỹ năng Viết tài liệu sắc bén."
        );
        ba = careerPathRepository.save(ba);
        createBASteps(ba);

        // UI/UX Designer
        CareerPath uiux = createCareerPath(
            "uiux",
            "UI/UX Designer",
            "PenTool",
            "rose",
            "Kiến tạo trải nghiệm người dùng tinh tế và giao diện ứng dụng hiện đại.",
            "Cao",
            "12M - 40M VNĐ",
            CareerPath.DifficultyLevel.MODERATE,
            6,
            "Với khả năng thiết kế và tư duy người dùng, bạn phù hợp với lộ trình UI/UX."
        );
        uiux = careerPathRepository.save(uiux);
        createUIUXSteps(uiux);

        // Data Analyst
        CareerPath da = createCareerPath(
            "da",
            "Data Analyst",
            "TrendingUp",
            "emerald",
            "Khám phá câu cnhungện đằng sau các con số để đưa ra quyết định kinh doanh.",
            "Đang tăng",
            "18M - 50M VNĐ",
            CareerPath.DifficultyLevel.HARD,
            7,
            "Phân tích dữ liệu là xu hướng tương lai, phù hợp với kỹ năng logic của bạn."
        );
        da = careerPathRepository.save(da);
        createDASteps(da);

        log.info("Career paths seeded successfully!");
    }

    private CareerPath createCareerPath(
        String code, String title, String icon, String color,
        String description, String marketDemand, String avgSalary,
        CareerPath.DifficultyLevel difficulty, Integer durationMonths, String aiReason
    ) {
        return CareerPath.builder()
                .code(code)
                .title(title)
                .icon(icon)
                .color(color)
                .description(description)
                .marketDemand(marketDemand)
                .avgSalary(avgSalary)
                .difficulty(difficulty)
                .durationMonths(durationMonths)
                .aiReason(aiReason)
                .build();
    }

    private void createBASteps(CareerPath careerPath) {
        try {
            // Step 1: Nền tảng nghiệp vụ
            RoadmapStep step1 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(0)
                    .title("Nền tảng nghiệp vụ")
                    .description("Xây dựng nền tảng vững chắc về phân tích nghiệp vụ")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Khơi gợi yêu cầu (Elicitation)",
                            "Viết User Stories",
                            "BPMN 2.0 Cơ bản"
                    )))
                    .rewardXp(500)
                    .badge("BA Starter")
                    .icon("CheckCircle2")
                    .build();
            roadmapStepRepository.save(step1);

            // Step 2: Phân tích & Thiết kế hệ thống
            RoadmapStep step2 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(1)
                    .title("Phân tích & Thiết kế hệ thống")
                    .description("Học cách phân tích và thiết kế hệ thống cnhungên nghiệp")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Vẽ sơ đồ UML",
                            "Database Schema Design",
                            "API Documentation"
                    )))
                    .rewardXp(800)
                    .badge("System Thinker")
                    .icon("Zap")
                    .build();
            roadmapStepRepository.save(step2);

            // Step 3: Quản lý sản phẩm
            RoadmapStep step3 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(2)
                    .title("Quản lý sản phẩm (Product)")
                    .description("Học cách quản lý sản phẩm và làm việc theo Agile")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Backlog Management",
                            "Agile/Scrum Framework",
                            "UAT Testing"
                    )))
                    .rewardXp(1200)
                    .badge("Product Owner")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step3);

            // Step 4: Thực chiến dự án
            RoadmapStep step4 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(3)
                    .title("Thực chiến dự án (Internship)")
                    .description("Áp dụng kiến thức vào dự án thực tế")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Làm việc cùng Dev/QC",
                            "Xử lý Change Requests",
                            "Hoàn thiện Portfolio"
                    )))
                    .rewardXp(2000)
                    .badge("Professional BA")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step4);
        } catch (JsonProcessingException e) {
            log.error("Error creating BA steps", e);
        }
    }

    private void createUIUXSteps(CareerPath careerPath) {
        try {
            RoadmapStep step1 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(0)
                    .title("Nguyên lý thiết kế cơ bản")
                    .description("Học các nguyên lý thiết kế cơ bản")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Color Theory & Typography",
                            "Layout & Grid Systems",
                            "Design Principles"
                    )))
                    .rewardXp(500)
                    .badge("Design Starter")
                    .icon("CheckCircle2")
                    .build();
            roadmapStepRepository.save(step1);

            RoadmapStep step2 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(1)
                    .title("User Research & Wireframing")
                    .description("Học cách nghiên cứu người dùng và tạo wireframe")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "User Interview Techniques",
                            "Wireframing & Prototyping",
                            "Usability Testing"
                    )))
                    .rewardXp(800)
                    .badge("UX Researcher")
                    .icon("Zap")
                    .build();
            roadmapStepRepository.save(step2);

            RoadmapStep step3 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(2)
                    .title("Advanced UI Design")
                    .description("Thiết kế UI nâng cao với Figma")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Figma Advanced",
                            "Design Systems",
                            "Animation & Micro-interactions"
                    )))
                    .rewardXp(1200)
                    .badge("UI Expert")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step3);

            RoadmapStep step4 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(3)
                    .title("Portfolio & Real Projects")
                    .description("Xây dựng portfolio và làm dự án thực tế")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Build Portfolio Website",
                            "Client Projects",
                            "Design Case Studies"
                    )))
                    .rewardXp(2000)
                    .badge("Professional Designer")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step4);
        } catch (JsonProcessingException e) {
            log.error("Error creating UI/UX steps", e);
        }
    }

    private void createDASteps(CareerPath careerPath) {
        try {
            RoadmapStep step1 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(0)
                    .title("SQL & Database Fundamentals")
                    .description("Học SQL và cơ sở dữ liệu")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "SQL Queries",
                            "Database Design",
                            "Data Modeling"
                    )))
                    .rewardXp(500)
                    .badge("Data Starter")
                    .icon("CheckCircle2")
                    .build();
            roadmapStepRepository.save(step1);

            RoadmapStep step2 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(1)
                    .title("Data Visualization")
                    .description("Học cách trực quan hóa dữ liệu")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Power BI / Tableau",
                            "Python Visualization",
                            "Dashboard Design"
                    )))
                    .rewardXp(800)
                    .badge("Visualization Expert")
                    .icon("Zap")
                    .build();
            roadmapStepRepository.save(step2);

            RoadmapStep step3 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(2)
                    .title("Statistical Analysis")
                    .description("Phân tích thống kê và machine learning cơ bản")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "Statistics & Probability",
                            "Python for Data Analysis",
                            "Basic ML Models"
                    )))
                    .rewardXp(1200)
                    .badge("Data Scientist")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step3);

            RoadmapStep step4 = RoadmapStep.builder()
                    .careerPath(careerPath)
                    .orderIndex(3)
                    .title("Real-world Data Projects")
                    .description("Làm dự án phân tích dữ liệu thực tế")
                    .tasks(objectMapper.writeValueAsString(Arrays.asList(
                            "End-to-end Data Projects",
                            "Business Intelligence Reports",
                            "Data Storytelling"
                    )))
                    .rewardXp(2000)
                    .badge("Senior Data Analyst")
                    .icon("Lock")
                    .build();
            roadmapStepRepository.save(step4);
        } catch (JsonProcessingException e) {
            log.error("Error creating DA steps", e);
        }
    }
}

