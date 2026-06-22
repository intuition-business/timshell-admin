"use client";

import { useState } from "react";
import { ModalCheck } from "../Modals/ModalCheck";

interface Props {
  open?: boolean;
  setUpdateTrainers?: () => void;
  onClose: () => void;
}

export default function ModalTrainersRegister({ open, setUpdateTrainers, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience_years: "",
    address: "",
    price: "", // new field requested by Elvis
    description: "",
    certifications: null as File | null,
    goal: "", // to match backend field, but will be sent as "focus"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModalCheck, setShowModalCheck] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      experience_years: "",
      address: "",
      goal: "",
      price: "",
      description: "",
      certifications: null,
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "certifications") {
      setForm({ ...form, certifications: files?.[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    if (!form.name.trim()) return "Nombre requerido";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido";
    if (!form.phone.trim()) return "Teléfono requerido";
    if (!form.experience_years || Number(form.experience_years) <= 0) return "Años de experiencia inválidos";
    if (!form.address.trim()) return "Dirección requerida";
    if (!form.goal.trim()) return "Enfoque del entrenador requerido";
    if (!form.price.trim() || Number(form.price) <= 0) return "Precio inválido";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      const token = localStorage.getItem("token") || "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}trainers/create`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Error al registrar entrenador");
      }
      setUpdateTrainers && setUpdateTrainers();
      setShowModalCheck(true);
      setMessage(data?.message || "Entrenador registrado exitosamente");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>    <div className="fixed inset-0 z-50 flex items-start overflow-auto justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl my-11 bg-[#1c1c1c] p-8 relative border border-gray-700">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-[#d4ff00] mb-6">
          Registrar entrenador
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6">
          <Input label="Nombre" name="name" placeholder="Escribe tu nombre" value={form.name} onChange={handleChange} />
          <Input label="Correo" name="email" placeholder="Escribe tu correo" value={form.email} onChange={handleChange} />
          <Input label="Teléfono" name="phone" placeholder="Escribe tu numero" value={form.phone} onChange={handleChange} />
          <Input label="Edad" name="experience_years" placeholder="Escribe tu edad" type="number" value={form.experience_years} onChange={handleChange} />
          <Input label="Dirección" name="address" placeholder="Ej: Calle 40 #5-12" value={form.address} onChange={handleChange} />
          <Input label="Enfoque del entrenador" name="goal" placeholder="Ej: fuerza, cardio, etc." value={form.goal} onChange={handleChange} />
          <Input label="Precio" name="price" placeholder="Ej: 20.000" type="number" value={form.price} onChange={handleChange} />
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <label className="text-sm text-gray-300">Descripción</label>
          <textarea
            name="description"
            placeholder="Escribe un mensaje"
            value={form.description}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
            rows={4}
          />
        </div>

        {/* Subir certificado */}
        <div className="mt-6">
          <label className="text-sm text-gray-300">Subir certificado</label>

          <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-10 cursor-pointer hover:border-[#d4ff00] transition">
            <span className="text-gray-400 text-sm">
              {form.certifications ? form.certifications.name : "Sube un archivo"}
            </span>
            <input
              type="file"
              name="certifications"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        {/* Buttons */}
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
      {/* { checkmodal} */
        <ModalCheck
          isOpen={showModalCheck}
          text={message}
          btnMessage="Continuar"
          onConfirm={() => { setShowModalCheck(false), onClose() }}
        />
      }
    </>

  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className="mt-2 p-3 rounded-xl bg-[#111] border border-gray-600 text-white focus:outline-none focus:border-[#d4ff00]"
      />
    </div>
  );
}