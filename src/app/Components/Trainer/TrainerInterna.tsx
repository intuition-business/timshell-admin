"use client";
import ProgressCard from "@/app/Components/Interna/components/ProgressCard";
import Loading from "@/app/Components/Loading/loading";
import Buttons from "@/app/Components/ui/Buttons";
import Dates from "@/app/Components/ui/Dates";
import { ProfileCard } from "@/app/Components/ui/ReusableProfile";
import { RutsCards } from "@/app/Components/ui/RutsCards";
import UserMovementChart from "@/app/Components/ui/UserMovementChart";
import WeightChart from "@/app/Components/ui/WeightChart";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrainerInfoCard from "../ui/profileTrainers";
import { CardList, TableList } from "../Table/TableList";
import TrainerMovementChart from "../ui/trainerMovementChart";
import MonthlyRevenueChart from "../ui/trainerBarChart";

interface Rutina {
  id: string;
  fecha: string;
  nombre: string;
  status: string;
  ejercicios: {
    nombre_ejercicio: string;
    Esquema: {
      Series: number;
      Descanso: string;
      "Detalle series": {
        Reps: number;
        carga: number | string;
      }[];
    };
  }[];
}

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  plan_id?: number | null;
  plan_name?: string;
  trainer_name?: string;
  trainer_image?: string;
  user_image?: string;
  fecha?: string;
  certificacion?: string;
  description?: string;
  rating?: string;
}

export default function TrainerDashboard() {
  const [rutinasVisibles, setRutinasVisibles] = useState<Rutina[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const totalPaginas = 5;

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const obtenerRutinas = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/ia/?user_id=${id}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log("No se encontraron rutinas para este usuario");
            setRutinasVisibles([]); // Establece rutinas vacías
            return;
          }
          const errorText = await response.text();
          console.log("Error response:", response.status, response.statusText);
          console.log("Error body:", errorText);
          throw new Error(
            `Error al obtener las rutinas: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Datos recibidos de la API:", data);
        console.log("Rutinas:", data.response);
        setRutinasVisibles(data.response); // Guarda las rutinas en el estado
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (id && token) {
      obtenerRutinas();
    }
  }, [id]);
  // Datos de ejemplo para la gráfica de peso
  const weightData = [79.5, 79.2, 78.8, 78.5, 78.3, 78.1, 77.9];
  const weightLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Altas mensuales",
        data: [
          600, 900, 1400, 1300, 1250, 1600, 1500, 1200, 900, 1500, 1600, 1200,
        ],
        borderColor: "#D4FF00",
        backgroundColor: "rgba(173, 255, 47, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Media de usuarios",
        data: [
          1000, 1100, 1200, 1300, 1250, 1300, 1200, 1100, 1000, 1300, 1250,
          1150,
        ],
        borderColor: "#ff4b4b",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.2,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
    },
  };

  const handleVerDetalles = (rutinaId: string | number, userId: string) => {
    router.push(`/pages/users/${userId}/page/${rutinaId}`);
  };

  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}trainers/${id}`,
          {
            headers: { "x-access-token": token },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          setError(`Error: ${res.status} - Usuario no encontrado`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        console.log("Datos recibidos:", json);

        if (json.data) {
          const userData = json.data;

          setData(userData.assigned_users);
          setLoadingUser(false);
          setUser({
            fecha: userData.fecha,
            id: userData.id?.toString() || "",
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            plan_id: userData.plan_id ?? null,
            plan_name: userData.plan_name || "",
            trainer_name: userData.name || "Sin entrenador",
            trainer_image: userData.image || "",
            user_image: userData.image || "",
            rating: userData.rating,
            certificacion: userData.certifications,
            description: userData.description,
          });
        } else {
          setError("No se encontraron datos del entrenador");
        }

      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al cargar usuario: ${errorMessage}`);
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen  text-white  flex items-center justify-center">
        <p className="text-red-500 text-xl">
          {error || "No se pudo cargar la información del usuario"}
        </p>
      </div>
    );
  }

  const EncabezadosData = [
    { label: "Nombre", width: "250px" },
    { label: "ID", width: "200px" },
    { label: "Correo electrónico", width: "450px" },
    { label: "Plan", width: "200px" },
  ];

  const handleUserClick = (userId: string) => {
    router.push(`/pages/users/${userId}`);
  };

  return (
    <section className=" min-h-screen w-full text-white ">
      <div className="mb-4">
        <Buttons
          data="Atrás"
          onClick={() => router.back()}
          className="flex bg-transparent hover:bg-transparent text-white cursor-pointer"
        >
          <ChevronLeft className=" text-white" />
        </Buttons>
      </div>

      <div className="mb-8">
        <h1 className=" text-[32px] text-[#dff400] font-bold ">Entrenador</h1>
      </div>
      <div className=" flex mb-9">
        <TrainerInfoCard
          name={user.name}
          image={user.user_image}
          rating={user.rating}
          specialty={user.certificacion}
          price="$120.000"
          description={user.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1">
          <TrainerMovementChart />
        </div>
        <div className="col-span-1">
          <MonthlyRevenueChart />
        </div>
      </div>
      <h2 className="text-[16px] my-9 font-bold flex gap-3 ">
        Rutina diaria{" "}
        <span className="text-[#dff400] text-base">plan intermedio</span>
      </h2>
      {loadingUser ? (
        <p className="text-center text-gray-400">Cargando usuarios...</p>
      ) : (
        <div className="flex flex-col w-full gap-2">
          <TableList encabezado={EncabezadosData} data={data} columns={5} />
          <CardList encabezado={EncabezadosData} data={data} columns={5} onCardClick={handleUserClick} />
        </div>
      )}
      <div className="flex justify-center mt-8">
        {/* <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChange={setPaginaActual}
        /> */}
      </div>
    </section>
  );
}
