import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../utils/db';
import { authenticateApiKey } from '../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Course offering ID is required.' });
    }

    if (req.method === 'PUT') {
        const { year, semester, image, status } = req.body;

        try {
            const promisePool = mysqlPool.promise();
            
            await promisePool.query(
                'UPDATE course_offerings SET year = ?, semester = ?, image = ?, status = ? WHERE id = ?',
                [year, semester, image, status, id]
            );

            res.status(200).json({ message: 'Course offering updated successfully' });
        } catch (error) {
            console.error('Error updating course offering:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 