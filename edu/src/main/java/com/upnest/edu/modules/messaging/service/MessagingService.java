package com.upnest.edu.modules.messaging.service;

import com.upnest.edu.modules.auth.repository.UserRepository;
import com.upnest.edu.modules.messaging.entity.*;
import com.upnest.edu.modules.messaging.payload.*;
import com.upnest.edu.modules.messaging.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * MessagingService - Service xử lý logic cho messaging
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ConversationParticipantRepository participantRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách cuộc trò chuyện của user
     */
    public List<ConversationDTO> getConversations(Long userId, String filter) {
        log.info("Getting conversations for user: {}, filter: {}", userId, filter);
        
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(userId);
        
        // Filter by type
        if (filter != null && !filter.equals("all")) {
            Conversation.ConversationType type = Conversation.ConversationType.valueOf(filter.toUpperCase());
            conversations = conversations.stream()
                    .filter(c -> c.getConversationType() == type)
                    .collect(Collectors.toList());
        }

        return conversations.stream()
                .map(conv -> mapToConversationDTO(conv, userId))
                .collect(Collectors.toList());
    }

    /**
     * Lấy hoặc tạo cuộc trò chuyện cá nhân
     */
    public Conversation getOrCreateIndividualConversation(Long userId1, Long userId2) {
        return conversationRepository.findIndividualConversation(userId1, userId2)
                .orElseGet(() -> createIndividualConversation(userId1, userId2));
    }

    private Conversation createIndividualConversation(Long userId1, Long userId2) {
        Conversation conversation = Conversation.builder()
                .conversationType(Conversation.ConversationType.INDIVIDUAL)
                .participantIds("[" + userId1 + "," + userId2 + "]")
                .build();
        
        conversation = conversationRepository.save(conversation);

        // Create participants
        ConversationParticipant p1 = ConversationParticipant.builder()
                .conversation(conversation)
                .userId(userId1)
                .build();
        
        ConversationParticipant p2 = ConversationParticipant.builder()
                .conversation(conversation)
                .userId(userId2)
                .build();

        participantRepository.save(p1);
        participantRepository.save(p2);

        return conversation;
    }

    /**
     * Lấy tin nhắn trong cuộc trò chuyện
     */
    public List<MessageDTO> getMessages(Long conversationId, Long userId, int page, int size) {
        log.info("Getting messages for conversation: {}, user: {}", conversationId, userId);
        
        // TODO: Use Pageable for pagination
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(
                conversationId, 
                org.springframework.data.domain.PageRequest.of(page, size)
        ).getContent();

        // Reverse to get chronological order
        List<Message> reversed = new ArrayList<>(messages);
        java.util.Collections.reverse(reversed);

        return reversed.stream()
                .map(msg -> mapToMessageDTO(msg, userId))
                .collect(Collectors.toList());
    }

    /**
     * Gửi tin nhắn
     */
    public MessageDTO sendMessage(Long conversationId, Long senderId, SendMessageRequest request) {
        log.info("Sending message to conversation: {} from user: {}", conversationId, senderId);

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message.MessageType messageType = Message.MessageType.valueOf(request.getMessageType().toUpperCase());

        Message.MessageBuilder messageBuilder = Message.builder()
                .conversation(conversation)
                .senderId(senderId)
                .content(request.getContent())
                .messageType(messageType)
                .status(Message.MessageStatus.SENT);

        // Get sender info
        userRepository.findById(senderId).ifPresent(user -> {
            messageBuilder.senderName(user.getFullName() != null ? user.getFullName() : "User");
            // TODO: Set avatar
        });

        Message message = messageRepository.save(messageBuilder.build());

        // Save attachments if any
        if (request.getAttachmentUrls() != null && !request.getAttachmentUrls().isEmpty()) {
            // TODO: Create MessageAttachment entities
        }

        // Update conversation last message
        conversation.setLastMessage(request.getContent());
        conversation.setLastMessageSenderId(senderId);
        conversation.setLastMessageTime(LocalDateTime.now());
        conversationRepository.save(conversation);

        return mapToMessageDTO(message, senderId);
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    public void markAsRead(Long conversationId, Long userId) {
        log.info("Marking messages as read for conversation: {}, user: {}", conversationId, userId);

        ConversationParticipant participant = participantRepository
                .findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setLastReadAt(LocalDateTime.now());
        participant.setUnreadCount(0);
        participantRepository.save(participant);
    }

    // ========== MAPPING METHODS ==========

    private ConversationDTO mapToConversationDTO(Conversation conv, Long userId) {
        // Get unread count
        Integer unreadCount = participantRepository
                .findByConversationIdAndUserId(conv.getId(), userId)
                .map(ConversationParticipant::getUnreadCount)
                .orElse(0);

        // Get avatar initials
        String avatar = conv.getName() != null && !conv.getName().isEmpty()
                ? conv.getName().substring(0, Math.min(2, conv.getName().length())).toUpperCase()
                : "??";

        return ConversationDTO.builder()
                .id(conv.getId())
                .conversationType(conv.getConversationType().name())
                .name(conv.getName())
                .avatarUrl(conv.getAvatarUrl())
                .avatarColor(conv.getAvatarColor())
                .avatar(avatar)
                .lastMessage(conv.getLastMessage())
                .lastMessageTime(conv.getLastMessageTime())
                .lastMessageTimeFormatted(formatTimeAgo(conv.getLastMessageTime()))
                .unreadCount(unreadCount)
                .isOnline(false) // TODO: Check from presence service
                .role("User") // TODO: Get role
                .build();
    }

    private MessageDTO mapToMessageDTO(Message msg, Long currentUserId) {
        String avatarInitial = msg.getSenderName() != null && !msg.getSenderName().isEmpty()
                ? msg.getSenderName().substring(0, 1).toUpperCase()
                : "?";

        return MessageDTO.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .senderAvatar(msg.getSenderAvatar())
                .senderAvatarInitial(avatarInitial)
                .content(msg.getContent())
                .messageType(msg.getMessageType().name())
                .status(msg.getStatus().name())
                .timeFormatted(formatTime(msg.getCreatedAt()))
                .createdAt(msg.getCreatedAt())
                .attachments(new ArrayList<>()) // TODO: Map attachments
                .isFromMe(msg.getSenderId().equals(currentUserId))
                .build();
    }

    private String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        int hour = dateTime.getHour();
        int minute = dateTime.getMinute();
        String amPm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour == 0) hour = 12;
        return String.format("%02d:%02d %s", hour, minute, amPm);
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 60) {
            return minutes + " phút trước";
        }
        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24) {
            return hours + " giờ trước";
        }
        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        if (days == 1) return "Hôm qua";
        return days + " ngày trước";
    }
}

