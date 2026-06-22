"use client";

import { useEffect, useState } from "react";
import { SearchInput } from "../Inputs/inputs";
import ReusableExercise from "../ui/ReusableExercise";
import { Pencil, Trash2 } from "lucide-react";
import { ModalConfirm } from "../Modals/ModalConfirm";
// import ConfirmReplaceExercise from "../modals/ConfirmReplaceExercise";

interface ListadoEjerciciosProps {
  /** se llamará cuando el usuario quiera editar un ejercicio.
   * Recibe el objeto completo del ejercicio seleccionado.
   */
  onEdit?: (item: any) => void;
  update?: boolean;
  setUpdate?: (update: boolean) => void;
}

export default function ListadoEjercicios({ onEdit, update, setUpdate }: ListadoEjerciciosProps & { update?: boolean, setUpdate?: (update: boolean) => void }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // estados para confirmar solo la eliminación
  const [selectExercise, setSelectExercise] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Saber qué acción estamos confirmando
  const [actionType, setActionType] = useState<"delete" | null>(null);
  // ==========================
  // FETCH
  // ==========================
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}exercises/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-access-token": token,
          },
        }
      );
      const json = await res.json();
      setData(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      console.log("ERROR FETCH:", e);
      setData([]);
    } finally {
      setLoading(false);
      setUpdate && setUpdate(false);
    }
  };
  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (update) {
      fetchExercises();
    }
  }, [update]);

  // ==========================
  // FILTRO
  // ==========================
  const filtered = data.filter((item) =>
    item.exercise.toLowerCase().includes(search.toLowerCase())
  );

  // ==========================
  // CLICK EDITAR
  // ==========================
  const handleEditClick = (item: any) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  // ==========================
  // CLICK ELIMINAR
  // ==========================
  const handleDeleteClick = (item: any) => {
    setSelectExercise(item);
    setActionType("delete");
    setOpenDelete(true);
  };

  // ==========================
  // CONFIRMAR ACCIÓN
  // ==========================
  const handleConfirm = async () => {
    if (!selectExercise || !actionType) return;

    if (actionType === "delete") {
      try {
        const token = localStorage.getItem("token") ?? "";

        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}exercises/delete/${selectExercise.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "x-access-token": token,
            },
          }
        );

        setData((prev) =>
          prev.filter((item) => item.id !== selectExercise.id)
        );
        setOpenDelete(false);
        onEdit?.(null); // Para cerrar el modal de edición si el ejercicio eliminado estaba abierto
      } catch (error) {
        console.log("Error eliminando:", error);
      }
    }

    setShowConfirm(false);
    setSelectExercise(null);
    setActionType(null);
  };

  return (
    <div className="h-[calc(100vh)] -mt-42 overflow-auto w-full bg-[#282828] text-white p-6 top-0 right-0 max-w-[560px]">

      <h1 className="text-2xl font-semibold text-[#D4FF00] mb-6">
        Editar ejercicio
      </h1>

      {/* BUSCADOR */}
      <div className="mb-6 w-full">
        <SearchInput
          placeholder="Buscador ejercicio"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          wFull={true}
        />
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-4">
        {loading && (
          <p className="text-gray-400 text-center py-6">
            Cargando ejercicios...
          </p>
        )}

        {!loading && filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4 flex items-center justify-between"
          >
            {/* LADO IZQUIERDO */}
            <div className="flex items-center gap-4">
              <img
                src={item.thumbnail_url}
                alt={item.exercise}
                className="w-32 h-24 object-cover rounded-lg"
              />

              <div>
                <h3 className="text-[#D4FF00] font-semibold text-lg uppercase">
                  {item.exercise}
                </h3>

                <p className="text-gray-400 text-lg mt-1">
                  Categoría: {item.category}
                </p>
              </div>
            </div>

            {/* ICONOS DERECHA */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleEditClick(item)}
                className="text-gray-300 hover:text-white transition cursor-pointer"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => handleDeleteClick(item)}
                className="text-gray-400 hover:text-red-400 transition cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center py-6">
            No se encontraron resultados.
          </p>
        )}
      </div>
      {/* MODAL CONFIRMAR */}
      <ModalConfirm
        isOpen={openDelete}
        onConfirm={handleConfirm}
        text="Estas seguro de que deseas eliminar este ejercicio?"
        onCancel={() => setOpenDelete(false)}
      />
    </div>
  );
}