import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const {  idcourses } = req.body;
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'SELECT users.stdid,users.name,users.image, COALESCE(COUNT(extra_point.stdid), 0) AS count FROM users LEFT JOIN extra_point ON users.stdid = extra_point.stdid AND extra_point.idcourse = ? JOIN enllo ON enllo.stdid = users.stdid GROUP BY users.stdid',
            [ idcourses ]
        );

            res.status(200).json(rows);

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);