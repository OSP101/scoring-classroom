"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect } from "react";
import { useRouter } from 'next/router';

export default function index() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
    router.push("/admin/users");

  }, [session, router]);
  return (
<></>
  )
}
