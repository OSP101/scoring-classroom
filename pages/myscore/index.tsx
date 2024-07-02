import React, { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, Divider, Button, Spinner, NavbarItem, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Accordion, AccordionItem } from "@nextui-org/react";
import { Prompt } from "next/font/google";
import { useSession } from "next-auth/react"
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });



export default function index() {

    interface Users {
        stdid: string;
        name: string;
        image: string;
        track: string;
        email: string;
        section: number;
        extra: number;
        namesub: string;
        idcourse: string;
        lab: any;
    }

    const [pointInput, setPointInput] = useState("");
    const [dataUser, setDataUser] = useState<Users | null>(null);
    const { data: session, status } = useSession();
    const [number, setNumber] = useState(0)
    const [statusUpdate, setStatusUpdate] = useState(false);

    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";


    const submutations = async () => {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
        });
        setStatusUpdate(true)
        const getData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/score/${pointInput}`, {
            method: 'GET',
            headers: headers
        })
        if (getData.status === 201) {
            setNumber(1)
            setStatusUpdate(false)
        } else if (getData.status === 200) {
            const dataCourses = await getData.json();
            setDataUser(dataCourses[0]);
            setNumber(2)

            setStatusUpdate(false)
        }

    }


    return (
        <div className={kanit.className}>
            {!session ? (
                <Navbar isBordered maxWidth="2xl" isBlurred={false}>
                    <NavbarContent justify="start">
                        <NavbarBrand className="mr-4">
                            <p className={`sm:block font-bold text-inherit ${kanit.className}`}>Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span></p>
                        </NavbarBrand>
                    </NavbarContent>
                </Navbar>
            ) : null}

            <div className={`container mx-auto w-full max-w-4xl ${kanit.className}`}>
                <div className={`px-2 pb-4 pt-3 ${kanit.className}`}>
                    <div className='flex justify-center'>
                        <h2 className="text-center text-lg sm:text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">ยินดีต้อนรับสู่ระบบตรวจสอบคะแนน</h2>
                    </div>

                    <div className='flex justify-center my-3'>
                        <Input type="text" label="รหัสนักศึกษา (633020xxx-x)" size='sm' variant="bordered" color={"secondary"} value={pointInput} onValueChange={setPointInput} isRequired className='w-2/3 mr-4' />

                        <Button className={`bg-gradient-to-tr w-1/5 from-[#FF1CF7] to-[#b249f8] text-white shadow-lg${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={submutations}>
                            {statusUpdate ? (<><Spinner color="default" /> <p> กำลังค้นหา...</p></>) : "ค้นหา"}
                        </Button>
                    </div>

                    {statusUpdate ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color="inherit" />
                        </Box>
                    ) : (
                        <>
                            {dataUser && number === 2 ? (
                                <>
                                    <h2 className='text-lg sm:text-3xl mt-5'>{dataUser.idcourse} {dataUser.namesub}</h2>
                                    <Divider className="my-2" />
                                    <Accordion variant="splitted" className='pt-4 px-0' selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
                                        <AccordionItem key="1" aria-label="ข้อมูลนักศึกษา" title="ข้อมูลนักศึกษา">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>ชื่อ - นามสกุล</th>
                                                        <th>อีเมลล์</th>
                                                        <th>กลุ่ม</th>
                                                        <th>แทร็ค</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className="avatar">
                                                                    <div className="mask mask-squircle h-12 w-12">
                                                                        <img
                                                                            src={dataUser.image}
                                                                            alt="Avatar Tailwind CSS Component"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold">{dataUser.name}</div>
                                                                    <div className="text-sm opacity-50">{dataUser.stdid}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {dataUser.email}
                                                            <br />
                                                            <span className="badge badge-ghost badge-sm">{dataUser.track}</span>
                                                        </td>
                                                        <td>{dataUser.section}</td>
                                                        <th>
                                                            <button className="btn btn-ghost btn-xs">{dataUser.track}</button>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </AccordionItem>

                                        <AccordionItem key="2" aria-label="คะแนนทั้งหมด" title="คะแนนทั้งหมด" className='mt-2'>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>คะแนนพิเศษ</th>
                                                        {dataUser.lab.map((item: any, index: number) => (
                                                            <th key={index}>{item[0].titelname ? item[0].titelname : `Lab ${index + 1}`}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{dataUser.extra}</td>
                                                        {dataUser.lab.map((item: any, index: number) => (
                                                            <td key={index}>{item[0].point}</td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th>คะแนนรวม</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </AccordionItem>
                                    </Accordion>
                                </>
                            ) : (
                                number === 1 && (
                                    <p className='text-center text-sm font-light mb-3'>ไม่พบข้อมูลของ {pointInput}</p>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
