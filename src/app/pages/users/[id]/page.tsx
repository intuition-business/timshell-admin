"use client";
import ProgressCard from "@/app/Components/Interna/components/ProgressCard";
import { RutinasCards } from "@/app/Components/ui/Cards";
import Dates from "@/app/Components/ui/Dates";
import ProfileCard from "@/app/Components/ui/ReusableProfile";
import { useState } from "react";
import Inputs from "../../../Components/Inputs/inputs";

interface Rutina {
  grupo: string;
  estado: "Completado" | "Fallida" | "Pendiente";
  fecha: string;
  ejercicios: string[];
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
  // const params = useParams(); // obtiene los params dinámicos
  // const { id } = params; // tu [id] dinámico

  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users/${id}`,
  //         {
  //           headers: { "x-access-token": token },
  //         }
  //       );

  //       if (!res.ok) {
  //         console.error("Usuario no encontrado");
  //         return;
  //       }

  //       const json = await res.json();

  //       if (json.data) {
  //         setUser({
  //           id: json.data.id,
  //           name: json.data.name,
  //           plan: json.data.plan_name,
  //           userImage: json.data.user_image,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //     }
  //   };

  //   fetchUser();
  // }, [id]);
  // if (!user) {
  //   return <p>Cargando usuario...</p>;
  // }
  return (
    <section
      className="min-h-screen w-12/12 text-white p-6"
      style={{
        backgroundImage: "url('/8d9f842b-100a-4e7f-a537-bec51029f233.png')",
      }}
    >
      <h1 className=" px-3 text-3xl text-[#dff400] font-bold ">Usuario</h1>
      <div className=" flex items-center  py-3">
        <ProfileCard
          name="Sebastián Morales"
          role="Plan Intermedio"
          imageUrl="https://randomuser.me/api/portraits/men/45.jpg"
        />
      </div>
      <div className="w-full py-5 flex justify-cente items-center">
        <ProgressCard weight={79} variation={1.2} height={1.78} />
      </div>
      <p className="text-xl">
        ID del usuario seleccionado:{" "}
        <span className="text-[#dff400]">{id}</span>
      </p>
      <div className="flex flex-col p-6 max-w-2xl  gap-5">
        <p className="text-1xl text-[#dff400]">Evolución de tu peso</p>
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
        <RutinasCards rutinas={rutinasVisibles} onSelect={getSelection} />
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
