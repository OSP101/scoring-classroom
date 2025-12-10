import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

/**
 * API สำหรับอัปเดตสถานะของ attendance session (เปิด/ปิด)
 * สำหรับ Instructor/TA เท่านั้น
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        session_id,
        created_by, // stdid ของผู้แก้ไข
        is_active
    } = req.body;

    if (!session_id || created_by === undefined || is_active === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const promisePool = mysqlPool.promise();

        // 1. ดึงข้อมูล session
        const [sessions] = await promisePool.query(
            `SELECT * FROM attendance_sessions WHERE id = ?`,
            [session_id]
        );

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(404).json({ error: 'Attendance session not found' });
        }

        const session = (sessions as any[])[0];

        // 2. ตรวจสอบว่าเป็น instructor/TA ของ course นี้หรือไม่
        const [caretakerCheck] = await promisePool.query(
            `SELECT c.id FROM caretaker c
             JOIN course_offerings co ON c.idcourse COLLATE utf8mb4_unicode_ci = co.id
             WHERE c.stdid = ? AND (c.idcourse = ? OR co.subject_id = ? OR co.id = ?)`,
            [created_by, session.course_offering_id, session.course_offering_id, session.course_offering_id]
        );

        if (!Array.isArray(caretakerCheck) || caretakerCheck.length === 0) {
            return res.status(403).json({ error: 'Unauthorized: You are not an instructor or TA for this course' });
        }

        // 3. อัปเดตสถานะ
        await promisePool.query(
            `UPDATE attendance_sessions 
             SET is_active = ? 
             WHERE id = ?`,
            [is_active ? 1 : 0, session_id]
        );

        return res.status(200).json({
            message: 'Attendance session status updated successfully',
            is_active: is_active
        });
    } catch (error: any) {
        console.error('Error updating attendance session status:', error);
        return res.status(500).json({ error: 'Failed to update attendance session status', details: error.message });
    }
};

export default authenticateApiKey(handler);

