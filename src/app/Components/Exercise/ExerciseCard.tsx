"use client";

import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ExerciseCardProps } from "../typeScript/exerciseType";

export default function ExerciseCard({
  image,
  title,
  series,
  rest,
}: ExerciseCardProps) {
  const router = useRouter();

  const editar = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Navegar a la página de crear ejercicio con el mismo formato que usuarios
    router.push(
      `/pages/exercise/1/create?name=${encodeURIComponent(title || "")}`
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
      <div className="flex gap-3 col-span-1">
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition">
          <Edit className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-gray-900 hover:bg-red-200 transition">
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
