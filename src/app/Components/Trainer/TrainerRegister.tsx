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
    address: "",
    experience_years: "",
    certifications: "",
    description: "",
    image: null as File | null,
  });


  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const validate = () => {
    if (!form.name) return "Nombre requerido";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido";
    if (!form.phone) return "Teléfono requerido";
    if (!form.address) return "Dirección requerida";
    if (!form.experience_years || Number(form.experience_years) < 0)
      return "Años de experiencia inválidos";
    return "";
  };


  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("certifications", form.certifications);
    formData.append("description", form.description);

    if (form.image) {
      formData.append("image", form.image);
    }
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(
        "https://timshel-backend.onrender.com/api/trainers/create",
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
        throw new Error(data?.message || "Error al crear entrenador");
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
    }
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

        <div className="mt-3">
          <label className="text-sm text-gray-300">Imagen de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files?.[0] || null })
            }
            className="mt-1 w-full text-sm text-gray-300"
          />
        </div>


        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre" name="name" value={form.name} onChange={handleChange} />
          <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
          <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Dirección" name="address" value={form.address} onChange={handleChange} />
          <Input
            label="Años de experiencia"
            name="experience_years"
            type="number"
            value={form.experience_years}
            onChange={handleChange}
          />
          <Input
            label="Certificaciones"
            name="certifications"
            value={form.certifications}
            onChange={handleChange}
          />
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
