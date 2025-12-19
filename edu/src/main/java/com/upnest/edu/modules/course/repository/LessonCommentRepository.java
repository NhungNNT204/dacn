package com.upnest.edu.modules.course.repository;

import com.upnest.edu.modules.course.entity.LessonComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonCommentRepository extends JpaRepository<LessonComment, Long> {
    List<LessonComment> findByLessonIdAndParentIdIsNullOrderByCreatedAtDesc(Long lessonId);
    List<LessonComment> findByParentIdOrderByCreatedAtAsc(Long parentId);
    Long countByLessonId(Long lessonId);
}

