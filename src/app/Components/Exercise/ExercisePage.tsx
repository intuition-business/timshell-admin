"use client";

import { useState } from "react";
import ExerciseEditForm from "./ExerciseCreateForm";
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
    </div>
  );
}
