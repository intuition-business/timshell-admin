'use client';

import { ChevronRight, Trash2 } from "lucide-react";

type Column = {
  key: string;
  label: string;
  width?: string;
};

export type PlanTableRow = {
  id: string;
  plan: string;
  precio: string;
  generaciones: string;
  usuarios: number;
  estado: string;
};

type TablaProps = {
  columns: Column[];
  data: PlanTableRow[];
  onEdit?: (row: PlanTableRow) => void;
  onToggleStatus?: (row: PlanTableRow, newStatus: boolean) => void;
  onDelete?: (row: PlanTableRow) => void;
  busyRowId?: string | null;
};

export function TablaPlan({
  columns,
  data,
  onEdit,
  onToggleStatus,
  onDelete,
  busyRowId,
}: TablaProps) {
  return (
    <div className="w-full mt-4">
      {/* HEADER */}
      <div
        className="grid bg-[#0e0d0d] text-white border border-[#333] rounded-t-lg px-5 py-3"
        style={{
          gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
        }}
      >
        {columns.map((col, i) => (
          <span key={i} className="text-sm font-semibold">
            {col.label}
          </span>
        ))}
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-2 mt-2">
        {data.map((row) => (
          <Row
            key={row.id}
            row={row}
            columns={columns}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            busyRowId={busyRowId}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= ROW ================= */

function Row({
  row,
  columns,
  onEdit,
  onToggleStatus,
  onDelete,
  busyRowId,
}: {
  row: PlanTableRow;
  columns: Column[];
  onEdit?: (row: PlanTableRow) => void;
  onToggleStatus?: (row: PlanTableRow, newStatus: boolean) => void;
  onDelete?: (row: PlanTableRow) => void;
  busyRowId?: string | null;
}) {
  const active = row.estado === "Activo";
  const isBusy = busyRowId === row.id;

  const handleToggle = () => {
    onToggleStatus?.(row, !active);
  };

  return (
    <div
      className="grid items-center bg-[#1a1a1a] hover:bg-[#262626] text-white px-5 py-4 rounded-lg border border-[#2a2a2a] transition"
      style={{
        gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
      }}
    >
      {columns.map((col, i) => {
        /* === COLUMNA ESTADO === */
        if (col.key === "estado") {
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggle}
                disabled={isBusy}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                  active ? "bg-lime-400" : "bg-gray-500"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div
                  className={`bg-black w-4 h-4 rounded-full shadow-md transform transition ${
                    active ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm">
                {active ? "Activo" : "Inactivo"}
              </span>
            </div>
          );
        }

        /* === COLUMNA ACCIONES === */
        if (col.key === "acciones") {
          return (
            <div key={i} className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onEdit && onEdit(row)}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-md bg-[#2c2c2c] px-4 py-2 text-sm transition hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Editar
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(row)}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-md border border-red-500/30 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Eliminar
                <Trash2 size={16} />
              </button>
            </div>
          );
        }

        /* === DEFAULT === */
        return (
          <div key={i} className="text-sm">
            {String(row[col.key as keyof PlanTableRow] ?? "")}
          </div>
        );
      })}
    </div>
  );
}