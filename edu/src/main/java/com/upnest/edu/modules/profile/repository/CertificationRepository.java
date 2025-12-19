package com.upnest.edu.modules.profile.repository;

import com.upnest.edu.modules.profile.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUserIdOrderByIssueDateDesc(Long userId);
}

