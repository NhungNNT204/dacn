package com.upnest.edu.modules.course.config;

import com.upnest.edu.modules.course.entity.Course;
import com.upnest.edu.modules.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * CourseDataSeeder - Seed dữ liệu mẫu cho courses
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CourseDataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            log.info("Courses already exist, skipping seed");
            return;
        }

        log.info("Seeding course data...");

        // Course 1: UI/UX Design
        Course course1 = Course.builder()
                .title("UI/UX Design Masterclass 2024")
                .description("Khóa học thiết kế UI/UX chuyên sâu với các công cụ hiện đại")
                .instructorId(1L)
                .instructorName("Trần Thế Duyệt")
                .category("DESIGN")
                .durationMinutes(765) // 12 giờ 45 phút
                .totalLessons(24)
                .rating(4.9)
                .ratingCount(1250)
                .thumbnailUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 2: Data Science
        Course course2 = Course.builder()
                .title("Data Science với Python và SQL")
                .description("Học Data Science từ cơ bản đến nâng cao với Python và SQL")
                .instructorId(2L)
                .instructorName("Nguyễn Thị B")
                .category("DATA")
                .durationMinutes(1215) // 20 giờ 15 phút
                .totalLessons(30)
                .rating(4.8)
                .ratingCount(890)
                .thumbnailUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 3: AI & Machine Learning
        Course course3 = Course.builder()
                .title("Kiến trúc Mạng nơ-ron Nâng cao")
                .description("Khám phá kiến trúc mạng nơ-ron sâu và các kỹ thuật nâng cao")
                .instructorId(3L)
                .instructorName("TS. Sarah Chen")
                .category("AI")
                .durationMinutes(765) // 12 giờ 45 phút
                .totalLessons(24)
                .rating(4.9)
                .ratingCount(2100)
                .thumbnailUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 4: Ethics in Robotics
        Course course4 = Course.builder()
                .title("Đạo đức học trong Robot")
                .description("Nghiên cứu các vấn đề đạo đức trong phát triển và ứng dụng robot")
                .instructorId(4L)
                .instructorName("GS. Marcus Thorne")
                .category("ETHICS")
                .durationMinutes(500) // 8 giờ 20 phút
                .totalLessons(15)
                .rating(4.7)
                .ratingCount(650)
                .thumbnailUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 5: Full-Stack Development
        Course course5 = Course.builder()
                .title("Thiết kế Hệ thống Full-Stack")
                .description("Xây dựng hệ thống full-stack từ frontend đến backend")
                .instructorId(5L)
                .instructorName("Alex Rivera")
                .category("WEB")
                .durationMinutes(1215) // 20 giờ 15 phút
                .totalLessons(42)
                .rating(5.0)
                .ratingCount(3200)
                .thumbnailUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 6: Data Structures & Algorithms
        Course course6 = Course.builder()
                .title("Làm chủ Cấu trúc Dữ liệu & Giải thuật")
                .description("Nắm vững các cấu trúc dữ liệu và thuật toán cơ bản đến nâng cao")
                .instructorId(6L)
                .instructorName("Elena Popova")
                .category("CS")
                .durationMinutes(930) // 15 giờ 30 phút
                .totalLessons(30)
                .rating(4.8)
                .ratingCount(1800)
                .thumbnailUrl("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        // Course 7: Digital Marketing
        Course course7 = Course.builder()
                .title("Marketing Digital cho Startups")
                .description("Chiến lược marketing digital hiệu quả cho các startup")
                .instructorId(7L)
                .instructorName("Phạm Minh C")
                .category("BUSINESS")
                .durationMinutes(600) // 10 giờ
                .totalLessons(20)
                .rating(4.6)
                .ratingCount(950)
                .thumbnailUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800")
                .status(Course.CourseStatus.PUBLISHED)
                .build();

        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);
        courseRepository.save(course4);
        courseRepository.save(course5);
        courseRepository.save(course6);
        courseRepository.save(course7);

        log.info("Seeded {} courses", courseRepository.count());
    }
}

