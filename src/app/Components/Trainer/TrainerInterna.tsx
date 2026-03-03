"use client";
import Loading from "@/app/Components/Loading/loading";
import Buttons from "@/app/Components/ui/Buttons";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrainerInfoCard from "../ui/profileTrainers";
import { CardList, TableList } from "../Table/TableList";
import TrainerMovementChart from "../ui/trainerMovementChart";
import MonthlyRevenueChart from "../ui/trainerBarChart";
import EditarTrinerModal from "./editarTriner"; // modal for editing trainer info

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
  certification?: string;
  description?: string;
  rating?: string;
  price?: number | string;
  specialty?: string;
}

export default function TrainerDashboard() {
  const [rutinasVisibles, setRutinasVisibles] = useState<Rutina[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;
  const router = useRouter();

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

  // fetch trainer info helper so we can call from effects and after updates
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
          certification: userData.certifications,
          description: userData.description,
          specialty: userData.specialty || "",
          price: userData.price ?? "",
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

  useEffect(() => {
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
      <div className=" flex mb-9 items-start">
        <TrainerInfoCard
          name={user.name}
          image={user.user_image}
          rating={user.rating}
          specialty={user.certification}
          price={user.price}
          description={user.description}
        />
        <button
          onClick={() => setShowEditModal(true)}
          className="ml-4 self-center px-4 py-2 bg-[#d4ff00] text-black font-semibold rounded-lg hover:brightness-110"
        >
          Editar
        </button>
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
      <EditarTrinerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        trainer={user}
        onUpdated={() => fetchTrainer()}
      />
    </section>
  );
}
