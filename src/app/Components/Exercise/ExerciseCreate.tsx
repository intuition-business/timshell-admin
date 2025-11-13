"use client";

import { useState } from "react";
import Buttons from "../ui/Buttons";

interface ExerciseCreateProps {
  exerciseName?: string | null;
}

export default function ExerciseCreate({ exerciseName }: ExerciseCreateProps) {
  const [title, setTitle] = useState(exerciseName || "Extensión de cadera (polea)");
  const [description, setDescription] = useState(
    "Inclínate hacia adelante y flexiona la cadera, rodilla semiflexionada. Busca llevar el talón hacia atrás y no hacia arriba."
  );
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔥 Aquí se enviarán los datos al backend (API POST/PUT)
    console.log({
      title,
      description,
      file,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1F1F1F] text-white p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00]">
        {exerciseName ? `Editar: ${exerciseName}` : "Crear nuevo ejercicio"}
      </h2>

      {/* Campo Título */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
        />
      </div>

      {/* Campo Descripción */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00] resize-none"
        />
      </div>

      {/* Subir archivo */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Subir archivo
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-400 bg-[#2B2B2B] rounded-lg border border-gray-700 cursor-pointer focus:outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#D4FF00] file:text-black hover:file:bg-[#cbe000]"
          />
          {file && (
            <span className="text-xs text-gray-400 truncate max-w-[200px]">
              {file.name}
            </span>
          )}
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <Buttons
          data="Guardar cambios"
          type="submit"
          className="bg-[#D4FF00] text-black font-bold hover:bg-[#cbe000]"
        />
      </div>
    </form>
  );
}
