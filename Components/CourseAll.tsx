import React from 'react'
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { Prompt } from "next/font/google";
import Image from 'next/image'
// import {Image} from "@nextui-org/react";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function CourseAll({ session }: { session: any }) {
    interface Course {
        id: number;
        stdid: string;
        idcourse: string;
        name: string;
        image: string;
        description: string;
    }
    const [dataCourses, setDataCourses] = useState<Course[]>([]);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                });

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/${session?.user?.stdid}`, {
                    method: 'GET',
                    headers: headers
                });
                if (!response.ok) {
                    throw new Error(`Error fetching courses: ${response.statusText}`);
                }
                const dataCourses = await response.json();
                setDataCourses(dataCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }


        };

        if (session?.user?.stdid) {
            fetchCourses();
        }
    }, [session]);

    // console.log('Fetching courses', dataCourses);
    return (
        <>
            {dataCourses.map((course) => (
                <Link href={`/c/${course.idcourse}`} className={`card card-compact bg-base-100 shadow-xl mx-4 md:mx-0 ${kanit.className}`}>
                    <figure className="object-cover w-full h-full" ><Image src={`/${course.image}`} alt={course.name} width={244} height={168} className="object-cover w-full h-full" priority={true} fetchPriority='auto' /></figure>

                    <div className="card-body">
                        <div className="badge badge-secondary badge-outline badge-sm">{course.idcourse}</div>
                        <Link href={`/c/${course.idcourse}`}><p className="truncate text-xl font-medium hover:underline">{course.name}</p></Link>
                        <p className='font-light'>{course.description}</p>
                    </div>
                </Link>
            ))
            }
        </>
    )
}

function Loading() {
    return (
        <>
            <div className="flex flex-col gap-4 w-52">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>
        </>
    )
}