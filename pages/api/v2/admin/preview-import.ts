import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import * as XLSX from 'xlsx';
import { mysqlPool } from '../../../../utils/db';
import { authenticateApiKey } from '../../../../lib/auth';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        const uploadedFile = files.file?.[0];

        if (!uploadedFile) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const workbook = XLSX.readFile(uploadedFile.filepath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // Remove header row, assuming the first row is the header
        if (data.length > 0) data.shift();

        const validUsers: any[] = [];
        const invalidRows: { row: number, data: any, reason: string }[] = [];
        
        const promisePool = mysqlPool.promise();

        for (const [index, row] of Array.from(data.entries())) {
            const rowNum = index + 2; // Excel row number
            const stdid = String(row[1] || '').trim();
            const name = String(row[2] || '').trim();
            const email = String(row[3] || '').trim();
            const rowData = { stdid, name, email };

            let errorReason = '';

            if (!stdid || !name || !email) {
                errorReason = 'Missing required data (stdid, name, or email).';
            } else if (stdid.length !== 11) {
                errorReason = `Invalid STDID format.`;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errorReason = `Invalid email format.`;
            }

            if (errorReason) {
                invalidRows.push({ row: rowNum, data: rowData, reason: errorReason });
                continue;
            }

            const [existing] = await promisePool.query(
                'SELECT stdid, email FROM users WHERE stdid = ? OR email = ?',
                [stdid, email]
            );

            if (Array.isArray(existing) && existing.length > 0) {
                const existingUser = existing[0] as { stdid: string, email: string };
                const reason = existingUser.stdid === stdid ? 'STDID already exists.' : 'Email already exists.';
                invalidRows.push({ row: rowNum, data: rowData, reason });
            } else {
                validUsers.push(rowData);
            }
        }

        fs.unlinkSync(uploadedFile.filepath); // Clean up the temp file

        res.status(200).json({ validUsers, invalidRows });

    } catch (error) {
        console.error('Preview process error:', error);
        res.status(500).json({ message: 'Failed to process the file for preview.' });
    }
};

export default authenticateApiKey(handler); 