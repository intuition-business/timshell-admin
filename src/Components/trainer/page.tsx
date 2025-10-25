"use client";

// import { useState } from "react";
import Inputs from "../Inputs/inputs";


import { CardList, TableList } from "../Table/TableList";

export default function TrainerDashboard() {
  const EncabezadosData = [
    "Nombre",
    "ID",
    "Correo electrónico ",
    "Plan",
    "Entrenador",
  ];
  const data = [
    {
      name: "Laura Fernández",
      id: "91F3C",
      email: "laura@email.com",
      plan: "Intermedio",
      entrena: "Juliana",
    },
    {
      name: "Diego Torres",
      id: "TMU-V58P2F",
      email: "diego@email.com",
      plan: "Plan avanzado",
      entrena: "Emilyn",
    },
    {
      name: "Laura Fernández",
      id: "91F3C",
      email: "laura@email.com",
      plan: "Intermedio",
      entrena: "Juliana",
    },
    {
      name: "Diego Torres",
      id: "TMU-V58P2F",
      email: "diego@email.com",
      plan: "Plan avanzado",
      entrena: "Emilyn",
    },
  ];

  return (
    <section className="  fp-6 bg-[#101010]  rounded-3xl shadow-lg w-full text-white items-center">
      <div className="w-full justify-end p-4">
        <div className="flex mx-7">
          <h1 className="text-3xl font-bold mt-10 p-8 text-[#dff400]">
            Entrenador
          </h1>
        </div>

        <div className=" flex gap-3 px-15  ">
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
            <h2 className=" font-bold mx-16 my-6 ">Gestión de usuaria</h2>
            <p className=" font-bold text-[#dff400] mx-16 my-6">
              Usuarios activos 200
            </p>
          </div>
          <div className=" px-16 flex relative -translate-y-4 ">
            <TableList encabezado={EncabezadosData} data={data} />
          </div>
          <div className="w- p-0 rounded-2xl px-15 flex flex-col sm:flex-row sm:items-center justify-between">
            <CardList data={data} columns={EncabezadosData} />
          </div>
        </div>
      </div>
    </section>
  );
}
