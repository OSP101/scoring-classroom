import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { idcourse, name, date, maxpoint, typework } = req.body;
        // console.log(data.section);

        if (!idcourse || !name || !date || !maxpoint) {
            return res.status(400).json({ error: 'All fields are required and section must be an array' });
        }

        try {
            const promisePool = mysqlPool.promise()
            const [courseResult] = await promisePool.query(
                'INSERT INTO titelwork (idcourse, name, date, maxpoint, typework) VALUES (?, ?, ?, ?, ?)',
                [idcourse, name, date, maxpoint, typework]
            );

            res.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            res.status(500).json({ error1: 'Failed to add work', error2: error });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);