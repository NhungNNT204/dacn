package com.upnest.edu.modules.social.service;

import com.upnest.edu.modules.social.entity.Friendship;
import com.upnest.edu.modules.social.entity.LearningActivity;
import com.upnest.edu.modules.social.payload.CreateLearningActivityRequest;
import com.upnest.edu.modules.social.repository.FriendshipRepository;
import com.upnest.edu.modules.social.repository.LearningActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningActivityService {

    private final LearningActivityRepository learningActivityRepository;
    private final FriendshipRepository friendshipRepository;

    public Page<LearningActivity> getActivityFeed(Long viewerUserId, Pageable pageable) {
        List<Long> followingIds = friendshipRepository.findByFollowerId(viewerUserId)
                .stream()
                .map(Friendship::getFollowingId)
                .distinct()
                .toList();

        if (followingIds.isEmpty()) {
            return Page.empty(pageable);
        }

        return learningActivityRepository.findByUserIdInOrderByCreatedAtDesc(followingIds, pageable);
    }

    public LearningActivity createMyActivity(Long userId, String userName, String userAvatar, CreateLearningActivityRequest req) {
        LearningActivity.ActivityType type = LearningActivity.ActivityType.valueOf(req.getActivityType().toUpperCase());
        LearningActivity activity = LearningActivity.builder()
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .activityType(type)
                .courseId(req.getCourseId())
                .courseTitle(req.getCourseTitle())
                .message(req.getMessage())
                .build();
        return learningActivityRepository.save(activity);
    }
}






