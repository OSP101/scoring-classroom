import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../../utils/db';
import { authenticateApiKey } from '../../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Course offering ID is required.' });
    }

    if (req.method === 'GET') {
        try {
            const promisePool = mysqlPool.promise();

            // Get course offering details
            const [offeringRows]: [any[], any] = await promisePool.query(
                `SELECT 
                    co.id,
                    co.year,
                    co.semester,
                    co.status,
                    co.image,
                    s.subject_code,
                    s.name,
                    s.description
                 FROM course_offerings co
                 JOIN subjects s ON co.subject_id = s.id
                 WHERE co.id = ?`,
                [id]
            );

            if (offeringRows.length === 0) {
                return res.status(404).json({ message: 'Course offering not found.' });
            }

            const offering = offeringRows[0];

            // Get enrolled students (from enllo table)
            const [enrolledStudents]: [any[], any] = await promisePool.query(
                `SELECT 
                    e.stdid,
                    u.name,
                    u.email,
                    u.image,
                    u.type
                 FROM enllo e
                 JOIN users u ON e.stdid = u.stdid
                 WHERE e.idcourse COLLATE utf8mb4_unicode_ci = ?
                 ORDER BY u.name ASC`,
                [offering.id]
            );

            // Get teachers/TA (from caretaker table)
            const [teachers]: [any[], any] = await promisePool.query(
                `SELECT 
                    ct.stdid,
                    u.name,
                    u.email,
                    u.image,
                    u.type
                 FROM caretaker ct
                 JOIN users u ON ct.stdid = u.stdid
                 WHERE ct.idcourse COLLATE utf8mb4_unicode_ci = ?
                 ORDER BY u.name ASC`,
                [offering.id]
            );

            // Count statistics
            const studentCount = enrolledStudents.length;
            const teacherCount = teachers.length;

            res.status(200).json({
                offering,
                enrolledStudents,
                teachers,
                statistics: {
                    studentCount,
                    teacherCount
                }
            });

        } catch (error) {
            console.error('Error fetching course offering details:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 