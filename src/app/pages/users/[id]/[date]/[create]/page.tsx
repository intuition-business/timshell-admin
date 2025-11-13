"use client";
import React, { useState } from "react";

interface Serie {
  reps: string;
  descanso: string;
}

export default function InternaEditar() {
  const [series, setSeries] = useState<Serie[]>([{ reps: "", descanso: "" }]);

  const addSerie = (): void => {
    setSeries([...series, { reps: "", descanso: "" }]);
  };

  const handleChange = (
    index: number,
    field: keyof Serie,
    value: string
  ): void => {
    const updated = [...series];
    updated[index][field] = value;
    setSeries(updated);
  };

  const handleGuardar = (): void => {
    alert("✅ Ejercicio guardado");
    console.log("Ejercicio guardado:", series);
  };

  const handleEditar = (): void => {
    alert("✏️ Editando ejercicio...");
  };

  const handleEliminar = (): void => {
    alert("🗑️ Ejercicio eliminado");
    setSeries([{ reps: "", descanso: "" }]);
  };

  return (
    <div className="f">
      {/* Izquierda */}
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cuádriceps y cadera
          </h1>
          <h2 className="text-lg text-gray-600">Extensión de glúteos</h2>
        </div>

        <p className="text-gray-500">
          Acuéstate boca abajo y eleva una pierna extendida contrayendo el
          glúteo. Mantén la posición un segundo y baja lentamente.
        </p>

        {/* Formulario */}
        <div className="space-y-3">
          {series.map((serie, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="number"
                placeholder="Repeticiones"
                value={serie.reps}
                onChange={(e) => handleChange(index, "reps", e.target.value)}
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Descanso (seg)"
                value={serie.descanso}
                onChange={(e) =>
                  handleChange(index, "descanso", e.target.value)
                }
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <button
            onClick={addSerie}
            className="px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 transition"
          >
            ➕ Agregar serie
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            💾 Guardar
          </button>
          <button
            onClick={handleEditar}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleEliminar}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src="https://via.placeholder.com/350x250"
          alt="Extensión de glúteos"
          className="rounded-xl shadow-md object-cover"
        />
        {/* Si prefieres un video: */}
        {/* <video src="/videos/extension-gluteos.mp4" controls className="rounded-xl shadow-md w-full max-w-md" /> */}
      </div>
    </div>
  );
};
