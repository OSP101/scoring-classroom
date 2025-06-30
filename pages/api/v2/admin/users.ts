import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/auth';
import { logActivity } from "../../../../lib/logger";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user?.stdid) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (req.method === 'GET') {
        try {
            const promisePool = mysqlPool.promise();
            const [rows] = await promisePool.query(
                `SELECT * FROM users`
            );
            return res.status(200).json(rows);
        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { stdid, fullname, email, imagePath, role } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!stdid || !fullname || !email || !role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
             if (!['1', '2'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role specified. Must be 1 (TA) or 2 (Student).' });
            }

            // ตรวจสอบรูปแบบ STDID (11 หลัก)
            if (stdid.length !== 11) {
                return res.status(400).json({ message: 'STDID must be 11 digits' });
            }

            // ตรวจสอบรูปแบบ email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            const promisePool = mysqlPool.promise();

            // ตรวจสอบว่า STDID ซ้ำหรือไม่
            const [existingUsers] = await promisePool.query(
                'SELECT stdid FROM users WHERE stdid = ?',
                [stdid]
            );

            if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                return res.status(400).json({ message: 'STDID already exists' });
            }

            // ตรวจสอบว่า email ซ้ำหรือไม่
            const [existingEmails] = await promisePool.query(
                'SELECT email FROM users WHERE email = ?',
                [email]
            );

            if (Array.isArray(existingEmails) && existingEmails.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // สร้างผู้ใช้ใหม่
            const [result] = await promisePool.query(
                'INSERT INTO users (stdid, name, email, image, type) VALUES (?, ?, ?, ?, ?)',
                [stdid, fullname, email, imagePath || null, role]
            );

            // Log the activity
            await logActivity(session.user.stdid, 'CREATE_USER', {
                createdUserId: stdid,
                createdUserName: fullname,
                role: role === '1' ? 'TA' : 'Student'
            });

            return res.status(201).json({
                message: 'User created successfully',
                userId: (result as any).insertId,
                user: {
                    stdid,
                    name: fullname,
                    email,
                    image: imagePath,
                    type: parseInt(role, 10)
                }
            });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
         try {
            const { stdid, name, email, imagePath } = req.body;

            if (!stdid || !name || !email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            const promisePool = mysqlPool.promise();

            const [result] = await promisePool.query(
                'UPDATE users SET name = ?, email = ?, image = ? WHERE stdid = ?',
                [name, email, imagePath, stdid]
            );

            const updateResult = result as any;

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            await logActivity(session.user.stdid, 'UPDATE_USER', {
                updatedUserId: stdid,
                updatedFields: { name, email, imagePath }
            });


            return res.status(200).json({ message: 'User updated successfully' });

        } catch (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default authenticateApiKey(handler);
