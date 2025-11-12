"use client";
import { useState } from "react";
import InputsModule from "../Inputs/inputs";
import ReusableExercise from "../ui/ReusableExercise";
import ReusableModal from "../ui/ReusableModal";
// import Modal from "./Modal";
// import ReusableCard from "./ReusableCard";

export default function ExerciseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const data = [
    {
      image: "https://i.pravatar.cc/100?img=17",
      title: "Sentadillas",
      description: "Categoría: Glúteo",
    },
    {
      image: "https://i.pravatar.cc/100?img=16",
      title: "Flexiones",
      description: "Categoría: Glúteo",
    },
    {
      image: "https://i.pravatar.cc/100?img=18",
      title: "Plancha",
      description: "Categoría: Glúteo",
    },
  ];

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Editar ejercicio">
      <div className="flex flex-col items-center space-y-3 p-4">
        <InputsModule.SearchInput placeholder="Buscador ejercicio" />
        {filtered.map((item, index) => (
          <ReusableExercise
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </ReusableModal>
  );
}
