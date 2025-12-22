"use client";

import ExerciseCard from "@/app/Components/Exercise/ExerciseCard";
import Loading from "@/app/Components/Loading/loading";
import AccionBar from "@/app/Components/navBar/ActionBar";
import Buttons from "@/app/Components/ui/Buttons";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RutinaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [createExercise, setCreateExercise] = useState()

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const exerciseNameParam = searchParams.get("name");
  const exerciseName = exerciseNameParam
    ? decodeURIComponent(exerciseNameParam)
    : "";

    console.log(exerciseName);
    
  const [rutina, setRutina] = useState<unknown>(null);
  const [rutinaName, setRutinaName] = useState("");
  const router = useRouter()

  const [rutinaId, setRutinaId] = useState("");

  const [loading, setLoading] = useState(true);
  const obtenerRutina = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      const url = `https://api.timshell.co/api/routines/search-in-generated?fecha_rutina=${date}&user_id=${id}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (!response.ok) throw new Error("Error al obtener la rutina");

      const data = await response.json();
      // setRutinaName(data.response.routine_name);
      setRutinaName(data.routine_name);
      setRutinaId(data.rutina_id)
      setRutina(data?.response.ejercicios || data);
    } catch (error) {
      console.error("Error al obtener la rutina:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id && date && exerciseName) {
      obtenerRutina();
    }
  }, [id, date, exerciseName]);

  useEffect(() => {
    createExercise && router.push(
      `/pages/exercise/${id}/new?date=${date}&name=${encodeURIComponent(exerciseName)}&rutina=${rutinaId}`
    );

  }, [createExercise])

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        |<Loading></Loading>
      </section>
    );
  }

  if (!rutina) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p>No se encontró la rutina.</p>
      </section>
    );
  }



  return (
    <>
      <section className="min-h-screen text-white">
        <div className="mb-5">
          <Buttons
            data="Atrás"
            onClick={() => router.push(`/pages/users/${id}`)}
            className="flex bg-transparent hover:bg-transparent text-white cursor-pointer"
          >
            <ChevronLeft className=" text-white" />
          </Buttons>
        </div>
        <h2 className="text-[32px] mb-12 font-semibold text-[#D4FF00]">
          {rutinaName}
        </h2>

        <div className="grid gap-4 grid-cols-2">
          {Array.isArray(rutina) &&
            rutina.map((ejercicio: any, key: number) => (
              <ExerciseCard
                key={key}
                image={ejercicio?.thumbnail_url}
                idExerciseProps={ejercicio.exercise_id}
                title={ejercicio?.nombre_ejercicio}
                date={date}
                series={ejercicio?.Esquema?.Series}
                rest={ejercicio?.Esquema?.Descanso}
                rutina_id={rutinaId}
                update={() => obtenerRutina()}
              />
            ))}
        </div>

      </section>
      <AccionBar textButton="Agregar Ejercicio" useAccionState={setCreateExercise} accionState={createExercise}></AccionBar>
    </>
  );
}
