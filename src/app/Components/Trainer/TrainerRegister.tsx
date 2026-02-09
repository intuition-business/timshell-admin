"use client";

import { useState } from "react";
import Buttons from "../ui/Buttons";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModalTrainersRegister({ open, onClose }: Props) {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    description: "",
    profession: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name) return "Nombre requerido";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido";
    if (!form.phone) return "Teléfono requerido";
    if (!form.age || Number(form.age) < 18) return "Debe ser mayor de edad";
    if (!form.password || form.password.length < 6)
      return "La contraseña debe tener mínimo 6 caracteres";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    console.log("DATA A ENVIAR:", form);
    /*
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trainers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(form),
    });
    */

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#0e0e0e] w-full max-w-lg rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#dff400] mb-4">
          Registrar entrenador
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre" name="name" value={form.name} onChange={handleChange} />
          <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
          <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Edad" name="age" type="number" value={form.age} onChange={handleChange} />
          <Input label="Profesión" name="profession" value={form.profession} onChange={handleChange} />
          <Input label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} />
        </div>

        <div className="mt-3">
          <label className="text-sm text-gray-300">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-xl bg-black border border-gray-700 text-white"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        <div className="mt-6 flex justify-end">
          <Buttons
            data="Registrar"
            onClick={handleSubmit}
            className="max-w-[220px] w-full py-3"
          />
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className="mt-1 p-3 rounded-xl bg-black border border-gray-700 text-white"
      />
    </div>
  );
}
