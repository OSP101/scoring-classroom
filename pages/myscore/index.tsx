'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Chip, Tooltip,Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Navbar, NavbarBrand, NavbarContent, Divider, Button, Spinner, useDisclosure, NavbarItem, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Accordion, AccordionItem, CardBody, Card } from "@heroui/react";
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
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography';
import Snowfall from 'react-snowfall';
import AnimatedCharacters from '../../Components/AnimatedCharacters';
import Image from 'next/image';

export default function index() {

    const copyrightStyle = css`
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
            margin-top: 15px;
            margin-left: 15px;
            margin-right: 15px;
            text-align: center;

            a {
                color: #666;
                text-decoration: underline;
                &:hover {
                color: #b249f8;
                }
            }
            `;

    // console.warn('%cคำเตือน!', 'background: yellow; color: red; font-size: 20px; font-weight: bold;');
    // console.warn(`การใช้คอนโซลนี้อาจทำให้ผู้โจมตีสามารถแอบอ้างตัวเป็นคุณและขโมยข้อมูลของคุณได้โดยใช้การโจมตีที่เรียกว่า Self-XSS อย่าป้อนหรือวางโค้ดที่คุณไม่เข้าใจ`);
    // console.warn('%cและขอเตือนว่าอย่าพยายามทำนอกเหนือการใช้งาน เพราะระบบได้ตรวจจับการทำงานไว้แล้ว!', 'text-decoration: underline; background: yellow; color: red; font-size: 10px; font-weight: bold;')
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
        kahoot: number;
        lab: any;
    }




    const [pointInput, setPointInput] = useState("");
    const [dataUser, setDataUser] = useState<Users | null>(null);
    const { data: session, status } = useSession();
    const [number, setNumber] = useState(0)
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const refTurnstile = useRef<TurnstileInstance>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [bannerModalOpen, setBannerModalOpen] = useState(false);
    const [banners, setBanners] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async () => {
        refTurnstile.current?.reset();
        console.log('submitted!');
    }

    // useEffect(() => {
    //     onOpen()
    // }, [])


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

    // console.log(dataUser)

    // Fetch banners from API
    useEffect(() => {
        // Only run on client side
        if (!isClient) return;

        const seen = localStorage.getItem('seenBannerModal');
        // console.log('Banner modal check:', { seen, hasApiKey: !!process.env.NEXT_PUBLIC_API_KEY });
        
        if (!seen) {
            fetch('/api/v2/admin/announcement', {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            })
                .then(res => {
                    // console.log('Banner API response status:', res.status);
                    return res.json();
                })
                .then(data => {
                    console.log('Banner API data:', data);
                    if (data && data.length > 0) {
                        setBanners(data);
                        setBannerModalOpen(true);
                    } else {
                        // console.log('No banners found or empty response');
                        // Show modal even if no banners for testing
                        setBannerModalOpen(true);
                    }
                })
                .catch(error => {
                    // console.error('Error fetching banners:', error);
                    // Show modal even on error for testing
                    setBannerModalOpen(true);
                });
        } else {
            // console.log('Banner modal already seen');
        }
    }, [isClient]);

    const handleCloseBannerModal = () => {
        setBannerModalOpen(false);
        if (isClient) {
            localStorage.setItem('seenBannerModal', '1');
        }
    };

    const resetBannerModal = () => {
        if (isClient) {
            localStorage.removeItem('seenBannerModal');
        }
        setBannerModalOpen(false);
        // Reload the page to trigger the useEffect again
        window.location.reload();
    };

    // Add global function for console testing
    useEffect(() => {
        if (isClient) {
            (window as any).resetBannerModal = resetBannerModal;
            // console.log('💡 Tip: Run resetBannerModal() in console to test banner modal');
        }
    }, [isClient]);

    // Load Google AdSense safely
    useEffect(() => {
        if (isClient) {
            try {
                // Load AdSense script
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);

                // Initialize AdSense after script loads
                script.onload = () => {
                    try {
                        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                        (window as any).adsbygoogle.push({});
                    } catch (error) {
                        console.warn('AdSense initialization error:', error);
                    }
                };

                script.onerror = () => {
                    console.warn('Failed to load AdSense script');
                };
            } catch (error) {
                console.warn('Error setting up AdSense:', error);
            }
        }
    }, [isClient]);

    return (
        <div className={kanit.className}>
            {/* <Snowfall /> */}
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
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225" crossOrigin="anonymous"></script>
            </Head>
            {!session ? (
                <Navbar isBordered maxWidth="2xl" isBlurred={false}>
                    <NavbarContent justify="start">
                        <NavbarBrand className="mr-4">
                            <p className={`sm:block font-bold text-inherit ${kanit.className}`}>Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span></p>
                            <Chip isDisabled size="sm" variant="flat">{process.env.NEXT_PUBLIC_VER || 'v2.7.10'}</Chip>
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

                            {/* Test button for banner modal */}
                            {/* {isClient && (
                                <div className='flex justify-center mb-2'>
                                    <Button 
                                        size="sm" 
                                        color="secondary" 
                                        variant="flat" 
                                        onClick={resetBannerModal}
                                        className="text-xs"
                                    >
                                        🔄 ทดสอบแบนเนอร์
                                    </Button>
                                </div>
                            )} */}

                            <div className=' block justify-center my-3 md:flex'>
                                <div className='flex justify-center md:w-2/3 mb-2'>
                                    <Input type="text" label="รหัสนักศึกษา(633020xxx-x)" size='sm' variant="bordered" color={"secondary"} value={pointInput} onValueChange={setPointInput} isRequired className=' w-full' />

                                    <Button className={`mx-4 my-1 bg-gradient-to-tr w-2/5 from-[#FF1CF7] to-[#b249f8] text-white shadow-lg${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={submutations} 
                                    isDisabled={!statusButton}
                                    >
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
                                                        <td className='text-center'>
                                                            <div>
                                                                {dataUser.email}
                                                                <br />
                                                                <span className="badge badge-ghost badge-sm">{dataUser.track}</span>
                                                            </div>
                                                        </td>
                                                        <td className='text-center'>{dataUser.section}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </AccordionItem>
                                    </Accordion>

                                    <Accordion variant="splitted" className='pt-2 mb-2 px-0' selectionMode="multiple">

                                            <AccordionItem
                                                key={`1`}
                                                aria-label={`คะแนนปฏิบัติการ ${dataUser.namesub}`}
                                                title={`คะแนนปฏิบัติการ ${dataUser.namesub}`}
                                                className=''
                                            >
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            {/* <th className='text-center'>% งานที่ส่งแล้ว <br /> <span className=' font-light'>(จำนวนงานทั้งหมด)</span></th> */}
                                                            <th className='text-center'>คะแนนพิเศษ</th>
                                                            {dataUser.namesub == "Object Oriented Programming" && 
                                                            <th className='text-center'>คะแนน Kahoot!</th>
                                                            }
                                                            {dataUser.lab.map((item: { titelname: any; }, index: React.Key | null | undefined) => (
                                                                <th key={index} className='text-center'>{item.titelname || `Lab`}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            {/* <td className='text-center'>
                                                                <Box sx={{ width: '100%' }}><CircularProgress variant="determinate" value={dataUser.coute} /></Box>
                                                            </td> */}
                                                            <td className='text-center'>{dataUser.extra}</td>
                                                            {dataUser.namesub == "Object Oriented Programming" && 
                                                            <td className='text-center'>{dataUser.kahoot}</td>
                                                            }
                                                            {dataUser.lab.map((item: { point: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; teachid: string; update_at: any; type: string }, index: React.Key | null | undefined) => (

                                                                <td key={index} className='text-center'>
                                                                    {item?.teachid == null ? item?.point : (
                                                                        <Tooltip color={`${item.type == "slow" ? "warning" : "secondary"}`} content={
                                                                            <div className="px-1 py-2">
                                                                                <div className="text-small font-bold">ผู้ตรวจ: {item.teachid}</div>
                                                                                <div className="text-tiny">ลงวันที่: {formatDate(item.update_at?.toString())}</div>
                                                                                <div className="text-tiny">สถานะการส่ง: {item.type}</div>
                                                                            </div>
                                                                        } className="capitalize" placement="top">
                                                                            <p className={`${item.type == "slow" ? 'text-yellow-500' : 'text-black' }`}>{item.point}</p>
                                                                        </Tooltip>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th colSpan={dataUser.lab.length + 3} className='text-center font-bold'>
                                                                คะแนนทั้งหมด
                                                                {(() => {
                                                                    const totalPoints = dataUser.lab.reduce((sum: number, item: { point: any; }) => {
                                                                        const point = Number(item.point);
                                                                        return isNaN(point) ? sum : sum + point;
                                                                    }, 0);
                                                                    return totalPoints === 0 ? " 0/" + dataUser.lab.length * 10 : ` ${totalPoints}/${dataUser.lab.length * 10}`;
                                                                })()}
                                                            </th>
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

                    <Footer />

                    {/* Google AdSense - moved to useEffect for safety */}
                    <ins className="adsbygoogle block"
                        data-ad-client="ca-pub-7427071385649225"
                        data-ad-slot="8650209963"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
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

                {/* Banner Modal */}
                <Modal isOpen={bannerModalOpen} onClose={handleCloseBannerModal} size="3xl" placement="center" className={kanit.className} isDismissable={true}>
                    <ModalContent>
                        {/* <ModalHeader className="flex flex-col gap-1 items-center text-lg font-bold">ประกาศประชาสัมพันธ์</ModalHeader> */}
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                {banners.length > 0 ? (
                                    banners.map((banner, idx) => (
                                        <div key={banner.id || idx} className="flex flex-col items-center gap-2">
                                            {banner.type === 'image' ? (
                                                <Image src={banner.content} alt={banner.filename || 'banner'} className="w-full max-w-2xl rounded-lg shadow-md" width={1200} height={1000} />
                                            ) : (
                                                <div className="bg-gradient-to-r from-[#FF1CF7]/10 to-[#b249f8]/10 px-4 py-2 rounded text-base text-center font-medium text-[#b249f8]">{banner.content}</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-gradient-to-r from-[#FF1CF7]/10 to-[#b249f8]/10 px-4 py-2 rounded text-base text-center font-medium text-[#b249f8]">
                                            🎉 ยินดีต้อนรับสู่ Scoring Classroom! ขอให้ทุกคนโชคดีในภาคการศึกษานี้
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <Button color="primary" className="mt-6 w-full" onClick={handleCloseBannerModal}>ปิด</Button> */}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
