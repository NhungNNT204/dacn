package com.upnest.edu.modules.group.entity;

/**
 * Enum đối với loại nhóm
 * PUBLIC: Công khai, bất kỳ ai cũng có thể xem và tham gia
 * PRIVATE: Riêng tư, cần được chấp thuận để vào
 * CLOSED: Đóng, chỉ thành viên hiện tại mới thấy
 */
public enum GroupType {
    PUBLIC,   // Công khai
    PRIVATE,  // Riêng tư - cần duyệt
    CLOSED    // Đóng - chỉ member
}
