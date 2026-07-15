"use client";

import { X } from "lucide-react";

export interface Payment {
  id: number;
  mercadopago_id: number | null;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  plan_id: number | null;
  plan_name: string | null;
  entrenador_id: number | null;
  trainer_name: string | null;
  amount: string | null;
  net_amount: string | null;
  fee_amount: string | null;
  status: string | null;
  payment_method_id: string | null;
  payment_type_id: string | null;
  currency_id: string | null;
  payer_email: string | null;
  period_start: string | null;
  period_end: string | null;
  approved_at: string | null;
  created_at: string | null;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  approved: { label: "Aprobado", className: "bg-[#dff400]/15 text-[#dff400]" },
  pending: { label: "Pendiente", className: "bg-yellow-500/15 text-yellow-300" },
  rejected: { label: "Rechazado", className: "bg-red-500/15 text-red-300" },
};

const PAYMENT_TYPE_LABEL: Record<string, string> = {
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  account_money: "Dinero en cuenta",
};

const formatCurrency = (value: string | null): string => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) return "—";
  return numeric.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5 py-2 border-b border-white/5">
    <span className="text-xs text-gray-400">{label}</span>
    <span className="text-sm break-words">{value ?? "—"}</span>
  </div>
);

interface Props {
  payment: Payment | null;
  onClose: () => void;
}

export default function PaymentDetailModal({ payment, onClose }: Props) {
  if (!payment) return null;

  const status = STATUS_META[payment.status ?? ""] ?? {
    label: payment.status ?? "—",
    className: "bg-gray-500/15 text-gray-300",
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1F1F1F] text-white rounded-2xl shadow-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1F1F1F] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#dff400]">Detalle del pago</h2>
            <p className="text-sm text-gray-400">
              #{payment.id}
              {payment.mercadopago_id ? ` · MercadoPago ${payment.mercadopago_id}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <Row label="Usuario" value={payment.user_name} />
          <Row label="Correo del usuario" value={payment.user_email} />
          <Row label="Plan" value={payment.plan_name} />
          <Row label="Entrenador" value={payment.trainer_name} />

          <Row label="Monto total" value={formatCurrency(payment.amount)} />
          <Row label="Comisión MercadoPago" value={formatCurrency(payment.fee_amount)} />
          <Row label="Monto neto" value={formatCurrency(payment.net_amount)} />
          <Row label="Moneda" value={payment.currency_id} />

          <Row
            label="Tipo de pago"
            value={
              payment.payment_type_id
                ? PAYMENT_TYPE_LABEL[payment.payment_type_id] ?? payment.payment_type_id
                : "—"
            }
          />
          <Row label="Método de pago" value={payment.payment_method_id} />
          <Row label="Email del pagador" value={payment.payer_email} />

          <Row label="Inicio del periodo" value={formatDateTime(payment.period_start)} />
          <Row label="Fin del periodo" value={formatDateTime(payment.period_end)} />
          <Row label="Aprobado el" value={formatDateTime(payment.approved_at)} />
          <Row label="Creado el" value={formatDateTime(payment.created_at)} />
        </div>
      </div>
    </div>
  );
}
