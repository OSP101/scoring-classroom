import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../utils/db";
import { authenticateApiKey } from '../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { readcourse } = req.query;

        try {
        const promisePool = mysqlPool.promise()
        const [rows, fields] = await promisePool.query('SELECT * FROM caretaker JOIN course ON course.idcourse = caretaker.idcourse WHERE stdid = ?', readcourse)

        if (rows.length > 0) {
            res.status(200).json(rows)
        }else{
            res.status(200).json({message: "Empty database"})
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