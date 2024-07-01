import React from 'react'
import Image from 'next/image'
import { Prompt } from "next/font/google";
import Link from 'next/link';
import { Tabs, Tab, Button } from "@nextui-org/react";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function index() {
  return (
<div className={`hero bg-base-200 min-h-screen ${kanit.className}`}>
                <div className="hero-content flex-col lg:flex-row">
                    <Image src={`/404.svg`} alt='404' width={300} height={300} />
                    <div className="max-w-md">
                        <h2 className="text-center text-3xl font-medium from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline">Page not found</h2>
                        <p className="pb-5 font-light text-sm">
                        Sorry, we couldn’t find the page you’re looking for.
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
