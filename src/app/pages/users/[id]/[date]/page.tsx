"use client";

import ExerciseCard from "@/app/Components/Exercise/ExerciseCard";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RutinaPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const exerciseNameParam = searchParams.get("name");
  const exerciseName = exerciseNameParam
    ? decodeURIComponent(exerciseNameParam)
    : "";

  const [rutina, setRutina] = useState<unknown>(null);
  const [rutinaName, setRutinaName] = useState("");
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerRutina = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const url = `https://api.timshell.co/api/routines/search-in-generated?fecha_rutina=${date}&routine_name=${exerciseName}&user_id=${id}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) throw new Error("Error al obtener la rutina");

        const data = await response.json();
        setRutinaName(data.response.routine_name);
        setRutina(data?.response.ejercicios || data);
      } catch (error) {
        console.error("Error al obtener la rutina:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id && date && exerciseName) {
      obtenerRutina();
    }
  }, [id, date, exerciseName]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando rutina...</p>
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
    <section className="min-h-screen text-white">
      <h2 className="text-[32px] mb-12 font-semibold text-[#D4FF00]">
        pagina{rutinaName}
      </h2>
      <div className="grid gap-4 grid-cols-2">
        {Array.isArray(rutina) &&
          rutina.map((ejercicio: any, key: number) => (
            <ExerciseCard
              key={key}
              image={ejercicio?.thumbnail_url}
              title={ejercicio?.nombre_ejercicio}
              date={date}
              series={ejercicio?.Esquema?.Series}
              rest={ejercicio?.Esquema?.Descanso}
            />
          ))}
      </div>
    </section>
  );
}
