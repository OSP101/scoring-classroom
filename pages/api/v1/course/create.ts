import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { idcourse, name, image, description, section, stdid } = req.body;
        // console.log(data.section);

        if (!idcourse || !name || !image || !description || !section || !Array.isArray(section)) {
            return res.status(400).json({ error: 'All fields are required and section must be an array' });
        }

        try {
            const promisePool = mysqlPool.promise()
            const [courseResult] = await promisePool.query(
                'INSERT INTO course (idcourse, name, image, description) VALUES (?, ?, ?, ?)',
                [idcourse, name, image, description]
            );

            for (const sec of section) {
                await promisePool.query(
                    'INSERT INTO opencourse (name, idcourse) VALUES (?, ?)',
                    [sec, idcourse]
                );
            }

            await promisePool.query( 'INSERT INTO caretaker (stdid, idcourse) VALUES (?, ?)',
            [stdid, idcourse]);

            res.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add course' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);