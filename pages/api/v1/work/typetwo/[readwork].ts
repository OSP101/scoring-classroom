import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';
import runMiddleware from '../../../../../lib/cors';
import cors from "../../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "GET") {
        const { readwork } = req.query;
        const type = 2;

        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'SELECT * FROM titelwork WHERE idcourse = ? AND typework = ? AND delete_at IS NULL',
            [readwork, type]
        );

            res.status(200).json(rows);

        // console.log(rows)

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);