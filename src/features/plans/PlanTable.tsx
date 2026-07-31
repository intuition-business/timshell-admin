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
    <div className="overflow-x-auto rounded-xl border border-white/10 mt-4">
      <table className="w-full text-base text-left border-collapse">
        <thead>
          <tr className="bg-[#282828] text-[#dff400]">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
}

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

  return (
    <tr className="border-t border-white/5 hover:bg-white/5 text-white">
      {columns.map((col, i) => {
        if (col.key === "estado") {
          return (
            <td key={i} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStatus?.(row, !active)}
                  disabled={isBusy}
                  className={`w-9 h-5 flex items-center rounded-full p-1 transition ${
                    active ? "bg-lime-400" : "bg-gray-500"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div
                    className={`bg-black w-3 h-3 rounded-full shadow-md transform transition ${
                      active ? "translate-x-4" : ""
                    }`}
                  />
                </button>
                <span>{active ? "Activo" : "Inactivo"}</span>
              </div>
            </td>
          );
        }

        if (col.key === "acciones") {
          return (
            <td key={i} className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(row)}
                  disabled={isBusy}
                  className="flex items-center gap-1 rounded-md bg-[#2c2c2c] px-3 py-1.5 text-xs transition hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Editar <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(row)}
                  disabled={isBusy}
                  className="flex items-center gap-1 rounded-md border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Eliminar <Trash2 size={14} />
                </button>
              </div>
            </td>
          );
        }

        return (
          <td key={i} className="px-4 py-3">
            {String(row[col.key as keyof PlanTableRow] ?? "")}
          </td>
        );
      })}
    </tr>
  );
}
