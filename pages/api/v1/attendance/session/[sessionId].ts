import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';

/**
 * API สำหรับดึงข้อมูล attendance session โดยใช้ session ID
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId is required' });
    }

    try {
        const promisePool = mysqlPool.promise();

        // ดึงข้อมูล session
        const [sessions] = await promisePool.query(
            `SELECT 
                s.id,
                s.course_offering_id,
                s.created_by,
                s.session_name,
                s.pin_code,
                s.latitude,
                s.longitude,
                s.radius,
                s.start_time,
                s.end_time,
                s.section_filter,
                s.is_active,
                s.created_at,
                s.updated_at
             FROM attendance_sessions s
             WHERE s.id = ?`,
            [sessionId]
        );

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(404).json({ error: 'Attendance session not found' });
        }

        const session = (sessions as any[])[0];

        return res.status(200).json(session);
    } catch (error: any) {
        console.error('Error fetching attendance session:', error);
        return res.status(500).json({ error: 'Failed to fetch attendance session', details: error.message });
    }
};

export default authenticateApiKey(handler);
