import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    

    if (req.method === "POST") {
        // const { idopen, stdid, type } = req.body;
        const { stdid, idcourse } = req.body;

        if (!stdid || !idcourse) {
            return res.status(400).json({ error: 'All fields are required and section must be an array' });
        }

        try {
            const promisePool = mysqlPool.promise()
            const [enlloResult] = await promisePool.query(
                'SELECT * FROM enllo WHERE stdid = ? AND idcourse = ?',
                [stdid , idcourse]
            );

            if(enlloResult.length > 0) {
            res.status(201).json({status: "Yes", data: enlloResult});
            } else{
                res.status(201).json({status: "No", data: enlloResult});
            }
            
        }catch (error) {
            res.status(500).json({ error: 'Failed to add course' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);