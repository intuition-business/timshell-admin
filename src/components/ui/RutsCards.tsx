"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock, ShieldAlert } from "lucide-react";
import React from "react";
import type { RutinasGridProps } from "@/types/uiCardsType";
import { useRouter } from "next/navigation";

export const RutsCards: React.FC<RutinasGridProps> = ({ rutinas, user_id, onVerDetalles }) => {
  const router = useRouter();
  void onVerDetalles;

  const getDatePart = (value?: string) => {
    if (!value) return "";
    return value.split("T")[0];
  };

  const parseLocalDate = (datePart: string) => {
    const [year, month, day] = datePart.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#DFF400] text-black";
      case "pending":
        return "bg-white text-black";
      default:
        return "bg-red-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check size={16} />;
      case "pending":
        return <Clock size={16} />;
      default:
        return <ShieldAlert size={16} />;
    }
  };

  // Group routines by week number
  const rutinasPorSemana = rutinas.reduce<Record<number, typeof rutinas>>((acc, rutina) => {
    const semana = rutina.semana ?? 1;
    if (!acc[semana]) acc[semana] = [];
    acc[semana].push(rutina);
    return acc;
  }, {});

  const semanas = Object.keys(rutinasPorSemana)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-6">
      {semanas.map((semana) => {
        const rutinasDeEstaSemana = rutinasPorSemana[semana];
        const primeraFecha = getDatePart(rutinasDeEstaSemana[0]?.fecha);
        const fechaInicioLocal = primeraFecha ? parseLocalDate(primeraFecha) : null;
        const fechaInicioSemana = fechaInicioLocal
          ? format(fechaInicioLocal, "dd/MMM", { locale: es })
          : "";

        return (
          <div key={semana}>
            {/* Week header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-base">
                Semana {semana}
                {fechaInicioSemana && (
                  <span className="text-gray-400 font-normal ml-2 text-sm">
                    - {fechaInicioSemana}
                  </span>
                )}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rutinasDeEstaSemana.map((rutina, index) => {
                const fechaBase = getDatePart(rutina.fecha);
                const fechaLocal = fechaBase ? parseLocalDate(fechaBase) : null;

                const fechaFormateada = fechaLocal
                  ? format(fechaLocal, "yyyy-MM-dd")
                  : "";

                const fechaVisible = fechaLocal
                  ? format(fechaLocal, "dd/MM", { locale: es })
                  : "Sin fecha";

                return (
                  <div
                    onClick={
                      rutina.status !== "completed"
                        ? () => {
                          const cleanName = rutina.nombre
                            ? encodeURIComponent(rutina.nombre).replace(/%20/g, " ")
                            : "";
                          router.push(
                            `/users/${user_id}/${fechaFormateada}?name=${cleanName}`
                          );
                        }
                        : undefined
                    }
                    key={index}
                    className={`relative group bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(223,244,0,0.2)] transition-all duration-300 flex flex-col justify-between ${rutina.status !== "completed" ? "cursor-pointer" : "cursor-default"
                      }`}
                  >
                    {/* Badge de estado */}
                    <div
                      className={`absolute top-0 right-0 flex items-center gap-2 px-3 py-1 rounded-tr-2xl rounded-bl-2xl text-sm font-semibold ${getStatusStyle(
                        rutina.status
                      )}`}
                    >
                      {getStatusIcon(rutina.status)}
                      <span>
                        {rutina.status === "completed"
                          ? "Completada"
                          : rutina.status === "pending"
                            ? "Pendiente"
                            : "Sin estado"}
                      </span>
                    </div>

                    {/* Badge día de la semana */}
                    {fechaLocal && (
                      <div className="absolute top-0 left-0 px-3 py-1 rounded-tl-xl rounded-br-xl bg-[#dff400] text-black text-xs font-bold uppercase tracking-wide">
                        {format(fechaLocal, "EEEE", { locale: es })}
                      </div>
                    )}

                    {/* Contenido principal */}
                    <div className="mt-5">
                      <h2 className="text-base font-bold text-white">
                        {rutina.nombre || "Rutina sin nombre"}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">Fecha: {fechaVisible}</p>

                      <ul className="text-sm text-gray-200 mt-3 space-y-1">
                        {rutina.ejercicios?.slice(0, 6).map((ej, i) => (
                          <li key={i}>• {ej.nombre_ejercicio}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Botón */}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          if (rutina.status === "completed") return;

                          const cleanName = rutina.nombre
                            ? encodeURIComponent(rutina.nombre).replace(/%20/g, " ")
                            : "";

                          router.push(`/users/${user_id}/${fechaFormateada}?name=${cleanName}`);
                        }}
                        disabled={rutina.status === "completed"}
                        className="w-full border border-[#444] text-white text-sm font-semibold py-1.5 rounded-lg group-hover:bg-[#DFF400] group-hover:text-black transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {rutina.status === "completed" ? "completado" : "Ver detalles"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CardsGrid = { RutsCards };
export default CardsGrid;
