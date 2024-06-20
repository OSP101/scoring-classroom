import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "DELETE") {
        const { id } = req.body;
        const dateNow = "deleted"
        // console.log(data.section);

        console.log(dateNow,id)

        try {
            const promisePool = mysqlPool.promise()
            const [courseResult] = await promisePool.query(
                'UPDATE titelwork SET delete_at = ? WHERE id = ?',
                [ dateNow, id ]
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