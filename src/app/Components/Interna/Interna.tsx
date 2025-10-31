"use client";
import { useEffect, useState } from "react";
import Inputs from "../Inputs/inputs";
import { RutinasCards } from "../ui/Cards";
import Dates from "../ui/Dates";
import Pagination from "../ui/Pagination";

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

export default function Interna() {
  const getSelection = () => {
    console.log("Rutina seleccionada");
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(5);
  const [rutinasVisibles, setRutinasVisibles] = useState<Rutina[]>(rutinas);

  useEffect(() => {
    setRutinasVisibles(rutinas);
  }, [paginaActual]);

  return (
    <section
      className="min-h-screen w-12/12 text-white p-6"
      style={{
        backgroundImage: "url('/8d9f842b-100a-4e7f-a537-bec51029f233.png')",
      }}
    >
      <h1 className="text-[16px] px-3 font-bold mb-8">Rutina diaria</h1>

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
        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChange={setPaginaActual}
        />
      </div>
    </section>
  );
}
