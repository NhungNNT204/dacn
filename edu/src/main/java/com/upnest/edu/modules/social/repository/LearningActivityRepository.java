package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.LearningActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface LearningActivityRepository extends JpaRepository<LearningActivity, Long> {
    Page<LearningActivity> findByUserIdInOrderByCreatedAtDesc(Collection<Long> userIds, Pageable pageable);
}






