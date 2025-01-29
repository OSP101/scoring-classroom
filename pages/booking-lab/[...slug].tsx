'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

const FormEnter = dynamic(() => import('../../Components/Forms/FormEnterBooking'), {
    loading: () => <LoadingStart />,
});

export default function Page() {
    const router = useRouter()
    const param = router.query.slug;
    console.log(param)
  // ตรวจสอบว่า param มีค่าหรือไม่
  if (!param || !Array.isArray(param) || param.length < 3) {
    return <div>Invalid parameters</div>;
  }

  return (
    <>
      <FormEnter idcourse={param[0]} idtitelwork={param[1]} studentId={param[2]}  />
    </>
  );
}

function LoadingStart() {
    <style jsx>{`
      @keyframes text-gradient {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
    
      .animate-text-gradient {
        animation: text-gradient 3s linear infinite;
      }
    `}</style>
    return (
      <div>
        <p
          className={`inline-flex md:ml-1 font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,#D6009A,#8a56cc,#D6009A)] dark:bg-[linear-gradient(90deg,#FFEBF9,#8a56cc,#FFEBF9)] animate-text-gradient ${kanit.className}`}
          style={{
            fontSize: "2rem",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Loading...
        </p>
      </div>
    )
  }