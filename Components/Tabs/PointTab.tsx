import React, { useState, useEffect } from 'react'
import { Tooltip, Button, Link } from "@nextui-org/react";
import Image from 'next/image';
import { Prompt } from "next/font/google";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function PointTab(idcouesr: any) {

    interface StudentData {
        stdid: string;
        titelname: string | null;
        point: string;
        name: string;
        image: string;
        teachid: string;
        create_at: Date;
        update_at: Date;
    }

    interface LabData {
        idtitelwork: number;
        namework: string;
        length: number;
        data: StudentData[];
    }

    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const [labsData, setLabsData] = useState<LabData[]>([]);

    useEffect(() => {
        getPoint(idcouesr.idcouesr);

    }, [])

    const getPoint = async (idcourses: string) => {
        try {

            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/get/${idcourses}`,
                {
                    method: 'GET',
                    headers: headers
                });
            if (data.ok) {
                const dataCourses = await data.json();
                // console.log(dataCourses)
                setLabsData(dataCourses);
                setStatusLoadTeach(true);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }


    return (
        <div className="overflow-x-auto">
            <Link isBlock showAnchorIcon href="/myscore" color="secondary" className='mb-2' target='_blank'>
                ดูคะแนนรายบุคคล
            </Link>
            <table className="table table-pin-rows table-pin-cols table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th>ชื่อ - นามสกุล</th>
                        <th className='text-center'>คะแนนพิเศษ</th>
                        {labsData.length > 0 ? (
                            labsData.map((item) => (
                                item.idtitelwork !== 0 ? (
                                    <th key={item.idtitelwork} className='text-center'>{item.namework}</th>
                                ) : null
                            ))
                        ) : null}
                        <th className='text-center'>รวม</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {labsData[0]?.data.map((head) => {

                        let totalPoints = 0;
                        return (
                            <tr key={head.stdid} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <Image
                                                    src={head.image}
                                                    alt={`Image ${head.name}`}
                                                    width={12}
                                                    height={12} />
                                            </div>
                                        </div>
                                        <div>
                                            <div>{head.name}</div>
                                            <div className="text-sm opacity-50">{head.stdid}</div>
                                        </div>
                                    </div>
                                </td>
                                {labsData.map((lab, index) => {
                                    if (lab.idtitelwork === 0) {
                                        const item2 = lab.data.find((data) => data.stdid === head.stdid);
                                        return (
                                            <td key={index} className='text-center'>
                                                    {item2?.point}
                                        </td>
                                        );
                                    }
                                    const item = lab.data.find((data) => data.stdid === head.stdid);
                                    if (item?.point && item?.point !== '-') {
                                        totalPoints += Number(item.point);
                                    }
                                    const formattedDate = (() => {
                                        if (item?.update_at) {
                                            const date = new Date(item.update_at);
                                            if (!isNaN(date.getTime())) {
                                                return date.toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    second: 'numeric'
                                                });
                                            }
                                        }
                                        return "Invalid Date";
                                    })();
                                    return (
                                        <td key={index} className='text-center'>
                                            {item?.teachid == null ? item?.point : (
                                                <Tooltip key={index} color="secondary" content={
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold">ผู้ตรวจ: {item?.teachid}</div>
                                                        <div className="text-tiny">ลงวันที่: {formattedDate}</div>
                                                    </div>
                                                } className="capitalize" placement="top">
                                                    {item?.point}
                                                </Tooltip>
                                            )}
                                        </td>
                                    )
                                })}
                                <td className={`text-center font-extrabold ${totalPoints === 0 ? 'text-red-500' : ""}`}>
                                    {totalPoints === 0 ? 0 : totalPoints}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
