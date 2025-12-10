import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

/**
 * API สำหรับดึงรายการรอบเช็คชื่อ
 * สำหรับ Instructor/TA: ดึงทั้งหมดของ course
 * สำหรับ Student: ดึงเฉพาะที่เปิดอยู่และอยู่ในช่วงเวลา
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { course_offering_id, stdid, user_type } = req.query;

    if (!course_offering_id) {
        return res.status(400).json({ error: 'course_offering_id is required' });
    }

    try {
        const promisePool = mysqlPool.promise();
        
        // แปลง course_offering_id หรือ subject_id เป็น course_offering_id จริง
        let actualCourseOfferingId = course_offering_id;
        
        // ลองแปลงเป็น number ก่อน (ถ้าเป็น course_offering_id)
        const courseIdAsNumber = parseInt(course_offering_id as string);
        const isNumeric = !isNaN(courseIdAsNumber);
        
        const [coCheck] = await promisePool.query(
            `SELECT id FROM course_offerings WHERE id = ? OR subject_id = ? LIMIT 1`,
            [isNumeric ? courseIdAsNumber : course_offering_id, course_offering_id]
        );
        
        if (Array.isArray(coCheck) && coCheck.length > 0) {
            actualCourseOfferingId = (coCheck as any[])[0].id;
        } else {
            // ถ้าไม่เจอ course offering ให้ return empty array แทน 404
            console.warn(`Course offering not found for: ${course_offering_id}`);
            return res.status(200).json([]);
        }

        let sessions;

        // ถ้าเป็น Instructor/TA (user_type = 0 หรือ 1) ให้ดึงทั้งหมด
        if (user_type === '0' || user_type === '1') {
            // ตรวจสอบว่าเป็น instructor/TA หรือไม่
            if (stdid) {
                // ตรวจสอบทั้ง course_offering_id และ subject_id
                const [caretakerCheck] = await promisePool.query(
                    `SELECT c.id FROM caretaker c
                     JOIN course_offerings co ON c.idcourse COLLATE utf8mb4_unicode_ci = co.id
                     WHERE c.stdid = ? AND (c.idcourse = ? OR co.subject_id = ? OR co.id = ?)`,
                    [stdid, actualCourseOfferingId, actualCourseOfferingId, actualCourseOfferingId]
                );

                if (!Array.isArray(caretakerCheck) || caretakerCheck.length === 0) {
                    console.warn(`Unauthorized access attempt: stdid=${stdid}, course_offering_id=${actualCourseOfferingId}`);
                    // Return empty array แทน 403 เพื่อให้แสดงหน้าได้ แต่ไม่มีข้อมูล
                    return res.status(200).json([]);
                }
            }

            // Query sessions with counts
            [sessions] = await promisePool.query(
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
                    s.updated_at,
                    COALESCE(COUNT(DISTINCT r.id), 0) as total_records,
                    COALESCE(COUNT(DISTINCT CASE WHEN r.status = 'present' THEN r.id END), 0) as present_count
                 FROM attendance_sessions s
                 LEFT JOIN attendance_records r ON s.id = r.session_id
                 WHERE s.course_offering_id = ?
                 GROUP BY s.id
                 ORDER BY s.created_at DESC`,
                [actualCourseOfferingId]
            );
            
            const sessionCount = Array.isArray(sessions) ? sessions.length : 0;
            console.log(`[Attendance List] Found ${sessionCount} sessions for course_offering_id: ${actualCourseOfferingId} (original: ${course_offering_id})`);
            
            if (sessionCount === 0) {
                // Debug: ตรวจสอบว่ามี sessions ในฐานข้อมูลหรือไม่
                const [allSessions] = await promisePool.query(
                    `SELECT id, course_offering_id, session_name FROM attendance_sessions LIMIT 5`
                );
                console.log(`[Attendance List] Sample sessions in DB:`, allSessions);
            }
        } else {
            // สำหรับ Student: ดึงเฉพาะที่เปิดอยู่และอยู่ในช่วงเวลา
            const now = new Date();
            [sessions] = await promisePool.query(
                `SELECT 
                    s.id,
                    s.course_offering_id,
                    s.session_name,
                    s.pin_code,
                    s.latitude,
                    s.longitude,
                    s.radius,
                    s.start_time,
                    s.end_time,
                    s.section_filter,
                    s.created_at
                 FROM attendance_sessions s
                 WHERE s.course_offering_id = ?
                   AND s.is_active = 1
                   AND s.start_time <= ?
                   AND s.end_time >= ?
                 ORDER BY s.start_time DESC`,
                [actualCourseOfferingId, now, now]
            );
        }

        return res.status(200).json(sessions);
    } catch (error: any) {
        console.error('Error fetching attendance sessions:', error);
        return res.status(500).json({ error: 'Failed to fetch attendance sessions', details: error.message });
    }
};

export default authenticateApiKey(handler);

