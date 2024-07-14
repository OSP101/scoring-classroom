import React, { useState, useRef, useEffect } from 'react'
import { Modal, ModalContent, Progress, ModalBody, Navbar, NavbarBrand, NavbarContent, Divider, Button, Spinner, useDisclosure, NavbarItem, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Accordion, AccordionItem, CardBody, Card } from "@nextui-org/react";
import { Prompt } from "next/font/google";
import { useSession } from "next-auth/react"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Head from 'next/head'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { useTheme } from "next-themes";
import { ThemeSwitcher } from '@/Components/Theme';
import Footer from '@/Components/Footer';

export default function index() {

    // console.warn('%cคำเตือน!', 'background: yellow; color: red; font-size: 20px; font-weight: bold;');
    // console.warn(`การใช้คอนโซลนี้อาจทำให้ผู้โจมตีสามารถแอบอ้างตัวเป็นคุณและขโมยข้อมูลของคุณได้โดยใช้การโจมตีที่เรียกว่า Self-XSS อย่าป้อนหรือวางโค้ดที่คุณไม่เข้าใจ`);
    // console.warn('%cและขอเตือนว่าอย่าพยายามทำนอกเหนือการใช้งาน เพราะระบบได้ตรวจจับการทำงานไว้แล้ว!', 'text-decoration: underline; background: yellow; color: red; font-size: 10px; font-weight: bold;')
    console.log(
        '%c คำเตือน! ' +
        '%c การใช้คอนโซลนี้อาจทำให้ผู้โจมตีสามารถแอบอ้างตัวคุณได้โดยใช้การโจมตีที่เรียกว่า Self-XSS อย่าป้อนหรือวางโค้ดที่คุณไม่เข้าใจ และเตือนว่าอย่าพยายามทำนอกเหนือการใช้งาน เพราะระบบได้ตรวจจับการทำงานไว้แล้ว!',
        'background: #ffff00; color: #ff0000; font-size: 18px; font-weight: bold; padding: 2px;',
        'color: white; background: #444; font-size: 14px; padding: 2px;'
    );
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
        coute: number;
        lab: any;
    }




    const [pointInput, setPointInput] = useState("");
    const [dataUser, setDataUser] = useState<Users[] | null>(null);
    const { data: session, status } = useSession();
    const [number, setNumber] = useState(0)
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const refTurnstile = useRef<TurnstileInstance>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSubmit = async () => {
        refTurnstile.current?.reset();
        console.log('submitted!');
    }

    useEffect(() => {
        onOpen()
    }, [])


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
            setDataUser(dataCourses);
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
                <meta property="og:title" content="Scoring Classroom" />
                <meta property="og:description" content="Scoring Classroom เว็บไซต์สำหรับบันทึกคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101" />
                <meta property="og:url" content="https://sc.osp101.dev" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Scoring Classroom" />
                <meta property="og:image" content="https://sc.osp101.dev/SA.png" />
                <script type="text/javascript" src="https://cookiecdn.com/cwc.js"></script>
                <script id="cookieWow" type="text/javascript" src="https://cookiecdn.com/configs/SKduo3rfyASeQCFhHQZYzrgK" data-cwcid="SKduo3rfyASeQCFhHQZYzrgK"></script>
            </Head>
            {!session ? (
                <Navbar isBordered maxWidth="2xl" isBlurred={false}>
                    <NavbarContent justify="start">
                        <NavbarBrand className="mr-4">
                            <p className={`sm:block font-bold text-inherit ${kanit.className}`}>Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span></p>
                        </NavbarBrand>
                    </NavbarContent>


                    <NavbarContent as="div" className="items-center" justify="end">
                        <ThemeSwitcher />
                    </NavbarContent>
                </Navbar>
            ) : null}

            <div className={`container mx-auto w-full max-w-4xl ${kanit.className}`}>
                <div className={`px-2 pb-4 pt-3 ${kanit.className}`}>
                    <Card>
                        <CardBody>
                            <div className='flex justify-center mb-1'>
                                <h1 className="text-center text-lg sm:text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">ยินดีต้อนรับสู่ระบบตรวจสอบคะแนน</h1>
                            </div>

                            <div className=' block justify-center my-3 md:flex'>
                                <div className='flex justify-center md:w-2/3 mb-2'>
                                    <Input type="text" label="รหัสนักศึกษา(633020xxx-x)" size='sm' variant="bordered" color={"secondary"} value={pointInput} onValueChange={setPointInput} isRequired className=' w-full' />

                                    <Button className={`mx-4 my-1 bg-gradient-to-tr w-2/5 from-[#FF1CF7] to-[#b249f8] text-white shadow-lg${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={submutations} >
                                        {statusUpdate ? (<><Spinner color="default" /> <p> กำลังค้นหา...</p></>) : "ค้นหา"}
                                    </Button>
                                </div>
                                <Turnstile
                                    id='turnstile-1'
                                    ref={refTurnstile}
                                    siteKey={process.env.NEXT_PUBLIC_CLOUD || ''}
                                    onSuccess={() => setCanSubmit(true)}
                                    options={{
                                        theme: "auto"
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
                                    <Accordion variant="splitted" className='pt-4 px-0' selectionMode="multiple" defaultExpandedKeys={["1"]}>
                                        <AccordionItem key="1" aria-label="ข้อมูลนักศึกษา" title="ข้อมูลนักศึกษา">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>ชื่อ - นามสกุล</th>
                                                        <th className='text-center'>อีเมลล์</th>
                                                        <th className='text-center'>กลุ่ม</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className="avatar">
                                                                    <div className="mask mask-squircle h-12 w-12">
                                                                        <img
                                                                            src={dataUser[0].image}
                                                                            alt="Avatar Tailwind CSS Component"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold">{dataUser[0].name}</div>
                                                                    <div className="text-sm opacity-50">{dataUser[0].stdid}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='text-center'>
                                                            <div>
                                                                {dataUser[0].email}
                                                                <br />
                                                                <span className="badge badge-ghost badge-sm">{dataUser[0].track}</span>
                                                            </div>
                                                        </td>
                                                        <td className='text-center'>{dataUser[0].section}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </AccordionItem>
                                    </Accordion>

                                    <Accordion variant="splitted" className='pt-2 mb-2 px-0' selectionMode="multiple">
                                        {dataUser.map((subject, subjectIndex) => (

                                            <AccordionItem
                                                key={`${subjectIndex + 2}`}
                                                aria-label={`คะแนนปฏิบัติการ ${subject.namesub}`}
                                                title={`คะแนนปฏิบัติการ ${subject.namesub}`}
                                                className=''
                                            >
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className='text-center'>% งานที่ส่งแล้ว <br /> <span className=' font-light'>(จำนวนงานทั้งหมด)</span></th>
                                                            <th className='text-center'>คะแนนพิเศษ</th>
                                                            {subject.lab.map((item: { titelname: any; }, index: React.Key | null | undefined) => (
                                                                <th key={index} className='text-center'>{item.titelname || `Lab`}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
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
                                                                    label={`(${subject?.lab.length})`}
                                                                    value={subject.coute}
                                                                    showValueLabel={true}
                                                                />
                                                            </td>
                                                            <td className='text-center'>{subject.extra}</td>
                                                            {subject.lab.map((item: { point: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                                                <td key={index} className='text-center'>{item.point}</td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th colSpan={subject.lab.length + 2} className='text-center font-bold'>
                                                                คะแนนทั้งหมด
                                                                {(() => {
                                                                    const totalPoints = subject.lab.reduce((sum: number, item: { point: any; }) => {
                                                                        const point = Number(item.point);
                                                                        return isNaN(point) ? sum : sum + point;
                                                                    }, 0);
                                                                    return totalPoints === 0 ? " 0/" + subject.lab.length * 10 : ` ${totalPoints}/${subject.lab.length * 10}`;
                                                                })()}
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </>
                            ) : (
                                number === 1 && (
                                    <p className='text-center text-sm font-light mb-3'>ไม่พบข้อมูลของ {pointInput}</p>
                                )
                            )}
                        </>
                    )}

                    <Footer />
                </div>

                <Modal
                    backdrop="opaque"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    radius="lg"
                    size='3xl'
                    placement="center"
                    classNames={{
                        body: "py-6",
                        backdrop: "bg-[#FBDBA7]/50 backdrop-opacity-40",
                        base: "border-[#FBDBA7] bg-[#FBDBA7] dark:bg-[#FBDBA7] text-[#FBDBA7]",
                        header: "border-b-[1px] border-[#FBDBA7]",
                        footer: "border-t-[1px] border-[#FBDBA7]",
                        closeButton: "hover:bg-white/5 active:bg-white/10",
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody>
                                    <img src={`/670111-671231_banner.jpeg`} alt='banner' width={700} height={500}></img>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
