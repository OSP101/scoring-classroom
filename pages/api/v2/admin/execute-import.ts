import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../utils/db';
import { authenticateApiKey } from '../../../../lib/auth';
import { logActivity } from '../../../../lib/logger';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user?.stdid) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { usersToImport } = req.body;

        if (!usersToImport || !Array.isArray(usersToImport) || usersToImport.length === 0) {
            return res.status(400).json({ message: 'No valid users provided for import.' });
        }

        const promisePool = mysqlPool.promise();
        let successCount = 0;
        const errors = [];

        // Note: We are trusting that the usersToImport array is pre-validated by the preview step.
        for (const user of usersToImport) {
            const { stdid, name, email } = user;
            try {
                await promisePool.query(
                    'INSERT INTO users (stdid, name, email, image, type) VALUES (?, ?, ?, ?, ?)',
                    [stdid, name, email, '/profile-img.png', 2] // Default role: Student, Default image
                );
                successCount++;
            } catch (dbError: any) {
                // This might catch race conditions if two people import the same user at the same time.
                errors.push({ stdid, reason: dbError.message || 'Database insertion failed.' });
            }
        }

        if (successCount > 0) {
            await logActivity(session.user.stdid, 'IMPORT_USERS', {
                importedCount: successCount,
                failedCount: errors.length,
            });
        }

        if (errors.length > 0) {
            return res.status(207).json({ // 207 Multi-Status
                message: `Partial success. ${successCount} users were imported. ${errors.length} failed during the final import.`,
                successCount,
                errors
            });
        }

        res.status(201).json({
            message: `Import successful. ${successCount} new users have been added.`,
            successCount,
        });

    } catch (error) {
        console.error('Execute import error:', error);
        res.status(500).json({ message: 'An internal server error occurred during the import execution.' });
    }
};

export default authenticateApiKey(handler); 