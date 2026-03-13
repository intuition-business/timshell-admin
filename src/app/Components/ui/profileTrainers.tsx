"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface TrainerInfoCardProps {
  name: string;
  image?: string;
  specialty?: string;
  price?: number | string;
  rating?: number | string;
  description?: string;
  onEdit?: () => void;
  certification?: [];
}

export default function TrainerInfoCard({
  name,
  image,
  specialty,
  price,
  rating,
  description,
  onEdit,
  certification
}: TrainerInfoCardProps) {

  const [precio, setPrecio] = useState<number | string>()

  function formatePrice(precio: number | string) {
    const precioNumber = Number(precio)
    const precioFormateado = precioNumber.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
    setPrecio(precioFormateado)
  }

  useEffect(() => {
    if (price) {
      formatePrice(price)
    }
  }, [price]);

  const certificationsArray =
    typeof certification === "string"
      ? JSON.parse(certification)
      : certification || [];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      <div className="flex gap-16 py-12 px-16 items-center bg-[#1A1A1A] rounded-xl h-full shadow-md">

        {/* Imagen */}
        <div className="relative">
          <img
            src={image || "/logo.png"}
            alt={name}
            className={`w-ful max-w-[340px] h-[450px]  rounded-xl ${image ? "object-cover" : "object-contain"}`}
          />
        </div>

        {/* Información */}
        <div className="text-white w-full">

          <div className="flex items-center justify-between w-full">
            <h2 className="text-[32px] font-bold text-[#dff400] mb-2">
              {name}
            </h2>

            {/* Botón editar */}
            <button
              onClick={onEdit}
              className="flex gap-1 items-center px-4 py-2 bg-black text-white font-semibold rounded-lg hover:brightness-110 cursor-pointer z-50"
            >
              <Pencil className="mr-2 w-4 h-4" />
              Editar
            </button>
          </div>

          <p className="text-lg font-bold">
            {specialty}
          </p>

          {/* Precio + Rating */}
          <div className="flex items-center gap-4 mt-6">
            <div>
              <span className="text-sm">Costo por servicio</span>
              <p className="text-2xl font-bold">{precio}</p>
            </div>

            <div className="flex items-center gap-2 bg-[#282828] px-4 py-3 rounded-lg">
              <img src="/star.svg" alt="estrella de rating" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          {/* Descripción */}
          {description && (
            <div className="pt-2 mt-6">
              <h4 className="font-semibold mb-1">Descripción</h4>
              <p className="text-base text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* certificacion */}
          <div className="pt-2 mt-2">
            <h4 className="font-semibold mb-3">Certificaciones</h4>
            <div>
              {certificationsArray?.map((cert: string, index: number) => (
                <a
                  key={index}
                  href={cert}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#282828] text-white rounded-lg hover:brightness-110"
                >
                  Descargar certificación {index + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
