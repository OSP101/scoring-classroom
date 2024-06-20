import Link from 'next/link';
import React from 'react'


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
        <div className="card card-compact bg-base-100 shadow-xl mx-4 md:mx-0">
            <figure className="object-cover w-full h-full"><img src={course.image} alt={course.name} className="object-cover w-full h-full" /></figure>
            <div className="card-body">
                <div className="badge badge-secondary badge-outline badge-sm">{course.idcourse}</div>
                <Link href={`/c/${course.idcourse}`}><p className="truncate text-xl font-medium hover:underline">{course.name}</p></Link>
                <p className='font-light'>{course.description}</p>
            </div>
        </div>
    )
}

export default CardCourse;
