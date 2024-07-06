import React, { useState,useRef } from 'react'
import { Navbar, NavbarBrand, NavbarContent, Divider, Button, Spinner, NavbarItem, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Accordion, AccordionItem, CardBody, Card } from "@nextui-org/react";
import { Prompt } from "next/font/google";
import { useSession } from "next-auth/react"
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Head from 'next/head'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });



export default function index() {

    console.warn('%cคำเตือน!', 'background: yellow; color: red; font-size: 20px; font-weight: bold;');
    console.warn(`การใช้คอนโซลนี้อาจทำให้ผู้โจมตีสามารถแอบอ้างตัวเป็นคุณและขโมยข้อมูลของคุณได้โดยใช้การโจมตีที่เรียกว่า Self-XSS อย่าป้อนหรือวางโค้ดที่คุณไม่เข้าใจ`);
    console.warn('%cและขอเตือนว่าอย่าพยายามทำนอกเหนือการใช้งาน เพราะระบบได้ตรวจจับการทำงานไว้แล้ว!', 'text-decoration: underline; background: yellow; color: red; font-size: 10px; font-weight: bold;')

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

        const [canSubmit, setCanSubmit] = useState(false);
        const refTurnstile = useRef<TurnstileInstance>(null);
    
        const handleSubmit = async () => {
            refTurnstile.current?.reset();
            console.log('submitted!');
        }

        const statusButton = canSubmit && pointInput.length > 0;
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
            <Head>
                <title>Myscore - Scoring Classroom</title>
                <meta name="robots" content="index,follow"></meta>
                <meta name="description" content="Myscore เว็บไซต์สำหรับตรวจสอบคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101"></meta>
            </Head>
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
                    <Card>
                        <CardBody>
                            <div className='flex justify-center'>
                                <h1 className="text-center text-lg sm:text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">ยินดีต้อนรับสู่ระบบตรวจสอบคะแนน</h1>
                            </div>

                            <div className=' block justify-center my-3 md:flex'>
                                <div className='flex justify-center md:w-2/3 mb-2'>
                                    <Input type="text" label="รหัสนักศึกษา(633020xxx-x)" size='sm' variant="bordered" color={"secondary"} value={pointInput} onValueChange={setPointInput} isRequired className=' w-full' />

                                    <Button className={`mx-4 my-1 bg-gradient-to-tr w-2/5 from-[#FF1CF7] to-[#b249f8] text-white shadow-lg${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={submutations} isDisabled={!statusButton}>
                                        {statusUpdate ? (<><Spinner color="default" /> <p> กำลังค้นหา...</p></>) : "ค้นหา"}
                                    </Button>
                                </div>
                                <Turnstile
                                    id='turnstile-1'
                                    ref={refTurnstile}
                                    siteKey='0x4AAAAAAAeSpDcbB30BJR1b'
                                    onSuccess={() => setCanSubmit(true)}
                                    options={{
                                        theme: 'light'
                                    }}
                                />
                            </div>


                        </CardBody>
                    </Card>

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
                                                        <td>
                                                            {dataUser.track}
                                                        </td>
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

                    {/* <Footer /> */}
                </div>
            </div>
        </div>
    )
}
