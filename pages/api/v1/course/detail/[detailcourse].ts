import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {
        const { detailcourse } = req.query;

        try {
        const promisePool = mysqlPool.promise()
        const [rows, fields] = await promisePool.query(`
            SELECT 
                s.id as idcourse,
                s.name,
                s.description,
                co.image,
                co.year,
                co.semester,
                co.status
            FROM subjects s
            LEFT JOIN course_offerings co ON s.id COLLATE utf8mb4_unicode_ci = co.subject_id
            WHERE s.id = ?
            ORDER BY co.year DESC, co.semester DESC
            LIMIT 1
        `, detailcourse)

        console.log(rows)
        res.status(200).json(rows)

        } catch (err) {
            res.status(500).json({ error: err });
        }
    }else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);