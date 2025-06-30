-- สร้างตารางสำหรับเก็บแบนเนอร์ประกาศ
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('text', 'image') NOT NULL,
    content TEXT NOT NULL COMMENT 'เก็บข้อความหรือ URL รูปภาพ',
    filename VARCHAR(255) NULL COMMENT 'ชื่อไฟล์รูปภาพ (ถ้าเป็นรูปภาพ)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'สถานะการแสดงผล',
    display_order INT DEFAULT 0 COMMENT 'ลำดับการแสดงผล (น้อยกว่า = แสดงก่อน)',
    created_by VARCHAR(11) NOT NULL COMMENT 'STDID ของผู้สร้าง',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่อัปเดตล่าสุด',
    FOREIGN KEY (created_by) REFERENCES users(stdid) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- สร้าง Index สำหรับประสิทธิภาพ
CREATE INDEX idx_announcements_active ON announcements(is_active, display_order);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_type ON announcements(type);

-- เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ)
INSERT INTO announcements (type, content, is_active, display_order, created_by) VALUES
('text', 'ยินดีต้อนรับสู่ Scoring Classroom! ขอให้ทุกคนโชคดีในภาคการศึกษานี้ 🎉', TRUE, 0, '6330200000-1'),
('text', 'ตรวจสอบคะแนนและประกาศสำคัญได้ที่นี่ตลอดภาคเรียน', TRUE, 1, '6330200000-1');

-- ตรวจสอบสิทธิ์ (ถ้าต้องการให้เฉพาะ admin เข้าถึงได้)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO 'your_admin_user'@'localhost'; 