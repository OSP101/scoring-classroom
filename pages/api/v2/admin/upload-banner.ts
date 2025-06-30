import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateApiKey } from '../../../../lib/auth';
import { logActivity } from '../../../../lib/logger';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user?.stdid) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // สร้างโฟลเดอร์ banners ถ้ายังไม่มี
        const uploadDir = path.join(process.cwd(), 'public/uploads/banners');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB for banners
            filter: ({ mimetype }) => {
                return Boolean(mimetype && mimetype.includes('image'));
            },
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ message: 'Error uploading file' });
            }

            const file = files.banner?.[0];

            if (!file) {
                return res.status(400).json({ message: 'No banner image provided' });
            }

            // Generate unique filename
            const timestamp = Date.now();
            const extension = path.extname(file.originalFilename || 'banner.jpg');
            const filename = `banner_${timestamp}${extension}`;
            const newPath = path.join(uploadDir, filename);

            // Rename the uploaded file
            fs.renameSync(file.filepath, newPath);

            // Return the relative path for database storage
            const imagePath = `/uploads/banners/${filename}`;

            // Log the activity
            await logActivity(session.user.stdid, 'UPLOAD_BANNER', {
                filename: filename,
                originalName: file.originalFilename
            });

            res.status(200).json({ 
                message: 'Banner uploaded successfully',
                imagePath: imagePath,
                filename: filename
            });
        });
    } catch (error) {
        console.error('Error in banner upload handler:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default authenticateApiKey(handler); 