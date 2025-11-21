"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchInput } from "../Inputs/inputs";
import ReusableExercise from "../ui/ReusableExercise";

export default function ExerciseModal({
  isOpen,
  onClose,
  title = "Reemplaza ejercicio",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onSelectExercise?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;

    const fetchExercises = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token") ?? "";

        const res = await fetch("https://api.timshell.co/api/exercises/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        const json = await res.json();

        setData(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        console.log("ERROR FETCH:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = data.filter((item) =>
    item.exercise.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end items-start z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#282828] h-full max-w-[560px] w-full rounded-l-2xl py-4 relative border-l border-[#2A2A2A] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute flex gap-2 right-4 top-4 text-gray-200 hover:text-[#D4FF00] transition"
        >
          Cerrar <ChevronRight size={22} />
        </button>

        {/* Título */}
        {title && (
          <h2 className="text-xl px-4 mb-3 mt-10 font-semibold text-[#D4FF00]">
            {title}
          </h2>
        )}

        <div className="px-4 mb-4">
          <SearchInput
            placeholder="Buscar ejercicio"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="flex flex-col space-y-3 px-4 pb-4 max-h-[85vh] overflow-y-auto">
          {loading && (
            <p className="text-gray-400 text-center py-6">
              Cargando ejercicios...
            </p>
          )}
          {!loading &&
            filtered.map((item) => (
              <ReusableExercise
                key={item.id}
                image={item.thumbnail_url}
                title={item.exercise}
                description={item.category}
                onClick={() => onSelectExercise(item)}
              />
            ))}
          {!loading && filtered.length === 0 && (
            <p className="text-gray-400 text-center py-6">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
