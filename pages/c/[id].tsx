/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head'
import { Tabs, Tab, Button } from "@nextui-org/react";
import { Prompt } from "next/font/google";
import dynamic from 'next/dynamic'
import LinearProgress from '@mui/material/LinearProgress';
import { purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
// import PointTab from '@/Components/Tabs/PointTab';
// import PersonTab from '@/Components/Tabs/PersonTab';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: '#f44336',
        },
    },
});


const WorkspaceTab = dynamic(() => import('@/Components/Tabs/WorkspaceTab'), {
    loading: () => <LinearProgress color="secondary" />,
});

const PersonTab = dynamic(() => import('@/Components/Tabs/PersonTab'), {
    loading: () => <LinearProgress color="secondary" />,
});

const PointTab = dynamic(() => import('@/Components/Tabs/PointTab'), {
    loading: () => <LinearProgress color="secondary" />,
});
const EditTab = dynamic(() => import('@/Components/Tabs/EditTab'), {
    loading: () => <LinearProgress color="secondary" />,
});


const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function CourseDetail() {


    const router = useRouter();
    const { id } = router.query;
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [checkUser, setCheckUser] = useState(true);
    var check = true;

    useEffect(() => {
        setCheckUser(true)
        if (!loading && !session) {
            router.push("/login");
        }

        const cheuser = async () => {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/checkuser/check`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ idcourse: id, email: session?.user?.email || null })
                }
            )
            const data = await response.json();
            setCheckUser(data.menubar);
            // console.log(data.menubar);
        }
        cheuser();

    }, [loading, session, router]);

    if (loading) {
        return <div>
            <Head>
                <title>Scoring Classroom</title>
            </Head>
        </div>
    }

    if (session && checkUser) {
        return (
            <>
                <Head>
                    <title>{id} - Scoring Classroom</title>
                </Head>
                {/* <NavbarComponent /> */}

                <div className={`flex w-full flex-col ${kanit.className} static `}>
                    <Tabs
                        aria-label="Options"
                        variant="underlined"
                        classNames={{
                            tabList: "w-full relative rounded-none p-0 border-b border-divider pl-5",
                            cursor: "w-full bg-[#b249f8] ",
                            tab: "max-w-fit h-12 px-5 ",
                            tabContent: "group-data-[selected=true]:text-[#b249f8] "
                        }}
                    >
                        {/* <LinearProgress /> */}
                        <Tab
                            key="workspace"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>งานของชั้นเรียน</span>
                                </div>
                            }
                            className='py-0'
                        >
                            <WorkspaceTab idcourse={id} />
                        </Tab>
                        <Tab
                            key="peplo"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>บุคคล</span>
                                </div>
                            }
                        >
                            <div className='overflow-y-scroll custom-h-screen-minus-16'>
                                <PersonTab idcouesr={id} className="px-4" />
                            </div>
                        </Tab>
                        <Tab
                            key="point"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>คะแนน</span>
                                </div>
                            }
                        >
                            <div className='overflow-y-scroll custom-h-screen-minus-16'>
                                <PointTab idcouesr={id} />
                            </div>
                        </Tab>
                        {session.user?.email == "supphitan.p@kkumail.com" ?
                            <Tab
                                key="editpoint"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <span>แก้ไขคะแนน</span>
                                    </div>
                                }
                            >
                                <div className='flex items-center space-x-2'>
                                    <EditTab idcouesr={id} />
                                </div>
                            </Tab> :
                            null
                        }
                    </Tabs>
                </div>
            </>
        );
    }

    else if (!checkUser) {
        return (
            <div className={`hero bg-base-200 min-h-screen ${kanit.className}`}>
                <div className="hero-content flex-col lg:flex-row">
                    <Image src={`/Questions-amico.svg`} alt='404' width={300} height={300} />
                    <div className="max-w-md">
                        <h2 className="text-center text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">ไม่พบชั้นเรียน</h2>
                        <p className="pb-5 font-light text-sm">
                            มองหาในรายชื่อชั้นเรียนหรือตรวจสอบลิงก์อีกครั้ง
                        </p>
                        <Link href={`/`}>
                            <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                กลับไปที่ชั้นเรียน
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

function setError(message: string) {
    throw new Error("Function not implemented.");
}