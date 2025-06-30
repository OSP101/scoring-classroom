import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../utils/db";
import { authenticateApiKey } from '../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing email in request body' });
    }

    try {
      const promisePool = mysqlPool.promise();
      const [rows] = await promisePool.query(
        `SELECT * FROM users WHERE email = ? AND type IN ('0', '1')`,
        [email]
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateApiKey(handler);
