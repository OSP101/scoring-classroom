import Image from "next/image";
import NavbarComponent from "@/Components/Navbar/Nav";
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

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
    </div>;
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Scoring Classroom</title>
        </Head>
        <NavbarComponent />
      </>
    );
  }

  return null;
}
