import Link from 'next/link';
import React from 'react'
import { Prompt } from "next/font/google";
import Image from 'next/image'
// import {Image} from "@heroui/react";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


interface Course {
    id: number;
    stdid: string;
    idcourse: string;
    name: string;
    image: string;
    description: string;
}

interface CardCourseProps {
    course: Course;
}

const CardCourse: React.FC<CardCourseProps> = ({ course }) => {

    return (
        <div className={`card card-compact bg-base-100 shadow-xl mx-4 md:mx-0 ${kanit.className}`} >
            <figure className="object-cover w-full h-full" ><Image src={`/${course.image}`} alt={course.name} width={244} height={168} className="object-cover w-full h-full" priority={true} fetchPriority='auto' /></figure>
            
            <div className="card-body">
                <div className="badge badge-secondary badge-outline badge-sm">{course.idcourse}</div>
                <Link href={`/c/${course.idcourse}`}><p className="truncate text-xl font-medium hover:underline">{course.name}</p></Link>
                <p className='font-light'>{course.description}</p>
            </div>
        </div>
    )
}

export default CardCourse;
