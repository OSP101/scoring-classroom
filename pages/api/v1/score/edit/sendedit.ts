import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';
import runMiddleware from '../../../../../lib/cors';
import cors from "../../../../../lib/cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    if (req.method === "POST") {
        const { stdid, teachid, idtitelwork, point, des } = req.body.formData;
        const status = 1
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'INSERT INTO `edit_point`( `stdid`, `teachid`, `idtitelwork`, `point`, `des`, `status`) VALUES (?,?,?,?,?,?)',
            [ stdid, teachid, idtitelwork, point, des, status]
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