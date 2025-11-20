"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { ExerciseCardProps } from "../typeScript/exerciseType";

export default function ExerciseCard({
  image,
  title,
  date,
  series,
  rest,
}: ExerciseCardProps) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const editar = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Navegar a la página de crear ejercicio con todos los datos necesarios
    const params = new URLSearchParams({
      name: encodeURIComponent(title || ""),
    });

    router.push(
      `/pages/exercise/${id}/create?name=${title?.toString()}&date=${date}`
    );
  };

  return (
    <div
      className="col-span-1  grid grid-cols-4 items-center  p-4 justify-around bg-[#282828] border-3 border-gray-600 rounded-lg shadow-md gap-4"
      onClick={editar}
    >
      <div className="overflow-hidden rounded-xl col-span-1 bg-gray-900 w-full h-full">
        {image ? (
          <img
            src={`${image}`}
            alt={`${title}`}
            className="object-cover max-h-[120px] w-full"
          />
        ) : (
          ""
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-col justify-center text-gray-300 col-span-2">
        <h2 className="text-2xl my-3 font-semibold text-[#D4FF00] line-clamp-1">
          {title}
        </h2>

        <div className="text-xl   mt-1">
          <p>Cantidad de series: {series}</p>
          <p>Descanso entre series: {rest}</p>
        </div>
      </div>

      {/* Iconos */}
      <div className="flex gap-3 justify-end col-span-1">
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-transparent hover:text-white transition">
          <Pencil className="w-5 h-5" />
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 hover:text-red-600 transition">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
