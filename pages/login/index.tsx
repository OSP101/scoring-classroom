/** @jsxImportSource @emotion/react */
import React from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from 'next/image'
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { css } from '@emotion/react'

export default function App() {
    const [selected, setSelected] = React.useState("login");
    const { data: session, status } = useSession();
    const loading = status === "loading";

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

    async function handleGoogleSignin() {
        await signIn('google',{ callbackUrl: '/' })
    }

    const router = useRouter()
    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [loading, session, router]);

    // if (loading) {
    //     return <div>
    //         <Head>
    //             <title>กำลังเปลี่ยนเส้นทาง...</title>
    //         </Head>
    //     </div>;
    // }

    // if (!session) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <Head>
                    <title>Login - Scoring Classroom</title>
                </Head>
                <Card className="max-w-full w-[340px]">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col mt-2 items-start">
                        <h2 className="text-center text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">ยินดีต้อนรับ</h2>
                        <small className="text-default-500">Scoring classroom website</small>
                    </CardHeader>
                    <CardBody className="overflow-hidden">
                        <Tabs
                            fullWidth
                            size="md"
                            aria-label="Tabs form"
                            selectedKey={selected}
                            onSelectionChange={setSelected}
                            color="secondary"
                        >
                            <Tab key="login" title="เข้าสู่ระบบ">
                                <form className="flex flex-col gap-4">
                                    <Input label="อีเมลล์" type="email" />
                                    <Input
                                        isRequired
                                        label="รหัสผ่าน"
                                        type="password"
                                    />
                                    <p className="text-center text-small">
                                        ต้องการสร้างบัญชีหรือไม่?{" "}
                                        <Link size="sm" onPress={() => setSelected("sign-up")} color="secondary">
                                            ลงทะเบียน
                                        </Link>
                                    </p>
                                    <div className="flex gap-2 justify-end">
                                        <Button fullWidth className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                            เข้าสู่ระบบ
                                        </Button>
                                    </div>
                                    <div className="mt-1 flex items-center gap-5"><hr className="border-slate-500 w-full" /><div className="text-slate-500">or</div><hr className="border-slate-500 w-full" /></div>
                                    <Button
                                        fullWidth
                                        variant="bordered"
                                        onClick={handleGoogleSignin}
                                        css={css`&:hover {color: #b249f8; border-color: #b249f8}`}
                                        className="inline-flex h-10 items-center justify-center gap-2 bg-white font-medium text-black outline-none focus:ring-2 focus:ring-[#b249f8] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Image
                                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                                            alt="Google"
                                            width={18}
                                            height={18}
                                        />
                                        เข้าสู่ระบบด้วยบัญชี Google
                                    </Button>
                                </form>
                            </Tab>
                            <Tab key="sign-up" title="ลงทะเบียน">
                                <form className="flex flex-col gap-4 h-[300px]">
                                    <Input isRequired label="ชื่อ" type="password" />
                                    <Input isRequired label="อีเมลล์" type="email" />
                                    <Input
                                        isRequired
                                        label="รหัสผ่าน"
                                        type="password"
                                    />
                                    <p className="text-center text-small">
                                        มีบัญชีอยู่แล้วใช่ไหม?{" "}
                                        <Link size="sm" onPress={() => setSelected("login")} color="secondary">
                                            เข้าสู่ระบบ
                                        </Link>
                                    </p>
                                    <div className="flex gap-2 justify-end">
                                        <Button fullWidth className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                            ลงทะเบียน
                                        </Button>
                                    </div>
                                </form>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>

                <p css={copyrightStyle}>
                    © 2024 Scoring Classroom v0.4 All Rights Reserved. made with by{' '}
                    <a href="http://github.com/OSP101" target="_blank" rel="noopener noreferrer">
                        OSP101
                    </a>
                </p>
            </div>
        );
    }

// }