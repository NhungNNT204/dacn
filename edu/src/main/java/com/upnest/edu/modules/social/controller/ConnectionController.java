package com.upnest.edu.modules.social.controller;

import com.upnest.edu.modules.social.entity.Friendship;
import com.upnest.edu.modules.social.payload.UpdatePresenceRequest;
import com.upnest.edu.modules.social.payload.UserConnectionDTO;
import com.upnest.edu.modules.social.repository.FriendshipRepository;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.entity.UserPresence;
import com.upnest.edu.modules.user.repository.UserPresenceRepository;
import com.upnest.edu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Connections API: search users + follow/unfollow + followers/following + friends (mutual follow)
 */
@RestController
@RequestMapping("/api/v1/social/connections")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ConnectionController {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final UserPresenceRepository userPresenceRepository;

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Unauthenticated");
        }
        if (authentication.getPrincipal() instanceof User u) {
            return u.getUserId();
        }
        // fallback: try to parse principal string as email
        String username = authentication.getName();
        return userRepository.findByEmail(username).map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserPresence getPresence(Long userId) {
        return userPresenceRepository.findById(userId).orElse(
                UserPresence.builder()
                        .userId(userId)
                        .online(false)
                        .currentCourseTitle(null)
                        .updatedAt(null)
                        .build()
        );
    }

    private UserConnectionDTO toDto(User u, Long me, Set<Long> followingIds, Set<Long> followerIds) {
        UserPresence presence = getPresence(u.getUserId());
        boolean isFollowing = followingIds.contains(u.getUserId());
        boolean isFollower = followerIds.contains(u.getUserId());
        return UserConnectionDTO.builder()
                .userId(u.getUserId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .avatarUrl(u.getAvatarUrl())
                .online(Boolean.TRUE.equals(presence.getOnline()))
                .currentCourseTitle(presence.getCurrentCourseTitle())
                .isFollowing(isFollowing)
                .isFollower(isFollower)
                .isFriend(isFollowing && isFollower)
                .build();
    }

    private Set<Long> followingIds(Long me) {
        return friendshipRepository.findByFollowerId(me).stream()
                .map(Friendship::getFollowingId)
                .collect(Collectors.toSet());
    }

    private Set<Long> followerIds(Long me) {
        return friendshipRepository.findByFollowingId(me).stream()
                .map(Friendship::getFollowerId)
                .collect(Collectors.toSet());
    }

    /**
     * GET /api/v1/social/connections/search?q=...&course=...
     * Search users by fullName/email/phone.
     * Optional: filter by current course title (presence.currentCourseTitle).
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam("q") String q,
            @RequestParam(value = "course", required = false) String course,
            Authentication authentication
    ) {
        Long me = currentUserId(authentication);
        String keyword = q == null ? "" : q.trim();
        String courseKeyword = course == null ? "" : course.trim();
        if (keyword.isEmpty() && courseKeyword.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<User> results = userRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        keyword.isEmpty() ? "" : keyword,
                        keyword.isEmpty() ? "" : keyword,
                        keyword.isEmpty() ? "" : keyword
                )
                .stream()
                .filter(u -> !Objects.equals(u.getUserId(), me))
                .filter(u -> {
                    if (courseKeyword.isEmpty()) return true;
                    UserPresence p = getPresence(u.getUserId());
                    String cur = p.getCurrentCourseTitle();
                    return cur != null && cur.toLowerCase().contains(courseKeyword.toLowerCase());
                })
                .limit(50)
                .toList();

        Set<Long> following = followingIds(me);
        Set<Long> followers = followerIds(me);

        List<UserConnectionDTO> dtos = results.stream()
                .map(u -> toDto(u, me, following, followers))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * POST /api/v1/social/connections/follow/{targetId}
     */
    @PostMapping("/follow/{targetId}")
    public ResponseEntity<?> follow(@PathVariable Long targetId, Authentication authentication) {
        Long me = currentUserId(authentication);
        if (Objects.equals(me, targetId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể tự theo dõi chính mình"));
        }
        if (friendshipRepository.findByFollowerIdAndFollowingId(me, targetId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Đã theo dõi người này"));
        }
        Friendship f = new Friendship();
        f.setFollowerId(me);
        f.setFollowingId(targetId);
        friendshipRepository.save(f);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * DELETE /api/v1/social/connections/unfollow/{targetId}
     */
    @DeleteMapping("/unfollow/{targetId}")
    public ResponseEntity<?> unfollow(@PathVariable Long targetId, Authentication authentication) {
        Long me = currentUserId(authentication);
        Friendship existing = friendshipRepository.findByFollowerIdAndFollowingId(me, targetId)
                .orElse(null);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Chưa theo dõi người này"));
        }
        friendshipRepository.delete(existing);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * GET /api/v1/social/connections/following
     */
    @GetMapping("/following")
    public ResponseEntity<List<UserConnectionDTO>> following(Authentication authentication) {
        Long me = currentUserId(authentication);
        Set<Long> following = followingIds(me);
        Set<Long> followers = followerIds(me);

        List<UserConnectionDTO> dtos = userRepository.findAllById(following).stream()
                .map(u -> toDto(u, me, following, followers))
                .sorted(Comparator.comparing(UserConnectionDTO::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /api/v1/social/connections/followers
     */
    @GetMapping("/followers")
    public ResponseEntity<List<UserConnectionDTO>> followers(Authentication authentication) {
        Long me = currentUserId(authentication);
        Set<Long> following = followingIds(me);
        Set<Long> followers = followerIds(me);

        List<UserConnectionDTO> dtos = userRepository.findAllById(followers).stream()
                .map(u -> toDto(u, me, following, followers))
                .sorted(Comparator.comparing(UserConnectionDTO::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /api/v1/social/connections/friends (mutual follow)
     */
    @GetMapping("/friends")
    public ResponseEntity<List<UserConnectionDTO>> friends(Authentication authentication) {
        Long me = currentUserId(authentication);
        Set<Long> following = followingIds(me);
        Set<Long> followers = followerIds(me);

        Set<Long> mutual = new HashSet<>(following);
        mutual.retainAll(followers);

        List<UserConnectionDTO> dtos = userRepository.findAllById(mutual).stream()
                .map(u -> toDto(u, me, following, followers))
                .sorted(Comparator.comparing(UserConnectionDTO::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * PUT /api/v1/social/connections/presence
     * body: { online: true/false, currentCourseTitle: "..." }
     */
    @PutMapping("/presence")
    public ResponseEntity<?> updatePresence(@RequestBody UpdatePresenceRequest request, Authentication authentication) {
        Long me = currentUserId(authentication);
        UserPresence presence = userPresenceRepository.findById(me).orElse(
                UserPresence.builder().userId(me).online(false).build()
        );
        if (request.getOnline() != null) {
            presence.setOnline(request.getOnline());
        }
        if (request.getCurrentCourseTitle() != null) {
            presence.setCurrentCourseTitle(request.getCurrentCourseTitle());
        }
        presence.setUpdatedAt(LocalDateTime.now());
        userPresenceRepository.save(presence);
        return ResponseEntity.ok(Map.of("success", true));
    }
}


