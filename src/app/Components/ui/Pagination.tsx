"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "../typeScript/uiPaginatiType";


export default function Pagination({
  paginaActual,
  totalPaginas,
  onChange,
}: PaginationProps) {
  if (totalPaginas <= 5) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onChange(1)}
        disabled={paginaActual === 1}
        className={`w-8 h-8 flex justify-center items-center rounded-md transition ${
          paginaActual === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#333]"
        }`}
      >
        <div className="flex items-center -space-x-1">
          <ChevronLeft size={16} />
          <ChevronLeft size={16} />
        </div>
      </button>

      <button
        onClick={() => onChange(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className={`w-8 h-8 flex justify-center items-center rounded-md transition ${
          paginaActual === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#333]"
        }`}
      >
        <ChevronLeft size={18} />
      </button>

      {[...Array(totalPaginas)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-8 h-8 text-[16px] rounded-md flex justify-center items-center transition ${
            paginaActual === i + 1
              ? "bg-[#dff400] text-black font-bold"
              : "bg-[#222] border border-b-gray-600 hover:bg-[#333]"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className={`w-8 h-8 flex justify-center items-center rounded-md transition ${
          paginaActual === totalPaginas
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#333]"
        }`}
      >
        <ChevronRight size={18} />
      </button>

      <button
        onClick={() => onChange(totalPaginas)}
        disabled={paginaActual === totalPaginas}
        className={`w-8 h-8 flex justify-center items-center rounded-md transition ${
          paginaActual === totalPaginas
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#333]"
        }`}
      >
        <div className="flex items-center -space-x-1">
          <ChevronRight size={16} />
          <ChevronRight size={16} />
        </div>
      </button>
    </div>
  );
}
