import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { email, idcourse } = req.body;
        // console.log(email, idcourse)
        try {
        const promisePool = mysqlPool.promise()
        let rows; 

        [rows] = await promisePool.query(
            'SELECT caretaker.id FROM users JOIN caretaker ON caretaker.stdid = users.stdid WHERE users.email = ? AND caretaker.idcourse = ?',
            [ email , idcourse ]
        );

        if (rows.length > 0){
            res.status(200).json({menubar: true})
        }else{
            res.status(200).json({menubar: false});
        }

        // console.log(rows)

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);