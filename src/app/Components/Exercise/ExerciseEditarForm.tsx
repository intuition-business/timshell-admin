"use client";

import { useState } from "react";
import Buttons from "../ui/Buttons";

interface Props {
  onClose: () => void;
  exercise?: {
    title: string;
    description: string;
    category: string;
  } | null;
}

export default function ExerciseEditForm({ onClose, exercise }: Props) {
  const [title, setTitle] = useState(exercise?.title || "");
  const [description, setDescription] = useState(exercise?.description || "");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 w-full border">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#D4FF00]">
            {exercise ? "Editar ejercicio" : "Crear nuevo ejercicio"}
          </h2>
          {/* <Buttons
          data="Cerrar"
          onClick={onClose}
          className="bg-gray-700 text-white font-medium hover:bg-gray-600"
        /> */}
        </div>

        {/* Título */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-300">Título</label>
          <input
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
            className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
          />
        </div>
        {/* Archivo */}
        <div className="flex justify-center h-[45rem] border-2 border-dotted border-[#D4FF00]  items-center   ">
          <label
            htmlFor="file"
            className="flex colns gap-2 text-gray-600 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-9 h-9 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5v-9m0 0L8.25 11.25M12 7.5l3.75 3.75M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
              />
            </svg>
            <span>Subir archivo</span>
          </label>

          <input
            id="file"
            type="file"
            onChange={(e) => {setFile(e.target.files?.[0] || null)}}
            className="hidden"
          />
        </div>
        {/* Descripción */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
            rows={4}
            className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] resize-none"
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <Buttons
            data={exercise ? "Guardar cambios" : "Crear ejercicio"}
            type="submit"
            className="bg-[#D4FF00] text-black font-bold hover:bg-[#cbe000]"
          />
        </div>
      </form>
    </div>
  );
}
