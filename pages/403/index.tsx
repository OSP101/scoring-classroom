import React from 'react'
import Image from 'next/image'
import { Prompt } from "next/font/google";
import Link from 'next/link';
import { Tabs, Tab, Button } from "@heroui/react";
import Head from 'next/head'
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function index() {
  return (
    <>
            <Head>
          <title>403 Forbidden - Scoring Classroom</title>
        </Head>
<div className={`hero bg-base-200 min-h-screen ${kanit.className}`}>
                <div className="hero-content flex-col lg:flex-row">
                    <Image src={`/403.svg`} alt='403' width={300} height={300} />
                    <div className="max-w-md">
                        <h2 className="text-center text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">Forbidden</h2>
                        <p className="pb-5 font-light text-sm">
                        You do not have permission to access the system.
                        </p>
                        <Link href={`/login`}>
                            <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                กลับไปที่ชั้นเรียน
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            </>
  )
}
