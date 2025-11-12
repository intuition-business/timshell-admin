"use client";

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#dff400] mb-2">
          {rutina.nombre || "Rutina sin nombre"}
        </h1>
        <p className="text-gray-400 mb-8">
          Fecha:{" "}
          {rutina.fecha
            ? new Date(rutina.fecha).toLocaleDateString()
            : "Sin fecha"}
        </p>

        <div className="space-y-6">
          {rutina.ejercicios?.map((ejercicio: any, index: number) => (
            <div
              key={index}
              className="flex items-center px-4 justify-around bg-[#282828] h-[148px] border-3 border-gray-600 w-full rounded-md shadow-md gap-4"
            >
              <div className="flex-shrink-0 w-[200px] h-[120px] overflow-hidden rounded-xl bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">Imagen</span>
              </div>

              <div className="flex flex-col justify-center text-gray-300 flex-1">
                <h2 className="text-2xl my-3 font-semibold text-[#D4FF00]">
                  {ejercicio.nombre_ejercicio}
                </h2>

                <div className="text-xl mt-1">
                  <p>
                    Cantidad de series: {ejercicio.Esquema?.Series || "N/A"}
                  </p>
                  <p>
                    Descanso entre series:{" "}
                    {ejercicio.Esquema?.Descanso || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-gray-900 hover:bg-red-200 transition">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
