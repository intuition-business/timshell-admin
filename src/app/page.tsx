"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./pages/Dashboard/Dashboard";
import Image from "next/image";
import Loading from "@/Components/Loading/loading";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push("/Auth/Login");
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [router]);

  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div>
      <main>
        <Dashboard></Dashboard>
      </main>
    </div>
  );
}
