package com.upnest.edu.modules.social.repository;

import com.upnest.edu.modules.social.entity.SocialCommentLite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialCommentLiteRepository extends JpaRepository<SocialCommentLite, Long> {
    List<SocialCommentLite> findByPostId(Long postId);
    List<SocialCommentLite> findByParentId(Long parentId);
}

