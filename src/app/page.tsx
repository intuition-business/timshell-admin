"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "@/features/dashboard/Dashboard";
import Loading from "@/components/loading/Loading";

const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload))?.role ?? null;
  } catch {
    return null;
  }
};

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // El Dashboard (Inicio) es solo para admin; el resto va a su lista de usuarios
    if (getRoleFromToken(token) !== "admin") {
      router.replace("/users");
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);

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