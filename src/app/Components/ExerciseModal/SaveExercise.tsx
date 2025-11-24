interface SaveExercisePro {
  isOpen?: boolean;
  onContinue?: () => void;
  setSelectExercise?: any;
}

export const SaveExercise = ({ isOpen, onContinue, setSelectExercise }: SaveExercisePro) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-[#1F1F1F] text-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4 w-[90%] max-w-md border border-gray-700">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#D4FF00]/20">
          <svg
            className="w-12 h-12 text-[#D4FF00]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold">Actualizado correctamente</h2>

        <button
          onClick={onContinue}
          className="mt-2 bg-[#D4FF00] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#cbe000] transition cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
