import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateApiKey } from '../../../../lib/auth';
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

    try {
        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true,
            maxFileSize: 2 * 1024 * 1024, // 2MB
            filter: ({ mimetype }) => {
                return Boolean(mimetype && mimetype.includes('image'));
            },
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ message: 'Error uploading file' });
            }

            const file = files.image?.[0];
            const courseId = fields.courseId?.[0];

            if (!file) {
                return res.status(400).json({ message: 'No image file provided' });
            }

            if (!courseId) {
                return res.status(400).json({ message: 'Course ID is required' });
            }

            // Generate unique filename
            const timestamp = Date.now();
            const extension = path.extname(file.originalFilename || 'image.jpg');
            const filename = `course_${courseId}_${timestamp}${extension}`;
            const newPath = path.join(uploadDir, filename);

            // Rename the uploaded file
            fs.renameSync(file.filepath, newPath);

            // Return the relative path for database storage
            const imagePath = `/uploads/${filename}`;

            res.status(200).json({ 
                message: 'Image uploaded successfully',
                imagePath: imagePath
            });
        });
    } catch (error) {
        console.error('Error in upload handler:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default authenticateApiKey(handler); 