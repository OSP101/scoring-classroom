import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { person } = req.query;
        try {
            const promisePool = mysqlPool.promise()
            const [ResultTeacher] = await promisePool.query(
                'SELECT * FROM enllo JOIN users ON enllo.stdid = users.stdid WHERE enllo.idcourse = ?',
                [person]
            );

            res.status(201).json(ResultTeacher);
            
        }catch (error) {
            res.status(500).json({ error: 'Failed to add course' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);
