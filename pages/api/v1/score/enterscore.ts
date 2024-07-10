import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { stdid, teachid, idtitelwork, point } = req.body.formData;

        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'UPDATE points SET teachid = ?,point = ? WHERE idtitelwork = ? AND stdid = ?',
            [ teachid, point, idtitelwork, stdid ]
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