"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Inputs, { SearchInput, SelectInput } from "../Inputs/inputs";
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
  total_users?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [totalUser, setTotalUser] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 36;

  const EncabezadosData = [
    { label: "Nombre", width: "250px" },
    { label: "ID", width: "100px" },
    { label: "Correo electrónico", width: "300px" },
    { label: "Plan", width: "150px" },
    { label: "Entrenador", width: "200px" },
  ];

  const fetchInfo = async (page: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users?page=${page}`, {
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
            setTotalUser(json.total_users);
            setTotalPages(json.total_pages);

            setData(mappedData);
          }
        })
        .catch((err) => console.error("Error fetching users:", err));
    } else {
      console.error("No token found in localStorage");
    }
  };

  // fetch para consultar usuarios
  useEffect(() => {
    const savedPage = localStorage.getItem("userListPage");
    if (savedPage) {
      setCurrentPage(Number(savedPage));
      fetchInfo(Number(savedPage));
    } else {
      fetchInfo(currentPage);
    }
  }, []);

  const handleUserClick = (userId: string) => {
    localStorage.setItem("userListPage", currentPage.toString());
    router.push(`/users/${userId}`);
  };

  useEffect(() => {
    fetchInfo(currentPage);
  }, [currentPage]);

  return (
    <main>
      <div className="w-full text-white items-center">
        <div className="w-full justify-end">
          <h1 className="text-3xl font-bold text-[#dff400] mb-9">Usuarios</h1>

          {/*     <div className="flex gap-6">
            <SearchInput placeholder="Buscar..." />
            <SelectInput
              placeholder="Tipo de plan"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
            <SelectInput
              placeholder="Ordenar"
              options={["Opción 1", "Opción 2"]}
              IconChevronDown
            />
          </div> */}

          <div>
            <div className="flex">
              <h2 className="font-bold my-6 text-xl">Gestión de usuarios</h2>
              <p className="font-light text-[#dff400] text-lg mx-16 my-6">
                Usuarios activos {totalUser}
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
                onCardClick={handleUserClick}
              />
            </div>
          </div>
        </div>

        <div className="w-full p-6 mb-11">
          <Pagination paginaActual={currentPage} totalPaginas={totalPages} onChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      </div>
    </main>
  );
}
