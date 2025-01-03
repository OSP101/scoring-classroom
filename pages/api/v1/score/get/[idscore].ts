import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';
import { count } from "console";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { idscore } = req.query;
        var dataPoint = []
        try {
            const promisePool = mysqlPool.promise();
            let [rows] = await promisePool.query('SELECT id, name, maxpoint FROM titelwork WHERE idcourse = ? AND delete_at IS NULL', [idscore]);
            let [data1] = await promisePool.query('SELECT users.stdid,users.name,users.image, COALESCE(COUNT(extra_point.stdid), 0) AS point FROM users LEFT JOIN extra_point ON users.stdid = extra_point.stdid AND extra_point.idcourse = ? JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse = ? GROUP BY users.stdid', [idscore, idscore]);
            let [kahoot] = await promisePool.query('SELECT users.stdid,users.name,users.image, COALESCE(COUNT(kahoot_point.stdid), 0) AS point FROM users LEFT JOIN kahoot_point ON users.stdid = kahoot_point.stdid AND kahoot_point.idcourse = ? JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse = ? GROUP BY users.stdid', [idscore, idscore]);

            dataPoint.push({
                idtitelwork: 0,
                namework: "คะแนนพิเศษ",
                length: data1.length,
                data: data1
            })

            dataPoint.push({
                idtitelwork: 9999,
                namework: "คะแนน Kahoot!",
                length: kahoot.length,
                data: kahoot
            })
            for (const item of rows) {
                let [data2] = await promisePool.query(`SELECT e.stdid, 
       users.name, users.image,p.teachid,
                    tw.name AS titelname,
       COALESCE(p.point, '-') AS point,p.update_at,p.type
FROM enllo e
LEFT JOIN points p ON e.stdid = p.stdid AND p.idtitelwork = ?
LEFT JOIN titelwork tw ON p.idtitelwork = tw.id AND tw.delete_at IS NULL
JOIN users ON e.stdid = users.stdid
WHERE e.idcourse = ?
  AND (tw.id = ? OR tw.id IS NULL);`, [item.id, idscore, item.id]);

                let [avg] = await promisePool.query('SELECT ROUND(AVG(point),2) AS avgpoint FROM points WHERE idtitelwork = ?', item.id);

                //   console.log(data2[0])
                dataPoint.push({
                    idtitelwork: item.id,
                    namework: item.name,
                    length: data2.length,
                    maxpoint: item.maxpoint,
                    avgpoint: avg[0].avgpoint,
                    data: data2
                })
            }



            res.status(200).json(dataPoint);
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);