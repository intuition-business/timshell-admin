"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import { ExerciseUsersProps } from "../typeScript/exerciseType";
import Buttons from "../ui/Buttons";

export default function ExerciseUser({
  date,
  title,
  exercises,
  ruiner,
  status,
}: ExerciseUsersProps) {
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
      <Clock className="w-5 h-5 text-[#D4FF00]" />
    );

  return (
    <div className="flex my-4 items-center  border-3 border-gray-600 h-[98px] justify-between bg-[#282828] text-gray-300 w-full rounded-2xl shadow-md px-4 py-4 hover:shadow-lg transition">
      <div className=" flex  gap-2 items-center ">
        <div className="flex flex-col items-center justify-center bg-[#D4FF00] text-black rounded-xl px-4 py-3 font-bold w-[100px]">
          <span className="text-xs uppercase tracking-widest">OCT</span>
          <span className="text-lg">{date}</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
        </div>
      </div>
      {/* Información principal */}
      <div className="flex flex-col w-[300px] px-4">
        <ul className="text-base text-gray-300 list-disc list-inside space-y-1">
          {exercises.map((exs, i) => (
            <li key={i}>{exs}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col w-[300px] px-4">
        <ul className="text-base text-gray-300 list-disc list-inside space-y-1">
          {ruiner.map((rus, i) => (
            <li key={i}>{rus}</li>
          ))}
        </ul>
      </div>
      {/* Estado */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 select-none">
          {statusIcon}
          <span className={`text-xl font-medium ${statusColor}`}>{status}</span>
        </div>
      </div>

      {/* Botón */}
      <div className="px-4">
        <Buttons
          data="Ver detalles"
          className="border-gray-500 bg-gray-200 hover:bg-gray-700"
        />
      </div>
    </div>
  );
}
