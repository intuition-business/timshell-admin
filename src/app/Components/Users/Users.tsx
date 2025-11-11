"use client";

import { useRouter } from "next/navigation"; // ✅ Import correcto para App Router
import { useEffect, useState } from "react";
import Inputs from "../Inputs/inputs";
import { CardList, TableList } from "../Table/TableList";
import Pagination from "../ui/Pagination";

interface User {
  plan_id: null;
  user_image: string;
  plan_name: string;
  name?: string;
  id: number;
  email?: string;
  phone?: string;
  trainer_name?: string;
  trainer_image?: string;
}

export default function UserDashboard() {
  const router = useRouter(); // ✅ Ahora funcionará sin errores
  const [data, setData] = useState([]);

  const EncabezadosData = [
    { label: "Nombre", width: "250px" },
    { label: "ID", width: "100px" },
    { label: "Correo electrónico", width: "300px" },
    { label: "Plan", width: "150px" },
    { label: "Entrenador", width: "200px" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users`, {
        headers: { "x-access-token": token },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            const mappedData = json.data.map((user: User) => ({
              id: user.id?.toString() || "",
              name: user.name || "",
              email: user.email || user.phone || "",
              plan_id: user.plan_id || null,
              plan: user.plan_name || "",
              trainer_name: user.trainer_name || "Sin entrenador",
              trainer_image: user.trainer_image || "",
              userImage: user.user_image || "",
            }));
            setData(mappedData);
          }
        })
        .catch((err) => console.error("Error fetching users:", err));
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  const handleUserClick = (userId: string) => {
    console.log("Navegando al usuario:", userId);
    router.push(`/pages/users/${userId}`);
  };

  return (
    <main>
      <div className="w-full text-white items-center">
        <div className="w-full justify-end">
          <h1 className="text-3xl font-bold text-[#dff400] mb-9">Usuarios</h1>

          <div className="flex gap-6">
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

          <div>
            <div className="flex">
              <h2 className="font-bold my-6">Gestión de usuaria</h2>
              <p className="font-bold text-[#dff400] mx-16 my-6">
                Usuarios activos 200
              </p>
            </div>

            <div className="flex relative -translate-y-4">
              <TableList encabezado={EncabezadosData} data={data} columns={5} />
            </div>

            <div className="p-0 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between">
              <CardList
                encabezado={EncabezadosData}
                data={data}
                columns={5}
                onCardClick={handleUserClick} // ✅ clickeable
              />
            </div>
          </div>
        </div>

        <div className="w-full p-6 mb-11">
          <Pagination paginaActual={1} totalPaginas={6} onChange={() => {}} />
        </div>
      </div>
    </main>
  );
}
