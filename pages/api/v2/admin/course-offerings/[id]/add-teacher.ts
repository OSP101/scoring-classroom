import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../../utils/db';
import { authenticateApiKey } from '../../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Course offering ID is required.' });
    }

    if (req.method === 'GET') {
        // Search teachers/TA
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

            // Search for teachers/TA (type = 1 for teachers, type = 3 for TA)
            const [teachers]: [any[], any] = await promisePool.query(
                `SELECT 
                    stdid,
                    name,
                    email,
                    image,
                    type
                 FROM users 
                 WHERE type IN (1, 0)
                 AND (name LIKE ? OR stdid LIKE ? OR email LIKE ?)
                 AND stdid NOT IN (
                     SELECT ct.stdid 
                     FROM caretaker ct 
                     WHERE ct.idcourse COLLATE utf8mb4_unicode_ci = ?
                 )
                 ORDER BY name ASC
                 LIMIT 10`,
                [`%${search}%`, `%${search}%`, `%${search}%`, offering.subject_code]
            );

            res.status(200).json(teachers);

        } catch (error) {
            console.error('Error searching teachers:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        // Add teacher
        const { teacherId } = req.body;

        if (!teacherId) {
            return res.status(400).json({ message: 'Teacher ID is required.' });
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

            // Check if teacher exists
            const [teacherRows]: [any[], any] = await promisePool.query(
                'SELECT stdid, name, type FROM users WHERE stdid = ? AND type IN (1, 0)',
                [teacherId]
            );

            if (teacherRows.length === 0) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }

            // Check if already assigned
            const [assignmentRows]: [any[], any] = await promisePool.query(
                'SELECT id FROM caretaker WHERE stdid = ? AND idcourse = ?',
                [teacherId, offering.subject_code]
            );

            if (assignmentRows.length > 0) {
                return res.status(409).json({ message: 'Teacher is already assigned to this course.' });
            }

            // Add teacher to course
            await promisePool.query(
                'INSERT INTO caretaker (stdid, idcourse) VALUES (?, ?)',
                [teacherId, offering.id]
            );

            res.status(201).json({ 
                message: 'Teacher added successfully',
                teacher: teacherRows[0]
            });

        } catch (error) {
            console.error('Error adding teacher:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 