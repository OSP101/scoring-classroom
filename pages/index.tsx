
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect } from "react";
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import WatermarkOverlay from "@/Components/WatermarkOverlay";

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

  console.log(session?.expires)

  if (session) {
    return (
      <>
        <Head>
          <title>Scoring Classroom</title>
          <meta name="description" content="Scoring Classroom เว็บไซต์สำหรับบันทึกคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101"></meta>
          <meta name="robots" content="index,follow"></meta>
          <meta name="google-site-verification" content="F6z6ihjP_j_3j1lcrmvdMGhCkhwdjdclCuxmQ4C9I68" />
          <meta property="og:title" content="Scoring Classroom" />
          <meta property="og:description" content="Scoring Classroom เว็บไซต์สำหรับบันทึกคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101" />
          <meta property="og:url" content="https://sc.osp101.dev" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Scoring Classroom" />
          <meta property="og:image" content="https://sc.osp101.dev/SA.png" />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225" crossOrigin="anonymous"></script>

        </Head>
        {/* <NavbarComponent /> */}
        {/* <WatermarkOverlay name={session?.user?.name || ""} email={session?.user?.email || ""} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container mx-auto mt-4">
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