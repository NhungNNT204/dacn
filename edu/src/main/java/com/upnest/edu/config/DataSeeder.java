package com.upnest.edu.config;

import com.upnest.edu.modules.auth.entity.Role;
import com.upnest.edu.modules.auth.entity.User;
import com.upnest.edu.modules.auth.repository.UserRepository;
import com.upnest.edu.modules.course.entity.Course;
import com.upnest.edu.modules.course.entity.Lesson;
import com.upnest.edu.modules.course.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    // Khai báo biến
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    // [FIX LỖI 1] Constructor thủ công để khởi tạo các biến final (thay cho @RequiredArgsConstructor)
    public DataSeeder(UserRepository userRepository, CourseRepository courseRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // --- PHẦN 1: TẠO USER (Dùng Setter và Constructor chuẩn) ---
        
        // 1. Tạo ADMIN (Có BẬT 2FA)
        if (!userRepository.existsByEmail("admin@upnest.edu")) {
            // SỬ DỤNG CONSTRUCTOR và SETTER THUẦN JAVA (KHÔNG DÙNG BUILDER)
            User admin = new User();
            admin.setEmail("admin@upnest.edu");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("Administrator");
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            admin.setTwoFactorEnabled(true); 
            admin.setTwoFactorSecret("JBSWY3DPEHPK3PXP"); 
            userRepository.save(admin);
            System.out.println(">>> Đã tạo tài khoản ADMIN (2FA ON): admin@upnest.edu | Pass: 123456 | Secret: JBSWY3DPEHPK3PXP");
        }

        // 2. Tạo STUDENT
        if (!userRepository.existsByEmail("student@upnest.edu")) {
            User student = new User();
            student.setEmail("student@upnest.edu");
            student.setPassword(passwordEncoder.encode("123456"));
            student.setFullName("Nguyễn Văn Huy");
            student.setRole(Role.STUDENT);
            student.setEnabled(true);
            student.setTwoFactorEnabled(false);
            userRepository.save(student);
            System.out.println(">>> Đã tạo tài khoản STUDENT (2FA OFF): student@upnest.edu | Pass: 123456");
        }

        // 3. Tạo TEACHER
        if (!userRepository.existsByEmail("teacher@upnest.edu")) {
            User teacher = new User();
            teacher.setEmail("teacher@upnest.edu");
            teacher.setPassword(passwordEncoder.encode("123456"));
            teacher.setFullName("Cô Minh Thư");
            teacher.setRole(Role.TEACHER);
            teacher.setEnabled(true);
            teacher.setTwoFactorEnabled(false);
            userRepository.save(teacher);
            System.out.println(">>> Đã tạo tài khoản TEACHER: teacher@upnest.edu | Pass: 123456");
        }

        // --- PHẦN 2: TẠO KHÓA HỌC MẪU (Comment out for now until Lombok works correctly) ---
        // TODO: Fix Lombok processing in Maven and enable course seeding later
        if (courseRepository.count() == 0) {
            System.out.println(">>> Bỏ qua tạo khóa học mẫu tạm thời (sẽ fix sau khi Lombok hoạt động)");
        }
    }
}