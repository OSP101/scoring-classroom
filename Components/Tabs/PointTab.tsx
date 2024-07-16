import React, { useState, useEffect, useMemo } from 'react'
import { Tooltip, Input, Link, Progress } from "@nextui-org/react";
import Image from 'next/image';
import { Prompt } from "next/font/google";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlinePersonSearch } from "react-icons/md";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

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
    maxpoint: number;
    avgpoint: number;
    data: StudentData[];
}

interface PointTabProps {
    idcouesr: string;
}

export default function PointTab({ idcouesr }: PointTabProps) {
    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const [labsData, setLabsData] = useState<LabData[]>([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        getPoint(idcouesr);
    }, [idcouesr]);

    const getPoint = async (idcourses: string) => {
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/get/${idcourses}`, {
                method: 'GET',
                headers: headers
            });

            if (response.ok) {
                const dataCourses: LabData[] = await response.json();
                setLabsData(dataCourses);
                setStatusLoadTeach(true);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const filteredData = useMemo(() => {
        if (searchInput.trim() === '') {
            return labsData[0]?.data || [];
        }
        return labsData[0]?.data.filter(student => 
            student.stdid.toLowerCase().includes(searchInput.toLowerCase()) ||
            student.name.toLowerCase().includes(searchInput.toLowerCase())
        ) || [];
    }, [searchInput, labsData]);

    const searchStd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    const calculateTotalPoints = (student: StudentData): number => {
        return labsData.reduce((total, lab) => {
            if (lab.idtitelwork !== 0) {
                const item = lab.data.find(data => data.stdid === student.stdid);
                if (item?.point && item.point !== '-') {
                    return total + Number(item.point);
                }
            }
            return total;
        }, 0);
    };

    const calculateTotalSubmissions = (student: StudentData): number => {
        return labsData.reduce((total, lab) => {
            if (lab.idtitelwork !== 0) {
                const item = lab.data.find(data => data.stdid === student.stdid);
                if (item?.point && item.point !== '0') {
                    return total + 1;
                }
            }
            return total;
        }, 0);
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "Invalid Date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <div className='mx-2 block justify-between md:flex'>
                <Link isBlock showAnchorIcon href="/myscore" color="secondary" className='mb-2' target='_blank'>
                    ดูคะแนนรายบุคคล
                </Link>
                <Input
                    type="text"
                    label="ค้นหาด้วยชื่อ หรือ รหัสนักศึกษา"
                    variant="bordered"
                    className='md:w-1/3'
                    size='sm'
                    isClearable
                    color='secondary'
                    onChange={searchStd}
                    value={searchInput}
                />
            </div>
            <table className="table table-pin-rows table-pin-cols table-zebra">
                <thead>
                    <tr>
                        <th>ชื่อ - นามสกุล</th>
                        <th className='text-center'>% งานที่ส่งแล้ว <br /> <span className='font-light'>(จำนวนงานทั้งหมด)</span></th>
                        <th className='text-center'>คะแนนพิเศษ</th>
                        {labsData.filter(item => item.idtitelwork !== 0).map((item) => (
                            <th key={item.idtitelwork} className='text-center'>
                                {item.namework} <br /> <span className='font-light'>จาก {item.maxpoint} คะแนน</span>
                            </th>
                        ))}
                        <th className='text-center'>รวมทั้งหมด <br /> <span className='font-light'>จาก {(labsData.length - 1) * 10} คะแนน</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover">
                        <td>
                            <div className='flex justify-start items-center'>
                                <FaUserGroup className='text-xl mr-3' />คะแนนเฉลี่ยของชั้นเรียน
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                        {labsData.filter(item => item.idtitelwork !== 0).map((item) => (
                            <td key={`avg-${item.idtitelwork}`} className='text-center font-bold'>{item.avgpoint}</td>
                        ))}
                        <td></td>
                    </tr>
                    {filteredData.map((student) => {
                        const totalPoints = calculateTotalPoints(student);
                        const totalSubmissions = calculateTotalSubmissions(student);
                        const totalLabs = labsData.length - 1;

                        return (
                            <tr key={student.stdid} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <Image
                                                    src={student.image}
                                                    alt={`Image ${student.name}`}
                                                    width={48}
                                                    height={48}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div>{student.name}</div>
                                            <div className="text-sm opacity-50">{student.stdid}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='text-center'>
                                    <Progress
                                        size="md"
                                        radius="sm"
                                        classNames={{
                                            base: "max-w-md",
                                            track: "drop-shadow-md border border-default",
                                            indicator: "bg-gradient-to-r from-[#FF1CF7] to-[#b249f8]",
                                            label: "text-default-600 font-light text-sm",
                                            value: "text-foreground/60 text-sm",
                                        }}
                                        label={`(${totalLabs})`}
                                        value={(totalSubmissions / totalLabs) * 100}
                                        showValueLabel={true}
                                    />
                                </td>
                                <td className='text-center'>
                                    {labsData.find(lab => lab.idtitelwork === 0)?.data.find(data => data.stdid === student.stdid)?.point || '0'}
                                </td>
                                {labsData.filter(lab => lab.idtitelwork !== 0).map((lab) => {
                                    const item = lab.data.find(data => data.stdid === student.stdid);
                                    return (
                                        <td key={`point-${student.stdid}-${lab.idtitelwork}`} className='text-center'>
                                            {item?.teachid == null ? item?.point : (
                                                <Tooltip color="secondary" content={
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold">ผู้ตรวจ: {item.teachid}</div>
                                                        <div className="text-tiny">ลงวันที่: {formatDate(item.update_at?.toString())}</div>
                                                    </div>
                                                } className="capitalize" placement="top">
                                                    {item.point}
                                                </Tooltip>
                                            )}
                                        </td>
                                    );
                                })}
                                <td className={`text-center font-extrabold ${totalPoints === 0 ? 'text-red-500' : ""}`}>
                                    {totalPoints}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}