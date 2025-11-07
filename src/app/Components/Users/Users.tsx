"use client";

import { useEffect, useState } from "react";
import Inputs from "../Inputs/inputs";
import { CardList, TableList } from "../Table/TableList";
import Pagination from "../ui/Pagination";

interface User {
  user_image: string;
  plan_id: any;
  name?: string;
  id: number;
  email?: string;
  phone?: string;
  trainer_name?: string;
  trainer_image?: string;
}

export default function UserDashboard() {
  const EncabezadosData = [
    "Nombre",
    "ID",
    "Correo electrónico ",
    "Plan",
    "Entrenador",
  ];
  const [dataUser, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            const mappedData = json.data.map((user: User) => ({
              id: user.id.toString(),
              name: user.name || "",
              email: user.email || user.phone || "",
              plan: user.plan_id ? `Plan #${user.plan_id}` : "Desconocido",
              trainer: user.trainer_name || "",
              trainer_image: user.trainer_image || "",
              user_image: user.user_image || "", // <-- agregamos la foto del usuario
            }));
            setData(mappedData);
          }
        })
        .catch((err) => console.error("Error fetching users:", err));
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  return (
    <section className="w-full text-white items-center">
      <div className="w-full justify-end">
        <h1 className="text-3xl font-bold text-[#dff400] mb-9">Usuarios</h1>
        <div className=" flex gap-6">
          <Inputs.SearchInput placeholder="Buscar..." />
          <Inputs.SelectInput
            placeholder="Tipo de plan"
            options={["Opción 1", "Opción 2"]}
            IconChevronDown
          />
          <Inputs.SelectInput
            placeholder="Ordenar"
            options={["Opción 1", "Opción 2"]}
            IconChevronDown
          />
        </div>
        <div className=" ">
          <div className="flex">
            <h2 className=" font-bold my-6 ">Gestión de usuaria</h2>
            <p className=" font-bold text-[#dff400] mx-16 my-6">
              Usuarios activos 200
            </p>
          </div>
          <div className="flex relative -translate-y-4 ">
            <TableList
              encabezado={EncabezadosData}
              data={dataUser}
              columns={5}
            />
          </div>
          <div className="w- p-0 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between">
            <CardList data={dataUser} columns={5} />
          </div>
        </div>
      </div>
      <div className="w-full p-6 mb-11 ">
        <Pagination paginaActual={1} totalPaginas={6} onChange={() => {}} />
      </div>
    </section>
  );
}
