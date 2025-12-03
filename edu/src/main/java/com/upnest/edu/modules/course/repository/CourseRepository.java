package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // JpaRepository đã cung cấp sẵn các phương thức CRUD cơ bản (save, findAll, findById, delete...)
    // Bạn có thể định nghĩa thêm các query method tùy chỉnh tại đây nếu cần
}