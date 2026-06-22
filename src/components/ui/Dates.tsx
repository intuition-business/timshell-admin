"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Dates() {
  const fecha = new Date();

  const mes = fecha.toLocaleString("es-ES", { month: "long" });

  const años = Array.from({ length: 10 }, (_, i) => 2021 + i); // 2021–2030

  const [añoSeleccionado, setAñoSeleccionado] = useState(fecha.getFullYear());

  return (
    <div className="flex border-b border-[#ffff]  justify-between  items-center gap- ">
      <p className="relative flex text[20px]">{mes}</p>

      <div className="relative  w-full">
        <select
          value={añoSeleccionado}
          onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
          className="appearance-none w-full bg-[#1A1A1A] text-gray-200 text-lg rounded-lg py-2 px-4  focus:outline-none focus:ring-2 "
        >
          {años.map((año) => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
}
