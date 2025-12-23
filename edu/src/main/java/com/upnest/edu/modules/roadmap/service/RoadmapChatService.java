package com.upnest.edu.modules.roadmap.service;

import com.upnest.edu.modules.roadmap.entity.RoadmapChatMessage;
import com.upnest.edu.modules.roadmap.entity.RoadmapGroupChat;
import com.upnest.edu.modules.roadmap.repository.RoadmapChatMessageRepository;
import com.upnest.edu.modules.roadmap.repository.RoadmapGroupChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * RoadmapChatService - Quản lý phòng thảo luận nhóm cho lộ trình
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RoadmapChatService {
    
    private final RoadmapGroupChatRepository groupChatRepository;
    private final RoadmapChatMessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Tạo hoặc lấy phòng chat cho lộ trình
     */
    @Transactional
    public RoadmapGroupChat getOrCreateChatRoom(Long roadmapId, String roadmapName) {
        return groupChatRepository.findByRoadmapId(roadmapId)
                .orElseGet(() -> {
                    String chatRoomId = UUID.randomUUID().toString();
                    RoadmapGroupChat chatRoom = RoadmapGroupChat.builder()
                            .roadmapId(roadmapId)
                            .roadmapName(roadmapName)
                            .chatRoomId(chatRoomId)
                            .memberCount(0)
                            .messageCount(0)
                            .isActive(true)
                            .build();
                    return groupChatRepository.save(chatRoom);
                });
    }
    
    /**
     * Gửi tin nhắn vào phòng chat
     */
    @Transactional
    public RoadmapChatMessage sendMessage(
            String chatRoomId,
            Long userId,
            String userName,
            String userAvatar,
            String content,
            RoadmapChatMessage.MessageType messageType,
            String attachmentUrl,
            Long replyToMessageId
    ) {
        RoadmapGroupChat chatRoom = groupChatRepository.findByChatRoomId(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        // Tạo tin nhắn mới
        RoadmapChatMessage message = RoadmapChatMessage.builder()
                .chatRoomId(chatRoomId)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .content(content)
                .messageType(messageType)
                .attachmentUrl(attachmentUrl)
                .replyToMessageId(replyToMessageId)
                .isPinned(false)
                .isDeleted(false)
                .build();
        
        message = messageRepository.save(message);
        
        // Cập nhật thông tin phòng chat
        chatRoom.setMessageCount(chatRoom.getMessageCount() + 1);
        chatRoom.setLastMessageAt(LocalDateTime.now());
        groupChatRepository.save(chatRoom);
        
        // Gửi tin nhắn qua WebSocket
        messagingTemplate.convertAndSend("/topic/roadmap-chat/" + chatRoomId, message);
        
        log.info("Message sent to room {}: {}", chatRoomId, content);
        return message;
    }
    
    /**
     * Lấy danh sách tin nhắn (phân trang)
     */
    public Page<RoadmapChatMessage> getMessages(String chatRoomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findByChatRoomIdAndIsDeletedFalse(chatRoomId, pageable);
    }
    
    /**
     * Lấy 50 tin nhắn mới nhất
     */
    public List<RoadmapChatMessage> getRecentMessages(String chatRoomId) {
        List<RoadmapChatMessage> messages = messageRepository
                .findTop50ByChatRoomIdAndIsDeletedFalseOrderByCreatedAtDesc(chatRoomId);
        // Reverse để hiển thị đúng thứ tự (cũ -> mới)
        java.util.Collections.reverse(messages);
        return messages;
    }
    
    /**
     * Ghim tin nhắn quan trọng
     */
    @Transactional
    public RoadmapChatMessage pinMessage(Long messageId) {
        RoadmapChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsPinned(true);
        return messageRepository.save(message);
    }
    
    /**
     * Bỏ ghim tin nhắn
     */
    @Transactional
    public RoadmapChatMessage unpinMessage(Long messageId) {
        RoadmapChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsPinned(false);
        return messageRepository.save(message);
    }
    
    /**
     * Lấy tin nhắn được ghim
     */
    public List<RoadmapChatMessage> getPinnedMessages(String chatRoomId) {
        return messageRepository.findPinnedMessages(chatRoomId);
    }
    
    /**
     * Xóa tin nhắn (soft delete)
     */
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        RoadmapChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Chỉ cho phép người gửi hoặc admin xóa
        if (!message.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own messages");
        }
        
        message.setIsDeleted(true);
        messageRepository.save(message);
        
        // Notify qua WebSocket
        messagingTemplate.convertAndSend(
                "/topic/roadmap-chat/" + message.getChatRoomId() + "/deleted",
                messageId
        );
    }
    
    /**
     * Tăng số lượng thành viên khi user join
     */
    @Transactional
    public void incrementMemberCount(String chatRoomId) {
        RoadmapGroupChat chatRoom = groupChatRepository.findByChatRoomId(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        chatRoom.setMemberCount(chatRoom.getMemberCount() + 1);
        groupChatRepository.save(chatRoom);
    }
    
    /**
     * Giảm số lượng thành viên khi user leave
     */
    @Transactional
    public void decrementMemberCount(String chatRoomId) {
        RoadmapGroupChat chatRoom = groupChatRepository.findByChatRoomId(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        if (chatRoom.getMemberCount() > 0) {
            chatRoom.setMemberCount(chatRoom.getMemberCount() - 1);
            groupChatRepository.save(chatRoom);
        }
    }
}

