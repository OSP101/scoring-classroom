import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../utils/db";
import { authenticateApiKey } from '../../../lib/auth';



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const email  = req.body;

        // console.log(email);
    
        if (!email) {
          return res.status(400).json({ message: 'Missing data in request body' });
        }

        const promisePool = mysqlPool.promise()
        const [rows, fields] = await promisePool.query(
          `SELECT * FROM users WHERE ? AND type = '1';` , email
        )
      res.status(200).json(rows);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };
  
  export default authenticateApiKey(handler);