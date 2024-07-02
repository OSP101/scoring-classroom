
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';


export const authenticateApiKey = (handler: NextApiHandler) => {

  return (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers['x-requested-enter'];

    if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
      res.status(401).json({ message: 'Invalid API Key' });
      return;
    }

    return handler(req, res);
  };
};