"use client";
import Inputs from "../Inputs/inputs";
import { RutinasCards } from "../ui/Cards";
import Dates from "../ui/Dates";

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
];

export default function Interna() {
  const getSelection = () => {
    // El componente RutinasCards espera un handler sin argumentos,
    // aquí puedes añadir la lógica necesaria cuando se selecciona una rutina.
    console.log("Rutina seleccionada");
  };

  return (
    <section className="min-h-screen  w-12/12  text-white p-6">
      <h1 className="text-[16px] px-3 font-bold mb-8">Rutina diaria</h1>

      <div className="flex flex-col items-center bg-gray- rounded-lg p-4 mb-8">
        <div className=" flex gap-3 px-3 w-full   ">
          <div className="">
            <Inputs.SearchInput placeholder="Buscar..." />
          </div>
          <div className="">
            <Inputs.SelectInput
              placeholder="Tipo de plan"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
          </div>
          <div className="">
            <Inputs.SelectInput
              placeholder="Ordenar"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
          </div>
        </div>
        <div className="m- p-4  text-white  flex flex-col w-full   ">
          <Dates />
        </div>
      </div>

      <div className="grid mt-20  justify-center">
        <RutinasCards rutinas={rutinas} onSelect={getSelection} />
      </div>
    </section>
  );
}
