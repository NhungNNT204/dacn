package com.upnest.edu.modules.learning.config;

import com.upnest.edu.modules.learning.entity.CareerTrack;
import com.upnest.edu.modules.learning.entity.RoadmapStep;
import com.upnest.edu.modules.learning.repository.CareerTrackRepository;
import com.upnest.edu.modules.learning.repository.RoadmapStepRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * RoadmapDataSeeder - Seeder dữ liệu cho Career Tracks và Roadmap Steps
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(2) // Chạy sau DataSeeder chính (Order 1)
public class RoadmapDataSeeder implements CommandLineRunner {

    private final CareerTrackRepository careerTrackRepository;
    private final RoadmapStepRepository roadmapStepRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            log.info(">>> Bắt đầu seed dữ liệu Career Tracks...");

            // 1. Full-stack Java Developer
            seedFullstackJavaTrack();

            // 2. AI & Data Science Engineer
            seedAIDataScienceTrack();

            // 3. Mobile App Developer
            seedMobileDeveloperTrack();

            // 4. DevOps Engineer
            seedDevOpsTrack();

            log.info(">>> Hoàn thành seed dữ liệu Career Tracks!");
        } catch (Exception e) {
            log.error(">>> LỖI RoadmapDataSeeder: " + e.getMessage(), e);
        }
    }

    private void seedFullstackJavaTrack() {
        if (careerTrackRepository.existsByCode("fullstack-java")) {
            log.info(">>> Career Track 'fullstack-java' đã tồn tại, bỏ qua");
            return;
        }

        CareerTrack track = CareerTrack.builder()
                .code("fullstack-java")
                .name("Full-stack Developer (Java & React)")
                .description("Xây dựng ứng dụng web hoàn chỉnh từ Backend đến Frontend")
                .icon("Code")
                .color("#6366f1")
                .build();
        track = careerTrackRepository.save(track);

        // Steps
        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(0)
                .title("Nền tảng Java Core")
                .description("Làm chủ các khái niệm OOP, Collections, Exception Handling")
                .durationWeeks(4)
                .difficulty(RoadmapStep.DifficultyLevel.BEGINNER)
                .rewardXp(500)
                .icon("CheckCircle2")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(1)
                .title("Xây dựng REST API với Spring Boot")
                .description("Thiết kế và xây dựng RESTful APIs, JPA, Security")
                .durationWeeks(6)
                .difficulty(RoadmapStep.DifficultyLevel.INTERMEDIATE)
                .rewardXp(800)
                .icon("Rocket")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(2)
                .title("Frontend Master với React & Tailwind")
                .description("React Hooks, State Management, Responsive Design")
                .durationWeeks(5)
                .difficulty(RoadmapStep.DifficultyLevel.INTERMEDIATE)
                .rewardXp(700)
                .icon("Code")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(3)
                .title("Triển khai hệ thống Microservices")
                .description("Spring Cloud, Docker, Kubernetes, CI/CD")
                .durationWeeks(8)
                .difficulty(RoadmapStep.DifficultyLevel.EXPERT)
                .rewardXp(1200)
                .icon("Cloud")
                .build());

        log.info(">>> Đã tạo Career Track: Full-stack Developer (Java & React) với 4 steps");
    }

    private void seedAIDataScienceTrack() {
        if (careerTrackRepository.existsByCode("ai-data-science")) {
            log.info(">>> Career Track 'ai-data-science' đã tồn tại, bỏ qua");
            return;
        }

        CareerTrack track = CareerTrack.builder()
                .code("ai-data-science")
                .name("AI & Data Science Engineer")
                .description("Phát triển hệ thống AI/ML và phân tích dữ liệu chuyên sâu")
                .icon("BrainCircuit")
                .color("#8b5cf6")
                .build();
        track = careerTrackRepository.save(track);

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(0)
                .title("Python Fundamentals & Data Structures")
                .description("Numpy, Pandas, Matplotlib, Basic Algorithms")
                .durationWeeks(4)
                .difficulty(RoadmapStep.DifficultyLevel.BEGINNER)
                .rewardXp(500)
                .icon("CheckCircle2")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(1)
                .title("Machine Learning Essentials")
                .description("Scikit-learn, Model Training, Evaluation Metrics")
                .durationWeeks(6)
                .difficulty(RoadmapStep.DifficultyLevel.INTERMEDIATE)
                .rewardXp(900)
                .icon("Rocket")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(2)
                .title("Deep Learning với TensorFlow/Keras")
                .description("Neural Networks, CNN, RNN, Transfer Learning")
                .durationWeeks(7)
                .difficulty(RoadmapStep.DifficultyLevel.ADVANCED)
                .rewardXp(1000)
                .icon("BrainCircuit")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(3)
                .title("Production AI Systems & MLOps")
                .description("Model Deployment, MLflow, A/B Testing, Scalability")
                .durationWeeks(8)
                .difficulty(RoadmapStep.DifficultyLevel.EXPERT)
                .rewardXp(1300)
                .icon("Cloud")
                .build());

        log.info(">>> Đã tạo Career Track: AI & Data Science Engineer với 4 steps");
    }

    private void seedMobileDeveloperTrack() {
        if (careerTrackRepository.existsByCode("mobile-developer")) {
            log.info(">>> Career Track 'mobile-developer' đã tồn tại, bỏ qua");
            return;
        }

        CareerTrack track = CareerTrack.builder()
                .code("mobile-developer")
                .name("Mobile App Developer")
                .description("Xây dựng ứng dụng di động cross-platform với React Native")
                .icon("Smartphone")
                .color("#10b981")
                .build();
        track = careerTrackRepository.save(track);

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(0)
                .title("React Fundamentals & JSX")
                .description("Components, Props, State, Hooks cơ bản")
                .durationWeeks(3)
                .difficulty(RoadmapStep.DifficultyLevel.BEGINNER)
                .rewardXp(400)
                .icon("CheckCircle2")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(1)
                .title("React Native Development")
                .description("Navigation, API Integration, State Management")
                .durationWeeks(6)
                .difficulty(RoadmapStep.DifficultyLevel.INTERMEDIATE)
                .rewardXp(800)
                .icon("Rocket")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(2)
                .title("Native Modules & Performance")
                .description("Bridge Native Code, Optimization, Testing")
                .durationWeeks(5)
                .difficulty(RoadmapStep.DifficultyLevel.ADVANCED)
                .rewardXp(750)
                .icon("Code")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(3)
                .title("App Store Deployment & CI/CD")
                .description("Build & Release, App Store Guidelines, Automation")
                .durationWeeks(4)
                .difficulty(RoadmapStep.DifficultyLevel.EXPERT)
                .rewardXp(600)
                .icon("Cloud")
                .build());

        log.info(">>> Đã tạo Career Track: Mobile App Developer với 4 steps");
    }

    private void seedDevOpsTrack() {
        if (careerTrackRepository.existsByCode("devops-engineer")) {
            log.info(">>> Career Track 'devops-engineer' đã tồn tại, bỏ qua");
            return;
        }

        CareerTrack track = CareerTrack.builder()
                .code("devops-engineer")
                .name("DevOps Engineer")
                .description("Tự động hóa và quản lý hạ tầng cloud với best practices")
                .icon("Cloud")
                .color("#f59e0b")
                .build();
        track = careerTrackRepository.save(track);

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(0)
                .title("Linux & Shell Scripting")
                .description("Command Line, File Systems, Process Management")
                .durationWeeks(3)
                .difficulty(RoadmapStep.DifficultyLevel.BEGINNER)
                .rewardXp(400)
                .icon("CheckCircle2")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(1)
                .title("Docker & Containerization")
                .description("Container Lifecycle, Docker Compose, Image Optimization")
                .durationWeeks(4)
                .difficulty(RoadmapStep.DifficultyLevel.INTERMEDIATE)
                .rewardXp(600)
                .icon("Rocket")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(2)
                .title("Kubernetes & Orchestration")
                .description("Pods, Services, Deployments, Helm Charts")
                .durationWeeks(6)
                .difficulty(RoadmapStep.DifficultyLevel.ADVANCED)
                .rewardXp(900)
                .icon("Code")
                .build());

        roadmapStepRepository.save(RoadmapStep.builder()
                .careerTrack(track)
                .orderIndex(3)
                .title("CI/CD & Infrastructure as Code")
                .description("Jenkins/GitLab CI, Terraform, Ansible, Monitoring")
                .durationWeeks(7)
                .difficulty(RoadmapStep.DifficultyLevel.EXPERT)
                .rewardXp(1100)
                .icon("Cloud")
                .build());

        log.info(">>> Đã tạo Career Track: DevOps Engineer với 4 steps");
    }
}

