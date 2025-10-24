"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./pages/Dashboard/Dashboard";
import Loading from "@/Components/Loading/loading";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Auth/Login");
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500); // Aquí defines el retraso para simular la carga
    }
  }, [router]);

  if (loading) {
    return <Loading />; // Muestra el componente de loading mientras se verifica el token
  }

  return (
    <div>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}
