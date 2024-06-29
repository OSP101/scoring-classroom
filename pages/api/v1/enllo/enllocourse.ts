import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';
import runMiddleware from '../../../../lib/cors';
import cors from "../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "POST") {
        // const { idopen, stdid, type } = req.body;
        const data = req.body;

        if (!data) {
            return res.status(400).json({ error: 'All fields are required and section must be an array' });
        }

        try {
            const promisePool = mysqlPool.promise()
            // const [enlloResult] = await promisePool.query(
            //     'INSERT INTO enllo (idopen, stdid, type) VALUES (?, ?, ?)',
            //     [idopen, stdid, type]
            // );

            // res.status(201).json({ message: 'Enllo added successfully' });

            for (const item of data) {
                const { idopen, stdid, type } = item;
                if (!idopen || !stdid || type === undefined) {
                  throw new Error('Missing required fields');
                }
                await promisePool.query('INSERT INTO enllo (idopen, stdid, type) VALUES (?, ?, ?)',
                [idopen, stdid, type]);
                console.log(idopen, stdid, type);

            res.status(200).json({message: 'Enllo added successfully'});
            }
        }catch (error) {
            res.status(500).json({ error: 'Failed to add course' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);
