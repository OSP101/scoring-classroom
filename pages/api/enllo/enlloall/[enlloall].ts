import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
    const enlloall = req.query;

    console.log(enlloall)

    res.status(200).json(enlloall)
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);


// ดึงข้อมูลนศ ในวิชานั้นๆทั้งหมด คนสอนด้วย