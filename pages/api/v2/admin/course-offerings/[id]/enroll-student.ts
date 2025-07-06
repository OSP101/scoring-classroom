import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../../utils/db';
import { authenticateApiKey } from '../../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Course offering ID is required.' });
    }

    if (req.method === 'GET') {
        // Search students
        const { search } = req.query;
        
        if (!search || typeof search !== 'string') {
            return res.status(400).json({ message: 'Search term is required.' });
        }

        try {
            const promisePool = mysqlPool.promise();
            
            // Get course offering details first
            const [offeringRows]: [any[], any] = await promisePool.query(
                `SELECT 
                    co.id,
                    s.subject_code
                 FROM course_offerings co
                 JOIN subjects s ON co.subject_id = s.id
                 WHERE co.id = ?`,
                [id]
            );

            if (offeringRows.length === 0) {
                return res.status(404).json({ message: 'Course offering not found.' });
            }

            const offering = offeringRows[0];

            // Search for students (type = 2 for students)
            const [students]: [any[], any] = await promisePool.query(
                `SELECT 
                    stdid,
                    name,
                    email,
                    image
                 FROM users 
                 WHERE type = 2 
                 AND (name LIKE ? OR stdid LIKE ? OR email LIKE ?)
                 AND stdid NOT IN (
                     SELECT e.stdid 
                     FROM enllo e 
                     WHERE e.idcourse = ?
                 )
                 ORDER BY name ASC
                 LIMIT 10`,
                [`%${search}%`, `%${search}%`, `%${search}%`, offering.id]
            );

            res.status(200).json(students);

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        // Enroll student
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required.' });
        }

        try {
            const promisePool = mysqlPool.promise();
            
            // Get course offering details
            const [offeringRows]: [any[], any] = await promisePool.query(
                `SELECT 
                    co.id,
                    s.subject_code
                 FROM course_offerings co
                 JOIN subjects s ON co.subject_id = s.id
                 WHERE co.id = ?`,
                [id]
            );

            if (offeringRows.length === 0) {
                return res.status(404).json({ message: 'Course offering not found.' });
            }

            const offering = offeringRows[0];

            // Check if student exists
            const [studentRows]: [any[], any] = await promisePool.query(
                'SELECT stdid, name FROM users WHERE stdid = ? AND type = 2',
                [studentId]
            );

            if (studentRows.length === 0) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            // Check if already enrolled
            const [enrollmentRows]: [any[], any] = await promisePool.query(
                'SELECT id FROM enllo WHERE stdid = ? AND idcourse = ?',
                [studentId, offering.id]
            );

            if (enrollmentRows.length > 0) {
                return res.status(409).json({ message: 'Student is already enrolled in this course.' });
            }

            // Enroll student
            await promisePool.query(
                'INSERT INTO enllo (idcourse, stdid, type) VALUES (?, ?, ?)',
                [offering.id, studentId, 2]
            );

            // Create initial points (0) for all existing assignments in this course
            const [assignments]: [any[], any] = await promisePool.query(
                'SELECT id, maxpoint FROM titelwork WHERE idcourse = ? AND delete_at IS NULL',
                [offering.id]
            );

            if (assignments.length > 0) {
                // Get a default teacher (first teacher in the course)
                const [teachers]: [any[], any] = await promisePool.query(
                    `SELECT u.name 
                     FROM users u 
                     JOIN enllo e ON u.stdid = e.stdid 
                     WHERE e.idcourse = ? AND u.type = 1 
                     LIMIT 1`,
                    [offering.id]
                );

                const defaultTeacher = teachers.length > 0 ? teachers[0].name : 'System';

                // Create initial points for each assignment
                for (const assignment of assignments) {
                    // Check if point already exists for this student and assignment
                    const [existingPoint]: [any[], any] = await promisePool.query(
                        'SELECT id FROM points WHERE stdid = ? AND idtitelwork = ?',
                        [studentId, assignment.id]
                    );

                    if (existingPoint.length === 0) {
                        // Create initial point record with 0 points
                        await promisePool.query(
                            'INSERT INTO points (stdid, teachid, idtitelwork, point, type) VALUES (?, ?, ?, ?, ?)',
                            [studentId, defaultTeacher, assignment.id, 0, '']
                        );
                    }
                }
            }

            res.status(201).json({ 
                message: 'Student enrolled successfully',
                student: studentRows[0]
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 