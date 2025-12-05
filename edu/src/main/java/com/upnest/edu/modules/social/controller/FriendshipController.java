package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.Friendship;
import com.upnest.edu.modules.social.repository.FriendshipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/social/friends")
@CrossOrigin(origins = "http://localhost:5173") 
public class FriendshipController {

    private final FriendshipRepository friendshipRepository;

    public FriendshipController(FriendshipRepository friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }

    // LƯU Ý: ĐỂ TEST DỄ DÀNG, TÔI SẼ DÙNG USER ID = 1L LÀ USER ĐANG ĐĂNG NHẬP (ADMIN)
    private Long getCurrentUserId() {
        return 1L; // Cần thay thế bằng logic lấy ID từ JWT Token sau này
    }

    /**
     * POST: /api/v1/social/friends/follow/{targetId}
     * Thực hiện theo dõi người dùng
     */
    @PostMapping("/follow/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable Long targetId) {
        Long currentUserId = getCurrentUserId();
        
        // Không cho phép tự theo dõi chính mình
        if (currentUserId.equals(targetId)) {
            return ResponseEntity.badRequest().body("Không thể tự theo dõi chính mình.");
        }

        Optional<Friendship> existing = friendshipRepository.findByFollowerIdAndFollowingId(currentUserId, targetId);
        
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Đã theo dõi người này.");
        }

        Friendship newFriendship = new Friendship();
        newFriendship.setFollowerId(currentUserId);
        newFriendship.setFollowingId(targetId);
        friendshipRepository.save(newFriendship);

        return ResponseEntity.ok("Theo dõi thành công!");
    }

    /**
     * DELETE: /api/v1/social/friends/unfollow/{targetId}
     * Hủy theo dõi người dùng
     */
    @DeleteMapping("/unfollow/{targetId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long targetId) {
        Long currentUserId = getCurrentUserId();
        
        Optional<Friendship> existing = friendshipRepository.findByFollowerIdAndFollowingId(currentUserId, targetId);
        
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chưa theo dõi người này.");
        }

        friendshipRepository.delete(existing.get());
        return ResponseEntity.ok("Hủy theo dõi thành công!");
    }
    
    /**
     * GET: /api/v1/social/friends/following
     * Lấy danh sách người mà user đang theo dõi
     */
    @GetMapping("/following")
    public ResponseEntity<List<Friendship>> getFollowing() {
        return ResponseEntity.ok(friendshipRepository.findByFollowerId(getCurrentUserId()));
    }
}