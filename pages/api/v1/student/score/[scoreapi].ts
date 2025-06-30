import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/encrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { scoreapi } = req.query;
        // console.log(studentID)
        var dataPoint = []
        var lab = []
        try {
            const promisePool = mysqlPool.promise();
            let [subjects] = await promisePool.query(`
                SELECT DISTINCT co.id as offering_id, s.id as idcourse, s.name as course_name
                FROM enllo e
                JOIN course_offerings co ON e.idcourse COLLATE utf8mb4_unicode_ci = co.subject_id
                JOIN subjects s ON co.subject_id = s.id
                WHERE e.stdid = ? AND co.status = 'o'
            `, [scoreapi]);
            
            if (subjects.length > 0) {
                for (const subject of subjects) {
                    let lab = [];
                    let couter = 0;
                    // ดึงข้อมูล Lab - updated to use course_offering_id
                    let [lad] = await promisePool.query('SELECT id, name FROM titelwork WHERE idcourse COLLATE utf8mb4_unicode_ci = ? AND delete_at IS NULL', [subject.offering_id]);
                    let [status] = await promisePool.query('SELECT status FROM course_offerings WHERE id = ?', [subject.offering_id]);

                    // ดึงข้อมูล Extra และข้อมูลผู้ใช้ - updated to use new structure
                    let [data1] = await promisePool.query(`
                        SELECT users.*, s.name AS namesub, COALESCE(COUNT(extra_point.stdid), 0) AS point 
                        FROM users 
                        LEFT JOIN extra_point ON users.stdid = extra_point.stdid AND extra_point.idcourse COLLATE utf8mb4_unicode_ci = ? 
                        JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse COLLATE utf8mb4_unicode_ci = ? AND users.stdid = ? 
                        JOIN course_offerings co ON enllo.idcourse COLLATE utf8mb4_unicode_ci = co.subject_id
                        JOIN subjects s ON co.subject_id = s.id
                        WHERE co.id = ?
                    `, [subject.offering_id, subject.idcourse, scoreapi, subject.offering_id]);

                    // ดึงข้อมูล Extra และข้อมูลผู้ใช้ - updated to use new structure
                    let [data3] = await promisePool.query(`
                        SELECT COALESCE(COUNT(kahoot_point.stdid), 0) AS point 
                        FROM users 
                        LEFT JOIN kahoot_point ON users.stdid = kahoot_point.stdid AND kahoot_point.idcourse COLLATE utf8mb4_unicode_ci = ? 
                        JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse COLLATE utf8mb4_unicode_ci = ? AND users.stdid = ? 
                        JOIN course_offerings co ON enllo.idcourse COLLATE utf8mb4_unicode_ci = co.subject_id
                        JOIN subjects s ON co.subject_id = s.id
                        WHERE co.id = ?
                    `, [subject.offering_id, subject.idcourse, scoreapi, subject.offering_id]);

                    for (const item of lad) {
                        let [data2] = await promisePool.query(`
                            SELECT tw.name AS titelname, COALESCE(p.point, '-') AS point , p.teachid,p.update_at,p.type
                            FROM enllo e 
                            LEFT JOIN points p ON e.stdid = p.stdid AND p.idtitelwork = ? 
                            LEFT JOIN titelwork tw ON p.idtitelwork = tw.id AND tw.delete_at IS NULL 
                            JOIN users ON e.stdid = users.stdid 
                            JOIN course_offerings co ON e.idcourse COLLATE utf8mb4_unicode_ci = co.subject_id
                            WHERE co.id = ? AND (tw.id = ? OR tw.id IS NULL) AND users.stdid = ?
                        `, [item.id, subject.offering_id, item.id, scoreapi]);
                        lab.push(data2[0]);
                        if (data2[0].point !== "0") {
                            couter += 1;
                        }
                    }
                    if (status[0].status === "o") {
                        dataPoint.push({
                            stdid: scoreapi,
                            idcourse: subject.idcourse,
                            namesub: data1[0].namesub,
                            name: data1[0].name,
                            image: data1[0].image,
                            track: data1[0].track,
                            email: data1[0].email,
                            section: data1[0].section,
                            extra: data1[0].point,
                            kahoot: data3[0].point,
                            coute: couter * 100 / lab.length,
                            lab
                        });
                    }


                }

                if (dataPoint.length > 0) {
                    res.status(200).json(dataPoint[0]);
                } else {
                    res.status(201).json({ message: "Not Found" });
                }

            } else {
                res.status(201).json({ message: "Not Found" });
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);
