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
    console.log({ title, description, file });
    onClose(); // Simula guardar y cerrar
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1F1F1F] text-white p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#D4FF00]">
          {exercise ? "Editar ejercicio" : "Crear nuevo ejercicio"}
        </h2>
        <Buttons
          data="Cerrar"
          onClick={onClose}
          className="bg-gray-700 text-white font-medium hover:bg-gray-600"
        />
      </div>

      {/* Título */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] resize-none"
        />
      </div>

      {/* Archivo */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Subir archivoSSS
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-gray-400 bg-[#2B2B2B] rounded-lg border border-gray-700 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#D4FF00] file:text-black hover:file:bg-[#cbe000]"
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
  );
}
