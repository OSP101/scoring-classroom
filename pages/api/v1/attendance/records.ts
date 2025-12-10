import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

/**
 * API สำหรับดึงรายการบันทึกการเช็คชื่อ
 * สำหรับ Instructor/TA: ดึงทั้งหมดของ session
 * สำหรับ Student: ดึงเฉพาะของตัวเอง
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { session_id, stdid, user_type } = req.query;

    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required' });
    }

    try {
        const promisePool = mysqlPool.promise();

        // ตรวจสอบว่า session มีอยู่จริง
        const [sessions] = await promisePool.query(
            `SELECT * FROM attendance_sessions WHERE id = ?`,
            [session_id]
        );

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(404).json({ error: 'Attendance session not found' });
        }

        const session = (sessions as any[])[0];

        let records;

        // ถ้าเป็น Instructor/TA ให้ดึงทั้งหมด
        if (user_type === '0' || user_type === '1') {
            // ตรวจสอบว่าเป็น instructor/TA ของ course นี้หรือไม่
            if (stdid) {
                const [caretakerCheck] = await promisePool.query(
                    `SELECT c.id FROM caretaker c
                     JOIN course_offerings co ON c.idcourse COLLATE utf8mb4_unicode_ci = co.id
                     WHERE c.stdid = ? AND (c.idcourse = ? OR co.subject_id = ? OR co.id = ?)`,
                    [stdid, session.course_offering_id, session.course_offering_id, session.course_offering_id]
                );

                if (!Array.isArray(caretakerCheck) || caretakerCheck.length === 0) {
                    return res.status(403).json({ error: 'Unauthorized' });
                }
            }

            [records] = await promisePool.query(
                `SELECT 
                    r.id,
                    r.session_id,
                    r.stdid,
                    r.pin_code,
                    r.latitude,
                    r.longitude,
                    r.distance,
                    r.is_valid_location,
                    r.is_valid_pin,
                    r.is_valid_time,
                    r.status,
                    r.submitted_at,
                    r.verified_at,
                    u.name as student_name,
                    u.email as student_email,
                    u.section as student_section
                 FROM attendance_records r
                 LEFT JOIN users u ON r.stdid = u.stdid
                 WHERE r.session_id = ?
                 ORDER BY r.submitted_at DESC`,
                [session_id]
            );
        } else {
            // สำหรับ Student: ดึงเฉพาะของตัวเอง
            if (!stdid) {
                return res.status(400).json({ error: 'stdid is required for students' });
            }

            [records] = await promisePool.query(
                `SELECT 
                    r.id,
                    r.session_id,
                    r.stdid,
                    r.pin_code,
                    r.latitude,
                    r.longitude,
                    r.distance,
                    r.is_valid_location,
                    r.is_valid_pin,
                    r.is_valid_time,
                    r.status,
                    r.submitted_at,
                    r.verified_at
                 FROM attendance_records r
                 WHERE r.session_id = ? AND r.stdid = ?
                 ORDER BY r.submitted_at DESC`,
                [session_id, stdid]
            );
        }

        return res.status(200).json(records);
    } catch (error: any) {
        console.error('Error fetching attendance records:', error);
        return res.status(500).json({ error: 'Failed to fetch attendance records', details: error.message });
    }
};

export default authenticateApiKey(handler);

