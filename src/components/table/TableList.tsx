'use client'

import { Star } from "lucide-react";
import type { CardListProps, StarsProps, TableListProps } from "@/types/tablaType";

export function TableList(_props: TableListProps) {
  return null;
}

export const Stars = ({ rating, size = 16, showNumber = true }: StarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalStars = 1;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? "text-yellow-400 fill-yellow-400"
              : hasHalf && i === fullStars
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-500"
          }
        />
      ))}
      {showNumber && (
        <p className="ml-1 text-sm text-gray-300">{rating.toFixed(1)}</p>
      )}
    </div>
  );
};

export function CardList({
  data,
  encabezado,
  onCardClick,
  variant,
}: CardListProps & { variant?: "trainer" }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 w-full mt-3">
      <table className="w-full text-base text-left border-collapse">
        <thead>
          <tr className="bg-[#282828] text-[#dff400]">
            {encabezado?.map((col, i) => (
              <th key={i} className="px-4 py-3 font-semibold whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((t: any, i) => (
            <tr
              key={i}
              onClick={() => onCardClick?.(t.id ?? t.user_id)}
              className="border-t border-white/5 hover:bg-white/5 cursor-pointer text-white"
            >
              {/* Columna 1: Nombre + avatar */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    {t.image || t.userImage ? (
                      <img
                        src={t.image ?? t.userImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                        {(t.name || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="truncate">{t.name || "Usuario sin nombre"}</span>
                </div>
              </td>

              {/* Columna 2: ID */}
              <td className="px-4 py-3">{t.id ?? t.user_id}</td>

              {/* Columna 3: Email */}
              <td className="px-4 py-3 truncate max-w-[280px]">
                {t.email ?? t.user_email}
              </td>

              {variant === "trainer" ? (
                <>
                  {/* Columna 4 trainer: Cantidad usuarios */}
                  <td className="px-4 py-3">
                    {t.usuarios ?? 0} usuario{(t.usuarios ?? 0) !== 1 ? "s" : ""}
                  </td>
                  {/* Columna 5 trainer: Valoración */}
                  <td className="px-4 py-3">
                    {t.valoration ? (
                      <Stars rating={Number(t.valoration)} size={16} />
                    ) : (
                      <span className="text-gray-400">Sin valoración</span>
                    )}
                  </td>
                </>
              ) : (
                <>
                  {/* Columna 4 usuario: Plan */}
                  <td className="px-4 py-3">
                    {t.plan || t.plan_id ? (
                      <span>{t.plan || t.plan_id}</span>
                    ) : (
                      <span className="text-gray-400">Sin plan</span>
                    )}
                  </td>
                  {/* Columna 5 usuario: Entrenador */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.trainer_image && (
                        <img
                          src={t.trainer_image}
                          alt=""
                          className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <span className={t.trainer_name && t.trainer_name !== "Sin entrenador" ? "" : "text-gray-400"}>
                        {t.trainer_name || "Sin entrenador"}
                      </span>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const InputsModule = { TableList, CardList, Stars };
export default InputsModule;
