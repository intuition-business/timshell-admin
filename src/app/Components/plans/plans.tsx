"use client";

import { useEffect, useMemo, useState } from "react";
import { ModalConfirm } from "../Modals/ModalConfirm";
import { TablaPlan, type PlanTableRow } from "./PlanTable";
import ModalPlanes, { type PlanFormData } from "./modalPlanes";

type PlanItem = PlanFormData & { id: string; usuarios: number };
type ApiPlan = {
    id?: unknown;
    title?: unknown;
    description?: unknown;
    price_cop?: unknown;
    activo?: unknown;
    description_items?: unknown;
    generations_allowed?: unknown;
    users_count?: unknown;
    users?: unknown;
};

const getApiUrl = (path: string): string =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

const getAuthHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "x-access-token": typeof window === "undefined" ? "" : localStorage.getItem("token") || "",
});

const formatCopPrice = (value: unknown): string => {
    const numericValue = Number(value ?? 0);

    if (Number.isNaN(numericValue)) {
        return "0";
    }

    return Math.trunc(numericValue).toLocaleString("es-CO");
};

const normalizeNumericInput = (value: string): number => {
    const digitsOnly = value.replace(/\D/g, "");
    return Number(digitsOnly || "0");
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
};

const mapApiPlanToItem = (plan: ApiPlan, index: number): PlanItem => ({
    id: String(plan.id ?? `plan-${index}`),
    nombre: String(plan.title ?? "Plan sin nombre"),
    descripcion: typeof plan.description === "string" ? plan.description : "",
    precio: formatCopPrice(plan.price_cop),
    estado: Boolean(plan.activo),
    usuarios: Number(plan.users_count ?? plan.users ?? 0) || 0,
    beneficios: Array.isArray(plan.description_items)
        ? plan.description_items.filter(
              (benefit): benefit is string => typeof benefit === "string"
          )
        : [],
    generacionesPermitidas: String(Number(plan.generations_allowed ?? 0) || 0),
});

const fetchPlansFromApi = async (): Promise<PlanItem[]> => {
    const response = await fetch(getApiUrl("plans"), {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.message || "Error al obtener planes");
    }

    const plansData = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

    return plansData.map((plan: ApiPlan, index: number) => mapApiPlanToItem(plan, index));
};

const buildCreatePayloadVariants = (plan: PlanFormData) => {
    const basePayload = {
        title: plan.nombre.trim(),
        price_cop: normalizeNumericInput(plan.precio),
        description_items: plan.beneficios.filter((beneficio) => beneficio.trim() !== ""),
        description: plan.descripcion.trim(),
        activo: plan.estado,
    };
    const generationsAllowed = normalizeNumericInput(plan.generacionesPermitidas);

    return [
        { ...basePayload, generations_allowed: generationsAllowed },
        { ...basePayload, generation_allowed: generationsAllowed },
        basePayload,
    ];
};

const buildUpdatePayload = (plan: PlanFormData, estado = plan.estado) => ({
    new_title: plan.nombre.trim(),
    new_price_cop: normalizeNumericInput(plan.precio),
    new_description_items: plan.beneficios.filter((beneficio) => beneficio.trim() !== ""),
    new_description: plan.descripcion.trim(),
    new_activo: estado,
});

const requestPlanMutation = async ({
    endpoint,
    method,
    body,
    fallbackMessage,
}: {
    endpoint: string;
    method: "POST" | "PUT" | "DELETE";
    body?: Record<string, unknown>;
    fallbackMessage: string;
}) => {
    const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.message || fallbackMessage);
    }

    return result;
};

export default function Plans() {
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [busyRowId, setBusyRowId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [planToDelete, setPlanToDelete] = useState<PlanItem | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadPlans = async () => {
            setLoading(true);
            setErrorMessage(null);

            try {
                const fetchedPlans = await fetchPlansFromApi();

                if (!isMounted) {
                    return;
                }

                setPlans(fetchedPlans);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setPlans([]);
                setErrorMessage(getErrorMessage(error, "No fue posible cargar los planes."));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadPlans();

        return () => {
            isMounted = false;
        };
    }, []);

    const refreshPlans = async () => {
        const fetchedPlans = await fetchPlansFromApi();
        setPlans(fetchedPlans);
    };

    const columns = [
        { key: "plan", label: "Plan", width: "2fr" },
        { key: "precio", label: "Precio" },
        { key: "generaciones", label: "Generaciones" },
        { key: "usuarios", label: "Usuarios" },
        { key: "estado", label: "Estado" },
        { key: "acciones", label: "Acciones", width: "1.5fr" },
    ];

    const selectedPlan = selectedPlanId
        ? plans.find((plan) => plan.id === selectedPlanId) ?? null
        : null;

    const data = useMemo(
        () =>
            plans.map<PlanTableRow>((plan) => ({
                id: plan.id,
                plan: plan.nombre,
                precio: `$${plan.precio}`,
                generaciones: plan.generacionesPermitidas,
                usuarios: plan.usuarios,
                estado: plan.estado ? "Activo" : "Inactivo",
            })),
        [plans]
    );

    const handleOpenModal = (planId: string | null = null) => {
        setErrorMessage(null);
        setSelectedPlanId(planId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPlanId(null);
        setErrorMessage(null);
    };

    const handleSavePlan = async (updatedPlan: PlanFormData) => {
        setIsSaving(true);
        setErrorMessage(null);

        try {
            if (selectedPlanId) {
                await requestPlanMutation({
                    endpoint: getApiUrl(`plans/update/${selectedPlanId}`),
                    method: "PUT",
                    body: buildUpdatePayload(updatedPlan),
                    fallbackMessage: "Error al actualizar el plan",
                });
            } else {
                let createError: Error | null = null;

                for (const payload of buildCreatePayloadVariants(updatedPlan)) {
                    try {
                        await requestPlanMutation({
                            endpoint: getApiUrl("plans/create"),
                            method: "POST",
                            body: payload,
                            fallbackMessage: "Error al crear el plan",
                        });
                        createError = null;
                        break;
                    } catch (error) {
                        createError = error instanceof Error ? error : new Error("Error al crear el plan");

                        if (!createError.message.includes("is not allowed")) {
                            throw createError;
                        }
                    }
                }

                if (createError) {
                    throw createError;
                }
            }

            await refreshPlans();
            handleCloseModal();
        } catch (error) {
            setErrorMessage(
                getErrorMessage(
                    error,
                    selectedPlanId
                        ? "No fue posible actualizar el plan."
                        : "No fue posible crear el plan."
                )
            );
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (row: PlanTableRow, status: boolean) => {
        const currentPlan = plans.find((plan) => plan.id === row.id);

        if (!currentPlan) {
            return;
        }

        setBusyRowId(row.id);
        setErrorMessage(null);

        try {
            await requestPlanMutation({
                endpoint: getApiUrl(`plans/update/${row.id}`),
                method: "PUT",
                body: buildUpdatePayload(currentPlan, status),
                fallbackMessage: "Error al actualizar el estado del plan",
            });

            await refreshPlans();
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error, "No fue posible actualizar el estado del plan.")
            );
        } finally {
            setBusyRowId(null);
        }
    };

    const handleAskDelete = (row: PlanTableRow) => {
        const selectedPlan = plans.find((plan) => plan.id === row.id) ?? null;
        setErrorMessage(null);
        setPlanToDelete(selectedPlan);
    };

    const handleDeletePlan = async () => {
        if (!planToDelete) {
            return;
        }

        setBusyRowId(planToDelete.id);
        setErrorMessage(null);

        try {
            await requestPlanMutation({
                endpoint: getApiUrl(`plans/delete/${planToDelete.id}`),
                method: "DELETE",
                fallbackMessage: "Error al eliminar el plan",
            });

            await refreshPlans();

            if (selectedPlanId === planToDelete.id) {
                handleCloseModal();
            }

            setPlanToDelete(null);
        } catch (error) {
            setErrorMessage(getErrorMessage(error, "No fue posible eliminar el plan."));
        } finally {
            setBusyRowId(null);
        }
    };

    return (
        <section className="fp-6 rounded-3xl shadow-lg w-full text-white items-center">
            <div className="w-full justify-end p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#dff400]">Planes</h1>
                        <h2 className="my-3 font-bold text-[#dff400]">Gestión de Planes</h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="rounded-xl bg-[#dff400] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#cfe500]"
                    >
                        Crear plan
                    </button>
                </div>

                {errorMessage ? (
                    <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {errorMessage}
                    </p>
                ) : null}

                {loading ? (
                    <p className="text-center text-gray-400">Cargando Planes...</p>
                ) : (
                    <div className="flex flex-col w-full gap-2">
                        <TablaPlan
                            columns={columns}
                            data={data}
                            onEdit={(row) => handleOpenModal(row.id)}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleAskDelete}
                            busyRowId={busyRowId}
                        />
                    </div>
                )}
            </div>

            <ModalPlanes
                isOpen={openModal}
                onClose={handleCloseModal}
                onSave={handleSavePlan}
                initialData={selectedPlan ?? undefined}
                title={selectedPlan ? "Editar plan" : "Crear plan"}
                isSaving={isSaving}
                errorMessage={errorMessage}
                isEditing={Boolean(selectedPlan)}
            />

            <ModalConfirm
                isOpen={Boolean(planToDelete)}
                onConfirm={() => {
                    void handleDeletePlan();
                }}
                onCancel={() => setPlanToDelete(null)}
                text={`¿Seguro que deseas eliminar ${planToDelete?.nombre ?? "este plan"}?`}
            />
        </section>
    );
}
