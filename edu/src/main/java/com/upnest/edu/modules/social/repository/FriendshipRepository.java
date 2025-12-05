package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    // Tìm danh sách người mà userId đang theo dõi
    List<Friendship> findByFollowerId(Long followerId);
    
    // Tìm danh sách người đang theo dõi userId
    List<Friendship> findByFollowingId(Long followingId);

    // Kiểm tra xem quan hệ đã tồn tại chưa
    Optional<Friendship> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
}