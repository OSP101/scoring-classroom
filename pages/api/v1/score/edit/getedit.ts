import type { NextApiRequest, NextApiResponse } from "next";
import { mysqlPool } from "../../../../../utils/db";
import { authenticateApiKey } from '../../../../../lib/auth';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { idcourse } = req.body;
        console.log(idcourse)
        try {
            const promisePool = mysqlPool.promise()
            let rows;

            [rows] = await promisePool.query(
                'SELECT points.id AS idpoint, edit_point.id, edit_point.idtitelwork, edit_point.stdid, edit_point.teachid AS teachedit, edit_point.point AS pointedit, edit_point.des, edit_point.status, edit_point.idcourse, edit_point.create_at, edit_point.description_t, titelwork.name, edit_point.update_at, points.teachid, points.point AS pointold, users.name AS nameStd FROM titelwork JOIN edit_point ON edit_point.idtitelwork = titelwork.id JOIN points ON edit_point.stdid = points.stdid JOIN users ON users.stdid = points.stdid WHERE edit_point.idcourse = ?',
                [idcourse]
            );

            let dataOne: any[] = [];
            let dataTwo: any[] = [];
            let dataTree: any[] = [];

            rows.forEach((item :any) => {
                if (item.status === 1) {
                    dataOne.push(item);
                } else if (item.status === 2) {
                    dataTwo.push(item);
                } else if (item.status === 3) {
                    dataTree.push(item);
                }
            });

            const newData = [dataOne,dataTwo,dataTree]

            res.status(200).json(newData);

            // console.log(rows)

        } catch (err) {
            res.status(500).json({ error: err });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authenticateApiKey(handler);