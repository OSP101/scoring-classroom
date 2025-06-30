import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const promisePool = mysqlPool.promise();
            const [rows] = await promisePool.query(
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
                 ORDER BY co.year DESC, co.semester DESC, s.subject_code ASC`
            );
            return res.status(200).json(rows);
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default authenticateApiKey(handler); 