/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavbarComponent from "@/Components/Navbar/Nav";
import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head'
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab, Chip } from "@nextui-org/react";
import Link from 'next/link';
import { css } from '@emotion/react'
import WorkspaceTab from '@/Components/Tabs/WorkspaceTab';
import { Prompt } from "next/font/google";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function CourseDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { data: session, status } = useSession();
    const loading = status === "loading";


    useEffect(() => {
        if (!loading && !session) {
            router.push("/login");
        }

    }, [loading, session, router]);

    if (loading) {
        return <div>
            <Head>
                <title>Scoring Classroom</title>
            </Head>
        </div>
    }

    if (session) {
        return (
            <>
                <Head>
                    <title>Scoring Classroom</title>
                </Head>
                <NavbarComponent />

                    <div className={`flex w-full flex-col ${kanit.className}`}>
                        <Tabs
                            aria-label="Options"
                            variant="underlined"
                            classNames={{
                                tabList: "w-full relative rounded-none p-0 border-b border-divider pl-5",
                                cursor: "w-full bg-[#b249f8]",
                                tab: "max-w-fit px-0 h-12 px-5",
                                tabContent: "group-data-[selected=true]:text-[#b249f8]"
                            }}
                        >
                            <Tab
                                key="workspace"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <span>งานของชั้นเรียน</span>
                                    </div>
                                }
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
                            >2</Tab>
                            <Tab
                                key="point"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <span>คะแนน</span>
                                    </div>
                                }
                            >4</Tab>
                        </Tabs>
                    </div>
            </>
        );
    }
}

function setError(message: string) {
    throw new Error("Function not implemented.");
}