package com.upnest.edu.modules.social.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "friendships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"followerId", "followingId"}) // Đảm bảo 1 người chỉ follow 1 người 1 lần
})
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long followerId; // ID của người theo dõi (A)

    @Column(nullable = false)
    private Long followingId; // ID của người được theo dõi (B)
    
    // --- CONSTRUCTORS & GETTERS/SETTERS (Thủ công) ---
    public Friendship() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFollowerId() { return followerId; }
    public void setFollowerId(Long followerId) { this.followerId = followerId; }
    public Long getFollowingId() { return followingId; }
    public void setFollowingId(Long followingId) { this.followingId = followingId; }
}