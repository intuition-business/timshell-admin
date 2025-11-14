"use client";

import { useState } from "react";
import Buttons from "../ui/Buttons";

interface ExerciseCreateProps {
  exerciseName?: string | null;
}

export default function ExerciseCreate({ exerciseName }: ExerciseCreateProps) {
  const [title, setTitle] = useState(exerciseName);
  const [description, setDescription] = useState(
    "Inclínate hacia adelante y flexiona la cadera, rodilla semiflexionada. Busca llevar el talón hacia atrás y no hacia arriba."
  );

  const [restTime, setRestTime] = useState("");
  const [series, setSeries] = useState<string[]>([""]);

  const handleAddSeries = () => {
    setSeries([...series, ""]);
  };

  const handleSeriesChange = (index: number, value: string) => {
    const updated = [...series];
    updated[index] = value;
    setSeries(updated);
  };

  const handleRemoveSeries = (index: number) => {
    if (series.length > 1) {
      const updated = series.filter((_, i) => i !== index);
      setSeries(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      title,
      description,
      restTime,
      series,
    });
  };

  return (
    <>
      <div className="flex flex-col p-5 min-h-screen lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00]                                       ">
            {exerciseName}
          </h2>

          <img
            src="/imgvide.png"
            alt="Ejercicio"
            className="rounded-xl border border-gray-700 w-full h-full max-h-[80vh] object-cover"
          />
        </div>

        <div className="lg:w-1/2">
          <div className="flex justify-end">
            <button
              className="px-4 py-2 border border-white text-white bg-transparent 
             rounded-lg transition hover:bg-white/10"
            >
              eliminar ejercicio
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-white py-">Descripción</h2>
            <p className="text-gray-100 ">{description}</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" text-white p-6 rounded-2xl shadow-md w-full space-y-6"
          >
            <div className="flex flex-col space-y-2 max-w-md">
              <label className="text-xl font-medium text-gray-300">
                Tiempo de descanso
              </label>
              <input
                type="text"
                value={restTime}
                onChange={(e) => setRestTime(e.target.value)}
                placeholder="Agregar el tiempo en minutos"
                className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-1">Series</h2>
            <div className="bg-[#1F1F1F] text-white rounded-2xl shadow-md mx-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {series.map((rep, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 bg-[#2B2B2B] p-4 rounded-xl relative"
                  >
                    {series.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSeries(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    )}

                    <h2 className="text-xl font-semibold text-[#D4FF00]">
                      Serie {index + 1}
                    </h2>

                    <label className="text-lg text-gray-300">
                      Repeticiones
                    </label>

                    <input
                      type="text"
                      value={rep}
                      onChange={(e) =>
                        handleSeriesChange(index, e.target.value)
                      }
                      placeholder="Número de repeticiones"
                      className="border border-gray-500 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={handleAddSeries}
                  className="flex flex-col space-y-2 bg-[#2B2B2B] p-4 rounded-xl text-gray-300 hover:bg-[#3A3A3A] transition items-center justify-center w-full"
                >
                  <span className="text-xl font-semibold text-gray-300">
                    + Agregar serie nueva
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Buttons
                data="Editar ejercicio"
                type="submit"
                className="bg-white text-black font-bold hover:bg-[#cbe000]"
              />

              <Buttons
                data="Guardar ejercicios"
                type="submit"
                className="bg-[#D4FF00] text-black font-bold hover:bg-[#cbe000]"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
