"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import type { ExerciseCardProps } from "../typeScript/exerciseType";

export default function ExerciseCard({
  image,
  title,
  series,
  rest,
}: ExerciseCardProps) {
  return (
    <div className="flex items-center  px-4 justify-around bg-[#282828] h-[148px] border-3 border-gray-600  w-[663.5px] rounded-md shadow-md gap-4 ">
      <div className="flex-shrink-0 w-[200px] h-[120px]  overflow-hidden rounded-xl  ">
        <Image
          src={image}
          alt={title}
          width={200}
          height={100}
          className="object-cover"
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col justify-center text-gray-300">
        <h2 className="text-2xl my-3 font-semibold text-[#D4FF00]">{title}</h2>

        <div className="text-xl   mt-1">
          <p>Cantidad de series: {series}</p>
          <p>Descanso entre series: {rest}</p>
        </div>
      </div>

      {/* Iconos */}
      <div className="flex  space-x-3">
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
