"use client";

import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

type Trainer = {
  name: string;
  id: string;
  email: string;
  users: number;
  rating: number;
};

const trainersData: Trainer[] = [
  {
    name: "Laura Fernández",
    id: "91F3C",
    email: "laura.fernandez@email.com",
    users: 49,
    rating: 4.7,
  },
  {
    name: "María López",
    id: "TMU-H35J8D",
    email: "maria.lopez@email.com",
    users: 32,
    rating: 4.7,
  },
  {
    name: "Diego Torres",
    id: "TMU-V58P2F",
    email: "diego.torres@email.com",
    users: 12,
    rating: 4.7,
  },
  {
    name: "Sofía Ruiz",
    id: "TMU-F21Y7H",
    email: "sofia.ruiz@email.com",
    users: 29,
    rating: 4.7,
  },
  {
    name: "Andrés Garcia",
    id: "TMU-D64K1R",
    email: "andres.garcia@email.com",
    users: 21,
    rating: 4.7,
  },
  {
    name: "Valentina Cruz",
    id: "TMU-P39B2Q",
    email: "valentina.cruz@email.com",
    users: 38,
    rating: 4.7,
  },
  {
    name: "Cristian Sánchez",
    id: "TMU-R88T6S",
    email: "cristian.sanchez@email.com",
    users: 56,
    rating: 4.7,
  },
  {
    name: "Isabella Morales",
    id: "TMU-J72X4N",
    email: "isabella.morales@email.com",
    users: 22,
    rating: 4.7,
  },
  {
    name: "Camila Herrera",
    id: "TMU-L90F8M",
    email: "carlos.ramirez@email.com",
    users: 99,
    rating: 4.7,
  },
  {
    name: "Lucía Ramírez",
    id: "TMU-E92W3T",
    email: "lucia.ramirez@email.com",
    users: 30,
    rating: 4.7,
  },
];

export default function TrainerDashboard() {
  const [search, setSearch] = useState("");

  const filtered = trainersData.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="  fp-6 bg-[#101010]   rounded-3xl shadow-lg w-full text-white items-center">
      <div className="w-full   justify-end p-4">
        <div className="flex  w-[55%] p-4 justify-center">
          <h1 className="text-2xl font-bold p-2 text-[#dff400]"> Usuarios</h1>
        </div>

        <div className=" px-24  w-[95%]">
          <div className="flex items-center justify-center border-amber-10 gap-24">
            <div className="relative flex justify-around ">
              <input
                type="text"
                placeholder="Buscador"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-700 bg-[#1a1a1a] rounded-xl pl-8 pr-3 py-2 text-sm text-gray-200 focus:ring-2 outline-none"
              />
              <IconSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative flex justify-around ">
              <input
                type="text"
                placeholder="Buscador"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-700 bg-[#1a1a1a] rounded-xl pl-8 pr-3 py-2 text-sm text-gray-200 focus:ring-2 outline-none"
              />
              <IconSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="relative flex justify-around ">
              <input
                type="text"
                placeholder="Buscador"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" border-gray-700 bg-[#1a1a1a] rounded-xl pl-8 pr-3 py-2 text-sm text-gray-200 focus:ring-2 outline-none"
              />
              <IconSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
          <div className="flex gap-8 p-6 w-[60%]  justify-center">
            <p>Gestion</p> <p className="text-[#dff400]">Usuaria activos 200</p>
          </div>
        </div>
        <div className=" w-[100%] flex justify-center ">
          <div className="bg-[#1a1a1a] w-[50%]  my-4 border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all">
            <p>Nombre</p> <p className="">ID</p>{" "}
            <p className="">Correo electrónico</p> <p className="">Plan</p>
            <p className="">Entrenador</p>
          </div>
        </div>
        <div className="space-y-7 flex items-center justify-center w-[100%]">
          <div className="w-[50%]">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-[#1a1a1a] my-4 border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <p className="font-semibold text-lg">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm mt-3 sm:mt-0">
                  <div className="text-gray-300">
                    <span className="block text-gray-500 text-xs">ID</span>
                    {t.id}
                  </div>
                  <div className="text-gray-300">
                    <span className="block text-gray-500 text-xs">
                      Usuarios
                    </span>
                    {t.users}
                  </div>
                  <div className="text-lime-400 font-semibold">
                    <span className="block text-gray-500 text-xs">
                      Valoración
                    </span>
                    ⭐ {t.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
