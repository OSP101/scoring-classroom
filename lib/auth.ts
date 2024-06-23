const CryptoJS = require('crypto-js');
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';


export const authenticateApiKey = (handler: NextApiHandler) => {

  return (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers['x-api-key'];

    if (token !== process.env.NEXT_PUBLIC_API_KEY) {
      res.status(401).json({ message: 'Invalid API Key' });
      return;
    }

    return handler(req, res);
  };
};

// function decrypt(ciphertext: any) {
//   const key = process.env.NEXT_PUBLIC_API_HASH;
//   const bytes = CryptoJS.AES.decrypt(ciphertext, key);
//   const originalText = bytes.toString(CryptoJS.enc.Utf8);
//   return originalText;
// }