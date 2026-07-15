"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Users, Award } from "lucide-react";
import Loading from "@/components/loading/Loading";
import TrainerInfoCard from "@/components/ui/profileTrainers";

interface TrainerProfile {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
  goal: string | null;
  price: number | string | null;
  rating: number | string | null;
  experience_years: number | null;
  certifications: string[];
  image: string | null;
  created_at: string;
  user_count: number;
}

export default function MiPerfil() {
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("No hay token de autenticación");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trainers/me`, {
        headers: { "x-access-token": token },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 404) {
          setError("No tienes un perfil de entrenador asociado.");
        } else if (res.status === 401) {
          setError("Tu sesión no es válida. Vuelve a iniciar sesión.");
        } else {
          setError(json?.message || "No se pudo cargar tu perfil.");
        }
        setProfile(null);
        return;
      }

      setProfile(json?.data ?? null);
    } catch (err) {
      console.error("Error al cargar el perfil del entrenador:", err);
      setError("Error de conexión al cargar tu perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <p className="text-red-500 text-xl">
          {error || "No se pudo cargar tu perfil"}
        </p>
      </div>
    );
  }

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-[#dff400]" />,
      label: "Usuarios activos",
      value: profile.user_count ?? 0,
    },
    {
      icon: <Award className="w-5 h-5 text-[#dff400]" />,
      label: "Años de experiencia",
      value: profile.experience_years ?? "—",
    },
    {
      icon: <Mail className="w-5 h-5 text-[#dff400]" />,
      label: "Correo",
      value: profile.email || "—",
    },
    {
      icon: <Phone className="w-5 h-5 text-[#dff400]" />,
      label: "Teléfono",
      value: profile.phone || "—",
    },
  ];

  return (
    <section className="min-h-screen w-full text-white">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#dff400] font-bold">Mi perfil</h1>
      </div>

      <div className="flex mb-7 items-start">
        <TrainerInfoCard
          name={profile.name}
          image={profile.image || undefined}
          rating={profile.rating ?? undefined}
          specialty={profile.goal ?? undefined}
          price={profile.price ?? undefined}
          description={profile.description as unknown as [] | undefined}
          certification={profile.certifications as unknown as string}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl flex flex-col gap-2 p-4 bg-[#1A1A1A] border border-white/10"
          >
            <div className="flex items-center gap-2">
              {stat.icon}
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
            <p className="text-xl font-semibold break-words">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
