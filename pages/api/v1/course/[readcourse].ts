import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {


    try {
        if (req.method === "GET") {

            const { readcourse } = req.query;
            const promisePool = mysqlPool.promise()
            let rows;

            [rows] = await promisePool.query(
                `SELECT 
                    co.id,
                    c.stdid,
                    s.id as idcourse,
                    s.name,
                    co.image,
                    s.description,
                    co.year,
                    co.semester,
                    co.status
                FROM caretaker c
                JOIN course_offerings co ON c.idcourse COLLATE utf8mb4_unicode_ci = co.id
                JOIN subjects s ON co.subject_id = s.id
                WHERE c.stdid = ? AND co.status = 'o'
                ORDER BY co.year DESC, co.semester DESC`,
                readcourse
            );

            if (rows.length === 0) {
                res.status(200).json({ message: "Empty database" });
            } else {
                res.status(200).json(rows);
            }

            // console.log(rows)
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }

}

export default authenticateApiKey(handler);