'use client'

import { Star } from "lucide-react";

import type {
  CardListProps,
  CardUsuarioProps,
  StarsProps,
  TableListProps,
} from "../typeScript/tablaType";
import { useEffect, useState } from "react";

export function TableList({ encabezado, home, columns }: TableListProps) {

  return (
    <>
      <div className="mt-3 w-full rounded-md">
        {/* encabezado */}
        <div className={`grid  !bg-[#0e0d0d] p-3  px-5 rounded-lg text-white border border-[#333]}`} style={{ gridTemplateColumns: `repeat(${columns}, ${home ? '200px' : '250px'})` }} >
          {encabezado?.map((item, index: number) => (
            <h3
              key={index}
              className={`col-span-1 font-semibold justify-center w-full ${home ? 'text-base' : 'text-xl'} line-clamp-1 text-ellipsis`}
            >
              {item}
            </h3>
          ))}
        </div>
      </div >
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

export function CardList({ data, columns }: CardListProps) {

  const respuesta = data.map((data) => {
    console.log(Object.keys(data).length);
  })

  useEffect(() => {
    respuesta
  }, [])
  return (
    <div className="flex flex-col gap-2  w-full">
      {data.map((t: any, i) => (
        <div
          key={i}
          className="grid text-[20px] rounded-md  bg-[#333] p-[20px] text-white"
          style={{ gridTemplateColumns: `repeat(${columns}, 250px)` }}
        >
          {/* Columna 1: Nombre */}
          <div className="flex gap-3 items-center w-full px-2">
            <div className="h-15 w-15 rounded-full overflow-hidden bg-gray-700 flex items-center justify-between">
              {t.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400"></span>
              )}
            </div>
            <span className="max-w-[150px] w-full text-ellipsis overflow-hidden" title={t.name}>{t.name}</span>
          </div>

          <div className="w-full  px-2 overflow-hidden">
            <span>{t.id}</span>
          </div>

          <div className="w-full px-2 overflow-hidden">
            <span>{t.email}</span>
          </div>

          <div className="w-full  px-2 overflow-hidden">
            <span>{t.usuarios}</span>
          </div>

          <div className=" flex justify-center w-full px-2 overflow-hidden">
            {t.valoration ? (
              <Stars rating={Number(t.valoration)} size={20} />
            ) : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardUsuario({ dataUser }: CardUsuarioProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {dataUser.map((t, i) => (
        <div
          key={i}
          className="flex h-[88px] text-[20px] items-center rounded-md bg-[#333] p-[20px] text-white"
        >
          <div className="flex items-center w-full space-x-4 px-2">
            <div className="h-15 w-15 rounded-full overflow-hidden bg-gray-700 flex items-center justify-between">
              {t.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-center text-gray-400"></span>
              )}
            </div>
            <span>{t.name}</span>
          </div>

          <div className="text-center w-full px-2">
            <span>{t.id}</span>
          </div>

          <div className="text-center w-full px-2">
            <span>{t.email}</span>
          </div>

          <div className="text-center w-full px-2">
            <span>{t.usuarios}</span>
          </div>

          {t.plan && (
            <div className="flex justify-center w-full px-2">
              <span>{t.plan}</span>
            </div>
          )}

          {t.entenador && (
            <div className="flex justify-center w-full px-2">
              <span>{t.entenador}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
const InputsModule = { TableList, CardList, Stars, CardUsuario };
export default InputsModule;
