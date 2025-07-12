import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/encrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { scoreapi } = req.query;
    try {
        const promisePool = mysqlPool.promise();
        // 1. ดึงข้อมูลโปรไฟล์
        const [profileRows] = await promisePool.query(
            `SELECT stdid, name, email, image, track, section FROM users WHERE stdid = ? LIMIT 1`,
            [scoreapi]
        );
        if (!profileRows || profileRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const profile = profileRows[0];

        // 2. ดึงรายวิชาที่ลงทะเบียน
        const [courses] = await promisePool.query(
            `SELECT co.id as offering_id, s.id as idcourse, s.name as course_name, co.year, co.semester, co.image
             FROM enllo e
             JOIN course_offerings co ON e.idcourse = co.id
             JOIN subjects s ON co.subject_id = s.id
             WHERE e.stdid = ? AND co.status = 'o'
             ORDER BY co.year DESC, co.semester DESC, s.name ASC`,
            [scoreapi]
        );

        // 3. สำหรับแต่ละวิชา ดึงงาน คะแนน ฯลฯ
        const courseDetails = [];
        for (const course of courses) {
            // 3.1 งานทั้งหมดในวิชา
            const [assignments] = await promisePool.query(
                `SELECT id, name, maxpoint FROM titelwork WHERE idcourse = ? AND delete_at IS NULL ORDER BY id ASC`,
                [course.offering_id]
            );
            // 3.2 คะแนนแต่ละงาน
            const assignmentScores = [];
            for (const assignment of assignments) {
                const [scoreRows] = await promisePool.query(
                    `SELECT point, teachid, update_at, type FROM points WHERE stdid = ? AND idtitelwork = ? LIMIT 1`,
                    [scoreapi, assignment.id]
                );
                assignmentScores.push({
                    id: assignment.id,
                    name: assignment.name,
                    maxpoint: assignment.maxpoint,
                    score: scoreRows[0]?.point ?? 0,
                    teachid: scoreRows[0]?.teachid ?? null,
                    update_at: scoreRows[0]?.update_at ?? null,
                    type: scoreRows[0]?.type ?? null
                });
            }
            // 3.3 คะแนนพิเศษ
            const [extraRows] = await promisePool.query(
                `SELECT COALESCE(SUM(point),0) as extra_point FROM extra_point WHERE stdid = ? AND idcourse = ?`,
                [scoreapi, course.idcourse]
            );
            // 3.4 คะแนน kahoot
            const [kahootRows] = await promisePool.query(
                `SELECT COALESCE(SUM(point),0) as kahoot_point FROM kahoot_point WHERE stdid = ? AND idcourse = ?`,
                [scoreapi, course.idcourse]
            );
            // 3.5 คะแนนรวม (ไม่รวมคะแนนพิเศษ)
            const total_score = assignmentScores.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
            const max_score = assignmentScores.reduce((sum, a) => sum + (Number(a.maxpoint) || 0), 0);
            // คะแนนรวมทั้งหมด (รวมคะแนนพิเศษ)
            const total_score_with_bonus = total_score + Number(extraRows[0]?.extra_point || 0) + Number(kahootRows[0]?.kahoot_point || 0);
            const max_score_with_bonus = max_score + Number(extraRows[0]?.extra_point || 0) + Number(kahootRows[0]?.kahoot_point || 0);
            courseDetails.push({
                offering_id: course.offering_id,
                idcourse: course.idcourse,
                course_name: course.course_name,
                year: course.year,
                semester: course.semester,
                image: course.image,
                assignments: assignmentScores,
                extra_point: Number(extraRows[0]?.extra_point || 0),
                kahoot_point: Number(kahootRows[0]?.kahoot_point || 0),
                total_score, // ไม่รวมคะแนนพิเศษ
                max_score,   // ไม่รวมคะแนนพิเศษ
                total_score_with_bonus, // รวมคะแนนพิเศษ
                max_score_with_bonus    // รวมคะแนนพิเศษ
            });
        }
        return res.status(200).json({
            profile,
            courses: courseDetails
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default authenticateApiKey(handler);
