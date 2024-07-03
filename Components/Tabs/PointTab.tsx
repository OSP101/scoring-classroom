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
            <table className="table table-pin-rows table-pin-cols" >
                {/* head */}
                <thead>
                    <tr>
                        <th>ชื่อ - นามสกุล</th>
                        {labsData.length > 0 ? (
                            labsData.map((item) => (
                                <th key={item.idtitelwork}>{item.namework}</th>
                            ))
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {labsData[0]?.data.map((head) => (
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
                                        <div >{head.name}</div>
                                        <div className="text-sm opacity-50">{head.stdid}</div>
                                    </div>
                                </div>
                            </td>
                            {labsData.map((lab, index) => {
                                const item = lab.data.find((data) => data.stdid === head.stdid);
                                return (

                                    <td key={index}>
                                        {item?.teachid == null ? item?.point : <Tooltip key={index} color="secondary" content={`ผู้ตรวจ: ${item?.teachid}`} className="capitalize" placement="top">
                                            {item?.point}
                                        </Tooltip>}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
