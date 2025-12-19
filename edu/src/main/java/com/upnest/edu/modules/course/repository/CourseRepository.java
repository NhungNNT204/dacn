package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatus(Course.CourseStatus status);
    List<Course> findByCategory(String category);
    List<Course> findByInstructorId(Long instructorId);
}
