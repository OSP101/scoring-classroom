import { Suspense } from 'react';
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import React from "react";
import dynamic from 'next/dynamic'
import CourseAll from "@/Components/CourseAll";

// const CourseAll = dynamic(() => import('@/Components/CourseAll'), {
//     loading: () => <p>Loading...</p>,
//   })

export default function Home() {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <>
        <Head>
          <title>Scoring Classroom</title>
        </Head>
        {/* <NavbarComponent /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 container mx-auto mt-4">
          <Suspense fallback={<Loading />}>
            <CourseAll session={session} />
          </Suspense>
        </div>
      </>
    );

  }
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}