"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Inputs, { SearchInput, SelectInput } from "@/components/inputs/inputs";
import { CardList, TableList } from "@/components/table/TableList";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";

const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload))?.role ?? null;
  } catch {
    return null;
  }
};

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
  const auth = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [totalUser, setTotalUser] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Evita disparar el fetch hasta restaurar la página guardada (sin esto se
  // lanzan dos peticiones que compiten y dejan la lista vacía).
  const [ready, setReady] = useState(false);
  const itemsPerPage = 36;

  const EncabezadosData = [
    { label: "Nombre", width: "250px" },
    { label: "ID", width: "100px" },
    { label: "Correo electrónico", width: "300px" },
    { label: "Plan", width: "150px" },
    { label: "Entrenador", width: "200px" },
  ];

  const mapUser = (user: any) => ({
    id: (user.id ?? user.user_id)?.toString() || "",
    name: user.name || "",
    email: user.email || user.user_email || user.phone || "",
    plan_id: user.plan_id || null,
    plan: user.plan_name || "",
    trainer_name: user.trainer_name || "Sin entrenador",
    trainer_image: user.trainer_image || "",
    userImage: user.user_image || user.image || "",
  });

  // Cierra sesión y vuelve al login cuando el token falta, es inválido o lo rechaza el backend
  const redirectToLogin = () => {
    auth?.logout?.();
    router.replace("/login");
  };

  // Guard: sin token o token inválido -> login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !getRoleFromToken(token)) {
      redirectToLogin();
    }
  }, []);

  const fetchInfo = async (page: number) => {
    const token = localStorage.getItem("token");
    const roleFromToken = token ? getRoleFromToken(token) : null;
    if (!token || !roleFromToken) {
      redirectToLogin();
      return;
    }

    const trainer = roleFromToken !== "admin";

    // Entrenador: solo sus usuarios asignados (el backend los deriva del token)
    if (trainer) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trainers/my-users`, {
        headers: { "x-access-token": token },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            redirectToLogin();
            return null;
          }
          return res.json();
        })
        .then((json) => {
          if (!json) return;
          const assigned =
            json?.data?.assigned_users ?? json?.data ?? json?.users ?? [];
          const mappedData = (Array.isArray(assigned) ? assigned : []).map(mapUser);
          setTotalUser(mappedData.length);
          setTotalPages(1);
          setData(mappedData);
        })
        .catch((err) => console.error("Error fetching trainer users:", err));
      return;
    }

    // Admin: todos los usuarios paginados
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users?page=${page}`, {
      headers: { "x-access-token": token },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          redirectToLogin();
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.data) {
          // Página fuera de rango (p.ej. guardada en localStorage): volver a la 1
          if (json.data.length === 0 && json.total_pages > 0 && page > json.total_pages) {
            localStorage.setItem("userListPage", "1");
            setCurrentPage(1);
            return;
          }

          const mappedData = json.data.map(mapUser);
          setTotalUser(json.total_users);
          setTotalPages(json.total_pages);

          setData(mappedData);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  // restaurar la página guardada al montar y habilitar el fetch
  useEffect(() => {
    const savedPage = Number(localStorage.getItem("userListPage"));
    if (savedPage && savedPage > 0) setCurrentPage(savedPage);
    setReady(true);
  }, []);

  const handleUserClick = (clickedId: string) => {
    localStorage.setItem("userListPage", currentPage.toString());
    router.push(`/users/${clickedId}`);
  };

  // cargar datos solo después de restaurar la página (rol derivado del token)
  useEffect(() => {
    if (!ready) return;
    fetchInfo(currentPage);
  }, [currentPage, ready]);

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
            localStorage.setItem("userListPage", page.toString());
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      </div>
    </main>
  );
}
