"use client";

import NavBar from "@/Components/navBar/NavBar";
import { Download, Search } from "lucide-react";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { IconSettings } from "@tabler/icons-react";

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
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
        datasets: [
            {
                label: "Altas mensuales",
                data: [600, 900, 1400, 1300, 1250, 1600, 1500, 1200, 900, 1500, 1600, 1200],
                borderColor: "#adff2f",
                backgroundColor: "rgba(173, 255, 47, 0.1)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Media de usuarios",
                data: [1000, 1100, 1200, 1300, 1250, 1300, 1200, 1100, 1000, 1300, 1250, 1150],
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
                backgroundColor: "#adff2f",
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
                backgroundColor: "#adff2f",
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

    // === UI principal ===
    return (
        <div className=" w-full bg-[#0f0f0f] relative flex">
            <NavBar></NavBar>
            <div className="px-8 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-gray-400 text-lg">
                                Bienvenido de nuevo
                            </h1>
                            <p className="text-2xl font-semibold text-[#adff2f]">Administrador</p>
                        </div>
                        <div>
                            <IconSettings className="text-white p-2 rounded-lg bg-[#1a1a1a] w-10 h-10"></IconSettings>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 text-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscador"
                                className="bg-[#1a1a1a] text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none"
                            />
                        </div>
                        <select className="bg-[#1a1a1a] text-sm px-4 py-2 rounded-lg">
                            <option>Fecha</option>
                        </select>
                        <select className="bg-[#1a1a1a] text-sm px-4 py-2 rounded-lg">
                            <option>Estado del usuario</option>
                        </select>
                        <button className="bg-[#1a1a1a] flex items-center px-4 py-2 rounded-lg hover:bg-[#222]">
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
                        { label: "Usuarios Totales", value: "1,250", highlight: true },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`rounded-xl p-4 text-center ${item.highlight
                                ? "bg-[#1a1a1a] border border-[#adff2f]"
                                : "bg-[#1a1a1a]"
                                }`}
                        >
                            <p className="text-gray-400 text-sm">{item.label}</p>
                            <h2 className="text-2xl font-semibold mt-1 text-white">
                                {item.value}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Sección principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Movimiento de usuarios */}
                    <div className="bg-[#1a1a1a] p-5 rounded-xl col-span-2">
                        <h3 className="text-[#adff2f] font-semibold mb-2 text-xl">
                            Movimiento de usuarios
                        </h3>
                        <Line data={lineData} options={lineOptions} />
                    </div>

                    {/* Top entrenadores */}
                    <div className="bg-[#1a1a1a] p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-[#adff2f] font-semibold text-xl">
                                Top de entrenadores de este mes
                            </h3>
                            <button className="text-gray-400 text-sm hover:text-white">
                                Ver más detalles
                            </button>
                        </div>
                        <div className="space-y-3 mt-4">
                            {[
                                { name: "Laura Fernández", users: "49 usuarios", change: "+24", up: true },
                                { name: "Diego Torres", users: "35 usuarios", change: "-1", up: false },
                                { name: "María López", users: "32 usuarios", change: "+4", up: true },
                                { name: "Sofía Ruiz", users: "29 usuarios", change: "0", up: null },
                            ].map((t, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-[#0f0f0f] rounded-lg px-4 py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                                        <div>
                                            <p className="text-sm font-medium">{t.name}</p>
                                            <p className="text-gray-400 text-xs">{t.users}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`text-sm font-semibold ${t.up === true
                                            ? "text-[#adff2f]"
                                            : t.up === false
                                                ? "text-red-500"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {t.change}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ingresos y Planes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#1a1a1a] p-5 rounded-xl">
                        <div className="mb-2">
                            <h3 className="text-[#adff2f] font-semibold text-xl">
                                Ingresos generados globales
                            </h3>
                            <p className="text-white">Tabla de ingresos totales generales globales a lo largo de los meses. </p>
                        </div>
                        <Bar data={barDataIngresos} options={barOptionsIngresos} />
                    </div>

                    <div className="bg-[#1a1a1a] p-5 rounded-xl">
                        <h3 className="text-[#adff2f] text-xl font-semibold mb-2">
                            Planes más usados
                        </h3>
                        <Bar data={barDataPlanes} options={barOptionsPlanes} />
                    </div>
                </div>
            </div>
        </div>
    )
}