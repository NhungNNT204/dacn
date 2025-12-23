package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.SocialReportLite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialReportLiteRepository extends JpaRepository<SocialReportLite, Long> {
}

