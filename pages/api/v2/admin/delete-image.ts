import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // ตรวจสอบ API key
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ message: 'Image path is required' });
    }

    // สร้าง path เต็มไปยังไฟล์
    const fullPath = path.join(process.cwd(), 'public', imagePath);

    // ตรวจสอบว่าไฟล์มีอยู่จริง
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // ลบไฟล์
    fs.unlinkSync(fullPath);

    res.status(200).json({
      message: 'Image deleted successfully',
      deletedPath: imagePath
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 