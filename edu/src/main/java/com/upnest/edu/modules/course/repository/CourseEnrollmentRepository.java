package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByUserId(Long userId);
    List<CourseEnrollment> findByUserIdAndStatus(Long userId, CourseEnrollment.EnrollmentStatus status);
    List<CourseEnrollment> findByUserIdAndIsFavoriteTrue(Long userId);
    Optional<CourseEnrollment> findByUserIdAndCourseId(Long userId, Long courseId);
}

