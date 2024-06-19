import Image from "next/image";
import NavbarComponent from "@/Components/Navbar/Nav";
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CardCourse from "@/Components/CardCourse";
import axios from 'axios'
import { useState } from "react";
import { Skeleton, Card } from "@nextui-org/react";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setLoading] = React.useState(false);
  const loading = status === "loading";
  const router = useRouter();

  interface Course {
    id: number;
    stdid: string;
    idcourse: string;
    name: string;
    image: string;
    description: string;
  }

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
    setData();
  }, [loading, session, router]);

  const [dataCourses, setDatacourse] = useState<Course[]>([]);

  async function setData() {
    try {
      const response = await axios.get<Course[]>(`${process.env.NEXT_PUBLIC_API_URL}/course/${session?.user?.stdid}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      });

      setDatacourse(response.data);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("Data course : ", dataCourses);
  // console.log(session?.user?.stdid);


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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 container mx-auto mt-4">
          {!isLoaded ? (
            <Card className="w-[200px] space-y-5 p-4" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            </Card>
          ) : (
            <>
              {dataCourses.length > 0 ? (
                dataCourses.map((course) => (
                  <CardCourse key={course.id} course={course} />
                ))
              ) : (
                <div className="text-gray-500 text-center mt-4">
                  No courses available.
                </div>
              )}
            </>
          )}

        </div>
      </>
    );

  }

  return null;
}

