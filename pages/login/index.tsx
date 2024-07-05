/** @jsxImportSource @emotion/react */
import React, { Key, useState, useRef } from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { css } from '@emotion/react'
import { Prompt } from "next/font/google";
import Typography from '@mui/material/Typography';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';


const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function App() {
    const [selected, setSelected] = React.useState("login");
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [canSubmit, setCanSubmit] = useState(true);
    const refTurnstile = useRef<TurnstileInstance>(null);

    const handleSubmit = async () => {
        refTurnstile.current?.reset();
        console.log('submitted!');
    }

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
        await signIn('google', { callbackUrl: '/' })
    }

    const router = useRouter()
    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    const handleSelectionChange = (key: Key) => {
        setSelected(String(key));
    };

    return (
        <div className={`flex flex-col items-center justify-center mt-20 ${kanit.className}`}>
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
                        onSelectionChange={handleSelectionChange}
                        color="secondary"
                    >
                        <Tab key="login" title="เข้าสู่ระบบ">
                            <form className="flex flex-col gap-4">
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                    <input type="text" className="grow" placeholder="Email" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input type="password" className="grow" placeholder="password" />
                                </label>
                                <p className="text-center text-small">
                                    ต้องการสร้างบัญชีหรือไม่?{" "}
                                    <Link size="sm" onPress={() => setSelected("sign-up")} color="secondary">
                                        ลงทะเบียน
                                    </Link>
                                </p>

                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth isDisabled={canSubmit} className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                        เข้าสู่ระบบ
                                    </Button>
                                </div>
                                <div className="mt-1 flex items-center gap-5"><hr className="border-slate-500 w-full" /><div className="text-slate-500">or</div><hr className="border-slate-500 w-full" /></div>
                                <Button
                                    fullWidth
                                    variant="bordered"
                                    onClick={handleGoogleSignin}
                                    // isDisabled={canSubmit}
                                    css={css`&:hover {color: #b249f8; border-color: #b249f8}`}
                                    className="inline-flex h-10 items-center justify-center gap-2 bg-white font-medium text-black outline-none focus:ring-2 focus:ring-[#b249f8] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Image
                                        src="Google__G__logo.svg"
                                        alt="Google"
                                        width={18}
                                        height={18}
                                    />
                                    เข้าสู่ระบบด้วยบัญชี Google
                                </Button>
                                <Turnstile
                                    id='turnstile-1'
                                    ref={refTurnstile}
                                    siteKey='0x4AAAAAAAeSpDcbB30BJR1b'
                                    onSuccess={() => setCanSubmit(false)}
                                    options={{
                                        theme: 'light'
                                      }}
                                />
                            </form>
                        </Tab>
                        <Tab key="sign-up" title="ลงทะเบียน">
                            <form className="flex flex-col gap-4 h-[300px]">
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                    <input type="text" className="grow" placeholder="Username" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                    <input type="text" className="grow" placeholder="Email" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input type="password" className="grow" placeholder="password" />
                                </label>
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
                    <Typography variant="caption" gutterBottom>
                        OSP101
                    </Typography>
                </a>
            </p>
        </div>
    );
}
