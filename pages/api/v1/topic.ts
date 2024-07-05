import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../utils/db";
import { authenticateApiKey } from '../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {

        try {
            const promisePool = mysqlPool.promise()
            const [ResultTopic] = await promisePool.query(
                'SELECT * FROM topic_create'
            );

            res.status(201).json(ResultTopic);
            
        }catch (error) {
            res.status(500).json({ error: 'Failed to add course' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);