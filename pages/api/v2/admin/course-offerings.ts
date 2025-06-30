import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';
import { logActivity } from "../../../../lib/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // Create a new Course Offering
    if (req.method === 'POST') {
        try {
            const { subjectId, year, semester, image } = req.body;

            // Basic validation
            if (!subjectId || !year || !semester) {
                return res.status(400).json({ message: 'Missing required fields: subjectId, year, and semester are required.' });
            }

            const promisePool = mysqlPool.promise();

            // Check for duplicates
            const [existing] = await promisePool.query(
                'SELECT id FROM course_offerings WHERE subject_id = ? AND year = ? AND semester = ?',
                [subjectId, year, semester]
            );

            if (Array.isArray(existing) && existing.length > 0) {
                return res.status(409).json({ message: 'This course offering already exists for the specified year and semester.' });
            }

            // Insert new offering
            const [result] = await promisePool.query(
                'INSERT INTO course_offerings (subject_id, year, semester, image, status) VALUES (?, ?, ?, ?, ?)',
                [subjectId, year, semester, image || null, 'o'] // Default status to 'o' (Open)
            );
            
            // @ts-ignore
            const newOfferingId = result.insertId;

            await logActivity(
                'CREATE_OFFERING', 
                req.headers['x-user-id'] as string || 'system', 
                { subjectId, year, semester, offeringId: newOfferingId }
            );

            return res.status(201).json({ message: 'Course offering created successfully', id: newOfferingId });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 