"use client";

import { useEffect, useState } from "react";
import Inputs from "../Inputs/inputs";
import AccionBar from "../navBar/ActionBar";
import { CardList, TableList } from "../Table/TableList";
import type { Entrenador } from "../typeScript/trainerType";

export default function Trainer() {
  const EncabezadosData = [
    { label: "Nombre", width: "250px" },
    { label: "ID", width: "100px" },
    { label: "Correo electrónico", width: "300px" },
    { label: "Cantidad de usuarios", width: "200px" },
    { label: "Valoración", width: "150px" },
  ];

  const [data, setData] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const response = await fetch(
          "https://api.timshell.co/api/trainers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener entrenadores");
        }

        const result = await response.json();

        // 🔁 Adaptamos la data del backend a tu tipo Entrenador
        const formattedData: Entrenador[] = result.data.map((trainer: any) => ({
          id: trainer.id,
          name: trainer.name,
          email: trainer.email,
          usuarios: trainer.user_count ?? 0,
          valoration: Number(trainer.rating) || 0,
          image: trainer.image || "https://i.pravatar.cc/100",
        }));


        setData(formattedData);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <section className="fp-6 rounded-3xl shadow-lg w-full text-white items-center">
      <div className="w-full justify-end p-4">
        <h1 className="text-3xl font-bold text-[#dff400]">Entrenador</h1>

        <div className="flex gap-3 my-4">
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

        <h2 className="font-bold text-[#dff400] mx-16 my-6">
          Gestión de usuarios
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Cargando entrenadores...</p>
        ) : (
          <div className="flex flex-col w-full gap-2">
            <TableList encabezado={EncabezadosData} data={data} columns={5} />
            <CardList encabezado={EncabezadosData} data={data} columns={5} />
          </div>
        )}
      </div>

      <AccionBar textButton="Crear entrenador" />
    </section>
  );
}
