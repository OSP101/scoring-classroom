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
            let [subjects] = await promisePool.query('SELECT idcourse FROM enllo WHERE stdid =  ?', [scoreapi]);
            if (subjects.length > 0) {
                for (const subject of subjects) {
                    let lab = [];
                    let couter = 0;
                    // ดึงข้อมูล Lab
                    let [lad] = await promisePool.query('SELECT id, name FROM titelwork WHERE idcourse = ? AND delete_at IS NULL', [subject.idcourse]);
                    let [status] = await promisePool.query('SELECT status FROM course WHERE idcourse = ?', [subject.idcourse]);

                    // ดึงข้อมูล Extra และข้อมูลผู้ใช้
                    let [data1] = await promisePool.query(`
                        SELECT users.*, course.name AS namesub, COALESCE(COUNT(extra_point.stdid), 0) AS point 
                        FROM users 
                        LEFT JOIN extra_point ON users.stdid = extra_point.stdid AND extra_point.idcourse = ? 
                        JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse = ? AND users.stdid = ? 
                        JOIN course ON course.idcourse = enllo.idcourse
                    `, [subject.idcourse, subject.idcourse, scoreapi]);

                    for (const item of lad) {
                        let [data2] = await promisePool.query(`
                            SELECT tw.name AS titelname, COALESCE(p.point, '-') AS point , p.teachid,p.update_at
                            FROM enllo e 
                            LEFT JOIN points p ON e.stdid = p.stdid AND p.idtitelwork = ? 
                            LEFT JOIN titelwork tw ON p.idtitelwork = tw.id AND tw.delete_at IS NULL 
                            JOIN users ON e.stdid = users.stdid 
                            WHERE e.idcourse = ? AND (tw.id = ? OR tw.id IS NULL) AND users.stdid = ?
                        `, [item.id, subject.idcourse, item.id, scoreapi]);
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
