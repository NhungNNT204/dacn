package com.upnest.edu.modules.user.repository;

import com.upnest.edu.modules.user.entity.UserPresence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPresenceRepository extends JpaRepository<UserPresence, Long> {
}






