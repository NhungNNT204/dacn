package com.upnest.edu.modules.social.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.upnest.edu.modules.chat.service.ChatService;
import com.upnest.edu.modules.chat.entity.Message;
import com.upnest.edu.modules.chat.entity.ChatGroup;
import com.upnest.edu.modules.chat.entity.ChatMember;
import com.upnest.edu.modules.chat.entity.CallRecord;
import com.upnest.edu.modules.social.payload.*;

import java.util.List;

/**
 * REST Controller cho Chat/Messenger - Quản lý tin nhắn, nhóm chat, gọi điện
 * 
 * Endpoints:
 * - Messages: GET, POST, PUT, DELETE, search, reactions
 * - Chat Groups: GET, POST, members management
 * - Calls: GET, POST, history
 * 
 * WebSocket: /ws/chat (real-time messaging)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/social/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

  private final ChatService chatService;

  // ============================================
  // MESSAGES ENDPOINTS
  // ============================================

  /**
   * GET /api/v1/social/messages/conversations
   * Lấy danh sách các cuộc trò cnhungện của người dùng
   */
  @GetMapping("/conversations")
  public ResponseEntity<List<ChatGroupDTO>> getUserConversations(
      @RequestParam(defaultValue = "1") Long userId) {
    log.info("Getting conversations for user: {}", userId);
    try {
      List<ChatGroup> conversations = chatService.getUserChats(userId, 0, 50);
      List<ChatGroupDTO> dtos = conversations.stream()
          .map(this::convertToChatGroupDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting conversations", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/{chatGroupId}
   * Lấy tin nhắn từ một cuộc trò cnhungện
   */
  @GetMapping("/{chatGroupId}")
  public ResponseEntity<List<MessageDTO>> getMessages(
      @PathVariable Long chatGroupId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "50") int limit) {
    log.info("Getting messages for chatGroupId: {}, page: {}", chatGroupId, page);
    try {
      List<Message> messages = chatService.getMessages(chatGroupId, page * limit, limit);
      List<MessageDTO> dtos = messages.stream()
          .map(this::convertToMessageDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting messages", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages
   * Gửi tin nhắn mới
   */
  @PostMapping
  public ResponseEntity<MessageDTO> sendMessage(
      @RequestBody SendMessageRequest request) {
    log.info("Sending message from user {} to chat {}", request.getSenderId(), request.getChatGroupId());
    try {
      Message message = chatService.sendMessage(
          request.getChatGroupId(),
          request.getSenderId(),
          request.getSenderName(),
          request.getSenderAvatar(),
          request.getContent(),
          "TEXT"
      );
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(convertToMessageDTO(message));
    } catch (IllegalArgumentException e) {
      log.error("Invalid request: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    } catch (Exception e) {
      log.error("Error sending message", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/media
   * Gửi tin nhắn với media (ảnh/video)
   */
  @PostMapping("/media")
  public ResponseEntity<MessageDTO> sendMediaMessage(
      @RequestParam Long chatGroupId,
      @RequestParam Long senderId,
      @RequestParam String messageType,
      @RequestParam MultipartFile file) {
    log.info("Sending media message from user {} to chat {}", senderId, chatGroupId);
    try {
      // Simulate file upload to storage (S3, Azure Blob, etc.)
      String mediaUrl = "https://storage.example.com/messages/" + file.getOriginalFilename();
      
      Message message = chatService.sendMediaMessage(
          chatGroupId,
          senderId,
          null,
          null,
          mediaUrl,
          messageType,
          file.getSize(),
          null,
          "MEDIA"
      );
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(convertToMessageDTO(message));
    } catch (Exception e) {
      log.error("Error sending media message", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * PUT /api/v1/social/messages/{messageId}
   * Chỉnh sửa tin nhắn
   */
  @PutMapping("/{messageId}")
  public ResponseEntity<MessageDTO> editMessage(
      @PathVariable Long messageId,
      @RequestBody EditMessageRequest request) {
    log.info("Editing message: {}", messageId);
    try {
      Message message = chatService.editMessage(messageId, request.getNewContent());
      return ResponseEntity.ok(convertToMessageDTO(message));
    } catch (IllegalArgumentException e) {
      log.error("Message not found: {}", messageId);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } catch (Exception e) {
      log.error("Error editing message", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * DELETE /api/v1/social/messages/{messageId}
   * Xóa tin nhắn (soft delete)
   */
  @DeleteMapping("/{messageId}")
  public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
    log.info("Deleting message: {}", messageId);
    try {
      chatService.deleteMessage(messageId);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
      log.error("Message not found: {}", messageId);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } catch (Exception e) {
      log.error("Error deleting message", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/{messageId}/reactions
   * Thêm emoji reaction vào tin nhắn
   */
  @PostMapping("/{messageId}/reactions")
  public ResponseEntity<Void> addReaction(
      @PathVariable Long messageId,
      @RequestBody AddReactionRequest request) {
    log.info("Adding reaction {} to message {}", request.getEmoji(), messageId);
    try {
      chatService.addReaction(messageId, request.getEmoji());
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error adding reaction", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/{messageId}/pin
   * Ghim tin nhắn
   */
  @PostMapping("/{messageId}/pin")
  public ResponseEntity<Void> pinMessage(@PathVariable Long messageId) {
    log.info("Pinning message: {}", messageId);
    try {
      chatService.pinMessage(messageId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error pinning message", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/{chatGroupId}/search
   * Tìm kiếm tin nhắn
   */
  @GetMapping("/{chatGroupId}/search")
  public ResponseEntity<List<MessageDTO>> searchMessages(
      @PathVariable Long chatGroupId,
      @RequestParam String keyword) {
    log.info("Searching messages in chat {} with keyword: {}", chatGroupId, keyword);
    try {
      List<Message> messages = chatService.searchMessages(chatGroupId, keyword);
      List<MessageDTO> dtos = messages.stream()
          .map(this::convertToMessageDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error searching messages", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/{chatGroupId}/pinned
   * Lấy các tin nhắn đã ghim
   */
  @GetMapping("/{chatGroupId}/pinned")
  public ResponseEntity<List<MessageDTO>> getPinnedMessages(@PathVariable Long chatGroupId) {
    log.info("Getting pinned messages for chat: {}", chatGroupId);
    try {
      List<Message> messages = chatService.getPinnedMessages(chatGroupId);
      List<MessageDTO> dtos = messages.stream()
          .map(this::convertToMessageDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting pinned messages", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // ============================================
  // CHAT GROUP ENDPOINTS
  // ============================================

  /**
   * POST /api/v1/social/messages/groups/private
   * Tạo hoặc lấy cuộc trò cnhungện 1-1
   */
  @PostMapping("/groups/private")
  public ResponseEntity<ChatGroupDTO> createPrivateChat(
      @RequestBody CreatePrivateChatRequest request) {
    log.info("Creating private chat between user {} and {}", request.getUserId1(), request.getUserId2());
    try {
      ChatGroup chatGroup = chatService.createPrivateChat(
          request.getUserId1(),
          request.getUserId2(),
          null,
          null,
          null,
          null
      );
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(convertToChatGroupDTO(chatGroup));
    } catch (Exception e) {
      log.error("Error creating private chat", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/groups
   * Tạo nhóm chat mới
   */
  @PostMapping("/groups")
  public ResponseEntity<ChatGroupDTO> createGroupChat(
      @RequestBody CreateGroupChatRequest request) {
    log.info("Creating group chat: {}", request.getGroupName());
    try {
      ChatGroup chatGroup = chatService.createGroupChat(
          request.getGroupName(),
          null,
          null,
          request.getGroupOwnerId(),
          null,
          request.getMemberIds()
      );
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(convertToChatGroupDTO(chatGroup));
    } catch (Exception e) {
      log.error("Error creating group chat", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/groups/{chatGroupId}/members
   * Lấy danh sách thành viên nhóm
   */
  @GetMapping("/groups/{chatGroupId}/members")
  public ResponseEntity<List<ChatMemberDTO>> getGroupMembers(@PathVariable Long chatGroupId) {
    log.info("Getting members for chat group: {}", chatGroupId);
    try {
      List<ChatMember> members = chatService.getGroupMembers(chatGroupId);
      List<ChatMemberDTO> dtos = members.stream()
          .map(this::convertToChatMemberDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting group members", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/groups/{chatGroupId}/members
   * Thêm thành viên vào nhóm
   */
  @PostMapping("/groups/{chatGroupId}/members")
  public ResponseEntity<Void> addMember(
      @PathVariable Long chatGroupId,
      @RequestBody AddMemberRequest request) {
    log.info("Adding member {} to chat group {}", request.getUserId(), chatGroupId);
    try {
      chatService.addMember(chatGroupId, request.getUserId(), null, null);
      return ResponseEntity.status(HttpStatus.CREATED).build();
    } catch (Exception e) {
      log.error("Error adding member", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * DELETE /api/v1/social/messages/groups/{chatGroupId}/members/{userId}
   * Xóa thành viên khỏi nhóm
   */
  @DeleteMapping("/groups/{chatGroupId}/members/{userId}")
  public ResponseEntity<Void> removeMember(
      @PathVariable Long chatGroupId,
      @PathVariable Long userId) {
    log.info("Removing member {} from chat group {}", userId, chatGroupId);
    try {
      chatService.removeMember(chatGroupId, userId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error removing member", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/groups/{chatGroupId}/mute
   * Tắt thông báo nhóm
   */
  @PostMapping("/groups/{chatGroupId}/mute")
  public ResponseEntity<Void> toggleMuteChat(
      @PathVariable Long chatGroupId,
      @RequestParam Long userId,
      @RequestParam Boolean mute) {
    log.info("Toggling mute for user {} in chat {}", userId, chatGroupId);
    try {
      chatService.toggleMuteChat(chatGroupId, userId, mute);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error toggling mute", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/groups/{chatGroupId}/archive
   * Lưu trữ nhóm chat
   */
  @PostMapping("/groups/{chatGroupId}/archive")
  public ResponseEntity<Void> toggleArchiveChat(
      @PathVariable Long chatGroupId,
      @RequestParam Long userId) {
    log.info("Toggling archive for user {} in chat {}", userId, chatGroupId);
    try {
      chatService.toggleArchiveChat(chatGroupId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error toggling archive", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // ============================================
  // CALL ENDPOINTS
  // ============================================

  /**
   * POST /api/v1/social/messages/calls/initiate
   * Bắt đầu cuộc gọi thoại/video
   */
  @PostMapping("/calls/initiate")
  public ResponseEntity<CallRecordDTO> initiateCall(
      @RequestBody InitiateCallRequest request) {
    log.info("Initiating {} call from user {} to {}", 
        request.getCallType(), request.getCallerId(), request.getReceiverId());
    try {
      CallRecord callRecord = chatService.initiateCall(
          request.getChatGroupId(),
          request.getCallerId(),
          null,
          request.getCallType(),
          request.getReceiverId()
      );
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(convertToCallRecordDTO(callRecord));
    } catch (Exception e) {
      log.error("Error initiating call", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/calls/{callId}/answer
   * Trả lời cuộc gọi
   */
  @PostMapping("/calls/{callId}/answer")
  public ResponseEntity<Void> answerCall(@PathVariable Long callId) {
    log.info("Answering call: {}", callId);
    try {
      chatService.answerCall(callId, null);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error answering call", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/calls/{callId}/reject
   * Từ chối cuộc gọi
   */
  @PostMapping("/calls/{callId}/reject")
  public ResponseEntity<Void> rejectCall(@PathVariable Long callId) {
    log.info("Rejecting call: {}", callId);
    try {
      chatService.rejectCall(callId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error rejecting call", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * POST /api/v1/social/messages/calls/{callId}/end
   * Kết thúc cuộc gọi
   */
  @PostMapping("/calls/{callId}/end")
  public ResponseEntity<Void> endCall(@PathVariable Long callId) {
    log.info("Ending call: {}", callId);
    try {
      chatService.endCall(callId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Error ending call", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/calls/history/{userId}
   * Lấy lịch sử cuộc gọi của người dùng
   */
  @GetMapping("/calls/history/{userId}")
  public ResponseEntity<List<CallRecordDTO>> getCallHistory(@PathVariable Long userId) {
    log.info("Getting call history for user: {}", userId);
    try {
      List<CallRecord> callRecords = chatService.getCallHistory(userId);
      List<CallRecordDTO> dtos = callRecords.stream()
          .map(this::convertToCallRecordDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting call history", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /**
   * GET /api/v1/social/messages/calls/missed/{userId}
   * Lấy các cuộc gọi nhỡ
   */
  @GetMapping("/calls/missed/{userId}")
  public ResponseEntity<List<CallRecordDTO>> getMissedCalls(@PathVariable Long userId) {
    log.info("Getting missed calls for user: {}", userId);
    try {
      List<CallRecord> callRecords = chatService.getMissedCalls(userId);
      List<CallRecordDTO> dtos = callRecords.stream()
          .map(this::convertToCallRecordDTO)
          .toList();
      return ResponseEntity.ok(dtos);
    } catch (Exception e) {
      log.error("Error getting missed calls", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // ============================================
  // DTO CONVERSION HELPERS
  // ============================================

  private MessageDTO convertToMessageDTO(Message message) {
    return MessageDTO.builder()
        .id(message.getId())
        .chatGroupId(message.getChatGroup().getId())
        .senderId(message.getSenderId())
        .senderName(message.getSenderName())
        .senderAvatar(message.getSenderAvatar())
        .content(message.getContent())
        .messageType(message.getMessageType().toString())
        .mediaUrl(message.getMediaUrl())
        .mediaType(message.getMediaType())
        .isPinned(message.getIsPinned())
        .isEdited(message.getIsEdited())
        .reactions(message.getReactions())
        .createdAt(message.getCreatedAt())
        .editedAt(message.getEditedAt())
        .build();
  }

  private ChatGroupDTO convertToChatGroupDTO(ChatGroup chatGroup) {
    return ChatGroupDTO.builder()
        .id(chatGroup.getId())
        .isGroup(chatGroup.getIsGroup())
        .groupName(chatGroup.getGroupName())
        .groupOwnerId(chatGroup.getGroupOwnerId())
        .memberCount(chatGroup.getChatMembers().size())
        .lastMessageAt(chatGroup.getLastMessageAt())
        .createdAt(chatGroup.getCreatedAt())
        .build();
  }

  private ChatMemberDTO convertToChatMemberDTO(ChatMember member) {
    return ChatMemberDTO.builder()
        .id(member.getId())
        .userId(member.getUserId())
        .userName(member.getUserName())
        .userAvatar(member.getUserAvatar())
        .role(member.getRole().toString())
        .isMuted(member.getIsMuted())
        .joinedAt(member.getJoinedAt())
        .build();
  }

  private CallRecordDTO convertToCallRecordDTO(CallRecord callRecord) {
    return CallRecordDTO.builder()
        .id(callRecord.getId())
        .callerId(callRecord.getCallerId())
        .receiverId(callRecord.getReceiverId())
        .callType(callRecord.getCallType().toString())
        .callStatus(callRecord.getCallStatus().toString())
        .durationSeconds(callRecord.getDurationSeconds())
        .isMissed(callRecord.getIsMissed())
        .createdAt(callRecord.getCreatedAt())
        .build();
  }
}
