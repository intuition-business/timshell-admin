"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainer: {
    id: string;
    name?: string;
    price?: number | string;
    description?: string;
    image?: string;
    goal?: string;
  } | null;
  onUpdated?: () => void;
}

export default function EditarTrinerModal({
  isOpen,
  onClose,
  trainer,
  onUpdated,
}: Props) {
  const [name, setName] = useState("");
  const [goal, setgoal] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trainer && isOpen) {
      setName(trainer.name || "");
      setgoal(trainer.goal || "");
      setPrice(trainer.price != null ? String(trainer.price) : "");
      setDescription(trainer.description || "");
      setPreview(trainer.image || "");
      setImageFile(null);
      setError("");
    }
  }, [trainer, isOpen]);

  const resetForm = () => {
    setName("");
    setgoal("");
    setPrice("");
    setDescription("");
    setImageFile(null);
    setPreview("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!name.trim()) return "Nombre requerido";
    if (!goal.trim()) return "Enfoque requerido";
    if (!price.trim() || Number(price) <= 0) return "Precio inválido";
    return "";
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      if (trainer?.id) formData.append("id", trainer.id);
      formData.append("new_name", name);
      formData.append("new_goal", goal);
      formData.append("new_price", price);
      formData.append("new_description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trainers/update`, {
        method: "Put",
        headers: {
          "x-access-token": token,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Error al actualizar entrenador");
      }

      if (onUpdated) onUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Error de red");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start overflow-auto justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl my-11 bg-[#1c1c1c] p-8 relative border border-gray-700">
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-[#d4ff00] mb-6">
          Editar entrenador
        </h2>

        {/* two columns: left for image, right for fields */}
        <div className="grid grid-cols-2 gap-6">
          {/* left side - image upload */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-300">Subir imagen</label>
            <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl h-64 cursor-pointer hover:border-[#d4ff00] transition">
              {preview ? (
                <img src={preview} className="max-h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm">Sube un archivo</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* right side - form fields */}
          <div className="grid grid-cols-2 gap-6 w-full">
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Meta"
                value={goal}
                onChange={(e) => setgoal(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Tarifa mensual"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
              />
            </div>
            <div className="col-span-2">
              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 p-4 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
                rows={4}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleClose}
            className="px-6 py-3 rounded-xl bg-gray-300 text-black font-medium hover:opacity-90 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-[#d4ff00] text-black font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
