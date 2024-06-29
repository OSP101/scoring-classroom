import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';
import runMiddleware from '../../../../lib/cors';
import cors from "../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "PUT") {
        const { id, idcourse, name, date, maxpoint, typework } = req.body;
        // console.log(data.section);

        if (!idcourse || !name || !date || !maxpoint) {
            return res.status(400).json({ error: 'All fields are required and section must be an array' });
        }

        try {
            const promisePool = mysqlPool.promise()
            const [courseResult] = await promisePool.query(
                'UPDATE titelwork SET name= ?,date=?,typework=?,maxpoint=? WHERE id = ? AND idcourse = ?',
                [ name, date, typework, maxpoint, id, idcourse]
            );

            res.status(201).json(courseResult);
        } catch (error) {
            res.status(500).json({ error1: 'Failed to add work', error2: error });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);