import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';
import runMiddleware from '../../../../../lib/cors';
import cors from "../../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "PUT") {
        const { idedit, idpoints, point } = req.body;
        const status = 2
        try {
        const promisePool = mysqlPool.promise()
        let [rows] = await promisePool.query(
            'UPDATE edit_point SET status = ? WHERE id = ?',
            [ status, idedit ]
        );

        let [rows2] = await promisePool.query(
            'UPDATE points SET point = ? WHERE id = ?',
            [ point, idpoints ]
        );

        res.status(201).json({ message: 'Edited successfully' });

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);