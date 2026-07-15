"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import PaymentDetailModal, { type Payment } from "@/features/payments/PaymentDetailModal";

interface Filters {
  status: string;
  plan_id: string;
  entrenador_id: string;
  date_from: string;
  date_to: string;
}

type Option = { id: string; label: string };

const LIMIT = 20;

const STATUS_META: Record<string, { label: string; className: string }> = {
  approved: { label: "Aprobado", className: "bg-[#dff400]/15 text-[#dff400]" },
  pending: { label: "Pendiente", className: "bg-yellow-500/15 text-yellow-300" },
  rejected: { label: "Rechazado", className: "bg-red-500/15 text-red-300" },
};

const emptyFilters: Filters = {
  status: "",
  plan_id: "",
  entrenador_id: "",
  date_from: "",
  date_to: "",
};

const getToken = (): string =>
  typeof window === "undefined" ? "" : localStorage.getItem("token") || "";

const formatCurrency = (value: string | null): string => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) return "—";
  return numeric.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

const formatDate = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  const [plans, setPlans] = useState<Option[]>([]);
  const [trainers, setTrainers] = useState<Option[]>([]);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Opciones para los filtros de plan y entrenador
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const loadOptions = async () => {
      try {
        const [plansRes, trainersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}plans`, {
            headers: { "x-access-token": token },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trainers`, {
            headers: { "x-access-token": token },
          }),
        ]);

        const plansJson = await plansRes.json().catch(() => null);
        const trainersJson = await trainersRes.json().catch(() => null);

        const plansData = Array.isArray(plansJson?.data) ? plansJson.data : [];
        const trainersData = Array.isArray(trainersJson?.data) ? trainersJson.data : [];

        setPlans(
          plansData.map((p: { id: number | string; title?: string; name?: string }) => ({
            id: String(p.id),
            label: p.title ?? p.name ?? `Plan ${p.id}`,
          }))
        );
        setTrainers(
          trainersData.map((t: { id: number | string; name?: string }) => ({
            id: String(t.id),
            label: t.name ?? `Entrenador ${t.id}`,
          }))
        );
      } catch (err) {
        console.error("Error al cargar filtros de pagos:", err);
      }
    };

    loadOptions();
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("No hay token de autenticación");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (filters.status) params.set("status", filters.status);
      if (filters.plan_id) params.set("plan_id", filters.plan_id);
      if (filters.entrenador_id) params.set("entrenador_id", filters.entrenador_id);
      if (filters.date_from) params.set("date_from", filters.date_from);
      if (filters.date_to) params.set("date_to", filters.date_to);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/payments?${params.toString()}`,
        { headers: { "x-access-token": token } }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Error al obtener los pagos");
      }

      setPayments(Array.isArray(json?.data) ? json.data : []);
      setTotalPages(Math.max(1, Number(json?.total_pages) || 1));
      setTotalPayments(Number(json?.total_payments) || 0);
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setError(err instanceof Error ? err.message : "No fue posible cargar los pagos.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setPage(1);
    setFilters(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const inputClass =
    "bg-[#2B2B2B] border border-[#777777] text-white px-3 py-3 rounded-xl focus:outline-none w-full";

  return (
    <section className="w-full text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#dff400]">Historial de pagos</h1>
        <h2 className="my-3 font-bold text-[#dff400]">Trazabilidad de pagos</h2>
      </div>

      {/* Filtros principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los estados</option>
          <option value="approved">Aprobado</option>
          <option value="pending">Pendiente</option>
          <option value="rejected">Rechazado</option>
        </select>

        <select
          value={filters.plan_id}
          onChange={(e) => handleFilterChange("plan_id", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los planes</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.label}
            </option>
          ))}
        </select>

        <select
          value={filters.entrenador_id}
          onChange={(e) => handleFilterChange("entrenador_id", e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los entrenadores</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por rango de fechas (separado) */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
        <label className="flex flex-col text-xs text-gray-400 gap-1 w-full sm:max-w-[220px]">
          Desde
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
            className={`${inputClass} py-2.5`}
          />
        </label>

        <label className="flex flex-col text-xs text-gray-400 gap-1 w-full sm:max-w-[220px]">
          Hasta
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
            className={`${inputClass} py-2.5`}
          />
        </label>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {totalPayments} {totalPayments === 1 ? "pago" : "pagos"} encontrados
        </p>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-[#dff400] hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Cargando pagos...</p>
      ) : payments.length === 0 ? (
        <div className="p-8 text-center text-gray-400 bg-[#1A1A1A] rounded-xl">
          No se encontraron pagos con los filtros seleccionados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#282828] text-[#dff400]">
                <th className="px-4 py-3 font-semibold">Usuario</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold text-right">Monto</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Periodo</th>
                <th className="px-4 py-3 font-semibold text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const status = STATUS_META[payment.status ?? ""] ?? {
                  label: payment.status ?? "—",
                  className: "bg-gray-500/15 text-gray-300",
                };
                return (
                  <tr
                    key={payment.id}
                    className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <td className="px-4 py-3 font-medium">{payment.user_name || "—"}</td>
                    <td className="px-4 py-3">{payment.plan_name || "—"}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">
                      {formatDate(payment.period_start)} – {formatDate(payment.period_end)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(payment);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-[#dff400] hover:bg-white/5 cursor-pointer"
                        aria-label="Ver detalle"
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination
          paginaActual={page}
          totalPaginas={totalPages}
          onChange={setPage}
        />
      )}

      <PaymentDetailModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </section>
  );
}
