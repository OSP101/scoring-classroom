import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../utils/db';
import { authenticateApiKey } from '../../../../lib/auth';
import { logActivity } from '../../../../lib/logger';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (req.method === 'GET') {
        try {
            const promisePool = mysqlPool.promise();
            const [rows] = await promisePool.query(
                `SELECT id, type, content, filename, is_active, display_order, created_at 
                 FROM announcements 
                 WHERE is_active = TRUE 
                 ORDER BY display_order ASC, created_at DESC`
            );
            return res.status(200).json(rows);
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        // ตรวจสอบสิทธิ์ admin
        if (!session || !session.user?.stdid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const { type, content, filename, display_order } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!type || !content) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (!['text', 'image'].includes(type)) {
                return res.status(400).json({ message: 'Invalid type. Must be "text" or "image"' });
            }

            const promisePool = mysqlPool.promise();

            // เพิ่มแบนเนอร์ใหม่
            const [result] = await promisePool.query(
                'INSERT INTO announcements (type, content, filename, display_order, created_by) VALUES (?, ?, ?, ?, ?)',
                [type, content, filename || null, display_order || 0, session.user.stdid]
            );

            // Log the activity
            await logActivity(session.user.stdid, 'CREATE_ANNOUNCEMENT', {
                announcementId: (result as any).insertId,
                type: type,
                content: content.substring(0, 100) // Log first 100 chars only
            });

            return res.status(201).json({
                message: 'Announcement created successfully',
                id: (result as any).insertId
            });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        // ตรวจสอบสิทธิ์ admin
        if (!session || !session.user?.stdid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const { id, type, content, filename, is_active, display_order } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Announcement ID is required' });
            }

            const promisePool = mysqlPool.promise();

            // อัปเดตแบนเนอร์
            const [result] = await promisePool.query(
                'UPDATE announcements SET type = ?, content = ?, filename = ?, is_active = ?, display_order = ? WHERE id = ?',
                [type, content, filename, is_active, display_order, id]
            );

            const updateResult = result as any;

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Announcement not found' });
            }

            await logActivity(session.user.stdid, 'UPDATE_ANNOUNCEMENT', {
                announcementId: id,
                updatedFields: { type, content: content.substring(0, 100), is_active, display_order }
            });

            return res.status(200).json({ message: 'Announcement updated successfully' });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        // ตรวจสอบสิทธิ์ admin
        if (!session || !session.user?.stdid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: 'Announcement ID is required' });
            }

            const promisePool = mysqlPool.promise();

            // ลบแบนเนอร์ (soft delete โดยตั้ง is_active = FALSE)
            const [result] = await promisePool.query(
                'UPDATE announcements SET is_active = FALSE WHERE id = ?',
                [id]
            );

            const deleteResult = result as any;

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Announcement not found' });
            }

            await logActivity(session.user.stdid, 'DELETE_ANNOUNCEMENT', {
                announcementId: id
            });

            return res.status(200).json({ message: 'Announcement deleted successfully' });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default authenticateApiKey(handler); 