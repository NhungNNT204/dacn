package com.upnest.edu.modules.chat.service;

import com.upnest.edu.modules.chat.entity.*;
import com.upnest.edu.modules.chat.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * ChatService - Xử lý logic tin nhắn
 * Bao gồm: gửi tin nhắn, tạo group, quản lý thành viên, gọi thoại/video
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService {
    
    private final MessageRepository messageRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final CallRecordRepository callRecordRepository;
    
    // ==================== MESSAGE OPERATIONS ====================
    
    /**
     * Gửi tin nhắn
     */
    public Message sendMessage(Long chatGroupId, Long senderId, String senderName, 
                               String senderAvatar, String content, String messageType) {
        ChatGroup chatGroup = chatGroupRepository.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat không tồn tại"));
        
        Message message = Message.builder()
                .chatGroup(chatGroup)
                .chatGroupId(chatGroupId)
                .senderId(senderId)
                .senderName(senderName)
                .senderAvatar(senderAvatar)
                .content(content)
                .messageType(Message.MessageType.valueOf(messageType))
                .isEdited(false)
                .isDeleted(false)
                .isPinned(false)
                .reactions(new HashMap<>())
                .mentions(new ArrayList<>())
                .build();
        
        Message saved = messageRepository.save(message);
        
        // Cập nhật thời gian tin nhắn cuối cùng
        chatGroup.setLastMessageAt(LocalDateTime.now());
        chatGroupRepository.save(chatGroup);
        
        // Cập nhật unread count cho thành viên khác
        chatMemberRepository.findByChatGroupId(chatGroupId).forEach(member -> {
            if (!member.getUserId().equals(senderId)) {
                member.setUnreadCount(member.getUnreadCount() + 1);
                chatMemberRepository.save(member);
            } else {
                member.setLastReadAt(LocalDateTime.now());
                member.setUnreadCount(0);
                chatMemberRepository.save(member);
            }
        });
        
        log.info("Gửi tin nhắn: {} -> {}", senderId, chatGroupId);
        return saved;
    }
    
    /**
     * Gửi tin nhắn có media (ảnh/video)
     */
    public Message sendMediaMessage(Long chatGroupId, Long senderId, String senderName,
                                    String senderAvatar, String mediaUrl, String mediaType,
                                    Long mediaSize, String caption, String messageType) {
        Message message = sendMessage(chatGroupId, senderId, senderName, senderAvatar, caption, messageType);
        message.setMediaUrl(mediaUrl);
        message.setMediaType(mediaType);
        message.setMediaSize(mediaSize);
        return messageRepository.save(message);
    }
    
    /**
     * Chỉnh sửa tin nhắn
     */
    public Message editMessage(Long messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Tin nhắn không tồn tại"));
        
        message.setContent(newContent);
        message.setIsEdited(true);
        message.setEditedAt(LocalDateTime.now());
        
        return messageRepository.save(message);
    }
    
    /**
     * Xóa tin nhắn
     */
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Tin nhắn không tồn tại"));
        
        message.setIsDeleted(true);
        message.setDeletedAt(LocalDateTime.now());
        messageRepository.save(message);
    }
    
    /**
     * Pin tin nhắn
     */
    public void pinMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Tin nhắn không tồn tại"));
        
        message.setIsPinned(!message.getIsPinned());
        messageRepository.save(message);
    }
    
    /**
     * Phản ứng với emoji
     */
    public void addReaction(Long messageId, String emoji) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Tin nhắn không tồn tại"));
        
        Map<String, Integer> reactions = message.getReactions();
        reactions.put(emoji, reactions.getOrDefault(emoji, 0) + 1);
        message.setReactions(reactions);
        
        messageRepository.save(message);
    }
    
    /**
     * Lấy tin nhắn của group chat
     */
    public List<Message> getMessages(Long chatGroupId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findByChatGroupId(chatGroupId, pageable).getContent();
    }
    
    /**
     * Tìm kiếm tin nhắn
     */
    public List<Message> searchMessages(Long chatGroupId, String keyword) {
        return messageRepository.searchMessages(chatGroupId, keyword);
    }
    
    /**
     * Lấy tin nhắn đã pin
     */
    public List<Message> getPinnedMessages(Long chatGroupId) {
        return messageRepository.findPinnedMessages(chatGroupId);
    }
    
    // ==================== CHAT GROUP OPERATIONS ====================
    
    /**
     * Tạo chat riêng tư (1-1)
     */
    public ChatGroup createPrivateChat(Long userId1, Long userId2, String user1Name, 
                                       String user1Avatar, String user2Name, String user2Avatar) {
        // Kiểm tra đã có chat chưa
        Optional<ChatGroup> existing = chatGroupRepository.findPrivateChat(userId1, userId2);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        ChatGroup chatGroup = ChatGroup.builder()
                .isGroup(false)
                .allowMembersInvite(false)
                .allowMembersEditGroup(false)
                .isMuted(false)
                .isArchived(false)
                .build();
        
        ChatGroup saved = chatGroupRepository.save(chatGroup);
        
        // Thêm 2 thành viên
        ChatMember member1 = ChatMember.builder()
                .chatGroup(saved)
                .userId(userId1)
                .userName(user1Name)
                .userAvatar(user1Avatar)
                .role(ChatMember.MemberRole.MEMBER)
                .isActive(true)
                .unreadCount(0)
                .build();
        
        ChatMember member2 = ChatMember.builder()
                .chatGroup(saved)
                .userId(userId2)
                .userName(user2Name)
                .userAvatar(user2Avatar)
                .role(ChatMember.MemberRole.MEMBER)
                .isActive(true)
                .unreadCount(0)
                .build();
        
        chatMemberRepository.save(member1);
        chatMemberRepository.save(member2);
        
        log.info("Tạo private chat: {} - {}", userId1, userId2);
        return saved;
    }
    
    /**
     * Tạo group chat
     */
    public ChatGroup createGroupChat(String groupName, String groupDescription, String avatarUrl,
                                     Long ownerId, String ownerName, List<Long> memberIds) {
        ChatGroup chatGroup = ChatGroup.builder()
                .name(groupName)
                .description(groupDescription)
                .avatarUrl(avatarUrl)
                .isGroup(true)
                .groupOwnerId(ownerId)
                .allowMembersInvite(true)
                .allowMembersEditGroup(false)
                .isMuted(false)
                .isArchived(false)
                .maxMembers(100)
                .build();
        
        ChatGroup saved = chatGroupRepository.save(chatGroup);
        
        // Thêm owner
        ChatMember ownerMember = ChatMember.builder()
                .chatGroup(saved)
                .userId(ownerId)
                .userName(ownerName)
                .role(ChatMember.MemberRole.OWNER)
                .isActive(true)
                .unreadCount(0)
                .build();
        chatMemberRepository.save(ownerMember);
        
        // Thêm thành viên khác
        memberIds.forEach(memberId -> {
            ChatMember member = ChatMember.builder()
                    .chatGroup(saved)
                    .userId(memberId)
                    .role(ChatMember.MemberRole.MEMBER)
                    .isActive(true)
                    .unreadCount(0)
                    .build();
            chatMemberRepository.save(member);
        });
        
        log.info("Tạo group chat: {}", groupName);
        return saved;
    }
    
    /**
     * Thêm thành viên vào group
     */
    public void addMember(Long chatGroupId, Long userId, String userName, String userAvatar) {
        ChatGroup chatGroup = chatGroupRepository.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat không tồn tại"));
        
        if (chatMemberRepository.existsByChatGroupIdAndUserId(chatGroupId, userId)) {
            throw new RuntimeException("Người dùng đã trong group");
        }
        
        ChatMember member = ChatMember.builder()
                .chatGroup(chatGroup)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .role(ChatMember.MemberRole.MEMBER)
                .isActive(true)
                .unreadCount(0)
                .build();
        
        chatMemberRepository.save(member);
        log.info("Thêm thành viên {} vào group {}", userId, chatGroupId);
    }
    
    /**
     * Xóa thành viên khỏi group
     */
    public void removeMember(Long chatGroupId, Long userId) {
        ChatMember member = chatMemberRepository.findByChatGroupIdAndUserId(chatGroupId, userId)
                .orElseThrow(() -> new RuntimeException("Thành viên không tồn tại"));
        
        member.setIsActive(false);
        chatMemberRepository.save(member);
        log.info("Xóa thành viên {} khỏi group {}", userId, chatGroupId);
    }
    
    /**
     * Lấy thành viên của group
     */
    public List<ChatMember> getGroupMembers(Long chatGroupId) {
        return chatMemberRepository.findByChatGroupId(chatGroupId);
    }
    
    /**
     * Lấy chats của user
     */
    public List<ChatGroup> getUserChats(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatGroupRepository.findUserChats(userId, pageable).getContent();
    }
    
    /**
     * Muting/Unmuting group
     */
    public void toggleMuteChat(Long chatGroupId, Long userId, Boolean mute) {
        ChatMember member = chatMemberRepository.findByChatGroupIdAndUserId(chatGroupId, userId)
                .orElseThrow(() -> new RuntimeException("Thành viên không tồn tại"));
        
        member.setIsMuted(mute);
        chatMemberRepository.save(member);
    }
    
    /**
     * Archive/Unarchive chat
     */
    public void toggleArchiveChat(Long chatGroupId) {
        ChatGroup chatGroup = chatGroupRepository.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat không tồn tại"));
        
        chatGroup.setIsArchived(!chatGroup.getIsArchived());
        chatGroupRepository.save(chatGroup);
    }
    
    // ==================== CALL OPERATIONS ====================
    
    /**
     * Bắt đầu cuộc gọi
     */
    public CallRecord initiateCall(Long chatGroupId, Long callerId, String callerName, 
                                   String callType, Long receiverId) {
        ChatGroup chatGroup = chatGroupRepository.findById(chatGroupId)
                .orElseThrow(() -> new RuntimeException("Chat không tồn tại"));
        
        CallRecord call = CallRecord.builder()
                .chatGroup(chatGroup)
                .chatGroupId(chatGroupId)
                .callerId(callerId)
                .callerName(callerName)
                .receiverId(receiverId)
                .callType(CallRecord.CallType.valueOf(callType))
                .status(CallRecord.CallStatus.INITIATED)
                .isMissed(false)
                .build();
        
        return callRecordRepository.save(call);
    }
    
    /**
     * Trả lời cuộc gọi
     */
    public void answerCall(Long callId, String receiverName) {
        CallRecord call = callRecordRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Cuộc gọi không tồn tại"));
        
        call.setStatus(CallRecord.CallStatus.ACCEPTED);
        call.setReceiverName(receiverName);
        call.setStartedAt(LocalDateTime.now());
        
        callRecordRepository.save(call);
    }
    
    /**
     * Từ chối cuộc gọi
     */
    public void rejectCall(Long callId) {
        CallRecord call = callRecordRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Cuộc gọi không tồn tại"));
        
        call.setStatus(CallRecord.CallStatus.REJECTED);
        call.setIsMissed(true);
        
        callRecordRepository.save(call);
    }
    
    /**
     * Kết thúc cuộc gọi
     */
    public void endCall(Long callId) {
        CallRecord call = callRecordRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Cuộc gọi không tồn tại"));
        
        call.setStatus(CallRecord.CallStatus.ENDED);
        call.setEndedAt(LocalDateTime.now());
        
        if (call.getStartedAt() != null) {
            long duration = java.time.temporal.ChronoUnit.SECONDS
                    .between(call.getStartedAt(), call.getEndedAt());
            call.setDurationSeconds(duration);
        }
        
        callRecordRepository.save(call);
    }
    
    /**
     * Lấy lịch sử gọi
     */
    public List<CallRecord> getCallHistory(Long userId) {
        return callRecordRepository.findCallsByUser(userId);
    }
    
    /**
     * Lấy cuộc gọi missed
     */
    public List<CallRecord> getMissedCalls(Long userId) {
        return callRecordRepository.findMissedCalls(userId);
    }
}
