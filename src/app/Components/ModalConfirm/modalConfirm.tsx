"use client";

interface ConfirmDeleteExerciseProps {
  isOpen?: boolean;
  onConfirm?: () => void; // Acción al confirmar
  onCancel?: () => void;  // Acción al cancelar
}

export const ConfirmDeleteExercise = ({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDeleteExerciseProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-[#1F1F1F] text-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-6 w-[90%] max-w-md border border-gray-700">

        {/* Ícono rojo de advertencia */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-center">
          ¿Deseas eliminar este ejercicio?
        </h2>

        {/* Botones */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-400 transition cursor-pointer"
          >
            Eliminar
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-600 transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
