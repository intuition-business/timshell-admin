"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock, ShieldAlert } from "lucide-react";
import React from "react";
import type { RutinasGridProps } from "../typeScript/uiCardsType";
import { useRouter } from "next/navigation";

export const RutsCards: React.FC<RutinasGridProps> = ({ rutinas, user_id, onVerDetalles }) => {
  const router = useRouter();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rutinas.map((rutina, index) => {
         const fechaUTC = rutina.fecha?.replace("Z", "") || ""; 
         const fechaLocal = fechaUTC ? new Date(fechaUTC) : null;

        const fechaFormateada = fechaLocal
          ? format(fechaLocal, "yyyy-MM-dd")
          : "";

        const fechaVisible = fechaLocal
          ? format(fechaLocal, "dd/MM", { locale: es })
          : "Sin fecha";


        return (
          <div
            key={index}
            className="relative bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(223,244,0,0.2)] transition-all duration-300 flex flex-col justify-between"
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

            {/* Contenido principal */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-white">
                {rutina.nombre || "Rutina sin nombre"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">Fecha: {fechaVisible}</p>

              <ul className="text-sm text-gray-200 mt-4 space-y-1">
                {rutina.ejercicios?.slice(0, 6).map((ej, i) => (
                  <li key={i}>• {ej.nombre_ejercicio}</li>
                ))}
              </ul>
            </div>

            {/* Botón */}
            <div className="mt-6">
              <button
                 onClick={() => {
                   const cleanName = rutina.nombre ? encodeURIComponent(rutina.nombre).replace(/%20/g, ' ') : '';
                   router.push(`/pages/users/${user_id}/${fechaFormateada}?name=${cleanName}`);
                 }}

                className="w-full border cursor-pointer border-[#444] text-white text-[15px] font-semibold py-2 rounded-lg hover:bg-[#DFF400] hover:text-black transition"
              >
                Ver detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CardsGrid = { RutsCards };
export default CardsGrid;
