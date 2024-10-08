import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { idcourse } = req.body;
    try {
        const promisePool = mysqlPool.promise()
        var dataPoint = []
        let [rows] = await promisePool.query('SELECT id, name, maxpoint FROM titelwork WHERE idcourse = ? AND delete_at IS NULL', [idcourse]);
            let [data1] = await promisePool.query('SELECT users.stdid,users.name,users.image, COALESCE(COUNT(extra_point.stdid), 0) AS point FROM users LEFT JOIN extra_point ON users.stdid = extra_point.stdid AND extra_point.idcourse = ? JOIN enllo ON enllo.stdid = users.stdid AND enllo.idcourse = ? GROUP BY users.stdid', [idcourse,idcourse]);
            
            dataPoint.push({
                idtitelwork: 0,
                namework: "คะแนนพิเศษ",
                length: data1.length,
                data: data1
            })
            for (const item of rows) {
                let [data2] = await promisePool.query(`SELECT e.stdid, 
       users.name, users.image,p.teachid,
                    tw.name AS titelname,
       COALESCE(p.point, '-') AS point,p.update_at
FROM enllo e
LEFT JOIN points p ON e.stdid = p.stdid AND p.idtitelwork = ?
LEFT JOIN titelwork tw ON p.idtitelwork = tw.id AND tw.delete_at IS NULL
JOIN users ON e.stdid = users.stdid
WHERE e.idcourse = ?
  AND (tw.id = ? OR tw.id IS NULL);`, [item.id, idcourse, item.id]);

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
      // สมมติว่าเรามีฟังก์ชันที่ดึงข้อมูลคะแนนจากฐานข้อมูล
    //   const scores = await fetchScoresFromDatabase();

      // สร้าง workbook และ worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataPoint);

      // เพิ่ม worksheet เข้าไปใน workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Scores');

      // สร้าง buffer จาก workbook
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      // ตั้งค่า headers สำหรับการดาวน์โหลด
      res.setHeader('Content-Disposition', 'attachment; filename=scores.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // ส่ง buffer กลับไปยัง client
      res.send(buf);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export scores' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


export default authenticateApiKey(handler);