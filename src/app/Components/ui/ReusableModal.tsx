"use client";

import { ChevronRight } from "lucide-react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
export default function ReusableModal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 max-h-screen  bg-black/70 backdrop-blur-sm flex justify-center  z-50">
      <div className="bg-[#282828]   prounded-2xl py-3 w-[90%] max-w-2xl relative border border-[#2A2A2A] shadow-xl">
        <button
          onClick={onClose}
          className="absolute flex gap-3 right-4 text-gray-200 hover:text-[#D4FF00] transition"
        >
          Cerrar
          <ChevronRight size={24} />
        </button>

        {title && (
          <h2 className="text-xl p-4 font-semibold  text-[#D4FF00]">{title}</h2>
        )}

        <div className="flex flex-col space-y-4">{children}</div>
      </div>
    </div>
  );
}
