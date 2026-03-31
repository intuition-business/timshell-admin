"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "./(pages)/dashboard/Dashboard";
import Loading from "@/app/Components/Loading/loading";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/Auth/Login");
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }


    return () => {
    };
  }, [router]);


  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}