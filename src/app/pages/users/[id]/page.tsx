"use client";
import ProgressCard from "@/app/Components/Interna/components/ProgressCard";
import Loading from "@/app/Components/Loading/loading";
import { RutinasCards } from "@/app/Components/ui/Cards";
import Dates from "@/app/Components/ui/Dates";
import ProfileCard from "@/app/Components/ui/ReusableProfile";
import UserMovementChart from "@/app/Components/ui/UserMovementChart";
import WeightChart from "@/app/Components/ui/WeightChart";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Inputs from "../../../Components/Inputs/inputs";

interface Rutina {
  grupo: string;
  estado: "Completado" | "Fallida" | "Pendiente";
  fecha: string;
  ejercicios: string[];
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
}

const rutinas: Rutina[] = [
  {
    grupo: "Cuádriceps y Glúteo",
    estado: "Completado",
    fecha: "3/10",
    ejercicios: [
      "Extensión de cadera (polea)",
      "Sentadilla Smith",
      "Prensa",
      "Hip Thrust Máquina",
      "Front Squat",
    ],
  },
  {
    grupo: "Bíceps",
    estado: "Fallida",
    fecha: "4/10",
    ejercicios: [
      "Curl de bíceps alternado",
      "Curl tipo martillo",
      "Curl concentrado",
      "Curl con barra recta o EZ",
      "Máquina de bíceps",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
  {
    grupo: "Espalda",
    estado: "Completado",
    fecha: "6/10",
    ejercicios: [
      "Dominadas",
      "Remo con barra",
      "Jalones al pecho",
      "Remo en máquina",
      "Face Pulls",
    ],
  },
  {
    grupo: "Pecho",
    estado: "Fallida",
    fecha: "7/10",
    ejercicios: [
      "Press de banca",
      "Aperturas con mancuernas",
      "Fondos",
      "Press de banca inclinado",
      "Pec Deck",
    ],
  },
  {
    grupo: "Hombros",
    estado: "Completado",
    fecha: "8/10",
    ejercicios: [
      "Press militar",
      "Elevaciones laterales",
      "Elevaciones frontales",
      "Pájaros",
      "Press Arnold",
    ],
  },
  {
    grupo: "Hombros",
    estado: "Completado",
    fecha: "8/10",
    ejercicios: [
      "Press militar",
      "Elevaciones laterales",
      "Elevaciones frontales",
      "Pájaros",
      "Press Arnold",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
  {
    grupo: "Abdominales",
    estado: "Pendiente",
    fecha: "5/10",
    ejercicios: [
      "Crunch abdominal clásico",
      "Toques de talón",
      "Russian Twists",
      "Reverse Crunch",
      "Ab Wheel Rollouts",
    ],
  },
];

export default function Pages() {
  const [rutinasVisibles, setRutinasVisibles] = useState<Rutina[]>(rutinas);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); // obtiene los params dinámicos
  const { id } = params; // tu [id] dinámico

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
        label: "Altas mensuales vvvvvvvvvvvvvvv",
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
  const getSelection = (rutina: Rutina) => {
    console.log("Rutina seleccionada:", rutina);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("ID:", id);
      console.log(
        "URL:",
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users/${id}`
      );

      if (!token) {
        setError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      try {
        console.log("Iniciando fetch...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users`,
          {
            headers: { "x-access-token": token },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        console.log("Respuesta status:", res.status);

        if (!res.ok) {
          setError(`Error: ${res.status} - Usuario no encontrado`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        console.log("Datos recibidos:", json);

        if (json.data) {
          // Buscar el usuario específico por ID en la lista
          const userData = json.data.find(
            (user: any) => user.id?.toString() === id
          );

          if (userData) {
            setUser({
              id: userData.id?.toString() || "",
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              plan_id: userData.plan_id || null,
              plan_name: userData.plan_name || "",
              trainer_name: userData.trainer_name || "Sin entrenador",
              trainer_image: userData.trainer_image || "",
              user_image: userData.user_image || "",
            });
          } else {
            setError(`Usuario con ID ${id} no encontrado`);
          }
        } else {
          setError("No se encontraron datos del usuario");
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

    fetchUser();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  // if (error || !user) {
  //   return (
  //     <div className="min-h-screen w-12/12 text-white p-6 flex items-center justify-center">
  //       <p className="text-red-500 text-xl">
  //         {error || "No se pudo cargar la información del usuario"}
  //       </p>
  //     </div>
  //   );
  // }
  return (
    <section className="min-h-screen w-12/12 text-white p-6">
      <h1 className=" px-3 text-3xl text-[#dff400] font-bold ">Usuario</h1>
      <div className=" flex py-3">
        <ProfileCard
          name={user.name || "sin nombre"}
          role={user.plan_name || "Sin plan"}
          imageUrl={user.user_image || "/default-avatar.png"}
        />
      </div>
      <div className="w-full py-5 flex justify-cente items-center">
        <ProgressCard weight={79} variation={1.2} height={1.78} />
      </div>

      <div className="flex bg-[#282828] justify-between gap-6 p-6">
        <div className="w-4/12 ">
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-white text-sm">Subida de peso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-white text-sm">Bajada de peso</span>
            </div>
          </div>
          <WeightChart
            dataPoints={weightData}
            labels={weightLabels}
            title="Evolución de tu peso"
          />
        </div>
        <div className="w-4/12 bg-[#282828] rounded-2xl shadow-lg p-6">
          <h3 className="text-[#D4FF00] font-semibold mb-4 text-xl">
            Movimiento de usuarios
          </h3>
          <UserMovementChart />
        </div>
      </div>
      <h2 className="text-[16px] px-3 font-bold mb-8">Rutina diaria</h2>
      <div className="flex flex-col rounded-lg p-4 mb-8 backdrop-blur-sm">
        <div className="flex gap-3 px-3 w-[1011px]">
          <Inputs.SearchInput placeholder="Buscar..." />
          <Inputs.InputDate placeholder="Fecha" />
          <Inputs.SelectInput
            placeholder="Estatus"
            options={["Opción 1", "Opción 2"]}
            IconChevronDown
          />
        </div>

        <div className="p-4 text-white flex w-full">
          <Dates />
        </div>
      </div>
      <div className="grid mt-2 w-12/12 px-8">
        <RutinasCards rutinas={rutinasVisibles} />
      </div>
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
