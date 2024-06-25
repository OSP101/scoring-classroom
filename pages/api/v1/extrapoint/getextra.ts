import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { inputData, idc, idTeach, point } = req.body;
        console.log(inputData, idc, idTeach, point)
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'INSERT INTO extra_point(stdid, idcourse, teachid, point) VALUES (?,?,?,?)',
            [ inputData, idc, idTeach, point ]
        );

            res.status(200).json({ message: 'Pount added successfully' });

        // console.log(rows)

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);