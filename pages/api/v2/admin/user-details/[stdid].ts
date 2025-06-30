import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../utils/db';
import { authenticateApiKey } from '../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { stdid } = req.query;

    if (!stdid || typeof stdid !== 'string') {
        return res.status(400).json({ message: 'Student ID is required.' });
    }

    try {
        const promisePool = mysqlPool.promise();

        // 1. Fetch User Profile
        const [userRows]: [any[], any] = await promisePool.query(
            'SELECT stdid, name, email, image, type, track FROM users WHERE stdid = ?',
            [stdid]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const userProfile = userRows[0];

        // 2. Fetch Enrolled/Caretaken Courses based on user type
        let courseRows: any[] = [];
        // User type 2 is Student, they are in the 'enllo' table
        if (userProfile.type === 2) {
            [courseRows] = await promisePool.query(
                `SELECT 
                    co.id as course_offering_id,
                    s.id as course_code,
                    s.name AS course_name,
                    co.year,
                    co.semester,
                    co.status,
                    co.image
                 FROM enllo e
                 JOIN course_offerings co ON e.idcourse COLLATE utf8mb4_unicode_ci = co.id
                 JOIN subjects s ON co.subject_id = s.id
                 WHERE e.stdid = ?
                 ORDER BY co.year DESC, co.semester DESC`,
                [stdid]
            );
        }
        // Other types (TA/Teacher) are in the 'caretaker' table
        else {
            [courseRows] = await promisePool.query(
                `SELECT 
                    co.id as course_offering_id,
                    s.id as course_code,
                    s.name AS course_name,
                    co.year,
                    co.semester,
                    co.status,
                    co.image
                 FROM caretaker ct
                 JOIN course_offerings co ON ct.idcourse COLLATE utf8mb4_unicode_ci = co.subject_id
                 JOIN subjects s ON co.subject_id = s.id
                 WHERE ct.stdid = ?
                 ORDER BY co.year DESC, co.semester DESC`,
                [stdid]
            );
        }

        // 3. Fetch Activity Logs
        const [logRows]: [any[], any] = await promisePool.query(
            'SELECT action, details, timestamp FROM activity_logs WHERE user_stdid = ? ORDER BY timestamp DESC LIMIT 50',
            [stdid]
        );

        // 4. If user is a student, fetch score analysis
        let courseScores: any[] = [];
        if (userProfile.type === 2) {
            const [scoreData]: [any[], any] = await promisePool.query(
                `
                SELECT
                    s.id as course_code,
                    s.name AS course_name,
                    co.year,
                    co.semester,
                    COALESCE(SUM(tw.maxpoint), 0) AS total,
                    COALESCE(SUM(p.point), 0) AS earned,
                    CASE
                        WHEN COALESCE(SUM(tw.maxpoint), 0) > 0 THEN ROUND((COALESCE(SUM(p.point), 0) / SUM(tw.maxpoint)) * 100)
                        ELSE 0
                    END AS percentage
                FROM enllo e
                JOIN course_offerings co ON e.idcourse COLLATE utf8mb4_unicode_ci = co.id
                JOIN subjects s ON co.subject_id = s.id
                LEFT JOIN titelwork tw ON co.id = tw.idcourse
                LEFT JOIN points p ON tw.id = p.idtitelwork AND e.stdid = p.stdid
                WHERE e.stdid = ?
                GROUP BY s.id, s.name, co.year, co.semester
                ORDER BY co.year DESC, co.semester DESC
                `,
                [stdid]
            );
            courseScores = scoreData;
        }

        res.status(200).json({
            profile: userProfile,
            enrolledCourses: courseRows,
            activityLogs: logRows,
            courseScores: courseScores,
        });

    } catch (error) {
        console.error(`Error fetching details for user ${stdid}:`, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authenticateApiKey(handler); 