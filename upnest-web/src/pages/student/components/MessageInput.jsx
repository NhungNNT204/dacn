import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image,
  Video,
  Smile,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';
import '../styles/MessageInput.css';

const MessageInput = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const EMOJI_LIST = [
    '😀', '😂', '😍', '🥰', '😢', '😡', '🤔', '👍',
    '👏', '🎉', '🎊', '❤️', '💯', '🔥', '⭐', '✨'
  ];

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_ATTACHMENTS = 5;

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(
        inputRef.current.scrollHeight,
        120
      ) + 'px';
    }
  }, [message]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setError(null);

    // Trigger typing indicator
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping();

      typingTimeoutRef.current = setTimeout(() => {
        // Typing indicator stops after 3 seconds of inactivity
      }, 3000);
    }
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) {
      setError('Vui lòng nhập tin nhắn hoặc đính kèm tệp');
      return;
    }

    if (message.length > 5000) {
      setError('Tin nhắn quá dài (tối đa 5000 ký tự)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSend(message.trim(), attachments);

      // Clear input
      setMessage('');
      setAttachments([]);

      // Focus input
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setError(`Tối đa ${MAX_ATTACHMENTS} tệp đính kèm`);
      return;
    }

    const newAttachments = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`Tệp ${file.name} quá lớn (tối đa 50MB)`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        newAttachments.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'file',
          name: file.name,
          size: file.size,
          url: dataUrl
        });
      } catch (err) {
        setError(`Không thể đọc tệp ${file.name}`);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleAddEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Send message on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
    }

    // Don't close emoji picker on Enter
    if (e.key === 'Escape') {
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="message-input-container">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-preview-item">
              {attachment.type === 'image' && (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="preview-image"
                />
              )}
              {attachment.type === 'video' && (
                <div className="preview-video">
                  <Video className="w-6 h-6" />
                </div>
              )}
              {attachment.type === 'file' && (
                <div className="preview-file">
                  <Paperclip className="w-6 h-6" />
                </div>
              )}
              <button
                className="remove-attachment"
                onClick={() => handleRemoveAttachment(attachment.id)}
                title="Xóa"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="attachment-name">{attachment.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Input Area */}
      <div className="input-wrapper">
        {/* Text Input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn... (Ctrl+Enter để gửi)"
          className="message-input"
          rows="1"
          disabled={isLoading}
        />

        {/* Actions */}
        <div className="input-actions">
          {/* Emoji Picker Button */}
          <div className="action-group emoji-group">
            <button
              className="action-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Biểu cảm"
              disabled={isLoading}
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker">
                {EMOJI_LIST.map(emoji => (
                  <button
                    key={emoji}
                    className="emoji-btn"
                    onClick={() => handleAddEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Attachment Button */}
          <button
            className="action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm tệp"
            disabled={isLoading || attachments.length >= MAX_ATTACHMENTS}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Image Button */}
          <button
            className="action-btn"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            title="Tải ảnh"
            disabled={isLoading || attachments.length >= MAX_ATTACHMENTS}
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Video Button */}
          <button
            className="action-btn"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            title="Tải video"
            disabled={isLoading || attachments.length >= MAX_ATTACHMENTS}
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            title="Gửi (Ctrl+Enter)"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        />
      </div>

      {/* Character Count */}
      {message.length > 4500 && (
        <div className="char-count">
          {message.length} / 5000
        </div>
      )}
    </div>
  );
};

// Helper function to read file as data URL
const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default MessageInput;
