import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';
import runMiddleware from '../../../../../lib/cors';
import cors from "../../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "GET") {
        const { teachall } = req.query;
        try {
            const promisePool = mysqlPool.promise()
            const [ResultTeacher] = await promisePool.query(
                'SELECT * FROM caretaker JOIN users ON caretaker.stdid = users.stdid WHERE caretaker.idcourse = ?',
                [teachall]
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
