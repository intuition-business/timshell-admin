"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import Buttons from "../ui/Buttons";

interface ExerciseRowProps {
  date: string;
  title: string;
  exercises: string[];
  status: "Completado" | "Fallida" | "Pendiente";
}

export default function ExerciseRow({
  date,
  title,
  exercises,
  status,
}: ExerciseRowProps) {
  const [checked, setChecked] = useState(status === "Completado");

  // Color dinámico según el estado
  const statusColor =
    status === "Completado"
      ? "text-green-400"
      : status === "Fallida"
      ? "text-red-400"
      : "text-yellow-400";

  const statusIcon =
    status === "Completado" ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : status === "Fallida" ? (
      <XCircle className="w-5 h-5 text-red-400" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-400" />
    );

  return (
    <div className="flex items-center justify-between bg-[#282828] text-white w-full rounded-2xl shadow-md px-4 py-4 hover:shadow-lg transition">
      ... {/* Fecha */}
      <div className="flex flex-col items-center justify-center bg-yellow-400 text-black rounded-xl px-4 py-3 font-bold w-[100px]">
        <span className="text-xs uppercase tracking-widest">OCT</span>
        <span className="text-lg">{date}</span>
      </div>
      {/* Información principal */}
      <div className="flex flex-col w-[300px] px-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
          {exercises.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
      {/* Estado */}
      <div className="flex flex-col items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="accent-yellow-400 w-4 h-4"
          />
          <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          {statusIcon}
        </label>
      </div>
      {/* Botón */}
      <div className="px-4">
        <Buttons
          data="Ver detalles"
          className="border-gray-500 text-gray-200 hover:bg-gray-700"
        />
      </div>
    </div>
  );
}
