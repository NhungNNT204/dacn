/**
 * Component: MessageInput
 * Purpose: Input area for composing messages
 * Features: Text input, emoji picker, file attachment, send button
 */

import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Loader } from 'lucide-react';
import './MessageInput.css';

const EMOJI_LIST = ['😀', '😂', '😍', '😢', '😡', '👍', '👏', '🎉', '❤️', '🔥', '✨', '💯'];

export default function MessageInput({
  onSendMessage = () => {},
  onUploadFile = () => {},
  disabled = false,
  maxLength = 5000,
  attachmentEnabled = true,
  emojiEnabled = true
}) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() && attachedFiles.length === 0) return;

    try {
      await onSendMessage({
        content: message.trim(),
        files: attachedFiles,
        timestamp: new Date()
      });

      setMessage('');
      setAttachedFiles([]);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newFiles = Array.from(files).map((file) => ({
        id: Math.random().toString(36),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));

      setAttachedFiles([...attachedFiles, ...newFiles]);

      if (onUploadFile) {
        await onUploadFile(newFiles);
      }
    } catch (error) {
      console.error('File selection error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
    e.target.value = ''; // Reset input
  };

  const removeFile = (fileId) => {
    setAttachedFiles(attachedFiles.filter(f => f.id !== fileId));
  };

  const addEmoji = (emoji) => {
    const newMessage = message + emoji;
    setMessage(newMessage.slice(0, maxLength));
    setShowEmojiPicker(false);
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="message-input-container">
      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="attached-files-preview">
          {attachedFiles.map((file) => (
            <div key={file.id} className="file-preview-item">
              <div className="file-icon">
                {file.type.startsWith('image/') ? '🖼️' : '📎'}
              </div>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                className="remove-file-btn"
                onClick={() => removeFile(file.id)}
                disabled={isUploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        {/* Emoji Picker */}
        {emojiEnabled && (
          <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
            <button
              className="emoji-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              title="Emoji"
            >
              <Smile size={20} />
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker">
                <div className="emoji-grid">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      className="emoji-item"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Attachment */}
        {attachmentEnabled && (
          <div className="attachment-wrapper">
            <button
              className="attachment-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              title="Attach file"
            >
              {isUploading ? (
                <Loader size={20} className="loader-icon" />
              ) : (
                <Paperclip size={20} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden-file-input"
              disabled={disabled || isUploading}
            />
          </div>
        )}

        {/* Text Input */}
        <textarea
          className="message-textarea"
          placeholder="Type a message... (Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
        />

        {/* Character Count */}
        <div
          className={`char-count ${
            isNearLimit ? 'warning' : ''
          }`}
        >
          {remainingChars}
        </div>

        {/* Send Button */}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
          title="Send (Enter)"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
