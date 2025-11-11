"use client";

import { useParams } from "next/navigation";

export default function RutinaPage() {
  const { id, exercise } = useParams();

  return (
    <section className="min-h-screen flex flex-col-2 items-center justify-center text-white bg-black">
      <h1 className="text-3xl font-bold text-[#dff400] mb-6">
        Rutina del Usuario {id}
      </h1>
      <p className="text-xl">
        ID del ejercicio seleccionado:{" "}
        <span className="text-[#dff400]">{exercise}</span>
      </p>
    </section>
  );
}
