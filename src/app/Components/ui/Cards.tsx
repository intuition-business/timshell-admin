"use client";

import { Check, Clock, ShieldAlert } from "lucide-react"; // iconos
import React from "react";
import type { RutinasGridProps } from "../typeScript/cardsType";

export const RutinasCards: React.FC<RutinasGridProps> = ({
  rutinas,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-4 gap-8">
      {rutinas.map((rutina, i) => {
        const estadoStyles =
          rutina.estado === "Completado"
            ? "bg-[#DFF400] text-black"
            : rutina.estado === "Fallida"
            ? "bg-red-500 text-white"
            : rutina.estado === "Pendiente"
            ? "bg-gray-300 text-gray-800"
            : "bg-yellow-400 text-black";

        const Icon =
          rutina.estado === "Completado"
            ? Check
            : rutina.estado === "Fallida"
            ? ShieldAlert
            : rutina.estado === "Pendiente"
            ? Clock
            : Clock;

        return (
          <div
            key={i}
            className="relative bg-gradient-to-b p from-zinc-900 to-zinc-800 shadow-[0_0_15px_rgba(223,244,0,0.2)] rounded-2xl flex flex-col justify-between w-[436px] h-[314px]"
          >
            <div
              className={`absolute top-0 right-0 flex w-[105px] h-[34px] items-center gap-2 px-3 py-1 rounded-tr-2xl rounded-bl-2xl text-sm font-semibold ${estadoStyles}`}
            >
              <Icon size={18} strokeWidth={3} />
              <span>{rutina.estado}</span>
            </div>

            <div className=" p-4">
              <h2 className="text-[20px] font-bold text-white">
                {rutina.grupo}
              </h2>
              <p className="text-[18px] text-gray-400 mb-5">
                Fecha: {rutina.fecha}
              </p>

              <ul className="text-[16px] text-gray-300 space-y-1 mb-5">
                {rutina.ejercicios.slice(0, 4).map((ej, idx) => (
                  <li key={idx}>• {ej}</li>
                ))}
              </ul>
            </div>

            <div className="w-full p-[16px] flex justify-center">
              <button
                className="border border[#d1d1d1] w-full rounded text-gray-50 text-[18px] font-semibold px-4 py-2 transition hover:bg-amber-50 hover:text-black"
                onClick={() => onSelect?.(rutina)}
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

const CardsGrid = { RutinasCards };
export default CardsGrid;
