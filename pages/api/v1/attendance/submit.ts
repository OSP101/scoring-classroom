import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

/**
 * API สำหรับส่งการเช็คชื่อ (สำหรับ Student)
 * ต้องล็อกอินแล้ว และส่งข้อมูล: PIN Code, GPS, SSO Identifier (stdid)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        session_id,
        stdid, // SSO Identifier
        pin_code,
        latitude,
        longitude
    } = req.body;

    // Validation
    if (!session_id || !stdid || !pin_code) {
        return res.status(400).json({ error: 'Missing required fields: session_id, stdid, pin_code' });
    }

    try {
        const promisePool = mysqlPool.promise();
        const now = new Date();

        // 1. ดึงข้อมูล session
        const [sessions] = await promisePool.query(
            `SELECT * FROM attendance_sessions 
             WHERE id = ? AND is_active = 1`,
            [session_id]
        );

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(404).json({ error: 'Attendance session not found or inactive' });
        }

        const session = (sessions as any[])[0];

        // 2. ตรวจสอบว่า session ยังเปิดอยู่หรือไม่
        const startTime = new Date(session.start_time);
        const endTime = new Date(session.end_time);

        if (now < startTime || now > endTime) {
            return res.status(400).json({ 
                error: 'Attendance session is not open',
                start_time: session.start_time,
                end_time: session.end_time,
                current_time: now.toISOString()
            });
        }

        // 3. ตรวจสอบว่าเคยเช็คชื่อแล้วหรือยัง
        const [existingRecords] = await promisePool.query(
            `SELECT * FROM attendance_records 
             WHERE session_id = ? AND stdid = ?`,
            [session_id, stdid]
        );

        if (Array.isArray(existingRecords) && existingRecords.length > 0) {
            return res.status(400).json({ error: 'You have already checked in for this session' });
        }

        // 4. ตรวจสอบ PIN Code
        const is_valid_pin = session.pin_code === pin_code;

        // 5. ตรวจสอบเวลา
        const is_valid_time = now >= startTime && now <= endTime;

        // 6. ตรวจสอบตำแหน่ง GPS (ถ้ามีการตั้งค่า)
        let is_valid_location = true;
        let distance = null;

        if (session.latitude && session.longitude && session.radius) {
            if (!latitude || !longitude) {
                is_valid_location = false;
            } else {
                // คำนวณระยะห่าง (Haversine formula)
                const R = 6371000; // รัศมีโลกในหน่วยเมตร
                const lat1 = parseFloat(session.latitude);
                const lon1 = parseFloat(session.longitude);
                const lat2 = parseFloat(latitude);
                const lon2 = parseFloat(longitude);

                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;

                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                distance = R * c; // ระยะห่างในหน่วยเมตร

                is_valid_location = distance <= parseFloat(session.radius);
            }
        }

        // 7. ตรวจสอบ section (ถ้ามีการกรอง)
        let is_valid_section = true;
        if (session.section_filter) {
            // ตรวจสอบว่านักศึกษาอยู่ใน section นี้หรือไม่
            // ต้องเช็คจาก enllo table หรือ table อื่นที่เก็บ section
            // สำหรับตอนนี้ให้ผ่านก่อน (สามารถเพิ่ม logic ได้ภายหลัง)
        }

        // 8. กำหนด status
        let status = 'pending';
        if (is_valid_pin && is_valid_time && is_valid_location && is_valid_section) {
            status = 'present';
        } else {
            status = 'invalid';
        }

        // 9. บันทึกการเช็คชื่อ
        const [result] = await promisePool.query(
            `INSERT INTO attendance_records 
             (session_id, stdid, pin_code, latitude, longitude, distance, 
              is_valid_location, is_valid_pin, is_valid_time, status, submitted_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                session_id,
                stdid,
                pin_code,
                latitude || null,
                longitude || null,
                distance,
                is_valid_location ? 1 : 0,
                is_valid_pin ? 1 : 0,
                is_valid_time ? 1 : 0,
                status,
                now
            ]
        );

        const insertResult = result as any;

        return res.status(201).json({
            message: 'Attendance submitted successfully',
            record_id: insertResult.insertId,
            status: status,
            validation: {
                pin: is_valid_pin,
                time: is_valid_time,
                location: is_valid_location,
                section: is_valid_section,
                distance: distance
            }
        });
    } catch (error: any) {
        console.error('Error submitting attendance:', error);
        return res.status(500).json({ error: 'Failed to submit attendance', details: error.message });
    }
};

export default authenticateApiKey(handler);

