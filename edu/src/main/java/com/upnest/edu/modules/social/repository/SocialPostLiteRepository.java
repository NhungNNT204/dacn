package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.SocialPostLite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialPostLiteRepository extends JpaRepository<SocialPostLite, Long> {
}

