"use client";

// import { useState } from "react";
import Inputs from "../Inputs/inputs";
import { CardList, TableList } from "../Table/TableList";
import type { Entrenador } from "../typeScript/trainerType";
import Buttons from "../ui/Buttons";

export default function Trainer() {
  const EncabezadosData = [
    "Nombre",
    "ID",
    "Correo electrónico ",
    "Cantidad de usuarios",
    "Valoración",
  ];
  const data: Entrenador[] = [
    {
      name: "Sebastián Morales",
      id: "91F3C",
      email: "sebastian.morales@email.com",
      usuarios: 49,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=1"
    },
    {
      name: "María López",
      id: "TMU-H35J8D",
      email: "maria.lopez@email.com",
      usuarios: 32,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=2"
    },
    {
      name: "Diego Torres",
      id: "TMU-V58P2F",
      email: "diego.torres@email.com",
      usuarios: 12,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=3"
    },
    {
      name: "Lucía Ramírez",
      id: "TMU-E92W3T",
      email: "lucia.ramirez@email.com",
      usuarios: 30,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=4"
    },
    {
      name: "María López",
      id: "TMU-H35J8D",
      email: "maria.lopez@email.com",
      usuarios: 32,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=2"
    },
    {
      name: "Diego Torres",
      id: "TMU-V58P2F",
      email: "diego.torres@email.com",
      usuarios: 12,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=3"
    },
    {
      name: "Lucía Ramírez",
      id: "TMU-E92W3T",
      email: "lucia.ramirez@email.com",
      usuarios: 30,
      valoration: 4.7,
      image: "https://i.pravatar.cc/100?img=4"
    },
  ];

  return (
    <section className="  fp-6 rounded-3xl shadow-lg w-full text-white items-center">
      <div className="w-full justify-end p-4">
        <div className="flex">
          <h1 className="text-3xl font-bold text-[#dff400]">
            Entrenador
          </h1>
        </div>

        <div className=" flex gap-3">
          <div className="">
            <Inputs.SearchInput placeholder="Buscar..." />
          </div>
          <div className="">
            <Inputs.SelectInput
              placeholder="Tipo de plan"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
          </div>
          <div className="">
            <Inputs.SelectInput
              placeholder="Ordenar"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
          </div>
        </div>
        <div className=" ">
          <div className="flex  ">
            <h2 className=" font-bold text-[#dff400]  mx-16 my-6 ">
              Gestión de usuaria
            </h2>
          </div>
          <div className="flex relative -translate-y-4  flex-col w-full gap-2">
            <TableList encabezado={EncabezadosData} data={data} columns={5} />
            <CardList data={data} columns={5} />

          </div>
        </div>
      </div>
      <div className="flex justify-end items-center sticky bottom-0 bg-black w-[calc(100%+96px)] -translate-x-[48px] pr-12 py-4 text-lg">
        <Buttons data="Crear entrenador" className="max-w-[370px] w-full py-4" />
      </div>
    </section>
  );
}
