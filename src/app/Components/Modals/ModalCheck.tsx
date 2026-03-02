import { Check } from "lucide-react";

interface ConfirmReplaceExerciseProps {
    isOpen?: boolean;
    onConfirm?: () => void; // Se ejecuta si el usuario dice "Sí"
    onCancel?: () => void;  // Se ejecuta si el usuario dice "No"
    text?: string; // Texto personalizado para la pregunta
    btnMessage?: string; // Texto personalizado para el botón
}

export const ModalCheck = ({
    text,
    btnMessage,
    isOpen,
    onConfirm,
    onCancel,
}: ConfirmReplaceExerciseProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-[#1F1F1F] text-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-6 w-[90%] max-w-md border border-gray-700">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#D4FF00]/20">
                    <Check className="w-12 h-12 text-[#D4FF00]" />
                </div>

                <h2 className="text-2xl font-semibold text-center">
                    {text || "Creado correctamente"}
                </h2>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onConfirm}
                        className="bg-[#D4FF00] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#cbe000] transition cursor-pointer"
                    >
                        {btnMessage || "Continuar"}
                    </button>
                </div>
            </div>
        </div>
    );
};
