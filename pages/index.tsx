
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import React,{useEffect} from "react";
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const CourseAll = dynamic(() => import('@/Components/CourseAll'), {
  loading: () => <Loading />,
});
export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
        router.push("/login");
    }

}, [loading, session, router]);

  if (session) {
    return (
      <>
        <Head>
          <title>Scoring Classroom</title>
          <meta name="description" content="Scoring Classroom เว็บไซต์สำหรับบันทึกคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101"></meta>
          <meta name="robots" content="index,follow"></meta>

        </Head>
        {/* <NavbarComponent /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 container mx-auto mt-4">
            <CourseAll session={session} />
        </div>
      </>
    );

  }
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