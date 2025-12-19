package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderIndex(Long courseId);
    Lesson findByCourseIdAndOrderIndex(Long courseId, Integer orderIndex);
}

