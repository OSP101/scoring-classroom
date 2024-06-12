import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
    const { enlloall } = req.query;
    const data = [];

    console.log(enlloall)

    try {
        const promisePool = mysqlPool.promise()
        const [ResultCourse] = await promisePool.query(
            'SELECT id,name FROM opencourse WHERE idcourse = ?',
            [enlloall]
        );

        for (const EnlloCourse of ResultCourse){
            const [ResultEnllo] = await promisePool.query(
                'SELECT * FROM enllo JOIN users ON users.stdid = enllo.stdid WHERE enllo.idopen = ?',
                [EnlloCourse.id]
            );
            console.log({name:EnlloCourse.name ,data:ResultEnllo})
            data.push({name:EnlloCourse.name ,data:ResultEnllo});
        }

        res.status(201).json(data);
        
    }catch (error) {
        res.status(500).json({ error: 'Failed to add course' });
    }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);


// ดึงข้อมูลนศ ในวิชานั้นๆทั้งหมด คนสอนด้วย