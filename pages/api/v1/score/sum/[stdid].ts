import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const {  idcourses } = req.body;
        console.log(req.body)
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'SELECT users.stdid,users.name,users.image, COALESCE(COUNT(points.point), 0) AS count FROM users LEFT JOIN points ON users.stdid = points.stdid AND points.stdid = ? JOIN enllo ON enllo.stdid = users.stdid GROUP BY users.stdid',
            [ idcourses ]
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