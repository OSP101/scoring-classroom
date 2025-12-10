-- Attendance System Database Schema
-- สำหรับระบบเช็คชื่อ (Attendance System)

-- ตารางสำหรับเก็บรอบเช็คชื่อ (Attendance Sessions)
CREATE TABLE IF NOT EXISTS `attendance_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_offering_id` int(11) NOT NULL COMMENT 'ID ของ course offering',
  `created_by` varchar(11) NOT NULL COMMENT 'stdid ของผู้สร้าง (instructor/TA)',
  `session_name` varchar(255) NOT NULL COMMENT 'ชื่อรอบเช็คชื่อ',
  `pin_code` varchar(10) NOT NULL COMMENT 'PIN Code สำหรับเช็คชื่อ',
  `latitude` decimal(10, 8) DEFAULT NULL COMMENT 'ตำแหน่ง GPS (lat)',
  `longitude` decimal(11, 8) DEFAULT NULL COMMENT 'ตำแหน่ง GPS (lng)',
  `radius` decimal(10, 2) DEFAULT NULL COMMENT 'รัศมีสำหรับตรวจสอบตำแหน่ง (เมตร)',
  `start_time` datetime NOT NULL COMMENT 'เวลาเปิดการเช็คชื่อ',
  `end_time` datetime NOT NULL COMMENT 'เวลาปิดการเช็คชื่อ',
  `section_filter` varchar(100) DEFAULT NULL COMMENT 'กรองตาม section (NULL = ทั้งวิชา, หรือระบุ section)',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'สถานะการใช้งาน (1=เปิด, 0=ปิด)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_course_offering` (`course_offering_id`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_pin_code` (`pin_code`),
  KEY `idx_time_range` (`start_time`, `end_time`),
  CONSTRAINT `fk_attendance_sessions_course` FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางสำหรับเก็บบันทึกการเช็คชื่อ (Attendance Records)
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL COMMENT 'ID ของ attendance session',
  `stdid` varchar(11) NOT NULL COMMENT 'รหัสนักศึกษา (SSO Identifier)',
  `pin_code` varchar(10) NOT NULL COMMENT 'PIN Code ที่ใช้เช็คชื่อ',
  `latitude` decimal(10, 8) DEFAULT NULL COMMENT 'ตำแหน่ง GPS ที่ส่งมา (lat)',
  `longitude` decimal(11, 8) DEFAULT NULL COMMENT 'ตำแหน่ง GPS ที่ส่งมา (lng)',
  `distance` decimal(10, 2) DEFAULT NULL COMMENT 'ระยะห่างจากจุดที่กำหนด (เมตร)',
  `is_valid_location` tinyint(1) DEFAULT 0 COMMENT 'สถานะตำแหน่งถูกต้อง (1=ถูกต้อง, 0=ไม่ถูกต้อง)',
  `is_valid_pin` tinyint(1) DEFAULT 0 COMMENT 'สถานะ PIN ถูกต้อง (1=ถูกต้อง, 0=ไม่ถูกต้อง)',
  `is_valid_time` tinyint(1) DEFAULT 0 COMMENT 'สถานะเวลาเช็คชื่อถูกต้อง (1=ถูกต้อง, 0=ไม่ถูกต้อง)',
  `status` varchar(20) DEFAULT 'pending' COMMENT 'สถานะ: pending, present, absent, invalid',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่ส่งการเช็คชื่อ',
  `verified_at` timestamp NULL DEFAULT NULL COMMENT 'เวลาที่ตรวจสอบแล้ว',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_session_student` (`session_id`, `stdid`),
  KEY `idx_session` (`session_id`),
  KEY `idx_student` (`stdid`),
  KEY `idx_submitted_at` (`submitted_at`),
  CONSTRAINT `fk_attendance_records_session` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index เพิ่มเติมสำหรับการค้นหา
CREATE INDEX `idx_attendance_sessions_active` ON `attendance_sessions` (`is_active`, `start_time`, `end_time`);
CREATE INDEX `idx_attendance_records_status` ON `attendance_records` (`status`, `submitted_at`);

