"use client";


import ExerciseCard from "@/app/Components/Exercise/ExerciseCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RutinaPage() {
  const { id, exercise } = useParams();
  const [rutina, setRutina] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerRutina = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(
          `https://api.timshell.co/api/routines/ia/?user_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Buscar la rutina específica por ID o índice
          const rutinaEncontrada = data.response[exercise as string];
          setRutina(rutinaEncontrada);
        }
      } catch (error) {
        console.error("Error al obtener la rutina:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && exercise) {
      obtenerRutina();
    }
  }, [id, exercise]);

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
        <p>
          No se encontró la rutina se muestra esta pagina edferwuigergierjguir
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen text-white p-6">
      <ExerciseCard />
    </section>
  );
}
