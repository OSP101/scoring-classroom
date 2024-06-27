import React from 'react'
import { useState, useEffect } from "react";
import axios from 'axios'
import dynamic from 'next/dynamic'
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';


const CardCourse = dynamic(() => import('@/Components/CardCourse'), {
    loading: () => <Loading />,
})

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
                <CardCourse key={course.id} course={course} />
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