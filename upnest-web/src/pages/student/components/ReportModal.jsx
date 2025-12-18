import React, { useState } from 'react';
import { X, Eye, AlertCircle, Trash2 } from 'lucide-react';
import '../styles/ReportModal.css';

/**
 * ReportModal - Modal để báo cáo hoặc ẩn bài đăng
 */
export default function ReportModal({ postId, onClose, onReport, onHide, onDelete }) {
    const [action, setAction] = useState('hide'); // hide, report, delete
    const [reportType, setReportType] = useState('SPAM');
    const [reason, setReason] = useState('');
    
    const reportTypes = [
        { value: 'SPAM', label: 'Spam' },
        { value: 'HARASSMENT', label: 'Quấy rối, bắt nạt' },
        { value: 'INAPPROPRIATE', label: 'Nội dung không phù hợp' },
        { value: 'FRAUD', label: 'Lừa đảo' },
        { value: 'OTHER', label: 'Khác' }
    ];
    
    const handleAction = async () => {
        if (action === 'hide') {
            await onHide(postId);
        } else if (action === 'report') {
            if (!reason.trim()) {
                alert('Vui lòng nhập lý do báo cáo');
                return;
            }
            await onReport(postId, reportType, reason);
        } else if (action === 'delete') {
            if (window.confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
                await onDelete(postId);
            }
        }
    };
    
    return (
        <div className="report-modal">
            <div className="report-modal-overlay" onClick={onClose}></div>
            <div className="report-modal-content">
                <div className="report-modal-header">
                    <h2>Tuỳ chọn bài viết</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="report-modal-body">
                    <div className="action-tabs">
                        <button
                            className={`tab ${action === 'hide' ? 'active' : ''}`}
                            onClick={() => setAction('hide')}
                        >
                            <Eye size={18} />
                            <span>Ẩn bài viết</span>
                        </button>
                        <button
                            className={`tab ${action === 'report' ? 'active' : ''}`}
                            onClick={() => setAction('report')}
                        >
                            <AlertCircle size={18} />
                            <span>Báo cáo</span>
                        </button>
                        <button
                            className={`tab ${action === 'delete' ? 'active' : ''}`}
                            onClick={() => setAction('delete')}
                        >
                            <Trash2 size={18} />
                            <span>Xóa</span>
                        </button>
                    </div>
                    
                    {action === 'hide' && (
                        <div className="action-content">
                            <p>Bạn sẽ không thấy bài viết này nữa</p>
                        </div>
                    )}
                    
                    {action === 'report' && (
                        <div className="action-content">
                            <div className="form-group">
                                <label>Lý do báo cáo</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="report-select"
                                >
                                    {reportTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Chi tiết bổ sung (tùy chọn)</label>
                                <textarea
                                    placeholder="Hãy cho chúng tôi biết thêm về vấn đề này..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="report-textarea"
                                ></textarea>
                            </div>
                        </div>
                    )}
                    
                    {action === 'delete' && (
                        <div className="action-content">
                            <p>Bài viết sẽ bị xóa vĩnh viễn</p>
                        </div>
                    )}
                </div>
                
                <div className="report-modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="action-btn" onClick={handleAction}>
                        {action === 'hide' ? 'Ẩn bài viết' : action === 'report' ? 'Gửi báo cáo' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
}
