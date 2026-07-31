'use client'

import { Star } from "lucide-react";

import { useEffect } from "react";
import type {
  CardListProps,
  StarsProps,
  TableListProps,
} from "@/types/tablaType";

export function TableList({ encabezado, home, columns }: TableListProps) {
  return (
    <>
      <div className="mt-3 w-full rounded-md">
        {/* encabezado */}
        <div
          className={`grid bg-[#0e0d0d] p-3  px-5 rounded-lg text-white border border-[#333]}`}
          style={{
            gridTemplateColumns: encabezado
              ?.map((item) => item.width)
              .join(" "),
          }}
        >
          {encabezado?.map((item, index: number) => (
            <h3
              key={index}
              className={`col-span-1 font-semibold justify-center w-full ${home ? "text-base" : "text-xl"
                } line-clamp-1 text-ellipsis`}
            >
              {item.label}
            </h3>
          ))}
        </div>
      </div>
    </>
  );
}

export const Stars = ({ rating, size = 16, showNumber = true }: StarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalStars = 1;

  return (
    <div className="flex text-[20px] ">
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
        <p className="ml-2 text-sm text-gray-300">{rating.toFixed(1)}</p>
      )}
    </div>
  );
};

export function CardList({
  data,
  columns,
  encabezado,
  onCardClick,
  variant,
}: CardListProps & { variant?: "trainer" }) {
  const respuesta = data.map((data) => {
    console.log(Object.keys(data).length);
  });

  useEffect(() => {
    respuesta;
  }, []);

  return (
    <div className="flex flex-col gap-2  w-full">
      {data.map((t: any, i) => (
        <div
          key={i}
          onClick={() => onCardClick && onCardClick(t.id ? t.id : t.user_id)}
          className="grid text-[20px] rounded-md  bg-[#333] p-5 cursor-pointer hover:bg-[#484848] text-white"
          style={{
            gridTemplateColumns: encabezado
              ?.map((item) => item.width)
              .join(" "),
          }}
        >
          {/* Columna 1: Nombre */}
          <div className="flex gap-3 items-center w-full px-2">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {t.image || t.userImage ? (
                <img
                  src={t.image ?? t.userImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                  {(t.name || "?")[0].toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-ellipsis overflow-hidden" title={t.name}>
              {t.name || "Usuario sin nombre"}
            </span>
          </div>

          {/* Columna 2: ID */}
          <div className="w-full flex items-center px-2 overflow-hidden">
            <span>{t.id ?? t.user_id}</span>
          </div>

          {/* Columna 3: Email */}
          <div className="w-full flex items-center px-2 overflow-hidden">
            <span className="text-ellipsis overflow-hidden">{t.email ?? t.user_email}</span>
          </div>

          {variant === "trainer" ? (
            <>
              {/* Columna 4 trainer: Cantidad usuarios */}
              <div className="w-full flex items-center px-2 overflow-hidden">
                <span>{t.usuarios ?? 0} usuario{(t.usuarios ?? 0) !== 1 ? "s" : ""}</span>
              </div>
              {/* Columna 5 trainer: Valoración */}
              <div className="w-full flex items-center px-2 overflow-hidden">
                {t.valoration ? (
                  <Stars rating={Number(t.valoration)} size={20} />
                ) : (
                  <span className="text-gray-400">Sin valoración</span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Columna 4 usuario: Plan */}
              <div className="w-full flex items-center px-2 overflow-hidden">
                {t.plan || t.plan_id
                  ? <span>{t.plan || t.plan_id}</span>
                  : <span className="text-gray-400">Sin plan</span>}
              </div>
              {/* Columna 5 usuario: Entrenador */}
              <div className="flex items-center gap-2 px-2 overflow-hidden">
                {t.trainer_image && (
                  <img src={t.trainer_image} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                )}
                <span className={t.trainer_name && t.trainer_name !== "Sin entrenador" ? "" : "text-gray-400"}>
                  {t.trainer_name || "Sin entrenador"}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
const InputsModule = { TableList, CardList, Stars };
export default InputsModule;
