import React, { useState, useEffect, useMemo } from 'react'
import { Tooltip, Input, Link, Progress, Button } from "@nextui-org/react";
import Image from 'next/image';
import { Prompt } from "next/font/google";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlinePersonSearch } from "react-icons/md";
import { exportToExcel } from '../../utils/excelExport';

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface StudentData {
    stdid: string;
    titelname: string | null;
    point: string;
    name: string;
    image: string;
    type: string;
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

interface Student {
    stdid: string;
    name: string;
    image: string;
    point: string | number;
}

interface WorkData {
    idtitelwork: number;
    namework: string;
    length: number;
    maxpoint: number;
    avgpoint: string;
    data: Student[];
}

interface PointTabProps {
    idcouesr: string;
}

export default function PointTab({ idcouesr }: PointTabProps) {
    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const [labsData, setLabsData] = useState<LabData[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [scoreData, setScoreData] = useState<WorkData[]>([]);

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
                const data: LabData[] = await response.json();
                setLabsData(data);

                // แปลงข้อมูลให้เข้ากับ WorkData interface
                const workData: WorkData[] = data.map(lab => ({
                    idtitelwork: lab.idtitelwork,
                    namework: lab.namework,
                    length: lab.length,
                    maxpoint: lab.maxpoint,
                    avgpoint: lab.avgpoint.toString(),
                    data: lab.data.map(student => ({
                        stdid: student.stdid,
                        name: student.name,
                        image: student.image,
                        point: student.point
                    }))
                }));
                setScoreData(workData);
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
            if (lab.idtitelwork !== 0 && lab.idtitelwork !== 9999) {
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
            if (lab.idtitelwork !== 0 && lab.idtitelwork !== 9999) {
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

    const handleExport = () => {
        if (labsData.length === 0) {
            alert("ไม่มีข้อมูลที่จะ export");
            return;
        }
        exportToExcel(labsData, idcouesr);
    };

    const ExportButton = () => (
        <Tooltip content="Export to Excel">
            <Button
                onClick={handleExport}
                color="success"
                variant="flat"
                isIconOnly
                aria-label="Export to Excel"
                className="min-w-unit-10 w-unit-10 h-unit-10"
            >
                <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                >
                    <path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" />
                    <path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" />
                    <path d="M8.512,9.5H19.581V16H8.512Z" />
                    <path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" />
                    <path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" fill="#ffffff" />
                    <path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" />
                    <path d="M19.581,16H30v6.5H19.581Z" />
                </svg>
            </Button>
        </Tooltip>
    );

    return (
        <div className="overflow-x-auto">
            <div className='mx-2 block justify-between md:flex'>
                <div><Link isBlock showAnchorIcon href="/myscore" color="secondary" className='mb-2' target='_blank'>
                    ดูคะแนนรายบุคคล
                </Link>
                    <ExportButton />
                </div>

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
            <table className="table table-pin-rows table-zebra">
                <thead>
                    <tr>
                        <th>ชื่อ - นามสกุล</th>
                        <th className='text-center'>% งานที่ส่งแล้ว <br /> <span className='font-light'>(จำนวนงานทั้งหมด)</span></th>
                        <th className='text-center'>คะแนนพิเศษ</th>
                        {idcouesr == "CP421024" &&
                            <th className='text-center'>คะแนน Kahoot!</th>
                        }
                        {labsData.filter(item => item.idtitelwork !== 0 && item.idtitelwork !== 9999).map((item) => (
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
                        const totalLabs = labsData.length - 2;

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
                                {idcouesr == "CP421024" &&
                                    <td className='text-center'>
                                        {labsData.find(lab => lab.idtitelwork === 9999)?.data.find(data => data.stdid === student.stdid)?.point || '0'}
                                    </td>
                                }
                                {labsData.filter(lab => lab.idtitelwork !== 0 && lab.idtitelwork !== 9999).map((lab) => {
                                    const item = lab.data.find(data => data.stdid === student.stdid);
                                    return (
                                        <td key={`point-${student.stdid}-${lab.idtitelwork}`} className='text-center'>
                                            {item?.teachid == null ? item?.point : (
                                                <Tooltip color={`${item.type == "slow" ? "warning" : "secondary"}`} content={
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold">ผู้ตรวจ: {item.teachid}</div>
                                                        <div className="text-tiny">ลงวันที่: {formatDate(item.update_at?.toString())}</div>
                                                        <div className="text-tiny">สถานะการส่ง: {item.type}</div>
                                                    </div>
                                                } className="capitalize" placement="top">
                                                    <p className={`${item.type == "slow" ? 'text-yellow-500' : 'text-black'}`}>{item.point}</p>
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