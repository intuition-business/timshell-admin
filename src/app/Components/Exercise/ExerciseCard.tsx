"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import type { ExerciseCardProps } from "../typeScript/exerciseType";
import { ConfirmDeleteExercise } from "../ModalConfirm/modalConfirm";

export default function ExerciseCard({
  image,
  title,
  date,
  series,
  rest,
  idExerciseProps,
  rutina_id,
  update
}: ExerciseCardProps) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const editar = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(
      `/pages/exercise/${id}/create?name=${title}&date=${date}&exercise=${idExerciseProps}`
    );
  };

  // --- NUEVA FUNCIÓN DE ELIMINAR ---
  const deleteExercise = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/delete-exercise?user_id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            rutina_id: rutina_id,
            fecha_rutina: date,
            exercise_id: idExerciseProps,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      update();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteExercise()
    setOpen(false);
  };

  return (
    <>
      <ConfirmDeleteExercise
        isOpen={open}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />

      <div
        className="col-span-1 grid grid-cols-4 items-center p-4 justify-around bg-[#282828] border-3 border-gray-600 rounded-lg shadow-md gap-4">
        <div className="overflow-hidden rounded-xl col-span-1 bg-gray-900 w-full h-full">
          {image && (
            <img
              src={`${image}`}
              alt={`${title}`}
              className="object-cover max-h-[120px] w-full"
            />
          )}
        </div>

        <div className="flex flex-col justify-center text-gray-300 col-span-2">
          <h2 className="text-2xl my-3 font-semibold text-[#D4FF00] line-clamp-1">
            {title}
          </h2>

          <div className="text-xl mt-1">
            <p>Cantidad de series: {series}</p>
            <p>Descanso entre series: {rest}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end col-span-1">
          <button
            onClick={editar}
            className="flex items-center p-2 justify-center w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-transparent hover:text-white transition cursor-pointer"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center p-2 justify-center w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-red-600 hover:text-white transition cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
