import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';
import runMiddleware from '../../../../lib/cors';
import cors from "../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "POST") {
        const { stdid, teachid, idtitelwork, point } = req.body;

        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'INSERT INTO `points`( `stdid`, `teachid`, `idtitelwork`, `point`) VALUES (?,?,?,?)',
            [ stdid, teachid, idtitelwork, point ]
        );

        res.status(201).json({ message: 'Course added successfully' });

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);