import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

/**
 * API สำหรับสร้างรอบเช็คชื่อ (Attendance Session)
 * สำหรับ Instructor หรือ TA เท่านั้น
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        course_offering_id,
        created_by, // stdid ของผู้สร้าง
        session_name,
        pin_code,
        latitude,
        longitude,
        radius,
        start_time,
        end_time,
        section_filter // NULL หรือ section name
    } = req.body;

    // Validation
    if (!course_offering_id || !created_by || !session_name || !pin_code || !start_time || !end_time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate time range
    const start = new Date(start_time);
    const end = new Date(end_time);
    if (start >= end) {
        return res.status(400).json({ error: 'End time must be after start time' });
    }

    try {
        const promisePool = mysqlPool.promise();

        // แปลง course_offering_id หรือ subject_id เป็น course_offering_id จริง
        let actualCourseOfferingId = course_offering_id;
        const [coCheck] = await promisePool.query(
            `SELECT id FROM course_offerings WHERE id = ? OR subject_id = ? LIMIT 1`,
            [course_offering_id, course_offering_id]
        );
        
        if (Array.isArray(coCheck) && coCheck.length > 0) {
            actualCourseOfferingId = (coCheck as any[])[0].id;
        } else {
            return res.status(404).json({ error: 'Course offering not found' });
        }

        // ตรวจสอบว่าเป็น instructor/TA ของ course นี้หรือไม่
        const [caretakerCheck] = await promisePool.query(
            `SELECT c.id FROM caretaker c
             JOIN course_offerings co ON c.idcourse COLLATE utf8mb4_unicode_ci = co.id
             WHERE c.stdid = ? AND (c.idcourse = ? OR co.subject_id = ? OR co.id = ?)`,
            [created_by, actualCourseOfferingId, actualCourseOfferingId, actualCourseOfferingId]
        );

        if (!Array.isArray(caretakerCheck) || caretakerCheck.length === 0) {
            return res.status(403).json({ error: 'Unauthorized: You are not an instructor or TA for this course' });
        }

        // สร้าง attendance session
        const [result] = await promisePool.query(
            `INSERT INTO attendance_sessions 
             (course_offering_id, created_by, session_name, pin_code, latitude, longitude, radius, start_time, end_time, section_filter)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                actualCourseOfferingId,
                created_by,
                session_name,
                pin_code,
                latitude || null,
                longitude || null,
                radius || null,
                start_time,
                end_time,
                section_filter || null
            ]
        );

        const insertResult = result as any;
        return res.status(201).json({
            message: 'Attendance session created successfully',
            session_id: insertResult.insertId
        });
    } catch (error: any) {
        console.error('Error creating attendance session:', error);
        return res.status(500).json({ error: 'Failed to create attendance session', details: error.message });
    }
};

export default authenticateApiKey(handler);

