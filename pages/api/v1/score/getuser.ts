import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { stdid, idcourse } = req.body;
        console.log(stdid, idcourse)
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'SELECT users.stdid,users.name,users.image FROM `users` JOIN enllo ON enllo.stdid = users.stdid WHERE enllo.idcourse = ? AND enllo.stdid LIKE "%"?"%" LIMIT 5 ',
            [ idcourse, stdid ]
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