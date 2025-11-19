"use client";

import { useState } from "react";
import ExerciseEditForm from "./ExerciseEditarForm";
// import ExerciseCreate from "./ExerciseCreate";

export default function ExercisePage() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const exercises = [
    {
      id: 1,
      title: "Extensión de cadera (polea)",
      description:
        "Inclínate hacia adelante, rodilla semiflexionada y lleva el talón hacia atrás.",
      category: "Glúteo",
    },
    {
      id: 2,
      title: "Prensa",
      description:
        "Empuja la plataforma con las piernas manteniendo la espalda fija.",
      category: "Glúteo",
    },
  ];

  const filtered = exercises.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Función para abrir el formulario de edición
  const handleEdit = (exercise: any) => {
    setSelectedExercise(exercise);
    setEditing(true);
  };

  // 🔹 Función para crear nuevo
  const handleCreate = () => {
    setSelectedExercise(null);
    setEditing(true);
  };

  // 🔹 Cerrar formulario
  const handleCloseForm = () => {
    setEditing(false);
    setSelectedExercise(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 ">

      <div className="">
        <ExerciseEditForm onClose={handleCloseForm} exercise={selectedExercise} />
      </div>
      <div className=""></div>

      {/* <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
          <h1 className="text-2xl font-semibold">Cuádriceps y Glúteo</h1>
        </div>
        <div className="flex gap-2">
          <Buttons
            data="Crear nuevo ejercicio"
            onClick={handleCreate}
            className="bg-[#D4FF00] text-black font-bold px-4 py-2 rounded-xl hover:bg-[#bde600]"
          />
          <Buttons
            data="Cerrar"
            className="bg-gray-700 text-white font-medium px-4 py-2 rounded-xl hover:bg-gray-600"
          />
        </div>
      </div>

      {/* BUSCADOR 
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#2B2B2B] w-full text-white pr-10 pl-4 py-3 rounded-lg focus:outline-none"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] w-5 h-5" />
      </div> */}

      {/* LISTA DE EJERCICIOS */}
      {/* <section className="grid gap-4">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="bg-[#1F1F1F] rounded-2xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-lg font-semibold">{ex.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{ex.description}</p>
              <p className="text-xs text-[#D4FF00] mt-1">
                Categoría: {ex.category}
              </p>
            </div>
            <Buttons
              data="Editar"
              onClick={() => handleEdit(ex)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
            >
              <Edit3 className="w-4 h-4" />
            </Buttons>
          </div>
        ))}
      </section> */}


    </div>
  );
}
