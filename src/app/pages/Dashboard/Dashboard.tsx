"use client";

import { InputDate, SearchInput, SelectInput } from "@/app/Components/Inputs/inputs";
import { TableList } from "@/app/Components/Table/TableList";
import { IconSettings } from "@tabler/icons-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Download } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function Dashboard() {
  // === Datos de ejemplo ===
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Altas mensuales vvvvvvvvvvvvvvv",
        data: [
          600, 900, 1400, 1300, 1250, 1600, 1500, 1200, 900, 1500, 1600, 1200,
        ],
        borderColor: "#D4FF00",
        backgroundColor: "rgba(173, 255, 47, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Media de usuarios",
        data: [
          1000, 1100, 1200, 1300, 1250, 1300, 1200, 1100, 1000, 1300, 1250,
          1150,
        ],
        borderColor: "#ff4b4b",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
    },
  };

  const barDataIngresos = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Ingresos ($)",
        data: [18, 12, 14, 10, 19, 13, 14, 16, 9, 17, 12, 6],
        backgroundColor: "#D4FF00",
      },
    ],
  };

  const barOptionsIngresos = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { display: false } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
    },
  };

  const barDataPlanes = {
    labels: ["Gratuito", "Básico", "Intermedio", "Avanzado"],
    datasets: [
      {
        label: "Cantidad",
        data: [350, 500, 250, 150],
        backgroundColor: "#D4FF00",
      },
    ],
  };

  const barOptionsPlanes = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { display: false } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
    },
  };

  const EncabezadosData = [
    { label: 'Entrenador', width: '100px' },
    { label: 'Cantidad usuarios', width: '200px' },
    { label: 'Desempeño', width: '200px' },
  ]

  return (
    <div className=" w-full relative">
      <div className="">
        {/* Header */}
        <div className="mb-9">
          <div className="flex items-center justify-between mb-9">
            <div className="flex items-center justify-center gap-5">
              <div className="img-fit">
                <img
                  src="/logo-fondo-blanco.jpg"
                  className="w-12 rounded-lg h-12"
                  alt=""
                />
                sssss
              </div>
              <div>
                <h1 className="text-white text-lg">Bienvenido de nuevo</h1>
                <p className="text-2xl font-semibold text-[#D4FF00]">
                  Administrador
                </p>
              </div>
            </div>
            <div>
              <IconSettings
                size={50}
                className="text-white p-2 rounded-lg bg-[#1a1a1a]"
              ></IconSettings>
            </div>
          </div>

          <div className="flex gap-6 text-white">
            <div className="flex items-center justify-start w-full gap-5">
              <SearchInput placeholder={"Buscador"} />
              <InputDate placeholder="Fecha"></InputDate>
              <SelectInput
                placeholder="Estado del usuario"
                options={["Opción 1", "Opción 2"]}
                IconChevronDown
              ></SelectInput>
            </div>
            <button className="bg-white text-[#1A1A1A] w-full max-w-[200px] flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] cursor-pointer ms-auto">
              <Download className="mr-2" size={18} />
              Descargar Excel
            </button>
          </div>
        </div>

        {/* Estadísticas superiores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Usuarios activos", value: "309" },
            { label: "Usuarios nuevos", value: "100" },
            { label: "Usuarios inactivos", value: "806" },
            { label: "Usuarios suspendidos", value: "35" },
            { label: "Usuarios Totales", value: "1,250" },
          ].map((item, i) => {
            console.log(i);

            return (
              <div
                key={i}
                className="rounded-xl flex flex-col p-4 text-center bg-[#fff]/10 backdrop-blur-md border-white/10 text-white"
              >
                <p
                  className="text-white text-xl mb-1 line-clamp-1"
                  title={item.label}
                >
                  {item.label}
                </p>
                <h2
                  className={`text-3xl mt-auto font-semibold ${i == 4 ? "text-[#D4FF00]" : "text-white"
                    } `}
                >
                  {item.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Sección principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movimiento de usuarios */}
          <div className="bg-[#282828] p-5 rounded-xl col-span-1">
            <h3 className="text-[#D4FF00] font-semibold mb-2 text-xl">
              Movimiento de usuarios
            </h3>
            <Line data={lineData} options={lineOptions} />
          </div>

          {/* Top entrenadores */}
          <div className="bg-[#282828] p-5 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#D4FF00] font-semibold text-xl">
                Top de entrenadores de este mes
              </h3>
              <button className="font-semibold text-sm hover:text-gray-600 hover:bg-gray-200 cursor-pointer bg-white py-3 px-4 max-w-[230px] w-full rounded-lg">
                Ver más detalles
              </button>
            </div>
            <TableList encabezado={EncabezadosData} columns={3} home={true} />
          </div>
        </div>

        {/* Ingresos y Planes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <div className="mb-2">
              <h3 className="text-[#D4FF00] font-semibold text-xl">
                Ingresos generados globales
              </h3>
              <p className="text-white">
                Tabla de ingresos totales generales globales a lo largo de los
                meses.{" "}
              </p>
            </div>
            <Bar data={barDataIngresos} options={barOptionsIngresos} />
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <h3 className="text-[#D4FF00] text-xl font-semibold mb-2">
              Planes más usados
            </h3>
            <Bar data={barDataPlanes} options={barOptionsPlanes} />
          </div>
        </div>
      </div>
    </div>
  );
}