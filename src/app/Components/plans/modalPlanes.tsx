"use client";

import { Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export type PlanFormData = {
  nombre: string;
  descripcion: string;
  precio: string;
  estado: boolean;
  beneficios: string[];
  generacionesPermitidas: string;
};

interface ModalPlanesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (plan: PlanFormData) => Promise<void> | void;
  initialData?: PlanFormData;
  title?: string;
  isSaving?: boolean;
  errorMessage?: string | null;
  isEditing?: boolean;
}

const createDefaultPlanData = (): PlanFormData => ({
  nombre: "",
  descripcion: "",
  precio: "",
  estado: true,
  beneficios: [""],
  generacionesPermitidas: "1",
});

const formatCopInput = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return Number(digitsOnly).toLocaleString("es-CO");
};

export default function ModalPlanes({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Editar plan",
  isSaving = false,
  errorMessage = null,
}: ModalPlanesProps) {
  const [formData, setFormData] = useState<PlanFormData>(createDefaultPlanData());

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(
      initialData
        ? {
            ...initialData,
            beneficios:
              initialData.beneficios.length > 0 ? initialData.beneficios : [""],
          }
        : createDefaultPlanData()
    );
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = <K extends keyof Omit<PlanFormData, "beneficios">>(
    field: K,
    value: PlanFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      beneficios: prev.beneficios.map((beneficio, benefitIndex) =>
        benefitIndex === index ? value : beneficio
      ),
    }));
  };

  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      beneficios: [...prev.beneficios, ""],
    }));
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prev) => {
      if (prev.beneficios.length === 1) {
        return {
          ...prev,
          beneficios: [""],
        };
      }

      return {
        ...prev,
        beneficios: prev.beneficios.filter((_, benefitIndex) => benefitIndex !== index),
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onSave?.({
        ...formData,
        beneficios: formData.beneficios.filter(
          (beneficio) => beneficio.trim() !== ""
        ),
      });
    } catch {
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl border border-[#4a4a4a] bg-[#252525] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto px-6 py-5 text-white md:px-8 md:py-7">
          <div className="mb-6 flex items-center justify-between border-b border-[#4a4a4a] pb-5">
            <h2 className="text-2xl font-semibold text-[#d8ff1f]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/5 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre-plan" className="text-[15px] font-semibold text-white">
                Nombre del plan
              </label>
              <input
                id="nombre-plan"
                type="text"
                value={formData.nombre}
                onChange={(event) => handleChange("nombre", event.target.value)}
                className="w-full rounded-[14px] border border-[#5c5c5c] bg-[#2d2d2d] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-[#d8ff1f]"
                placeholder="Ingresa el nombre del plan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion-plan" className="text-[15px] font-semibold text-white">
                Descripción del plan
              </label>
              <textarea
                id="descripcion-plan"
                value={formData.descripcion}
                onChange={(event) => handleChange("descripcion", event.target.value)}
                className="min-h-[110px] w-full resize-none rounded-[14px] border border-[#5c5c5c] bg-[#2d2d2d] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-[#d8ff1f]"
                placeholder="Describe este plan"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-end">
              <div className="space-y-2">
                <label htmlFor="precio-plan" className="text-[15px] font-semibold text-white">
                  Precio del plan
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/75">
                    COL $
                  </span>
                  <input
                    id="precio-plan"
                    type="text"
                    inputMode="numeric"
                    value={formData.precio}
                    onChange={(event) =>
                      handleChange("precio", formatCopInput(event.target.value))
                    }
                    className="w-full rounded-[14px] border border-[#5c5c5c] bg-[#2d2d2d] py-3 pl-20 pr-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-[#d8ff1f]"
                    placeholder="199.900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="generaciones-plan" className="text-[15px] font-semibold text-white">
                  Generaciones permitidas
                </label>
                <input
                  id="generaciones-plan"
                  type="number"
                  min="1"
                  value={formData.generacionesPermitidas}
                  onChange={(event) =>
                    handleChange("generacionesPermitidas", event.target.value)
                  }
                  disabled={isSaving}
                  className="w-full rounded-[14px] border border-[#5c5c5c] bg-[#2d2d2d] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-[#d8ff1f] disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <span className="text-[15px] font-semibold text-white">Estado</span>
                <button
                  type="button"
                  onClick={() => handleChange("estado", !formData.estado)}
                  disabled={isSaving}
                  className="flex items-center gap-3 py-3"
                >
                  <span
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                      formData.estado ? "bg-[#d8ff1f]" : "bg-[#6b6b6b]"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-[#181818] shadow-md transition ${
                        formData.estado ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                  <span className="text-lg font-semibold">
                    {formData.estado ? "Activo" : "Inactivo"}
                  </span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#4a4a4a] pt-5">
              <h3 className="text-2xl font-semibold text-[#d8ff1f]">Beneficios incluidos</h3>
              <p className="mt-2 text-[15px] text-white/80">
                Selecciona los beneficios que tendrá este plan
              </p>

              <div className="mt-4 max-h-[250px] space-y-3 overflow-y-auto pr-1">
                {formData.beneficios.map((beneficio, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      value={beneficio}
                      onChange={(event) => handleBenefitChange(index, event.target.value)}
                      className="w-full rounded-[14px] border border-[#5c5c5c] bg-[#2d2d2d] px-4 py-3 pr-24 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-[#d8ff1f]"
                      placeholder="Describe un beneficio"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      disabled={isSaving}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-red-200 transition hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Eliminar beneficio"
                    >
                      <X size={16} />
                    </button>
                    <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-white/70">
                      <Pencil size={18} />
                    </span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddBenefit}
                  disabled={isSaving}
                  className="flex w-full items-center gap-3 rounded-[14px] border border-dashed border-[#5c5c5c] bg-transparent px-4 py-3 text-left text-[15px] font-medium text-white/85 transition hover:border-[#d8ff1f] hover:text-white"
                >
                  <Plus size={18} className="text-[#d8ff1f]" />
                  Añadir beneficio
                </button>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-5 rounded-[14px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#4a4a4a] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-w-40 rounded-[14px] border border-[#d0d0d0] bg-white px-6 py-3 text-base font-semibold text-[#222222] transition hover:bg-[#f0f0f0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-w-[190px] rounded-[14px] bg-[#d8ff1f] px-6 py-3 text-base font-semibold text-[#202020] shadow-[0_0_20px_rgba(216,255,31,0.25)] transition hover:bg-[#cce81e]"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}