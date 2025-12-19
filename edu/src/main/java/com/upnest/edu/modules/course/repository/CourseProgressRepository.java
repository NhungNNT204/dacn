package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {
    Optional<CourseProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    List<CourseProgress> findByUserId(Long userId);
}

