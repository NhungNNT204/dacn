package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.LessonNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LessonNoteRepository extends JpaRepository<LessonNote, Long> {
    Optional<LessonNote> findByUserIdAndLessonId(Long userId, Long lessonId);
}

