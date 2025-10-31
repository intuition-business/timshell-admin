"use client";

import { ChevronRight } from "lucide-react";

interface PaginationProps {
  paginaActual: number;
  totalPaginas: number;
  onChange: (nuevaPagina: number) => void;
}

export default function Pagination({
  paginaActual,
  totalPaginas,
  onChange,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onChange(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="transition"
      ></button>

      {[...Array(totalPaginas)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-8 h-8 text-[18px] rounded-md transition ${
            paginaActual === i + 1
              ? "bg-[#dff400] text-black font-bold"
              : "bg-[#222] border border-b-gray-600"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPaginas, paginaActual + 2))}
        disabled={paginaActual === totalPaginas}
        className="  "
      >
        <ChevronRight />
      </button>
    </div>
  );
}
