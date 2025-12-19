package com.upnest.edu.modules.learning.repository;

import com.upnest.edu.modules.learning.entity.CareerTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerTrackRepository extends JpaRepository<CareerTrack, Long> {
    
    /**
     * Tìm CareerTrack theo code
     */
    Optional<CareerTrack> findByCode(String code);
    
    /**
     * Kiểm tra code đã tồn tại chưa
     */
    boolean existsByCode(String code);
}

